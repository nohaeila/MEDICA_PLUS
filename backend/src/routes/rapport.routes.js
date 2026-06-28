const express = require("express")
const router = express.Router()
const { getRapports, createRapport } = require("../controllers/rapport.controller")

router.get("/:patientId", getRapports)
router.post("/", createRapport)

module.exports = router