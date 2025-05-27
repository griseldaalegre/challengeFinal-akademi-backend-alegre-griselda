const Course = require("../models/Course");
const HttpError = require("../utils/Http-Error");
const paginate = require("../utils/Pagination");

const getCourses = async (req, res, next) => {
  const { category, level, price, page, limit } = req.body;

  filter = {};

  if (category) filter.category = new RegExp(category, "i");
  if (level) filter.level = new Reg.Exp(level, "i");
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
    next(new HttpError("Error al obtener listado de cursos", 500));
  }
};

const createCourse  = async (req,res,next) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).send({message: "Curso creado correctamente"});
  } catch(e){
    next(new HttpError("Error al crear curso", 400));
  }
}

module.exports = {
  getCourses,
  createCourse 
}
