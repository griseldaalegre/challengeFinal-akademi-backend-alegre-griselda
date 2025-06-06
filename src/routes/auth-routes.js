const express = require("express");
const router = express.Router();
const { loginValidator,registerValidator, passwordValidator } = require("../validators/auth-validator");
const handleValidationErrors = require("../middlewares/handle-validation-errors"); 
const auth = require("../middlewares/auth");
const authController = require("../controllers/auth-controller")


router.post("/register", registerValidator,handleValidationErrors, authController.registerUser); 

router.post("/login", loginValidator, handleValidationErrors, authController.login);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", passwordValidator, handleValidationErrors, authController.resetPassword);

router.post("/logout",auth, authController.logout);
module.exports = router;