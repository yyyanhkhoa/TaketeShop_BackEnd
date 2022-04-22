const { check } = require("express-validator");

exports.signupValidation = [
  check("username", "Username is requied").not().isEmpty(),
  check("password", "Password is requied").not().isEmpty(),
  check("password", "Password must be 6 or more characters").isLength({
    min: 6,
  }),
  check("birthday", "Birthday is requied").not().isEmpty(),
  check("gender", "Gender is requied").not().isEmpty(),
  check("email", "Please include a valid email")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("type", "Type is requied").not().isEmpty(),
];

exports.loginValidation = [
  check("name", "Name is requied").not().isEmpty(),
  check("password", "Password must be 6 or more characters").isLength({
    min: 6,
  }),
];
