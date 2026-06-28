const express = require("express")
const router = express.Router()
const { getNotifications, marquerLu } = require("../controllers/notification.controller")

router.get("/:userId", getNotifications)
router.put("/:id/read", marquerLu)

module.exports = router