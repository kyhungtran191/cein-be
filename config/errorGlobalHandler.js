const notFound = (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found!`)
    error.status = 404
    return next(error)
}
const errHandler = (err, req, res, next) => {
    const statusCode = err.status ? err.status : 500
    return res.status(statusCode).json({
        status: `${statusCode}`.startsWith('4') ? 'Fail' : 'Error',
        message: err.message
    })
}

module.exports = {
    notFound,
    errHandler
}