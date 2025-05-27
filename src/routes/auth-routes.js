const express = require("express");
const router = express.Router();
const { loginValidator,registerValidator, passwordValidator } = require("../validators/auth-validator");
const handleValidationErrors = require("../middlewares/handle-validation-errors"); //revisar
const authController = require("../controllers/auth-controller")

//rutas publicas
//register
//Aclaración: el registro apunta a la entidad users, pero se guarda con un profile correspondiente al rol de alumno
router.post("/register", registerValidator,handleValidationErrors, authController.registerUser); // validar dni
//login
router.post("/login", loginValidator, handleValidationErrors, authController.login);
module.exports = router;
//forgot password
router.post("/forgot-password", authController.forgotPassword);
//reset password
router.post("/reset-password", passwordValidator, handleValidationErrors, authController.resetPassword);

