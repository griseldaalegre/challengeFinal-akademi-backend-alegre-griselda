const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const HttpError = require("../utils/Http-Error");
const paginate = require("../utils/Pagination");
const  isCourseOfThisUser = require("../utils/is-course-this-user");//renombrar


//listar inscripciones del propio estudiante
const getEnrollments = async (req, res, next) => {
  const { page, limit } = req.query;
  const { id } = req.params;

  try {
    isCourseOfThisUser(req.user, id);

    const result = await paginate(Enrollment, { student: id }, page, limit);

    if (result.data.length === 0) {
      return next(new HttpError("No se encontraron inscripciones", 404));
    }

    res.status(200).json({
      message: "Listado de inscripciones",
      ...result,
    });
  } catch (e) {
    next(new HttpError(e));
  }
};
const enrollStudentInCourse = async (req, res, next) => {
  try {
    //revisar destructurign
    const { student, course: courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return next(new HttpError("Curso no encontrado", 404));
    }

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
    next(new HttpError(e));
  }
};

const cancelEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) {
      return next(new HttpError("Inscripción no encontrado", 404));
    }
    res.status(200).json({
      message: "Inscripción cancelada",
      enrollment,
    });
  } catch (e) {
    next(new HttpError(e));
  }
};

const getEnrollmentsByCourse = async (req, res, next) => {
  const { id } = req.params;
  const { page, limit } = req.query;
console.log(id)
  try {
    const course = await Course.findById(id);
    console.log(course);
    if (!course) {
      return next(new HttpError("Curso no encontrado", 404));
    }

    isCourseOfThisUser(req.user, course.professor);

    const result = await paginate(
      Enrollment,
      { course: id },
      page,
      limit
    );

    if (result.data.length === 0) {
      return next(new HttpError("No hay inscripciones en este curso", 404));
    }

    res.status(200).json({
      message: "Inscripciones encontradas",
      ...result,
    });
  } catch (err) {
    next(new HttpError(err));
  }
};



module.exports = {
  getEnrollments,
  enrollStudentInCourse,
  cancelEnrollment,
  getEnrollmentsByCourse,
};
