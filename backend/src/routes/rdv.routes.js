const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { createRdv, getRdvs, deleteRdv, updateRdv, getHorairesPris } = require('../controllers/rdv.controller');

router.use(authMiddleware);

router.post('/', createRdv);
router.get('/', getRdvs);
router.delete('/:id', deleteRdv);
router.put('/:id', updateRdv);
router.get('/horaires-pris', getHorairesPris);

module.exports = router;