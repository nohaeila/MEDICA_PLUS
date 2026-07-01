const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const {
  searchMedecins, getMedecinById,
  getPatientsMedecin, getMonProfil, updateMonProfil
} = require('../controllers/medecins.controller');

router.get('/search', searchMedecins);
router.get('/profil', authMiddleware, getMonProfil);
router.put('/profil', authMiddleware, updateMonProfil);
router.get('/mes-patients', authMiddleware, getPatientsMedecin);
router.get('/:id', getMedecinById);

module.exports = router;