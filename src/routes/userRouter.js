const router = require('express').Router()
const verifyToken = require('../app/middleware/auth')
const { signupValidation, loginValidation } = require("../app/validations/authValidation");

const { userController } = require('../app/controller/index')

router.get('/', userController.index)
router.get('/getAllUser',userController.getAllUser)
router.get('/:id',userController.getUserByIDRequest)
router.patch('/:id', userController.updateUserByIDRequest)
router.delete('/:id', verifyToken, userController.deleteUserByIDRequest)
router.post('/register', signupValidation, userController.register)
router.post('/login', loginValidation, userController.login)
router.get('/refresh_token', userController.refreshToken)



module.exports = router