require('dotenv').config()
const jwt = require('jsonwebtoken')

const authService = {
    createAccessToken: (user) => {
        return jwt.sign(user, `${process.env.ACCESS_TOKEN_SECRET}`, { expiresIn: '1d' })
    },
    createRefreshToken: (user) => {
        return jwt.sign(user, `${process.env.REFRESH_TOKEN_SECRET}`, { expiresIn: '7d' })
    },
    refreshToken: (refreshToken, callback) => {
        jwt.verify(refreshToken, `${process.env.REFRESH_TOKEN_SECRET}`, callback)
    }
}

module.exports = authService