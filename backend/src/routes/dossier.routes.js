const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getDossier, updateDossier, getDossierPatient, updateDossierNotes } = require('../controllers/dossier.controller');

router.use(authMiddleware);

router.get('/', getDossier);
router.put('/', updateDossier);
router.get('/patient/:patientId', getDossierPatient);
router.put('/patient/:patientId/notes', updateDossierNotes);

module.exports = router;