const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getRDV = async (req, res) => {
  try {
    const { id: userId, role } = req.user
    let where = {}
    if (role === "MEDECIN") {
      const medecin = await prisma.medecin.findUnique({ where: { userId } })
      if (!medecin) return res.status(404).json({ message: "Médecin introuvable" })
      where = { medecinId: medecin.id }
    } else if (role === "PATIENT") {
      const patient = await prisma.patient.findUnique({ where: { userId } })
      if (!patient) return res.status(404).json({ message: "Patient introuvable" })
      where = { patientId: patient.id }
    }
    const rdv = await prisma.rendezVous.findMany({
      where,
      include: { patient: true, medecin: true }
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