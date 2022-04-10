const express = require('express')
const router = express.Router()
const reviewController = require("../controllers/review.controller");
const userController = require("../controllers/user.controller");

router.post("/:id/reviews",userController.validateToken, reviewController.create);
router.get("/:id/reviews",userController.validateToken, reviewController.getAll);
router.get("/:id/reviews/:idReview",userController.validateToken, reviewController.get);
router.put("/:id/reviews/:idReview",userController.validateToken, reviewController.update);
router.delete("/:id/reviews/:idReview",userController.validateToken, reviewController.remove );

module.exports = router;