const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  try {
    const post = await new Post(req.body).save();
    await post.populate("user", "first_name last_name cover picture username");
    res.json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

