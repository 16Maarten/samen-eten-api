const express = require('express')
const router = express.Router()
const User = require("../models/user.model")(); // note we need to call the model caching function
const CrudController = require("../controllers/crud");
const userCrudController = new CrudController(User);
const userController = require("../controllers/user.controller");

// UC-201 Maak studentenhuis
router.post("/register", userController.create);
// UC-201 Maak studentenhuis
router.post("/login", userController.login);
// UC-202 Overzicht van studentenhuizen
router.get("",userController.validateToken, userCrudController.getAll);
// UC-203 Details van studentenhuis
router.get("/:id",userController.validateToken, userCrudController.getOne);
// UC-204 Studentenhuis wijzigen
router.put("/:id",userController.validateToken, userCrudController.update);
// UC-205 Studentenhuis verwijderen
router.delete("/:id",userController.validateToken, userCrudController.delete);

module.exports = router;