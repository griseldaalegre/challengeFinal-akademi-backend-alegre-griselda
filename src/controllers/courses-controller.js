const Course = require("../models/Course");
const HttpError = require("../utils/Http-Error");
const paginate = require("../utils/Pagination");

const getCourses = async (req, res, next) => {
  const { category, level, price, page, limit } = req.query;

  filter = {};

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
    res.send({
      message: "Listado dde cursos",
      ...result,
    });
  } catch (e) {
    next(new HttpError(e));
  }
};

const createCourse = async (req, res, next) => {
  try {
    isCourseOfThisProfessor(
      req.user.id.toString(),
      req.body.professor.toString()
    );

    const course = new Course(req.body);
    await course.save();
    res.status(201).send({ message: "Curso creado correctamente", course });
  } catch (e) {
    next(new HttpError(e));
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
    next(new HttpError(e));
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
    if (req.body.professor) {
      isCourseOfThisProfessor(
        req.user._id.toString(),
        req.body.professor.toString()
      );
    }

    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!course) {
      return next(new HttpError("Curso no encontrado", 404));
    }

    res.status(200).json({
      message: "Curso actualizado",
      course,
    });
  } catch (e) {
    next(new HttpError(e));
  }
  
};

const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new HttpError("Curso no encontrado", 404));
    }

    isCourseOfThisProfessor(
      req.user._id.toString(),
      course.professor.toString()
    );

    await course.deleteOne();

    res.status(200).json({ message: "Curso eliminado correctamente", course });
  } catch (e) {
    next(new HttpError(e));
  }
};

const getCoursesByProfessor = async (req, res, next) => {
  const { page, limit } = req.query;
  try {
    isCourseOfThisProfessor(req.user._id.toString(), req.params.id.toString());

    const result = await paginate(
      Course,
      { professor: req.user._id },//revisar
      page,
      limit
    );
    if (result.data.length === 0) {
      return next(
        new HttpError("No se encontraron cursos con esos criterios", 404)
      );
    }
    res.send({
      message: "Listado dde cursos",
      ...result,
    });
  }catch (e) {
    next(new HttpError(e));
  }
  
};

const isCourseOfThisProfessor = (professorAuthId, professorIdCourse) => {
  if (professorIdCourse !== professorAuthId) {
    throw new HttpError("Usted no lo dicta este curso", 403);
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
