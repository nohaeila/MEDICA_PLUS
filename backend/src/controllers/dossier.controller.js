const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

// GET /api/dossier/patient/:patientId
const getDossierPatient = async (req, res) => {
  try {
    const { patientId } = req.params
    const dossier = await prisma.dossier.findUnique({
      where: { patientId: parseInt(patientId) }
    })
    if (!dossier) {
      return res.status(404).json({ message: "Dossier introuvable" })
    }
    res.json(dossier)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error })
  }
}

// PUT /api/dossier/patient/:patientId/notes
const updateNotesDossier = async (req, res) => {
  try {
    const { patientId } = req.params
    const { notes } = req.body

    // Sécurité : seul un médecin peut modifier ce champ
    if (req.user.role !== "MEDECIN") {
      return res.status(403).json({ message: "Accès refusé" })
    }

    const dossier = await prisma.dossier.update({
      where: { patientId: parseInt(patientId) },
      data: { notes }
    })
    res.json(dossier)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error })
  }
}

module.exports = { getDossierPatient, updateNotesDossier }