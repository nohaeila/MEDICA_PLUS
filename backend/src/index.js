const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const rdvRoutes = require('./routes/rdv.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rdv', rdvRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'MEDICA+ API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur MEDICA+ lancé sur le port ${PORT}`);
});