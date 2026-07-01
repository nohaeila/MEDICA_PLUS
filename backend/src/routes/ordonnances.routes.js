const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getOrdonnances, createOrdonnance } = require('../controllers/ordonnances.controller');

router.use(authMiddleware);
router.get('/', getOrdonnances);
router.post('/', createOrdonnance);

module.exports = router;