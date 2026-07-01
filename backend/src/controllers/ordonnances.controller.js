const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET — patient voit ses ordonnances
const getOrdonnances = async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    let ordonnances;

    if (role === 'patient') {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (!patient) return res.status(404).json({ error: 'Patient non trouvé' });

      ordonnances = await prisma.ordonnance.findMany({
        where: { patientId: patient.id },
        include: { medecin: true },
        orderBy: { createdAt: 'desc' }
      });
    } else if (role === 'medecin') {
      const medecin = await prisma.medecin.findUnique({ where: { userId } });
      if (!medecin) return res.status(404).json({ error: 'Médecin non trouvé' });

      const { patientId } = req.query;
      ordonnances = await prisma.ordonnance.findMany({
        where: { medecinId: medecin.id, ...(patientId && { patientId }) },
        include: { patient: true },
        orderBy: { createdAt: 'desc' }
      });
    }

    return res.status(200).json(ordonnances);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// POST — médecin crée une ordonnance pour un patient
const createOrdonnance = async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    if (role !== 'medecin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const medecin = await prisma.medecin.findUnique({ where: { userId } });
    if (!medecin) return res.status(404).json({ error: 'Médecin non trouvé' });

    const { patientId, contenu, date } = req.body;

    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) return res.status(404).json({ error: 'Patient non trouvé' });

    const ordonnance = await prisma.ordonnance.create({
      data: {
        patientId,
        medecinId: medecin.id,
        contenu,
        date
      }
    });

    return res.status(201).json({ message: 'Ordonnance créée', ordonnance });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { getOrdonnances, createOrdonnance };