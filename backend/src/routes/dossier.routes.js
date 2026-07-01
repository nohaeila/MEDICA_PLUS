const express = require("express")
const router = express.Router()
const { getDossierPatient, updateNotesDossier } = require("../controllers/dossier.controller")
const authMiddleware = require("../middleware/auth.middleware")

router.get("/patient/:patientId", authMiddleware, getDossierPatient)
router.put("/patient/:patientId/notes", authMiddleware, updateNotesDossier)

module.exports = router