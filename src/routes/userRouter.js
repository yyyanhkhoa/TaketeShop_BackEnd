const router = require('express').Router()
const { userController } = require('../app/controller/index')

router.get('/', userController.index)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/refresh_token', userController.refreshToken)



module.exports = router