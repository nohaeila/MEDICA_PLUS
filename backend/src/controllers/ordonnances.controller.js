const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

// GET /api/ordonnances/:patientId
const getOrdonnances = async (req, res) => {
  try {
    const { patientId } = req.params
    const ordonnances = await prisma.ordonnance.findMany({
      where: { patientId: parseInt(patientId) },
      orderBy: { createdAt: "desc" }
    })
    res.json(ordonnances)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error })
  }
}

// POST /api/ordonnances
const createOrdonnance = async (req, res) => {
  try {
    if (req.user.role !== "MEDECIN") {
      return res.status(403).json({ message: "Accès refusé" })
    }

    const { id: userId } = req.user
    const medecin = await prisma.medecin.findUnique({ where: { userId } })
    if (!medecin) return res.status(404).json({ message: "Médecin introuvable" })

    const { medicament, posologie, duree, notes, patientId } = req.body
    const ordonnance = await prisma.ordonnance.create({
      data: {
        medicament,
        posologie,
        duree,
        notes,
        medecinId: medecin.id,
        patientId: parseInt(patientId),
      }
    })
    res.status(201).json(ordonnance)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error })
  }
}

module.exports = { getOrdonnances, createOrdonnance }