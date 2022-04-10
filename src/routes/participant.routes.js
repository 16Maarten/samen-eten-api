const express = require('express')
const router = express.Router()
const userController = require("../controllers/user.controller");
const participantController = require("../controllers/participant.controller");

router.post("/:id/signup",userController.validateToken, participantController.create);
router.get("/:id/participants",userController.validateToken, participantController.getAll);
router.delete("/:id/signoff",userController.validateToken, participantController.remove);

module.exports = router;