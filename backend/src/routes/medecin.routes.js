const express = require("express")
const router = express.Router()

const {
  getMedecins,
  getMedecinById,
  getPatientsMedecin,
  getMonProfil,
  updateMonProfil
} = require("../controllers/medecin.controller")

const { verifyToken } = require("../controllers/auth.middleware")

router.get("/profil", verifyToken, getMonProfil)
router.put("/profil", verifyToken, updateMonProfil)

router.get("/", getMedecins)
router.get("/:id/patients", getPatientsMedecin)
router.get("/:id", getMedecinById)

module.exports = router