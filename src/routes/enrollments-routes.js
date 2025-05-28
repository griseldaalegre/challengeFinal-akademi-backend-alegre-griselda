const express = require("express");
const router = express.Router();
const permit = require("../middlewares/roles");
const {enrollmentValidator} = require("../validators/enrollment-validator");
const handleValidationErrors = require("../middlewares/handle-validation-errors");
const enrollmentController = require("../controllers/enrollment-controller");

//  · GET/enrollments/studentId- Listar mis inscripciones (solo alumno)
router.get("/:id", permit("student"),  enrollmentController.getEnrollments);

// · POST/enrollments- Inscribirse a un curso (solo alumno)
router.post("/", permit("student"), enrollmentValidator, handleValidationErrors, enrollmentController.enrollStudentInCourse )

// · DELETE/enrollments/:id- Cancelar inscripción (solo alumno)
router.delete("/:id", permit("student"), enrollmentController.cancelEnrollment);

// · GET/enrollments/courseId– Listar inscripciones por curso (solo profesor)

router.get("/", permit("professor", enrollmentController.getEnrollmentsByCourse));

 module.exports = router;
