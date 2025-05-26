const { body } = require("express-validator");

const loginValidator = [
  body("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Ingresa un email válido"),
  body("password").not().isEmpty().withMessage("La contraseña es obligatoria"),
];

const registerValidator = [
  body("email").isEmail().withMessage("Email inválido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("profile.name").not().isEmpty().withMessage("El nombre es requerido"),
  body("role")
    .equals("student")
    .withMessage("Solo se puede registrar alumnos")
];


const passwordValidator = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
];



module.exports = {
  loginValidator,
  registerValidator,
  passwordValidator
};
