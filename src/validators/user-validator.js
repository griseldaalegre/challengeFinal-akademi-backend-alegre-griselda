const { check, body } = require("express-validator");
const HttpError = require("../utils/Http-Error");
const Course = require("../models/Course")

const createUserValidator = [
  check("email")
    .isEmail()
    .withMessage("Email inválido"),

  check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  check("name")
    .notEmpty()
    .withMessage("El nombre es requerido"),

  check("dni")
    .notEmpty()
    .withMessage("El DNI no puede estar vacío"),

  check("role").custom((value, { req }) => {
    const allowedRoles = ["superadmin", "professor", "student"];
    if (!allowedRoles.includes(value)) {
      throw new HttpError("Rol inválido. Debe ser 'superadmin' o 'professor', 'student'");
    }
    return true;
  }),

];

const editUserValidator = [
  check("email").optional().isEmail().withMessage("Email inválido"),

  check("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  check("name")
    .optional()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío"),

  check("dni")
    .optional()
    .notEmpty()
    .withMessage("El DNI no puede estar vacío"),

  check("role")
    .optional()
    .custom((value, { req }) => {
      if (req.user.role !== "superadmin") {
        throw new HttpError("No tienes permiso para modificar el rol", 403);
      }

      if (!["superadmin", "professor", "student"].includes(value)) {
        throw new HttpError("Rol inválido", 400);
      }

      return true;
    }),

 
];

module.exports = editUserValidator;



module.exports = {
  createUserValidator,
  editUserValidator
};
