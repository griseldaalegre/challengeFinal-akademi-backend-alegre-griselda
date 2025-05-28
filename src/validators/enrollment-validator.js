const { check } = require("express-validator");

const enrollmentValidator = [
  check("student")
    .notEmpty().withMessage("El ID del estudiante es obligatorio.")
    .isMongoId().withMessage("Debe ser un ObjectId válido."),

  check("course")
    .notEmpty().withMessage("El ID del curso es obligatorio.")
    .isMongoId().withMessage("Debe ser un ObjectId válido.")
];

module.exports = {
    enrollmentValidator
  };
