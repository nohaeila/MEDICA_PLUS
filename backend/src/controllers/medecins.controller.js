const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const searchMedecins = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Requete trop courte' });
    }
    const medecins = await prisma.medecin.findMany({
      where: {
        OR: [
          { nom: { contains: query } },
          { prenom: { contains: query } },
          { specialite: { contains: query } },
        ]
      },
      include: { user: { select: { email: true } } },
      take: 10
    });
    const results = medecins.map((m) => ({
      id: m.id,
      nom: `Dr. ${m.prenom} ${m.nom}`,
      spec: m.specialite,
      ville: m.adresse || 'Cabinet'
    }));
    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

const getMedecinById = async (req, res) => {
  try {
    const { id } = req.params;
    const medecin = await prisma.medecin.findUnique({
      where: { id },
      include: { user: { select: { email: true } } }
    });
    if (!medecin) return res.status(404).json({ error: 'Médecin non trouvé' });
    return res.status(200).json({
      id: medecin.id,
      prenom: medecin.prenom,
      nom: medecin.nom,
      specialite: medecin.specialite,
      telephone: medecin.telephone,
      email: medecin.user.email,
      adresse: medecin.adresse
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Patients ayant eu un RDV avec ce médecin
const getPatientsMedecin = async (req, res) => {
  try {
    const userId = req.user.userId;
    const medecin = await prisma.medecin.findUnique({ where: { userId } });
    if (!medecin) return res.status(404).json({ error: 'Médecin non trouvé' });

    const rdvs = await prisma.rDV.findMany({
      where: { medecinId: medecin.id },
      include: { patient: true },
      distinct: ['patientId']
    });

    const patients = rdvs.map(r => r.patient);
    return res.status(200).json(patients);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Profil du médecin connecté
const getMonProfil = async (req, res) => {
  try {
    const userId = req.user.userId;
    const medecin = await prisma.medecin.findUnique({
      where: { userId },
      include: { user: { select: { email: true } } }
    });
    if (!medecin) return res.status(404).json({ error: 'Profil introuvable' });
    return res.status(200).json({
      id: medecin.id,
      prenom: medecin.prenom,
      nom: medecin.nom,
      specialite: medecin.specialite,
      telephone: medecin.telephone,
      adresse: medecin.adresse,
      email: medecin.user.email
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Mise à jour du profil médecin
const updateMonProfil = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { telephone, specialite, adresse } = req.body;

    const medecin = await prisma.medecin.update({
      where: { userId },
      data: {
        ...(telephone && { telephone }),
        ...(specialite && { specialite }),
        ...(adresse !== undefined && { adresse })
      }
    });
    return res.status(200).json({ message: 'Profil mis à jour', medecin });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { searchMedecins, getMedecinById, getPatientsMedecin, getMonProfil, updateMonProfil };