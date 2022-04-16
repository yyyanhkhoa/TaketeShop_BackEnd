const mysql = require("mysql2");

const SQLpool = mysql.createPool({
  host: "localhost",
  user: "admin",
  password: "admin",
  database: "DA1_TaketeShop",
  port: "6033",
});

module.exports = SQLpool;
