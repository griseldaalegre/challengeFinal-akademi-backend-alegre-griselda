const { check } = require('express-validator');

const createCourseValidator = [
  check('title')
    .notEmpty().withMessage('El título es obligatorio')
    .isLength({ min: 3 }).withMessage('El título debe tener al menos 3 caracteres'),

  check('description')
    .isLength({ max: 1000 }).withMessage('La descripción no puede superar los 1000 caracteres'),

  check('category')
    .isString().withMessage('La categoría debe ser una cadena de texto'),

  check('level')
    .isString().withMessage('El nivel debe ser una cadena de texto'),

  check('price')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),

  check('capacity')
    .notEmpty().withMessage('La capacidad es obligatoria')
    .isInt({ min: 1 }).withMessage('La capacidad debe ser un número entero mayor a 0'),

  check('professor')
    .notEmpty().withMessage('El ID del profesor es obligatorio')
    .isMongoId().withMessage('El ID del profesor debe ser un ObjectId válido')
];

module.exports = {
  createCourseValidator
};
