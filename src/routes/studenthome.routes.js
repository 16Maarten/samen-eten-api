const express = require('express')
const router = express.Router()

const Studenthome = require('../models/studenthome.model')() // note we need to call the model caching function
const CrudController = require('../controllers/crud')

const studenthomeCrudController = new CrudController(Studenthome)
const userController = require('../controllers/user.controller')

// UC-201 Maak studentenhuis
router.post("",userController.validateToken, studenthomeCrudController.create);
// UC-202 Overzicht van studentenhuizen
router.get("",userController.validateToken, studenthomeCrudController.getAll);
// UC-203 Details van studentenhuis
router.get("/:id",userController.validateToken, studenthomeCrudController.getOne);
// UC-204 Studentenhuis wijzigen
router.put("/:id",userController.validateToken, studenthomeCrudController.update);
// UC-205 Studentenhuis verwijderen
router.delete("/:id",userController.validateToken, studenthomeCrudController.delete);

module.exports = router