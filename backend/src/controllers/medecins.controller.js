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
      ville: 'Cabinet'
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
      email: medecin.user.email
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { searchMedecins, getMedecinById };