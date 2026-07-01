// profil.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getProfil, updateProfil } = require('../controllers/profil.controller');

router.use(authMiddleware);

router.get('/', getProfil);
router.put('/', updateProfil);

module.exports = router;