const express = require("express");

const { register } = require("../controllers/user");

const router = express.Router();

router.post("/register",register);
router.post("/login",login);

module.exports = router;