const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createNotification } = require('./notifications.controller');

// Créer un RDV
const createRdv = async (req, res) => {
  try {
    const { medecinId, date, heure, motif } = req.body;
    const userId = req.user.userId;

    const patient = await prisma.patient.findUnique({ where: { userId } });
    if (!patient) {
      return res.status(404).json({ error: 'Patient non trouvé' });
    }

    const medecin = await prisma.medecin.findUnique({ where: { id: medecinId } });
    if (!medecin) {
      return res.status(404).json({ error: 'Médecin non trouvé' });
    }

    const rdv = await prisma.rDV.create({
      data: {
        medecinId: medecin.id,
        patientId: patient.id,
        date,
        heure,
        motif: motif || 'Consultation',
        statut: 'confirme'
      }
    });

    await createNotification(
      userId,
      `Votre RDV avec Dr. ${medecin.prenom} ${medecin.nom} le ${date} a ${heure} est confirme.`
    );

    await createNotification(
      medecin.userId,
      `Nouveau RDV : ${patient.prenom} ${patient.nom} le ${date} a ${heure}.`
    );

    return res.status(201).json({ message: 'RDV créé avec succès', rdv });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Lister les RDV (patient OU médecin selon le rôle)
const getRdvs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    let rdvs;

    if (role === 'patient') {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (!patient) return res.status(404).json({ error: 'Patient non trouvé' });

      rdvs = await prisma.rDV.findMany({
        where: { patientId: patient.id },
        include: { medecin: true, patient: true },
        orderBy: { date: 'asc' }
      });
    } else if (role === 'medecin') {
      const medecin = await prisma.medecin.findUnique({ where: { userId } });
      if (!medecin) return res.status(404).json({ error: 'Médecin non trouvé' });

      rdvs = await prisma.rDV.findMany({
        where: { medecinId: medecin.id },
        include: { medecin: true, patient: true },
        orderBy: { date: 'asc' }
      });
    } else {
      return res.status(403).json({ error: 'Rôle non autorisé' });
    }

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
    const role = req.user.role;

    const rdv = await prisma.rDV.findUnique({ where: { id } });
    if (!rdv) return res.status(404).json({ error: 'RDV non trouvé' });

    if (role === 'patient') {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (!patient || rdv.patientId !== patient.id) {
        return res.status(403).json({ error: 'Non autorisé' });
      }
    } else if (role === 'medecin') {
      const medecin = await prisma.medecin.findUnique({ where: { userId } });
      if (!medecin || rdv.medecinId !== medecin.id) {
        return res.status(403).json({ error: 'Non autorisé' });
      }
    }

    await prisma.rDV.delete({ where: { id } });
    return res.status(200).json({ message: 'RDV supprimé' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Modifier un RDV (le médecin peut changer le statut, le patient la date/heure)
const updateRdv = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, heure, motif, statut } = req.body;
    const userId = req.user.userId;
    const role = req.user.role;

    const rdv = await prisma.rDV.findUnique({ where: { id } });
    if (!rdv) return res.status(404).json({ error: 'RDV non trouvé' });

    let updateData = {};

    if (role === 'patient') {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (!patient || rdv.patientId !== patient.id) {
        return res.status(403).json({ error: 'Non autorisé' });
      }
      updateData = { date, heure, motif };
    } else if (role === 'medecin') {
      const medecin = await prisma.medecin.findUnique({ where: { userId } });
      if (!medecin || rdv.medecinId !== medecin.id) {
        return res.status(403).json({ error: 'Non autorisé' });
      }
      updateData = { statut };
    }

    const updated = await prisma.rDV.update({
      where: { id },
      data: updateData
    });

    return res.status(200).json({ message: 'RDV modifié', rdv: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Horaires pris
const getHorairesPris = async (req, res) => {
  try {
    const { medecinId, date } = req.query;
    const rdvs = await prisma.rDV.findMany({ where: { medecinId, date } });
    const heures = rdvs.map(r => r.heure);
    return res.status(200).json(heures);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { createRdv, getRdvs, deleteRdv, updateRdv, getHorairesPris };