const express = require("express");
const router = express.Router();
const permit = require("../middlewares/roles");
const { validateCreateGrade, validateUpdateGrade } = require("../validators/grade-validator");
const handleValidationErrors = require("../middlewares/handle-validation-errors");
const gradeController = require("../controllers/grade-controller");

// · POST/grades- Cargar calificación (solo profesor)
router.post("/", permit("professor"), validateCreateGrade, handleValidationErrors, gradeController.addGrade);

// · P /grades/student/:id- Editar calificación (solo profesor)
router.patch("/student/:id", permit("professor"), validateUpdateGrade, handleValidationErrors, gradeController.updateGrade );

// · GET/grades/student/:id- Ver calificaciones de un alumno
 router.get("/student/:id", permit("professor", "student"), gradeController.getGradesByStudent );

 module.exports = router;
