const express = require("express");

const { register, login, activateAccount} = require("../controllers/user");

const router = express.Router();

const { authUser } = require("../middlwares/auth");

router.post("/register",register);
router.post("/activate", authUser, activateAccount);
router.post("/login",login);

module.exports = router;