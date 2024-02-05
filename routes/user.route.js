const express = require('express');
const router = express.Router();
const { signUp, login, currentUser, logOut, forgotPassword, resetPassword, refreshToken } = require("../controllers/user.ctrl")
const authenticate = require("../middlewares/authenticate")
router
    .post("/signUp", signUp)
    .post("/login", login)
    .post("/forgot-password", forgotPassword)
    .get("/reset-password", resetPassword)
    .post("/refresh-token", refreshToken)
    .get("/me", authenticate, currentUser)
    .post("/logout", authenticate, logOut)
module.exports = router;