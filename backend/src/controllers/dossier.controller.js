const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDossier = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        patient: {
          include: { dossier: true }
        }
      }
    });

    if (!user?.patient) {
      return res.status(404).json({ error: 'Patient non trouvé' });
    }

    const patient = user.patient;

    let dossier = patient.dossier;
    if (!dossier) {
      dossier = await prisma.dossier.create({
        data: { patientId: patient.id }
      });
    }

    return res.status(200).json({
      patient: {
        prenom: patient.prenom,
        nom: patient.nom,
        dateNaissance: patient.dateNaissance,
        medecinTraitant: patient.medecinTraitant || ''
      },
      dossier: {
        antecedents: dossier.antecedents,
        antecedentsChirurgicaux: dossier.antecedentsChirurgicaux,
        allergies: dossier.allergies,
        notes: dossier.notes
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

const updateDossier = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { antecedents, antecedentsChirurgicaux, allergies } = req.body;

    const patient = await prisma.patient.findUnique({ where: { userId } });
    if (!patient) return res.status(404).json({ error: 'Patient non trouvé' });

    let dossier = await prisma.dossier.findUnique({ where: { patientId: patient.id } });
    if (!dossier) {
      dossier = await prisma.dossier.create({ data: { patientId: patient.id } });
    }

    await prisma.dossier.update({
      where: { patientId: patient.id },
      data: {
        ...(antecedents !== undefined && { antecedents }),
        ...(antecedentsChirurgicaux !== undefined && { antecedentsChirurgicaux }),
        ...(allergies !== undefined && { allergies }),
      }
    });

    return res.status(200).json({ message: 'Dossier mis à jour' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

const getDossierPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const role = req.user.role;

    if (role !== 'medecin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    let dossier = await prisma.dossier.findUnique({
      where: { patientId },
      include: { patient: true }
    });

    if (!dossier) {
      dossier = await prisma.dossier.create({
        data: { patientId },
        include: { patient: true }
      });
    }

    return res.status(200).json(dossier);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

const updateDossierNotes = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { notes } = req.body;
    const role = req.user.role;

    if (role !== 'medecin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    let dossier = await prisma.dossier.findUnique({ where: { patientId } });
    if (!dossier) {
      dossier = await prisma.dossier.create({ data: { patientId } });
    }

    await prisma.dossier.update({
      where: { patientId },
      data: { notes }
    });

    return res.status(200).json({ message: 'Notes mises à jour' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { getDossier, updateDossier, getDossierPatient, updateDossierNotes };