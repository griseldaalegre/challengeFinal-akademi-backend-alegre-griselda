const express = require("express");
const router = express.Router();
const permit = require("../middlewares/roles");
const handleValidationErrors = require("../middlewares/handle-validation-errors"); //revisar
const {createCourseValidator} = require("../validators/course-validator");
const coursesController = require("../controllers/courses-controller");


router.get("/", permit("student"), coursesController.getCourses);

router.post("/", permit("professor"), createCourseValidator, handleValidationErrors,  coursesController.createCourse);

router.get("/:id", permit("student", "professor"), coursesController.getCourse);

router.patch("/:id", permit("professor"), coursesController.updateCourse);

router.delete("/:id", permit("professor"), coursesController.deleteCourse);

router.get("/professor/:id", permit("professor"), coursesController.getCoursesByProfessor);

 module.exports = router;

