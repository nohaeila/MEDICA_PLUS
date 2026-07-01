const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProfil = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { patient: true }
    });

    if (!user || !user.patient) {
      return res.status(404).json({ error: 'Patient non trouvé' });
    }

    return res.status(200).json({
      prenom: user.patient.prenom,
      nom: user.patient.nom,
      email: user.email,
      telephone: user.patient.telephone,
      dateNaissance: user.patient.dateNaissance,
      nss: user.patient.nss,
      medecinTraitant: user.patient.medecinTraitant || ''
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

const updateProfil = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { email, telephone, medecinTraitant } = req.body;

    const patient = await prisma.patient.findUnique({ where: { userId } });

    if (!patient) {
      return res.status(404).json({ error: 'Patient non trouvé' });
    }

    if (email) {
      await prisma.user.update({
        where: { id: userId },
        data: { email }
      });
    }

    await prisma.patient.update({
      where: { userId },
      data: {
        ...(telephone && { telephone }),
        ...(medecinTraitant !== undefined && { medecinTraitant })
      }
    });

    return res.status(200).json({ message: 'Profil mis à jour' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { getProfil, updateProfil };