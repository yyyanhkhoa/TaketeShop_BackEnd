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
      SQLpool.execute(command, (err, result, field) => {
        if (err) throw err;
        console.log(result.length);
        res.send(result);
      });
    } catch (err) {
      console.log("Product Error");
      console.log(err);
    }
  }
  async getProductByID(req, res) {
    try {
      var command = "SELECT * FROM `Product` WHERE id =" + req.params.id;
      SQLpool.execute(command, (err, result, field) => {
        if (err) throw err;
        console.log(result.length);
        res.send(result);
      });
    } catch (err) {
      console.log("Product Error");
      console.log(err);
    }
  }

  async updateProductByIDRequest(req, res) {
    const field = req.query.field;
    const value = req.query.value;
    const productID = req.params.id;

    try {
      var command =
        "UPDATE `Product` SET `" +
        field +
        "` = '" +
        value +
        "', `update_time` = CURRENT_TIMESTAMP WHERE id = " +
        productID;
      SQLpool.execute(command, (err, result, field) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
      });
    } catch (err) {
      console.log(err);
    }
  }

  async addProductWithoutImage(req, res) {
    try {
      var {categoryID, userID, name, descriptions, price, quantity, unitID} = req.body;
      var command =
        "INSERT INTO `Product` (`id`, `category_id`, `user_id`, `name`, `descriptions`, `price`, `quantity`, `unid_id`, `discount_id`, `create_time`, `update_time`) VALUES (NULL, '" +
        categoryID +
        "', '" +
        userID +
        "', '" +
        name +
        "', '" +
        descriptions +
        "', '" +
        price +
        "', '" +
        quantity +
        "', '" +
        unitID +
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
