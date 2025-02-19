const bcrypt = require("bcrypt");
const { Users } = require("../models");
const { authService } = require("../services");
const { authValidation } = require("../validations");
const jwt = require("jsonwebtoken");
const SQLpool = require("../../database/connectSQL");

class UserController {
  index(req, res, next) {
    res.send("User controller....");
  }

  async register(req, res) {
    let command = "";
    const { username, password, name, birthday, gender, email, type } =
      req.body;
    try {
      SQLpool.getConnection((err, connection) => {
        if (err) throw err;

        //check duplicated email
        command = `SELECT * FROM User WHERE email = ${"'" + email + "'"} OR ${
          "'" + username + "'"
        };`;
        connection.query(command, (error, result) => {
          if (error) throw error;
          if (!result.length) {
            if (username === result.username) {
              return res.status(409).send({
                error: true,
                msg: "This username is already in use!",
              });
            }

            if (email === result.email) {
              return res.status(409).send({
                error: true,
                msg: "This email is already in use!",
              });
            }
          }
        });

        // hash password
        bcrypt.hash(password, 10, (error, passwordHashed) => {
          if (error) throw error;
          if (err) {
            return res.status(500).send({
              error: true,
              msg: err,
            });
          }
          // has hashed pw => add to database
          command =
            "INSERT INTO `User` (`id`, `username`, `password`, `name`, `birthday`, `gender`, `email`, `type`, `create_time`, `update_time`) VALUES (NULL, '" +
            username +
            "', '" +
            passwordHashed +
            "', '" +
            name +
            "', '" +
            birthday +
            "', '" +
            gender +
            "', '" +
            email +
            "', '" +
            type +
            "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
          connection.query(command, (err, result) => {
            if (err) {
              return res.status(400).send({
                error: true,
                msg: err,
              });
            }
            console.log(result);
            return res.status(201).send({
              error: false,
              msg: "The user has been registered with us!",
            });
          });
        });
        connection.end();
      });
    } catch (err) {
      console.log(err);
      return res.send({
        error: true,
        msg: err,
      });
    }
  }
  async login(req, res) {
    let command = "";
    const { username, password } = req.body;
    try {
      SQLpool.getConnection((err, connection) => {
        if (err) throw err;

        command = `SELECT * FROM User WHERE username = ${
          "'" + username + "'"
        };`;
        connection.query(command, (error, result) => {
          if (error) throw error;
          if (!result.length) {
            return res.status(401).send({
              error: true,
              msg: "Username is incorrect",
            });
          }

          //check Password
          bcrypt.compare(password, result[0]["password"], (bErr, bResult) => {
            // wrong password
            if (bErr) {
              return res.status(401).send({
                error: true,
                msg: "Password is incorrect!",
              });
            }
            if (bResult) {
              // create token
              const token = authService.createAccessToken({ id: result[0].id });
              // create refresh token
              const refreshToken = authService.createRefreshToken({
                id: result[0].id,
              });
              // save refresh token to cookie
              res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                path: "/user/refresh_token",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
              });

              return res.status(200).send({
                error: false,
                msg: `${result[0].name} (${result[0].username}) logged in!`,
                userID: result[0].id,
                name: result[0].name,
                sex: result[0].gender,
                birthday: result[0].birthday,
                email: result[0].email,
                phone: result[0].phone,
                avatar: result[0].avatar,
                roles: result[0].type,
                token,
              });
            }
            return res.status(401).send({
              error: true,
              msg: "Username or password is incorrect!",
            });
          });
        });
      });
    } catch (err) {
      res.status(500).json({
        error: true,
        msg: err,
      });
    }
  }

  async refreshToken(req, res) {
    // GET refresh Token from request
    const refreshToken = req.cookies.refresh_token;
    console.log(refreshToken);
    try {
      // check if refresh token exists
      if (!refreshToken) {
        return res.status(400).json({
          error: true,
          msg: "Please Login first.",
        });
      }

      // check if refresh token is valid
      authService.refreshToken(refreshToken, (error, user) => {
        // Invalid
        if (error) {
          return res.status(400).json({
            error: true,
            msg: "Please Login first.",
          });
        }

        // Valid
        const accessToken = authService.createAccessToken({ id: user.id });
        res.status(200).json({
          error: false,
          accessToken,
        });
      });
    } catch (error) {
      res.status(400).json({
        error: true,
        msg: error.message,
      });
    }
  }

  async getUserByUsername(username) {
    try {
      var command = "SELECT * FROM `User` WHERE username = " + `'${username}'`;
      SQLpool.execute(command, (err, result, field) => {
        if (err) throw err;
        if (result.length > 0) return result;
        return -1;
      });
    } catch (err) {
      console.log("Find User by ID error");
      console.log(err);
    }
  }

  async getUserByID(id) {
    try {
      var command = "SELECT * FROM `User` WHERE id = " + `'${id}'`;
      SQLpool.execute(command, (err, result, field) => {
        if (err) throw err;
        if (result.length > 0) return result;
        return -1;
      });
    } catch (err) {
      console.log("Find User by ID error");
      console.log(err);
    }
  }
  async getAllUser(req, res) {
    try {
      var command = "SELECT * FROM `User`";
      SQLpool.execute(command, (err, result, field) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
      });
    } catch (err) {
      console.log(err);
    }
  }
  async getUserByIDRequest(req, res) {
    try {
      const userID = req.params.id;
      var command = "SELECT * FROM `User` WHERE id =" + userID;
      SQLpool.execute(command, (err, result, field) => {
        if (err) throw err;
        console.log(result.length);
        res.send(result);
      });
    } catch (err) {
      console.log(err);
      return res.send({ error: true, msg: err });
    }
  }

  async updateUserByIDRequest(req, res) {
    const field = req.query.field;
    const value = req.query.value;
    const userID = req.params.id;

    try {
      var command =
        "UPDATE `User` SET `" +
        field +
        "` = '" +
        value +
        "', `update_time` = CURRENT_TIMESTAMP WHERE id = " +
        userID;
      SQLpool.execute(command, (err, result, field) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
      });
    } catch (err) {
      console.log(err);
      return res.send({ error: true, msg: err });
    }
  }
  async deleteUserByIDRequest(req, res) {
    const userID = req.params.id;
    try {
      var command = "DELETE FROM User WHERE id = " + userID;
      SQLpool.execute(command, (err, result, field) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
      });
    } catch (err) {
      console.log(err);
      return res.send({ error: true, msg: err });
    }
  }
}

module.exports = new UserController();
