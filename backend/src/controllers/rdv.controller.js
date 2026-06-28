const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getRDV = async (req, res) => {
  try {
    const { medecinId } = req.params
    const rdv = await prisma.rendezVous.findMany({
      where: { medecinId: parseInt(medecinId) },
      include: { patient: true }
    })
    res.json(rdv)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error })
  }
}

const createRDV = async (req, res) => {
  try {
    const { date, heure, motif, medecinId, patientId } = req.body
    const rdv = await prisma.rendezVous.create({
      data: {
        date: new Date(date),
        heure,
        motif,
        medecinId: parseInt(medecinId),
        patientId: parseInt(patientId),
      }
    })
    res.status(201).json(rdv)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error })
  }
}

const updateRDV = async (req, res) => {
  try {
    const { id } = req.params
    const { statut } = req.body
    const rdv = await prisma.rendezVous.update({
      where: { id: parseInt(id) },
      data: { statut }
    })
    res.json(rdv)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error })
  }
}

const deleteRDV = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.rendezVous.delete({ where: { id: parseInt(id) } })
    res.json({ message: "RDV supprimé" })
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error })
  }
}

module.exports = { getRDV, createRDV, updateRDV, deleteRDV }