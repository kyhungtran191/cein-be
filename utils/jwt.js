const jwt = require('jsonwebtoken');

const signJWT = (payload, tokenSecret, expired) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, tokenSecret, {
            expiresIn: expired
        }, (err, token) => {
            if (err) {
                return reject(err);
            }
            resolve(token)
        }
        )
    })
}

const verifyToken = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (error, decoded) => {
            if (error) {
                return reject(error)
            };
            resolve(decoded)
        })
    })
}

module.exports = {
    signJWT,
    verifyToken
}