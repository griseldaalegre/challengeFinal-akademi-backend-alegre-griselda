const { check } = require("express-validator");

const loginValidator = [
  check("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Ingresa un email válido"),
  check("password").not().isEmpty().withMessage("La contraseña es obligatoria"),
];

const registerValidator = [
  check("email").isEmail().withMessage("Email inválido"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  check("name").not().isEmpty().withMessage("El nombre es requerido"),
  check("dni").notEmpty().withMessage("El DNI no puede estar vacío"),
  check("role")
    .equals("student")
    .withMessage("Solo se puede registrar alumnos"),
];

const passwordValidator = [
  check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
];

module.exports = {
  loginValidator,
  registerValidator,
  passwordValidator,
};
