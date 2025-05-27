const express = require("express");
const router = express.Router();
const permit = require("../middlewares/roles");
const handleValidationErrors = require("../middlewares/handle-validation-errors"); //revisar
const {createCourseValidator} = require("../validators/course-validator");
const coursesController = require("../controllers/courses-controller");


// · GET/courses- Listar cursos (solo alumno)
router.get("/", permit("student"), coursesController.getCourses);
// · POST/courses- Crear curso (solo profesor)
router.post("/", permit("teacher"), createCourseValidator, handleValidationErrors, coursesController.createCourse);
/* Cursos:
 · GET/courses/:id- Detalle del curso
 · P /courses/:id- Editar curso (solo profesor)
 · DELETE/courses/:id- Eliminar curso (solo profesor)
 · GET/courses/professorId– Listar listados de cursos dados de alta por el (solo profesor)*/
 module.exports = router;
