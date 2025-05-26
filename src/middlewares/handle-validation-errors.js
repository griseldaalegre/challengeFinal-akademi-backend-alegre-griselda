const { validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(error => ({
        message: error.msg,
        //field: error.param
      }))
    });
  }
  next();
};

module.exports = handleValidationErrors;
