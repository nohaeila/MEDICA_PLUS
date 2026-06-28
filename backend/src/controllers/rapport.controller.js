const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getRapports = async (req, res) => {
  try {
    const { patientId } = req.params
    const rapports = await prisma.rapport.findMany({
      where: { patientId: parseInt(patientId) },
      include: { medecin: true },
      orderBy: { createdAt: "desc" }
    })
    res.json(rapports)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error })
  }
}

const createRapport = async (req, res) => {
  try {
    const { contenu, medecinId, patientId } = req.body
    const rapport = await prisma.rapport.create({
      data: {
        contenu,
        medecinId: parseInt(medecinId),
        patientId: parseInt(patientId)
      }
    })
    res.status(201).json(rapport)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error })
  }
}

module.exports = { getRapports, createRapport }