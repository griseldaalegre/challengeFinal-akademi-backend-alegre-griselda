const User = require("../models/User");
const jwt = require("jsonwebtoken");
const HttpError = require("../utils/Http-Error");
const { sendRecoverEmail } = require("../email/recovery-email");


const login = async (req, res, next) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
        name: user.name, 
        email: user.email, 
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    user.token = token; 
    await user.save();

    res.send({ message: "Usuario logueado correctamente", user, token });
  } catch (e) {
    console.log(e);
    next(e);
  }
  
};

const registerUser = async (req, res, next) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new HttpError("Ya existe un usuario con ese email.", 422));
  }

  try {
    const user = new User(req.body);
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      message: "Usuario creado correctamente",
      user: userObj,
    });
  } catch (e) {
    next(e);
  }
  
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return next(new HttpError("No se encontró un usuario con ese email", 404));

  const recoveryToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const recoveryLink = `http://localhost:3000/reset-password/${recoveryToken}`;

  user.token = recoveryToken;
  await user.save();

  await sendRecoverEmail(user.email, recoveryLink);

  res.status(200).json({ message: "Correo de recuperación enviado." });
};

const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return next(new HttpError("Faltan campos obligatorios", 400));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new HttpError("Usuario no encontrado", 404));
    }

    if (token !== user.token) {
      return next(new HttpError("Token inválido o expirado", 400));
    }

    user.password = password; 
    user.token = null; 

    await user.save();

    res.send({ message: "Contraseña actualizada exitosamente" });
  } catch (e) {
    next(e);
  }
  
};

const logout = async (req, res, next) => {
  try {
    req.user.token = null;
    await req.user.save();
    res.send({ message: "Sesión cerrada con éxito" });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    next(new HttpError("No se pudo cerrar la sesión. Intente nuevamente.", 500));
  }
};

module.exports = {
  login,
  registerUser,
  forgotPassword,
  resetPassword,
  logout
};
