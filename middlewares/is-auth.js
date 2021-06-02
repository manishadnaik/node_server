const { PRIVATE_KEY } = require("../config/config");
const HttpError = require("../helpers/http-error");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    // console.log("token", token);
    if (!token) {
      throw new Error("Authentication failed");
    }
    const decodedToken = jwt.verify(token, PRIVATE_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed", 401);
    next(error);
  }
};
