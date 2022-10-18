const { validateEamil, validateLenght } = require("../helpers/validation");

const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/tokens");

exports.register = async (req, res) => {
    try {
        const { first_name, last_name, email, password, userName, bYear, bMonth, bDay, gender } = req.body;

        if (!validateEamil(email)) {
            return res.status(400).json({
                message: "invalid email address"
            });
        }
        const check = await User.findOne({ email });
        if (check) {
            return res.status(400).json({
                message: "This email address already exists, try with a different email address"
            });
        }
        if (!validateLenght(first_name, 2, 30)) {
            return res.status(400).json({
                message: "first name must between 3 and 30 characters"
            })
        }
        if (!validateLenght(last_name, 2, 30)) {
            return res.status(400).json({
                message: "last name must between 3 and 30 characters"
            })
        }
        if (!validateLenght(password, 6, 40)) {
            return res.status(400).json({
                message: "password must between 3 and 30 characters"
            })
        }
        const cryptedPassword = await bcrypt.hash(password, 12);
        console.log(cryptedPassword);

        return;
        const user = await new User({
            first_name, last_name, email, password, userName, bYear, bMonth, bDay, gender
        }).save();

        const emailVerificationToken = generateToken(
            {id: user._id.toString()},"30m"
        )
        console.log(emailVerificationToken);

        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}