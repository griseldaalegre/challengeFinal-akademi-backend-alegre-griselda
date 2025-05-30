const { check } = require("express-validator");

const validateCreateGrade = [
  check("student")
    .notEmpty()
    .withMessage("El ID del estudiante es obligatorio")
    .isMongoId()
    .withMessage("ID de estudiante inválido"),

  check("course")
    .notEmpty()
    .withMessage("El ID del curso es obligatorio")
    .isMongoId()
    .withMessage("ID de curso inválido"),

  check("score")
    .notEmpty()
    .withMessage("La calificación es obligatoria")
    .isFloat({ min: 0, max: 10 })
    .withMessage("La calificación debe estar entre 0 y 10"),

  check("feedback")
    .optional()
    .isString()
    .withMessage("El feedback debe ser un texto")
    .isLength({ max: 500 })
    .withMessage("El feedback no puede superar los 500 caracteres"),
];
const validateUpdateGrade = [
  check("score")
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage("La calificación debe estar entre 0 y 10"),

  check("feedback")
    .optional()
    .isString()
    .withMessage("El feedback debe ser un texto")
    .isLength({ max: 500 })
    .withMessage("El feedback no puede superar los 500 caracteres"),
];

module.exports = {
  validateCreateGrade,
  validateUpdateGrade
};
