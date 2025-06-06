const express = require("express");
const router = express.Router();
const permit = require("../middlewares/roles");
const handleValidationErrors = require("../middlewares/handle-validation-errors"); 

const { editUserValidator,createUserValidator  } = require("../validators/user-validator");

const userController = require("../controllers/user-controller");

router.get("/", permit("superadmin"), userController.getUsers);

router.get("/:id", permit("professor", "student"), userController.getUser);

router.patch("/:id", permit("professor", "student"), editUserValidator, handleValidationErrors, userController.editUser);

router.delete("/:id", permit("superadmin"), userController.deleteUser);

router.post("/", permit("superadmin"), createUserValidator, handleValidationErrors, userController.createUser);

router.get("/stats/general", permit("superadmin"), userController.getGeneralStats);


module.exports = router;
