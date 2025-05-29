const express = require("express");
const router = express.Router();
const permit = require("../middlewares/roles");
const handleValidationErrors = require("../middlewares/handle-validation-errors"); //revisar
const {createCourseValidator} = require("../validators/course-validator");
const coursesController = require("../controllers/courses-controller");


// · GET/courses- Listar cursos (solo alumno)
router.get("/", permit("student"), coursesController.getCourses);
// · POST/courses- Crear curso (solo profesor)
router.post("/", permit("professor"), createCourseValidator, handleValidationErrors,  coursesController.createCourse);

// · GET/courses/:id- Detalle del curso
router.get("/:id", permit("student", "professor"), coursesController.getCourse);

// · PATCH/courses/:id- Editar curso (solo profesor)
router.patch("/:id", permit("professor"), coursesController.updateCourse);

router.delete("/:id", permit("professor"), coursesController.deleteCourse);

// · GET/courses/professorId– Listar listados de cursos dados de alta por el (solo profesor)
router.get("/professor/:id", permit("professor"), coursesController.getCoursesByProfessor);
 module.exports = router;
