module.exports = (roles) => (req, res, next) => {
    if (roles.includes(req.user.role)) return next();
    return next(new Error('You are not allow to access this route'))
}