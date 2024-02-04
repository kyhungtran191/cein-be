const token = require("../utils/jwt")
const User = require("../models/user.model")
module.exports = (async (req, res, next) => {
    console.log(req.headers.authorization)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        let user_token = req.headers.authorization.split(' ')[1];
        try {
            const decoded = await token.verifyToken(user_token, process.env.ACCESS_TOKEN_SECRET)
            const user = await User.findById(decoded._id);
            if (!user) {
                return next(new Error('Account not exists'))
            }
            req.user = user
            next()
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return next(new Error('Token Expired'));
            } else {
                return next(new Error('Authenticate Token Error'));
            }
        }
    } else {
        return next(new Error("Please provide correct format with Bearer token"))
    }
}) 