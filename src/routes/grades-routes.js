const express = require("express");
const router = express.Router();
const permit = require("../middlewares/roles");
const { validateCreateGrade, validateUpdateGrade } = require("../validators/grade-validator");
const handleValidationErrors = require("../middlewares/handle-validation-errors");
const gradeController = require("../controllers/grade-controller");

router.post("/", permit("professor"), validateCreateGrade, handleValidationErrors, gradeController.addGrade);

router.patch("/student/:id", permit("professor"), validateUpdateGrade, handleValidationErrors, gradeController.updateGrade );

 router.get("/student/:id", permit("professor", "student"), gradeController.getGradesByStudent ); 

router.get("/courses/:id", permit("professor"), gradeController.getGradesByCourse);

 module.exports = router;
