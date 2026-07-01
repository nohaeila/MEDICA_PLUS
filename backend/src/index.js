const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const rdvRoutes = require('./routes/rdv.routes');
const medecinsRoutes = require('./routes/medecins.routes');
const ordonnancesRoutes = require('./routes/ordonnances.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const profilRoutes = require('./routes/profil.routes');
const dossierRoutes = require('./routes/dossier.routes');
const rapportRoutes = require('./routes/rapport.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rdv', rdvRoutes);
app.use('/api/medecins', medecinsRoutes);
app.use('/api/ordonnances', ordonnancesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/profil', profilRoutes);
app.use('/api/dossier', dossierRoutes);
app.use('/api/rapports', rapportRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'MEDICA+ API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur MEDICA+ lancé sur le port ${PORT}`);
});