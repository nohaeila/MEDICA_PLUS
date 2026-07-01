const express = require("express")
const router = express.Router()
const { getDossierPatient, updateNotesDossier } = require("../controllers/dossier.controller")
const { verifyToken } = require("../controllers/auth.middleware")

router.get("/patient/:patientId", verifyToken, getDossierPatient)
router.put("/patient/:patientId/notes", verifyToken, updateNotesDossier)

module.exports = router