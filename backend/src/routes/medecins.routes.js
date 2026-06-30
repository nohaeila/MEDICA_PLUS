const express = require('express');
const router = express.Router();
const { searchMedecins, getMedecinById } = require('../controllers/medecins.controller');

router.get('/search', searchMedecins);
router.get('/:id', getMedecinById);

module.exports = router;