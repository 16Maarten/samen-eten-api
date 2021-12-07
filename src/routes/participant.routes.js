const express = require('express')
const router = express.Router()
const userController = require("../controllers/user.controller");
const participantController = require("../controllers/participant.controller");


// UC-201 Maak studentenhuis
router.post("/:id/signup",userController.validateToken, participantController.create);
// UC-202 Overzicht van studentenhuizen
router.get("/:id/participants",userController.validateToken, participantController.getAll);
// UC-205 Studentenhuis verwijderen
router.delete("/:id/signoff",userController.validateToken, participantController.remove);

module.exports = router;