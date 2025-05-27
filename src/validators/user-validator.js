const { check, body } = require("express-validator");
const HttpError = require("../utils/Http-Error");

//revisar

const createUserValidator = [
  check("email").isEmail().withMessage("Email inválido"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  check("name").notEmpty().withMessage("El nombre es requerido"),
  check("dni").notEmpty().withMessage("El DNI no puede estar vacío"),
  check("role")
    .isIn(["superadmin", "teacher"])
    .withMessage("Rol inválido. Debe ser 'superadmin', 'teacher'"),
  check("profile").custom((value, { req }) => {
    const role = req.body.role;

    if (role === "teacher") {
      if (!value || !value.credential || !value.title) {
        throw new HttpError(
          "La credencial y el título son requeridos para profesores"
        );
      }
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
  check("dni").optional().notEmpty().withMessage("El DNI no puede estar vacío"),
  check("role")
    .optional()
    .isIn(["superadmin", "teacher"])
    .withMessage("Rol inválido. Debe ser 'superadmin', 'teacher'"),
  body("profile")
    .optional()
    .custom((value, { req }) => {
      const role = req.body.role;
      if (role === "teacher") {
        if ("credential" in value && value.credential === "") {
          throw new HttpError("La credencial no puede estar vacía");
        }
        if ("title" in value && value.title === "") {
          throw new HttpError("El título no puede estar vacío");
        }
      }

      return true;
    }),
];

module.exports = {
  createUserValidator,
  editUserValidator,
};
