const express = require('express')
const router = express.Router()
const reviewController = require("../controllers/review.controller");
const userController = require("../controllers/user.controller");

// UC-201 Maak studentenhuis
router.post("/:id/reviews",userController.validateToken, reviewController.create);
// UC-202 Overzicht van studentenhuizen
router.get("/:id/reviews",userController.validateToken, reviewController.getAll);
router.get("/:id/reviews/:idReview",userController.validateToken, reviewController.get);
router.put("/:id/reviews/:idReview",userController.validateToken, reviewController.update);
// UC-205 Studentenhuis verwijderen
router.delete("/:id/reviews/:idReview",userController.validateToken, reviewController.remove );

module.exports = router;