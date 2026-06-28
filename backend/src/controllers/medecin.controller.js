const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getMedecins = async (req, res) => {
  try {
    const medecins = await prisma.medecin.findMany({
      include: { user: { select: { email: true } } }
    })
    res.json(medecins)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error })
  }
}

const getMedecinById = async (req, res) => {
  try {
    const { id } = req.params
    const medecin = await prisma.medecin.findUnique({
      where: { id: parseInt(id) },
      include: { user: { select: { email: true } } }
    })
    if (!medecin) return res.status(404).json({ message: "Médecin introuvable" })
    res.json(medecin)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error })
  }
}

const getPatientsMedecin = async (req, res) => {
  try {
    const { id } = req.params
    const rdvs = await prisma.rendezVous.findMany({
      where: { medecinId: parseInt(id) },
      include: { patient: true },
      distinct: ['patientId']
    })
    const patients = rdvs.map(r => r.patient)
    res.json(patients)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error })
  }
}

module.exports = { getMedecins, getMedecinById, getPatientsMedecin }