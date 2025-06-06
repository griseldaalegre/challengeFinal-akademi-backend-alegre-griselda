const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const User = require("../models/User");
const HttpError = require("../utils/Http-Error");
const paginate = require("../utils/Pagination");
const isCourseOfThisUser = require("../utils/is-course-this-user"); 

const getCourses = async (req, res, next) => {
  const { category, level, price, page, limit } = req.query;

  const filter = {};

  if (category) filter.category = new RegExp(category, "i");
  if (level) filter.level = new RegExp(level, "i");
  if (price) filter.price = price;

  try {
    const result = await paginate(Course, filter, page, limit);

    if (result.data.length === 0) {
      return next(
        new HttpError("No se encontraron cursos con esos criterios", 404)
      );
    }

    const populatedData = await Course.populate(result.data, {
      path: "professor",
      select: "name email dni role", 
    });

    res.send({
      message: "Listado de cursos",
      ...result,
      data: populatedData,
    });
  } catch (e) {
    next(e);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const { professor } = req.body;

    const professorUser = await User.findById(professor);
    if (!professorUser) {
      return next(new HttpError("Profesor no encontrado", 404));
    }

    isCourseOfThisUser(req.user._id, professorUser._id, "No dictas este curso");

    const course = new Course(req.body);
    await course.save();
    const populatedCourse = await Course.findById(course._id).populate("professor");

    res.status(201).send({ message: "Curso creado correctamente", course: populatedCourse });
  } catch (e) {
    next(e);
  }
};

const getCourse = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new HttpError("Se requiere el id del curso"));
  }
  

  try {
    const course = await Course.findById(id);
    if (!course) {
      return next(new HttpError("Curso no encontrado", 404));
    }
    res.send({ message: " Detalles del curso", course });
  } catch (e) {
    next(e);
  }
};

const updateCourse = async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowed = [
    "title",
    "description",
    "category",
    "level",
    "price",
    "capacity",
    "professor",
  ];
  const isValid = updates.every((u) => allowed.includes(u));

  if (!isValid) {
    return next(new HttpError("Actualización inválida", 400));
  }

  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new HttpError("Curso no encontrado", 404));
    }
    console.log(course.professor);
    isCourseOfThisUser(req.user, course.professor);

    updates.forEach((key) => {
      course[key] = req.body[key];
    });

    await course.save();

    res.status(200).json({
      message: "Curso actualizado",
      course,
    });
  } catch (e) {
    next(e);
  }
};
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return next(new HttpError("Curso no encontrado", 404));
    }

    isCourseOfThisUser(req.user, course.professor, "eliminar curso"); 

    const hasEnrollments = await Enrollment.exists({ course: course._id });

    if (hasEnrollments) {
      return next(
        new HttpError(
          "No se puede eliminar un curso con estudiantes inscriptos",
          400
        )
      );
    }

    await course.deleteOne();

    res.status(200).json({ message: "Curso eliminado correctamente", course });
  } catch (e) {
    next(e);
  }
};

const getCoursesByProfessor = async (req, res, next) => {
  const { category, level, price, page, limit } = req.query;

  const filter = {
    professor: req.params.id,
  };

  if (category) filter.category = new RegExp(category, "i");
  if (level) filter.level = new RegExp(level, "i");
  if (price) filter.price = price;

  try {

    isCourseOfThisUser(req.user, req.params.id, "No dictas este curso");

    const result = await paginate(Course, filter, page, limit);

    if (result.data.length === 0) {
      return next(
        new HttpError("No se encontraron cursos con esos criterios", 404)
      );
    }

    const populatedData = await Course.populate(result.data, {
      path: "professor",
      select: "name email dni role",
    });

    res.send({
      message: "Listado de cursos",
      ...result,
      data: populatedData,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  getCoursesByProfessor,
};
