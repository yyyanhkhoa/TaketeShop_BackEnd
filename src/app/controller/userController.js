const bcrypt = require('bcrypt')
const { Users } = require('../models')
const { authService } = require('../services')
const { authValidation } = require('../validations')

class UserController {
    index(req, res, next) {
        res.send('User controller....')
    }

    async register(req, res) {
        try {
            const {storeName, userName, password, name, age, gender, email, type } = req.body
            const validate = await authValidation.validateUser({storeName, userName, password, name, age, gender, email, type})
            if (validate.message) {
                return res.status(400).json({
                    success: false,
                    message: validate.message
                })
            }

            // hash password
            const passwordHash = await bcrypt.hash(password, 10)

            // create new User
            const newUser = new Users({storeName, userName, password: passwordHash, name, age, gender, email, type})

            // save new user
            await newUser.save()

            // Create jsonwebtoken to authentication
            const accessToken = authService.createAccessToken({ id: newUser._id })

            // create refresh token 
            const refreshToken = authService.createRefreshToken({ id: newUser._id })

            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })

            res.json({ accessToken })
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body


            console.log({ username, password })

            // check user exists
            const user = await Users.findOne({ username })
            if (user) {
                console.log(user)
                const isMatch = await bcrypt.compare(password, user.password)

                // password match
                if (isMatch) {
                    // Create jsonwebtoken to authentication
                    const accessToken = authService.createAccessToken({ id: user._id })

                    // create refresh token 
                    const refreshToken = authService.createRefreshToken({ id: user._id })

                    res.cookie('refresh_token', refreshToken, {
                        httpOnly: true,
                        path: '/user/refresh_token',
                        maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
                    })

                    return res.json({ accessToken })
                }
            }

            res.status(400).json({
                success: false,
                message: 'Username or password incorrect.'
            })
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }

    }

    async refreshToken(req, res) {

        // GET refresh Token from request
        const refreshToken = req.cookies.refresh_token
        console.log(refreshToken)
        try {
            // check if refresh token exists
            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Please Login before.'
                })
            }

            // check if refresh token is valid
            authService.refreshToken(refreshToken, (error, user) => {
                // Invalid
                if (error) {
                    return res.status(400).json({
                        success: false,
                        message: 'Please Login before.'
                    })
                }

                // Valid
                const accessToken = authService.createAccessToken({ id: user.id })
                res.status(200).json({
                    success: true,
                    accessToken
                })
            })

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }
}


module.exports = new UserController