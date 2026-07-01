const express = require("express")
const router = express.Router()
const { getRDV, createRDV, updateRDV, deleteRDV } = require("../controllers/rdv.controller")
const authMiddleware = require("../middleware/auth.middleware")

router.get("/", authMiddleware, getRDV)
router.post("/", authMiddleware, createRDV)
router.put("/:id", authMiddleware, updateRDV)
router.delete("/:id", authMiddleware, deleteRDV)

module.exports = router