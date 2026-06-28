const express = require("express")
const router = express.Router()
const { getMedecins, getMedecinById } = require("../controllers/medecin.controller")

router.get("/", getMedecins)
router.get("/:id", getMedecinById)

module.exports = router