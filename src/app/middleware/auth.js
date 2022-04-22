const jwt = require("jsonwebtoken");
const SQLpool = require("../../database/connectSQL");
const verifyToken = (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer") ||
    !req.headers.authorization.split(" ")[1]
  ) {
    return res.status(422).json({
      message: "Please provide the token",
    });
  }
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const command = "SELECT * FROM User where id = " + decoded.id;
    SQLpool.execute(command, (err, result, field) => {
      if (err) throw err;
      if (!result.length) return -1;

      return res.send({
        error: false,
        data: results[0],
        message: "Fetch Successfully.",
      });
      
    });
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(403);
  }
};

module.exports = verifyToken;
