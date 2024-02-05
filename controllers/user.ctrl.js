const User = require("../models/user.model")
const asyncHandler = require("express-async-handler");
const STATUS = require("../config/status")
const jwt = require("../utils/jwt")
const sendMail = require("../utils/send-mail")
const crypto = require("crypto-js")
const bcrypt = require("bcrypt")
const signUp = asyncHandler(async (req, res, next) => {
    const { email, password, confirm_password, fullName } = req.body
    console.log(req.body)
    if (password !== confirm_password) {
        return next(new Error("Password is not match"));
    }
    const existedEmail = await User.findOne({ email });
    if (existedEmail) return next(new Error("This email is already exist !"));
    const user = await User.create({ email, password, fullName, confirm_password })
    if (!user) {
        return next(new Error("Error when creating user"));
    }
    const access_token = await jwt.signJWT({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRED);
    const refresh_token = await jwt.signJWT({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRED)
    await User.findOneAndUpdate({ email: user.email }, { refresh_token }, { new: true })
    const userResponse = {
        _id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
    }
    return res.status(STATUS.OK).json({
        message: "Sign up successfully !",
        data: {
            user: userResponse,
            access_token,
            refresh_token
        }
    })
})
const login = asyncHandler(async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email }).select('+password')
    if (!user || !(await user.isMatch(req.body.password))) {
        return next(new Error("Please provide correct email and password"));
    }
    const access_token = await jwt.signJWT({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRED);
    const refresh_token = await jwt.signJWT({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRED)
    await User.findOneAndUpdate({ email: user.email }, { refresh_token })
    const userResponse = {
        _id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
    }
    res.status(STATUS.OK).json({
        message: 'Login successfully!',
        data: {
            access_token,
            refresh_token,
            user: userResponse
        }
    })
})


const currentUser = asyncHandler((req, res, next) => {
    res.status(STATUS.OK).json(req.user);
})


const logOut = asyncHandler(async (req, res, next) => {
    await User.findOneAndUpdate({ _id: req.user._id }, { refresh_token: undefined }, { new: true })
    req.user = null;
    return res.status(STATUS.OK).json({
        message: "Logout successfully!"
    });
})

const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.query;
    const emailValid = await User.findOne({ email });
    if (!emailValid) return next(new Error("This email is not exist"));
    const token = emailValid.resetTokenGenerate();
    emailValid.save()
    const html = `Please click on this link to reset your password <a href=${process.env.URL_SERVER}/api/v1/auth/reset-password/${token}>Verify here</a>`
    const info = await sendMail(email, html);
    if (!info) return next(new Error("Invalid in send email"));
    return res.status(200).json({
        status: "Success",
        message: "Send verification code successfully"
    })
})

const resetPassword = asyncHandler(async (req, res, next) => {
    const { password: newPassword, token } = req.body;
    console.log(token)
    const tokenHash = crypto.SHA256(token).toString(crypto.enc.Hex)
    console.log(tokenHash)
    const user = await User.findOne({ passwordResetToken: tokenHash, passwordResetExpired: { $gt: Date.now() } })
    if (!user) return next(new Error("Invalid Reset Token"));
    user.password = newPassword;
    user.passwordChangeAt = Date.now();
    user.passwordResetExpired = undefined
    user.passwordResetToken = undefined
    user.save();
    return res.json({
        status: "Success",
        message: "Reset Password successfully !"
    })
})

const refreshToken = asyncHandler(async (req, res, next) => {
    if (!req.body.refresh_token) return next(new Error("Refresh Token not provided"));
    const decoded = await jwt.verifyToken(req.body.refresh_token, process.env.REFRESH_TOKEN_SECRET);
    if (decoded) {
        let access_token = await jwt.signJWT({ id: decoded.id }, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRED);
        let refreshToken = await jwt.signJWT({ id: decoded.id }, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRED)
        return res.status(200).json({
            message: 'Refresh token successfully !',
            access_token,
            refresh_token: refreshToken
        })
    }
});

module.exports = {
    signUp, login, logOut, forgotPassword, refreshToken, currentUser, resetPassword
}
