const router = require("express").Router();
const { chanelController } = require("../app/controller/index");

router.get('/',chanelController.getAllQuestion)
router.get('/product/:id', chanelController.getQuestionByIdProduct)
router.get('/:id',chanelController.findQuestionFromId)
router.post('/',chanelController.addQuestion)

router.patch('/:id',chanelController.setQuestion)
router.delete('/:id',chanelController.deleteQuestionFromId)

module.exports = router;
