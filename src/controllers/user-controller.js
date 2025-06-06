const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const HttpError = require("../utils/Http-Error");
const paginate = require("../utils/Pagination");
const isCourseOfThisUser = require("../utils/is-course-this-user");

const getUsers = async (req, res, next) => {
  const { name, role, page, limit } = req.query;

  filter = {};
  if (name) filter.name = { $regex: name, $options: "i" };
  if (role) filter.role = new RegExp(role);

  try {
    const result = await paginate(User, filter, page, limit);

    if (result.data.length === 0) {
      return next(new HttpError("No hay usuarios registrados", 404));
    }

    const sanitizedUsers = result.data.map((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      delete userObj.token;
      return userObj;
    });

    res.status(200).json({
      message: "Listado de usuarios",
      total: result.total,
      page: result.page,
      pages: result.pages,
      data: sanitizedUsers,
    });
  } catch (e) {
    next(e);
  }
};

const getUser = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new HttpError("ID de usuario requerido", 400));
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return next(new HttpError("Usuario no encontrado", 404));
    }

    isCourseOfThisUser(
      req.user,
      user,
      "Este perfil no pertenece al estudiante logueado."
    );

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.token;

    res.send({ message: "Detalles del usuario", user: userObj });
  } catch (e) {
    next(e);
  }
};

const editUser = async (req, res, next) => {
  const allowed = ["name", "email", "dni", "password", "profile", "role"];
  const updates = Object.keys(req.body);

  const isValidUpdate = updates.find((key) => !allowed.includes(key));
  if (isValidUpdate) {
    return next(new HttpError(`Campo no permitido: ${isValidUpdate}`, 400));
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new HttpError("Usuario no encontrado", 404));

    isCourseOfThisUser(
      req.user,
      user,
      "No tienes permiso para editar a este usuario"
    );

    const { email } = req.body;
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (
        existingEmail &&
        existingEmail._id.toString() !== user._id.toString()
      ) {
        return next(new HttpError("Ya existe un usuario con ese email.", 422));
      }
    }

    updates.forEach((key) => {
      if (key === "profile" && typeof req.body.profile === "object") {
        Object.assign(user.profile, req.body.profile);
      } else {
        user[key] = req.body[key];
      }
    });

    await user.save({ validateModifiedOnly: true });

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.token;

    res.status(200).json({
      message: "Usuario editado correctamente",
      user: userObj,
    });
  } catch (e) {
    next(e);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new HttpError("Usuario no encontrado", 404));
    }

    if (user.role === "professor") {
      const hasCourses = await Course.exists({ professor: user._id });
      if (hasCourses) {
        return next(
          new HttpError(
            "No se puede eliminar un profesor con cursos asignados",
            403
          )
        );
      }
    }

    if (user.role === "student") {
      const hasEnrollments = await Enrollment.exists({ student: user._id });
      if (hasEnrollments) {
        return next(
          new HttpError(
            "No se puede eliminar un alumno con inscripciones asignados",
            403
          )
        );
      }
    }

    await user.deleteOne();
    res.status(200).json({ message: "Usuario eliminado correctamente", user });
  } catch (e) {
    next(e);
  }
};

const createUser = async (req, res, next) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new HttpError("Ya existe un usuario con ese email", 422));
  }
  try {
    const user = new User(req.body);
    await user.save();
    const userObj = user.toObject();
    delete user.password;
    delete user.token;
    res.status(201).json({
      message: "Se creo usuario  correctamente",
      user: userObj,
    });
  } catch (e) {
    next(e);
  }
};

const getGeneralStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: "student" });
    const professors = await User.countDocuments({ role: "professor" });
    const superadmins = await User.countDocuments({ role: "superadmin" });

    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    res.status(200).json({
      message: "Estadisticas Generales",
      totalUsers,
      students,
      professors,
      superadmins,
      totalCourses,
      totalEnrollments,
    });
  } catch (e) {
    next(
      new HttpError(
        "No se pudieron obtener las estadísticas generales del sistema",
        500
      )
    );
  }
};

module.exports = {
  getUsers,
  getUser,
  editUser,
  deleteUser,
  createUser,
  getGeneralStats,
};
