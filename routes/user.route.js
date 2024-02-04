const express = require('express');
const router = express.Router();
const { signUp, login, currentUser, logOut } = require("../controllers/user.ctrl")
const authenticate = require("../middlewares/authenticate")
router
    .post("/signUp", signUp)
    .post("/login", login)
    .get("/me", authenticate, currentUser)
    .post("/logout", authenticate, logOut);
module.exports = router;