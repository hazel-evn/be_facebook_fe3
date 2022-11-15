const express = require("express");

const { register,
        login, 
        activateAccount, 
        findUser, 
        sendResetPasswordCode, 
        validateResetCode, 
        changePassword, 
        getProfile, 
        updateProfilePicture, 
        updateCover, 
        updateDetails, 
        addFriend, 
        follow, 
        unfollow,
        unfriend,
        search
    } = require("../controllers/user");

const router = express.Router();

const { authUser } = require("../middlwares/auth");

router.post("/register",register);
router.post("/activate", authUser, activateAccount);
router.post("/login",login);
router.post("/findUser", findUser);
router.post("/sendResetPasswordCode", sendResetPasswordCode);
router.post("/validateResetCode", validateResetCode);
router.post("/changePassword", changePassword);
router.get("/getProfile/:username", authUser, getProfile);
router.put("/updateProfilePicture", authUser, updateProfilePicture);
router.put("/updateCover", authUser, updateCover);
router.put("/updateDetails", authUser, updateDetails);
router.put("/addFriend/:id", authUser, addFriend);
router.put("/follow/:id", authUser, follow);
router.put("/unfollow/:id", authUser, unfollow);
router.put("/unfriend/:id", authUser, unfriend);
router.post("/search/:searchTerm", authUser, search);

module.exports = router;