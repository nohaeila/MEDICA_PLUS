const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Créer un RDV
const createRdv = async (req, res) => {
  try {
    const { medecinNom, medecinSpec, date, heure, lieu } = req.body;
    const userId = req.user.userId;

    const patient = await prisma.patient.findUnique({
      where: { userId }
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient non trouvé' });
    }

    // On cherche ou crée un médecin temporaire
    let medecin = await prisma.medecin.findFirst({
      where: { nom: medecinNom }
    });

    if (!medecin) {
      // Créer un user fictif pour le médecin externe
      const userMedecin = await prisma.user.create({
        data: {
          email: `${medecinNom.replace(/\s/g, '').toLowerCase()}@medica.fr`,
          password: 'external',
          role: 'medecin'
        }
      });
      medecin = await prisma.medecin.create({
        data: {
          userId: userMedecin.id,
          prenom: medecinNom.split(' ')[1] || '',
          nom: medecinNom.split(' ')[0] || medecinNom,
          telephone: '0000000000',
          specialite: medecinSpec,
          rpps: `EXT${Date.now()}`
        }
      });
    }

    const rdv = await prisma.rDV.create({
      data: {
        medecinId: medecin.id,
        patientId: patient.id,
        date,
        heure,
        motif: lieu,
        statut: 'en_attente'
      }
    });

    return res.status(201).json({ message: 'RDV créé avec succès', rdv });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Lister les RDV du patient
const getRdvs = async (req, res) => {
  try {
    const userId = req.user.userId;

    const patient = await prisma.patient.findUnique({
      where: { userId }
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient non trouvé' });
    }

    const rdvs = await prisma.rDV.findMany({
      where: { patientId: patient.id },
      include: { medecin: true },
      orderBy: { date: 'asc' }
    });

    return res.status(200).json(rdvs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Supprimer un RDV
const deleteRdv = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const patient = await prisma.patient.findUnique({ where: { userId } });

    const rdv = await prisma.rDV.findUnique({ where: { id } });

    if (!rdv || rdv.patientId !== patient.id) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    await prisma.rDV.delete({ where: { id } });
    return res.status(200).json({ message: 'RDV supprimé' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Modifier un RDV
const updateRdv = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, heure, motif } = req.body;
    const userId = req.user.userId;

    const patient = await prisma.patient.findUnique({ where: { userId } });
    const rdv = await prisma.rDV.findUnique({ where: { id } });

    if (!rdv || rdv.patientId !== patient.id) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    const updated = await prisma.rDV.update({
      where: { id },
      data: { date, heure, motif }
    });

    return res.status(200).json({ message: 'RDV modifié', rdv: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { createRdv, getRdvs, deleteRdv, updateRdv };