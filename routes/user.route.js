const express = require('express');
const router = express.Router();
const { signUp, login } = require("../controllers/user.ctrl")
router.post("/signUp", signUp).post("/login",login)

module.exports = router;