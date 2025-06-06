const Student = require("../models/User");
const Course = require("../models/Course");
const Grade = require("../models/Grade");
const HttpError = require("../utils/Http-Error");
const paginate = require("../utils/Pagination");
const isCourseOfThisUser = require("../utils/is-course-this-user");
const addGrade = async (req, res, next) => {
  const { student: studentId, course: courseId, score } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new HttpError("Curso no encontrado", 404));
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return next(new HttpError("Estudiante no encontrado", 404));
    }

    isCourseOfThisUser(req.user, course.professor);

    const grade = new Grade({ student: studentId, course: courseId, score });
    await grade.save();

    res.status(201).json({
      message: "Calificación registrada exitosamente",
      grade,
    });
  } catch (e) {
    next(e);
  }
};

const updateGrade = async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowed = ["score", "feedback"];
  const isValid = updates.every((u) => allowed.includes(u));

  if (!isValid) {
    return next(new HttpError("Actualización inválida", 400));
  }

  try {
    const existingGrade = await Grade.findById(req.params.id).populate(
      "course"
    );
    if (!existingGrade) {
      
      return next(new HttpError("Calificación no encontrada", 404));
    }

    isCourseOfThisUser(req.user, existingGrade.course.professor);

    const updatedGrade = await Grade.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Calificación actualizada",
      grade: updatedGrade,
    });
  } catch (e) {
    next(e);
  }
};

const getGradesByStudent = async (req, res, next) => {
  const { page, limit } = req.query;
  const { id } = req.params; 

  try {
    const firstGrade = await Grade.findOne({ student: id }).populate("course");

    if (!firstGrade) {
      return next(new HttpError("No se encontraron calificaciones", 404));
    }

    const course = firstGrade.course;


    if (req.user.role === "professor") {
      isCourseOfThisUser(
        req.user,
        course.professor,
        "ver calificaciones de este curso"
      );
    }
    if (req.user.role === "student") {
      isCourseOfThisUser(req.user, id, "ver tus propias calificaciones");
    }

    const result = await paginate(Grade, { student: id }, page, limit);

    if (result.data.length === 0) {
      return next(new HttpError("No se encontraron calificaciones", 404));
    }

    await Grade.populate(result.data, [
      { path: "course" },
      { path: "student" },
    ]);
    res.status(200).json({
      message: "Listado de calificaciones del alumno",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getGradesByCourse = async (req, res, next) => {
  const { page, limit } = req.query;
  const { id: courseId } = req.params;

  try {

    const course = await Course.findById(courseId);
    if (!course) {
      return next(new HttpError("Curso no encontrado", 404));
    }

    isCourseOfThisUser(req.user, course.professor);

    const result = await paginate(Grade, { course: courseId }, page, 99999, [
      { path: "student" },
    ]);

    if (result.data.length === 0) {
      return next(new HttpError("No se encontraron calificaciones", 404));
    }

   
    res.status(200).json({
      message: "Listado de calificaciones del curso",
      ...result 
        });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addGrade,
  updateGrade,
  getGradesByStudent,
  getGradesByCourse,
};
