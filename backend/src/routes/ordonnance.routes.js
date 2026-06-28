const express = require("express")
const router = express.Router()
const { getOrdonnances, createOrdonnance } = require("../controllers/ordonnance.controller")

router.get("/:patientId", getOrdonnances)
router.post("/", createOrdonnance)

module.exports = router