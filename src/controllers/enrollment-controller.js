const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const HttpError = require("../utils/Http-Error");
const paginate = require("../utils/Pagination");
const isCourseOfThisUser = require("../utils/is-course-this-user");

const getEnrollments = async (req, res, next) => {
  const { page, limit } = req.query;
  const { id } = req.params;

  try {
    isCourseOfThisUser(req.user, id, "Las inscripciones no te pertenecen");

    const result = await paginate(Enrollment, { student: id }, page, limit);

    await Enrollment.populate(result.data, [
      { path: "course", populate: { path: "professor" } },
      { path: "student" },
    ]);

    res.status(200).json({
      message: "Listado de inscripciones",
      ...result,
    });
  } catch (e) {
    next(e);
  }
};
const enrollStudentInCourse = async (req, res, next) => {
  try {
    const { student, course: courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return next(new HttpError("Curso no encontrado", 404));
    }
    isCourseOfThisUser(
      req.user,
      student,
      "No te estas inscribiendo con tu usuario"
    );

    const existingEnrollment = await Enrollment.findOne({
      student,
      course: courseId,
    });
    if (existingEnrollment) {
      return next(new HttpError("Ya estás inscrito en este curso", 400));
    }

    const currentEnrollments = await Enrollment.countDocuments({
      course: courseId,
    });

    if (currentEnrollments >= course.capacity) {
      return next(
        new HttpError("Ya no hay cupos disponibles para este curso", 400)
      );
    }

    const enrollment = new Enrollment({ student, course: courseId });
    await enrollment.save();

    res.status(201).json({
      message: "Inscripción exitosa",
      enrollment,
    });
  } catch (e) {
    next(e);
  }
};

const cancelEnrollment = async (req, res, next) => {
  try {
    const enrollmentId = req.params.id;

    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      return next(new HttpError("Inscripción no encontrada", 404));
    }

    isCourseOfThisUser(
      req.user,
      enrollment.student,
      "La inscripción no te pertenece"
    );

    await enrollment.deleteOne();

    res.status(200).json({
      message: "Inscripción cancelada",
      enrollment,
    });
  } catch (e) {
    next(e);
  }
};

const getEnrollmentsByCourse = async (req, res, next) => {
  const { id } = req.params;
  const { page, limit } = req.query;

  try {
    const course = await Course.findById(id);
    if (!course) {
      return next(new HttpError("Curso no encontrado", 404));
    }

    isCourseOfThisUser(req.user, course.professor);

    const result = await paginate(Enrollment, { course: id }, page, limit);

    await Enrollment.populate(result.data, [
      { path: "student" },
      { path: "course" },
    ]);

    if (result.data.length === 0) {
      return next(new HttpError("No hay inscripciones en este curso", 404));
    }

    res.status(200).json({
      message: "Inscripciones encontradas",
      ...result,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getEnrollments,
  enrollStudentInCourse,
  cancelEnrollment,
  getEnrollmentsByCourse,
};
