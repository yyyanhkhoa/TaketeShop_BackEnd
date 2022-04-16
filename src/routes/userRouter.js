const router = require('express').Router()
const { userController } = require('../app/controller/index')

router.get('/', userController.index)
router.get('/getAllUser',userController.getAllUser)
router.get('/:id',userController.getUser)
router.patch('/:id', userController.changeUserName)
router.delete('/:id', userController.deleteUser)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/refresh_token', userController.refreshToken)



module.exports = router