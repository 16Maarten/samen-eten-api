const express = require("express");
const router = express.Router();
const Meal = require("../models/meal.model")(); // note we need to call the model caching function

const CrudController = require("../controllers/crud");

const mealCrudController = new CrudController(Meal);
const userController = require("../controllers/user.controller");

router.post("",userController.validateToken, mealCrudController.create);
router.get("",userController.validateToken,mealCrudController.getAll);
router.get("/:id",userController.validateToken,mealCrudController.getOne);
router.put("/:id",userController.validateToken,mealCrudController.update);
router.delete("/:id",userController.validateToken,mealCrudController.delete);

module.exports = router;
