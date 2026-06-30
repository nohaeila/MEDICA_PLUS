const express = require("express")
const router = express.Router()

const {
  getDossierPatient,
  updateNotesDossier
} = require("../controllers/dossier.controller")

const authMiddleware = require("../middlewares/auth.middleware")

// GET dossier patient
router.get(
  "/patient/:patientId",
  authMiddleware,
  getDossierPatient
)

// UPDATE notes dossier
router.put(
  "/patient/:patientId/notes",
  authMiddleware,
  updateNotesDossier
)

module.exports = router