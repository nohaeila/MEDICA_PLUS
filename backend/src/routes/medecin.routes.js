const express = require("express")
const router = express.Router()
const { getMedecins, getMedecinById, getPatientsMedecin } = require("../controllers/medecin.controller")

router.get("/", getMedecins)
router.get("/:id/patients", getPatientsMedecin)
router.get("/:id", getMedecinById)

module.exports = router