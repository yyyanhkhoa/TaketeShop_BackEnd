const router = require("express").Router();
const { chanelController } = require("../app/controller/index");


router.post("/addWthImage", chanelController.addProductWithoutImage);
router.patch("/update/:id", chanelController.updateProductByIDRequest);
router.get("/productList", chanelController.getProductWithCategoryID);
router.get("/all", chanelController.getAllProduct);
router.get("/:id", chanelController.getProductByID);
router.get("/", chanelController.index);


module.exports = router;
