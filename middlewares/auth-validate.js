const validator = require("../helpers/validate");

const validateRegister = (req, res, next) => {
  const validationRule = {
    name: "required|string",
    email: "required|email",
    password: "required|string|min:6|confirmed",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};
const validateLogin = (req, res, next) => {
  const validationRule = {
    email: "required|email",
    password: "required|string|min:6",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    // console.log("in login validate==>", req.body);
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};

module.exports = {
  validateRegister,
  validateLogin,
};
