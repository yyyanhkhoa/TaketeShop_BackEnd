const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const db = require('../database/connectSQL')
const routes = require('../routes')


const app = express();
app.use(cors()); //Help Front end get data
app.use(express.json()); // getJson
app.use(cookieParser()) // read Cookie
dotenv.config() // get variables environment

app.use(fileUpload({
    useTempFiles: true,
}))
const port = process.env.PORT || 5000;

db.connectSQL();
const SQL = db.connection;

routes(app);

//Select
app.get("/data", (req, res) => {
  var command = "SELECT * FROM Ward;";
  SQL.query(command, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});
//Insert
app.post("/data", (req, res) => {
  console.log(req.data);
  var data = { name: req.body.name };
  var command = "INSERT INTO `da1_taketeshop`.`province` (`name`) VALUES ?;";
  SQL.query(command, (err, result) => {
    if (err) throw err;
    res.send({
      name: req.body.name,
    });
  });
});

app.listen(port, () => {
  console.log("SQL Server is running at port: " + port);
});
