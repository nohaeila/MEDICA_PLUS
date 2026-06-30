const express = require("express")
const router = express.Router()

const {
  getRDV,
  createRDV,
  updateRDV,
  deleteRDV
} = require("../controllers/rdv.controller")

const verifyToken = require("../middleware/auth.middleware")

router.get("/", verifyToken, getRDV)

router.post("/", createRDV)
router.put("/:id", updateRDV)
router.delete("/:id", deleteRDV)

module.exports = router