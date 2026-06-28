const express = require("express")
const router = express.Router()
const { getRDV, createRDV, updateRDV, deleteRDV } = require("../controllers/rdv.controller")

router.get("/:medecinId", getRDV)
router.post("/", createRDV)
router.put("/:id", updateRDV)
router.delete("/:id", deleteRDV)

module.exports = router