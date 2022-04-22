const router = require("express").Router();
const { productController } = require("../app/controller/index");


router.post("/addWthImage", productController.addProductWithoutImage);
router.patch("/update/:id", productController.updateProductByIDRequest);
router.get("/productList", productController.getProductWithCategoryID);
router.get("/all", productController.getAllProduct);
router.get("/:id", productController.getProductByID);
router.get("/", productController.index);


module.exports = router;



































