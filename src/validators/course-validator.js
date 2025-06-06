const { check } = require("express-validator");
const HttpError = require("../utils/Http-Error");

const CATEGORY_ENUM = ["web", "cyber"];
const LEVEL_ENUM = ["beginner", "intermediate", "advanced"];

const createCourseValidator = [
  check("title")
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isLength({ min: 3 })
    .withMessage("El título debe tener al menos 3 caracteres"),

  check("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("La descripción no puede superar los 1000 caracteres"),

  check("category")
    .notEmpty()
    .withMessage("La categoría es obligatoria")
    .custom((value) => {
      if (!CATEGORY_ENUM.includes(value)) {
        throw new HttpError(`Categoría inválida. Debe ser una de: ${CATEGORY_ENUM.join(", ")}`, 400);
      }
      return true;
    }),

  check("level")
    .notEmpty()
    .withMessage("El nivel es obligatorio")
    .custom((value) => {
      if (!LEVEL_ENUM.includes(value)) {
        throw new HttpError(`Nivel inválido. Debe ser uno de: ${LEVEL_ENUM.join(", ")}`, 400);
      }
      return true;
    }),

  check("price")
    .notEmpty()
    .withMessage("El precio es obligatorio")
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número positivo"),

  check("capacity")
    .notEmpty()
    .withMessage("La capacidad es obligatoria")
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser un número entero mayor a 0"),

  check("professor")
    .notEmpty()
    .withMessage("El ID del profesor es obligatorio")
    .isMongoId()
    .withMessage("El ID del profesor debe ser un ObjectId válido"),
];

const updateCourseValidator = [
  check("title")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("El título debe tener al menos 3 caracteres"),

  check("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("La descripción no puede superar los 1000 caracteres"),

  check("category")
    .optional()
    .custom((value) => {
      if (!CATEGORY_ENUM.includes(value)) {
        throw new HttpError(`Categoría inválida. Debe ser una de: ${CATEGORY_ENUM.join(", ")}`, 400);
      }
      return true;
    }),

  check("level")
    .optional()
    .custom((value) => {
      if (!LEVEL_ENUM.includes(value)) {
        throw new HttpError(`Nivel inválido. Debe ser uno de: ${LEVEL_ENUM.join(", ")}`, 400);
      }
      return true;
    }),

  check("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número positivo"),

  check("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser un número entero mayor a 0"),

  check("professor")
    .optional()
    .isMongoId()
    .withMessage("El ID del profesor debe ser un ObjectId válido"),
];

module.exports = {
  createCourseValidator,
  updateCourseValidator,
};
