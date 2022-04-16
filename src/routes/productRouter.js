const router = require("express").Router();
const { productController } = require("../app/controller/index");


router.post("/addWthImage", productController.addProductWithoutImage);
router.post("/update", productController.updateProduct);
router.get("/productList", productController.getProductWithCategoryID);
router.get("/all", productController.getAllProduct);
router.get("/", productController.index);

module.exports = router;
 