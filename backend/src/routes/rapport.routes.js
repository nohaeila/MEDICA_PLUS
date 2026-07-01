const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getRapports, createRapport } = require('../controllers/rapport.controller');

router.use(authMiddleware);
router.get('/:patientId', getRapports);
router.post('/', createRapport);

module.exports = router;