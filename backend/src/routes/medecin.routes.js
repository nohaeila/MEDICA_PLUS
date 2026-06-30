const express = require("express")
const router = express.Router()
const { getMedecins, getMedecinById, getPatientsMedecin, getMonProfil, updateMonProfil } = require("../controllers/medecin.controller")
const { verifyToken } = require("../middleware/auth.middleware")

// IMPORTANT : ces routes doivent être placées AVANT "/:id", sinon Express
// interprète "profil" comme une valeur de :id et appelle getMedecinById par erreur.
router.get("/profil", verifyToken, getMonProfil)
router.put("/profil", verifyToken, updateMonProfil)

router.get("/", getMedecins)
router.get("/:id/patients", getPatientsMedecin)
router.get("/:id", getMedecinById)

module.exports = router