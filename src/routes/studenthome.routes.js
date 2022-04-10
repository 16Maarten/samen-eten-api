const express = require('express')
const router = express.Router()

const Studenthome = require('../models/studenthome.model')() // note we need to call the model caching function
const CrudController = require('../controllers/crud')

const studenthomeCrudController = new CrudController(Studenthome)
const userController = require('../controllers/user.controller')

router.post("",userController.validateToken, studenthomeCrudController.create);
router.get("", studenthomeCrudController.getAll);
router.get("/:id", studenthomeCrudController.getOne);
router.put("/:id",userController.validateToken, studenthomeCrudController.update);
router.delete("/:id",userController.validateToken, studenthomeCrudController.delete);

module.exports = router