const User = require("../models/User");
const Course = require("../models/Course");
const HttpError = require("../utils/Http-Error");
const paginate = require("../utils/pagination");

const getUsers = async (req, res, next) => {
  const { page, limit } = req.query;

  try {
    const result = await paginate(User, {}, page, limit);

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
    next(new HttpError(e));
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

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.token;

    res.send({ message: "Detalles del usuario", user: userObj });
  } catch (e) {
    next(new HttpError(e));
  }
  
};

//modularizar mejor
const editUser = async (req, res, next) => {
  const allowed = ["name", "email", "dni", "password", "role", "profile"];
  const updates = Object.keys(req.body);

  const isValidUpdate = updates.find((key) => !allowed.includes(key));
  if (isValidUpdate) {
    return next(new HttpError(`Campo no permitido: ${isValidUpdate}`, 400));
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new HttpError("Usuario no encontrado", 404));

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
  }catch (e) {
    next(new HttpError(e));
  }
  
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new HttpError("Usuario no encontrado", 404));

    if (user.role === "professor") {
      const cursos = await Course.find({ professor: user._id });
      if (cursos.length > 0) {
        return next(
          new HttpError(
            "No se puede eliminar un profesor con cursos asignados",
            403
          )
        );
      }
    }

    await user.deleteOne();

    res.status(200).json({
      message: "Usuario eliminado correctamente",
      user,
    });
  } catch (e) {
    next(new HttpError(e));
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
    next(new HttpError(e));
  }
  
};

module.exports = {
  getUsers,
  getUser,
  editUser,
  deleteUser,
  createUser,
};
