const jwt = require("jsonwebtoken");
const { PRIVATE_KEY } = require("../config/config");

module.exports.generateToken = (user, next) => {
  return jwt.sign({ userId: user._id, email: user.email }, PRIVATE_KEY, {
    // expiresIn: "1h",
    expiresIn: "1h",
  });
};
