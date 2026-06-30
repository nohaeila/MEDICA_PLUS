const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getOrdonnances = async (req, res) => {
  try {
    const userId = req.user.userId;

    const patient = await prisma.patient.findUnique({
      where: { userId }
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient non trouvé' });
    }

    const ordonnances = await prisma.ordonnance.findMany({
      where: { patientId: patient.id },
      include: { patient: true },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(ordonnances);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

const createOrdonnance = async (req, res) => {
  try {
    const { patientId, contenu, date } = req.body;

    const ordonnance = await prisma.ordonnance.create({
      data: { patientId, contenu, date }
    });

    return res.status(201).json({ message: 'Ordonnance créée', ordonnance });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { getOrdonnances, createOrdonnance };