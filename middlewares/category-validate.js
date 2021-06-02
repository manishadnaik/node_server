const validator = require("../helpers/validate");

const validateCategory = (req, res, next) => {
  const validationRule = {
    title: "required|string|min:5|max:200",
    max_amount: "required|number",
    userId: "required|string",
    description: "required|string|min:5|max:400",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    console.log("here==>", req.body);
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
  validateCategory,
};
