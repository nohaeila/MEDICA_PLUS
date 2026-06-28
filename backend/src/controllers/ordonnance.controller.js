const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getOrdonnances = async (req, res) => {
  try {
    const { patientId } = req.params
    const ordonnances = await prisma.ordonnance.findMany({
      where: { patientId: parseInt(patientId) },
      include: { medecin: true },
      orderBy: { createdAt: "desc" }
    })
    res.json(ordonnances)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error })
  }
}

const createOrdonnance = async (req, res) => {
  try {
    const { medicament, posologie, duree, notes, medecinId, patientId } = req.body
    const ordonnance = await prisma.ordonnance.create({
      data: {
        medicament,
        posologie,
        duree,
        notes,
        medecinId: parseInt(medecinId),
        patientId: parseInt(patientId)
      }
    })
    res.status(201).json(ordonnance)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error })
  }
}

module.exports = { getOrdonnances, createOrdonnance }