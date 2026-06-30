const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getDossier, updateDossier } = require('../controllers/dossier.controller');

router.use(authMiddleware);

router.get('/', getDossier);
router.put('/', updateDossier);

module.exports = router;