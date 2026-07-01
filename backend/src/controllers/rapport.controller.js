const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET — médecin voit les rapports d'un patient
const getRapports = async (req, res) => {
  try {
    const { patientId } = req.params;
    const rapports = await prisma.rapport.findMany({
      where: { patientId },
      include: { medecin: true },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(rapports);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// POST — médecin crée un rapport pour un patient
const createRapport = async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    if (role !== 'medecin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const medecin = await prisma.medecin.findUnique({ where: { userId } });
    if (!medecin) return res.status(404).json({ error: 'Médecin non trouvé' });

    const { patientId, contenu } = req.body;

    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) return res.status(404).json({ error: 'Patient non trouvé' });

    const rapport = await prisma.rapport.create({
      data: { patientId, medecinId: medecin.id, contenu }
    });

    return res.status(201).json({ message: 'Rapport créé', rapport });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { getRapports, createRapport };