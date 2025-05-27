const express = require("express");
const router = express.Router();
const permit = require("../middlewares/roles");
const handleValidationErrors = require("../middlewares/handle-validation-errors"); //revisar

const { editUserValidator,createUserValidator  } = require("../validators/user-validator");

const userController = require("../controllers/user-controller");

// · GET/users- Listar usuarios (solo superadmin)
router.get("/", permit("superadmin"), userController.getUsers);

// · GET/users:id- Detalle de usuario
router.get("/:id", permit("superadmin"), userController.getUser);

// · PUT/users/:i- Editar usuario
router.put("/:id", permit("superadmin"), editUserValidator, handleValidationErrors, userController.editUser);

// . DELETE/users/:id- Eliminar usuario
router.delete("/:id", permit("superadmin"), userController.deleteUser);

// · POST/users- Crear usuario (con rol Profesor/SuperAdmin)
router.post("/", permit("superadmin"), createUserValidator, handleValidationErrors, userController.createUser);



module.exports = router;


/* Usuarios:


 · DELETE/users/:id- Eliminar usuario
 · POST/users- Crear usuario (con rol Profesor/SuperAdmin).*/