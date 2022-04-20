const bcrypt = require("bcrypt");
const { Users } = require("../models");
const { authService } = require("../services");
const { authValidation } = require("../validations");
const SQLpool = require("../../database/connectSQL");

class UserController {
  index(req, res, next) {
    res.send("User controller....");
  }

  async register(req, res) {
    try {
      const { username, password, name, birthday, gender, email, type } =
        req.body;

      // hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // // create new User
      // const newUser = new Users({
      //   null,
      //   username,
      //   password: passwordHash,
      //   name,
      //   birthday,
      //   age,
      //   gender,
      //   email,
      //   type,
      // });

      // save new user
      await createAccount(
        username,
        password,
        name,
        birthday,
        gender,
        email,
        type
      );

      // Create jsonwebtoken to authentication
      // const accessToken = authService.createAccessToken({ id: newUser.id });
      const userID = getUserIDByEmail(email);
      const accessToken = authService.createAccessToken(userID);

      // create refresh token
      const refreshToken = authService.createRefreshToken(userID);

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      res.json({ accessToken });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;

      console.log({ username, password });

      // check user exists
      const user = await getUserByID({ username });
      if (user !== -1) {
        console.log(user + " found");
        // const isMatch = await bcrypt.compare(password, user.password);
        const isMatch = await bcrypt.compare(password, user.password);

        // password match
        if (isMatch) {
          // Create jsonwebtoken to authentication
          const accessToken = authService.createAccessToken({ id: user._id });

          // create refresh token
          const refreshToken = authService.createRefreshToken({ id: user._id });

          res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            path: "/user/refresh_token",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
          });

          return res.json({ accessToken });
        }
      }

      res.status(400).json({
        success: false,
        message: "Username or password incorrect.",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
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
          success: false,
          message: "Please Login first.",
        });
      }

      // check if refresh token is valid
      authService.refreshToken(refreshToken, (error, user) => {
        // Invalid
        if (error) {
          return res.status(400).json({
            success: false,
            message: "Please Login first.",
          });
        }

        // Valid
        const accessToken = authService.createAccessToken({ id: user.id });
        res.status(200).json({
          success: true,
          accessToken,
        });
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async createAccount(username, password, name, birthday, gender, email, type) {
    try {
      var command =
        "INSERT INTO `User` (`id`, `username`, `password`, `name`, `birthday`, `gender`, `email`, `type`, `create_time`, `update_time`) VALUES (NULL, '" +
        username +
        "', '" +
        password +
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
      SQLpool.execute(command, (err, result, field) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
      });
    } catch (err) {
      console.log("Add User Error");
      console.log(err);
    }
  }
  async getUserIDByEmail(email) {
    try {
      var command = "SELECT id FROM `User` WHERE email = " + `'${email}'`;
      SQLpool.execute(command, (err, result, field) => {
        if (err) throw err;
        if (result.length > 0) return result;
        return -1;
      });
    } catch (err) {
      console.log("Find User by Email error");
      console.log(err);
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
      var command = "SELECT * FROM `User` WHERE userID =" + userID;
      SQLpool.execute(command, (err, result, field) => {
        if (err) throw err;
        console.log(result.length);
        res.send(result);
      });
    } catch (err) {
      console.log(err);
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
    }
  }
}

module.exports = new UserController();
