const express = require('express')
const router = express.Router()
const User = require("../models/user.model")();
const CrudController = require("../controllers/crud");
const userCrudController = new CrudController(User);
const userController = require("../controllers/user.controller");


router.post("/register", userController.create);
router.post("/login", userController.login);
router.post("/:id/follow",userController.validateToken, userController.follow);
router.get("/:id",userController.validateToken, userCrudController.getOne);
router.get("/:id/followers",userController.validateToken, userController.followers);
router.put("/:id",userController.validateToken, userCrudController.update);
router.delete("/:id",userController.validateToken, userController.delete);
router.delete("/:id/unfollow",userController.validateToken, userController.unfollow);

module.exports = router;