const { authService } = require("../services");
const { authValidation } = require("../validations");
const SQLpool = require("../../database/connectSQL");

class ProductController {
  index(req, res, next) {
    res.send("Product controller....");
  }

  async getAllProduct(req, res) {
    try {
      var command = "SELECT * FROM Product;";
      SQLpool.execute(command, (err, result, field) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
      });
    } catch (err) {
      console.log("Product Error");
      console.log(err);
    }
  }

  async getProductWithCategoryID(req, res) {
    try {
      var command =
        "SELECT * FROM `Product` WHERE category_id =" + req.query.categoryID;
        console.log(req.query.categoryID);
      SQLpool.execute(command, (err, result, field) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
      });
    } catch (err) {
      console.log("Product Error");
      console.log(err);
    }
  }

  async updateProduct(req, res) {
    try {
      const product = req.query;
      const command =
        "UPDATE `Product` SET `id` = '" +
        product.id +
        "', `category_id` = '" +
        product.categoryID +
        "', `name` = '" +
        product.name +
        "', `descriptions` = '" +
        product.descriptions +
        "', `price` = '" +
        product.price +
        "', `quantity` = '" +
        product.quantity +
        "', `unid_id` = '" +
        product.unidID +
        "', `discount_id` = '" +
        product.discountID +
        "', `update_time` = CURRENT_TIMESTAMP WHERE `Product`.`id` = 2";
      SQLpool.execute(command, (err, result, field) => {
        if (err) throw err;
        console.log("Update Product Success");
        res.send(result);
      });
    } catch (err) {
      console.log("Update Product Error: ");
      console.log(err);
    }
  }

  async addProductWithoutImage(req, res) {
    try {
      var product = req.query;
      var command =
        "INSERT INTO `Product` (`id`, `category_id`, `user_id`, `name`, `descriptions`, `price`, `quantity`, `unid_id`, `discount_id`, `create_time`, `update_time`) VALUES (NULL, '" +
        product.categoryID +
        "', '" +
        product.userID +
        "', '" +
        product.name +
        "', '" +
        product.descriptions +
        "', '" +
        product.price +
        "', '" +
        product.quantity +
        "', '" +
        product.unitID +
        "', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);";

      SQLpool.execute(command, (err, result, field) => {
        if (err) throw err;
        console.log("Add Product Success");
        res.send(result);
      });
    } catch (err) {
      console.log("Add Product Error: ");
      console.log(err);
    }
  }
}

module.exports = new ProductController();
