const {
    validateEmail,
    validateLength,
    validateUsername,
  } = require("../helpers/validation");
  const User = require("../models/User");
  const Code = require("../models/Code");
  const Post = require("../models/Post");
  const jwt = require("jsonwebtoken");
  const bcrypt = require("bcrypt");
  const { generateToken } = require("../helpers/tokens");
  const { sendVerificationEmail, sendResetCode } = require("../helpers/mailer");
  const generateCode = require("../helpers/generateCode");


  exports.register = async (req, res) => {
    try {
      const {
        first_name,
        last_name,
        email,
        password,
        username,
        bYear,
        bMonth,
        bDay,
        gender,
      } = req.body;
  
      if (!validateEmail(email)) {
        return res.status(400).json({
          message: "invalid email address",
        });
      }
      const check = await User.findOne({ email });
      if (check) {
        return res.status(400).json({
          message:
            "This email address already exists,try with a different email address",
        });
      }
  
      if (!validateLength(first_name, 3, 30)) {
        return res.status(400).json({
          message: "first name must between 3 and 30 characters.",
        });
      }
      if (!validateLength(last_name, 3, 30)) {
        return res.status(400).json({
          message: "last name must between 3 and 30 characters.",
        });
      }
      if (!validateLength(password, 6, 40)) {
        return res.status(400).json({
          message: "password must be atleast 6 characters.",
        });
      }
  
      const cryptedPassword = await bcrypt.hash(password, 12);
  
      let tempUsername = first_name + last_name;
      let newUsername = await validateUsername(tempUsername);
      const user = await new User({
        first_name,
        last_name,
        email,
        password: cryptedPassword,
        username: newUsername,
        bYear,
        bMonth,
        bDay,
        gender,
      }).save();
      const emailVerificationToken = generateToken(
        { id: user._id.toString() },
        "30m"
      );
      const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
      sendVerificationEmail(user.email, user.first_name, url);
      const token = generateToken({ id: user._id.toString() }, "7d");
      res.send({
        id: user._id,
        username: user.username,
        picture: user.picture,
        first_name: user.first_name,
        last_name: user.last_name,
        token: token,
        verified: user.verified,
        message: "Register Success ! please activate your email to start",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  exports.activateAccount = async (req, res) => {
    try {
      const { token } = req.body;
      const user = jwt.verify(token, process.env.TOKEN_SECRET);
      const check = await User.findById(user.id);
      if (check.verified == true) {
        return res
          .status(400)
          .json({ message: "this email is already activated" });
      } else {
        await User.findByIdAndUpdate(user.id, { verified: true });
        return res
          .status(200)
          .json({ message: "Account has beeen activated successfully." });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          message:
            "the email address you entered is not connected to an account.",
        });
      }
      const check = await bcrypt.compare(password, user.password);
      if (!check) {
        return res.status(400).json({
          message: "Invalid credentials.Please try again.",
        });
      }
      const token = generateToken({ id: user._id.toString() }, "7d");
      res.send({
        id: user._id,
        username: user.username,
        picture: user.picture,
        first_name: user.first_name,
        last_name: user.last_name,
        token: token,
        verified: user.verified,
        message: "Register Success ! please activate your email to start",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  exports.findUser = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email }).select("-password");
      if (!user) {
        return res.status(400).json({
          message: "Account does not exists.",
        });
      }
      return res.status(200).json({
        email: user.email,
        picture: user.picture,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  exports.sendResetPasswordCode = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email }).select("-password");
      await Code.findOneAndRemove({ user: user._id });
      const code = generateCode(5);
      const savedCode = await new Code({
        code,
        user: user._id,
      }).save();
      sendResetCode(user.email, user.first_name, code);
      return res.status(200).json({
        message: "Email reset code has been sent to your email",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  exports.validateResetCode = async (req, res) => {
    try {
      const { email, code } = req.body;
      const user = await User.findOne({ email });
      const Dbcode = await Code.findOne({ user: user._id });
      if (Dbcode.code !== code) {
        return res.status(400).json({
          message: "Verification code is wrong..",
        });
      }
      return res.status(200).json({ message: "ok" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  exports.changePassword = async (req, res) => {
    const { email, password } = req.body;
  
    const cryptedPassword = await bcrypt.hash(password, 12);
    await User.findOneAndUpdate(
      { email },
      {
        password: cryptedPassword,
      }
    );
    return res.status(200).json({ message: "ok" });
  };
  exports.getProfile = async (req, res) => {
    try {
      const { username } = req.params;
      const user = await User.findById(req.user.id);
      const profile = await User.findOne({ username }).select("-password");
      const friendship = {
        friends: false,
        following: false,
        requestSent: false,
        requestReceived: false,
      };
      if (!profile) {
        return res.json({ ok: false });
      }
  
      if (
        user.friends.includes(profile._id) &&
        profile.friends.includes(user._id)
      ) {
        friendship.friends = true;
      }
      if (user.following.includes(profile._id)) {
        friendship.following = true;
      }
      if (user.requests.includes(profile._id)) {
        friendship.requestReceived = true;
      }
      if (profile.requests.includes(user._id)) {
        friendship.requestSent = true;
      }
  
      const posts = await Post.find({ user: profile._id })
        .populate("user")
        .populate(
          "comments.commentBy",
          "first_name last_name picture username commentAt"
        )
        .sort({ createdAt: -1 });
      await profile.populate("friends", "first_name last_name username picture");
      res.json({ ...profile.toObject(), posts, friendship });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  exports.updateProfilePicture = async (req, res) => {
    try {
      const { url } = req.body;
  
      await User.findByIdAndUpdate(req.user.id, {
        picture: url,
      });
      res.json(url);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  exports.updateCover = async (req, res) => {
    try {
      const { url } = req.body;
  
      await User.findByIdAndUpdate(req.user.id, {
        cover: url,
      });
      res.json(url);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  exports.updateDetails = async (req, res) => {
    try {
      const { infos } = req.body;
  
      const updated = await User.findByIdAndUpdate(
        req.user.id,
        {
          details: infos,
        },
        {
          new: true,
        }
      );
      res.json(updated.details);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  exports.addFriend = async (req, res) => {
    try {
      if (req.user.id !== req.params.id) {
        const sender = await User.findById(req.user.id);
        const receiver = await User.findById(req.params.id);
        if (
          !receiver.requests.includes(sender._id) &&
          !receiver.friends.includes(sender._id)
        ) {
          await receiver.updateOne({
            $push: { requests: sender._id },
          });
          await receiver.updateOne({
            $push: { followers: sender._id },
          });
          await sender.updateOne({
            $push: { following: receiver._id },
          });
          res.json({ message: "friend request has been sent" });
        } else {
          return res.status(400).json({ message: "Already sent" });
        }
      } else {
        return res
          .status(400)
          .json({ message: "You can't send a request to yourself" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };