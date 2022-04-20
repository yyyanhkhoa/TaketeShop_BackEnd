const { Users } = require('../models')

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

const validateUser = async ({username, password, name, birthday, gender, email, type}) => {

    if (username.length < 6) {
        return {
            message: 'Username must be at least 6 characters'
        }
    }

    if (name.length < 6) {
        return {
            message: 'Names must be at least 6 characters'
        }
    }

    if (!email) {
        return {
            message: 'Email is required'
        }
    }

    if (!validateEmail(email)) {
        return {
            message: 'The email is invalid'
        }
    }

    const user = await Users.findOne({ email })
    if (user) {
        return {
            message: 'The email already exists'
        }
    }

    if (password.length < 6) {
        return {
            message: 'Password must be at least 6 characters'
        }
    }

    return {

    }

}

module.exports = {
    validateEmail,
    validateUser
}