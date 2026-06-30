const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notifications.controller');

router.use(authMiddleware);
router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);

module.exports = router;