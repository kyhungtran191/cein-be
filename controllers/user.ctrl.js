const User = require("../models/user.model")
const asyncHandler = require("express-async-handler");
const STATUS = require("../config/status")
const jwt = require("../utils/jwt")
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
    await User.findOneAndUpdate({ email: user.email }, { refresh_token })
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


const logOut = () => {

}

const currentUser = () => {

}


const forgotPassword = () => {

}

const refreshToken = () => {

}
module.exports = {
    signUp, login, logOut, forgotPassword, refreshToken, currentUser
}
