const express = require("express");
const router = express.Router();
const permit = require("../middlewares/roles");
const {enrollmentValidator} = require("../validators/enrollment-validator");
const handleValidationErrors = require("../middlewares/handle-validation-errors");
const enrollmentController = require("../controllers/enrollment-controller");

router.get("/student/:id", permit("student"),  enrollmentController.getEnrollments);

router.post("/", permit("student"), enrollmentValidator, handleValidationErrors, enrollmentController.enrollStudentInCourse )

router.delete("/:id", permit("student"), enrollmentController.cancelEnrollment);

router.get("/course/:id", permit("professor"), enrollmentController.getEnrollmentsByCourse);

 module.exports = router;
