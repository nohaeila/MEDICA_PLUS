const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

// GET RDV
const getRDV = async (req, res) => {
  try {
    const { id: userId, role } = req.user

    let where = {}

    // RDV médecin
    if (role === "MEDECIN") {

      const medecin = await prisma.medecin.findUnique({
        where: { userId }
      })

      if (!medecin) {
        return res.status(404).json({
          message: "Médecin introuvable"
        })
      }

      where = {
        medecinId: medecin.id
      }
    }

    // RDV patient
    else if (role === "PATIENT") {

      const patient = await prisma.patient.findUnique({
        where: { userId }
      })

      if (!patient) {
        return res.status(404).json({
          message: "Patient introuvable"
        })
      }

      where = {
        patientId: patient.id
      }
    }

    const rdv = await prisma.rendezVous.findMany({
      where,
      include: {
        patient: true,
        medecin: true
      },
      orderBy: {
        date: "asc"
      }
    })

    res.json(rdv)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Erreur serveur"
    })
  }
}

// CREATE RDV
const createRDV = async (req, res) => {
  try {

    const {
      date,
      heure,
      motif,
      medecinId
    } = req.body

    // Vérifie patient connecté
    if (req.user.role !== "PATIENT") {
      return res.status(403).json({
        message: "Seul un patient peut réserver"
      })
    }

    // Récupère vrai patient depuis token
    const patient = await prisma.patient.findUnique({
      where: {
        userId: req.user.id
      }
    })

    if (!patient) {
      return res.status(404).json({
        message: "Patient introuvable"
      })
    }

    // Vérifie créneau déjà réservé
    const existingRDV = await prisma.rendezVous.findFirst({
      where: {
        medecinId: parseInt(medecinId),
        date: new Date(date),
        heure,
        statut: {
          in: ["PLANIFIE"]
        }
      }
    })

    if (existingRDV) {
      return res.status(400).json({
        message: "Créneau déjà réservé"
      })
    }

    // Création RDV
    const rdv = await prisma.rendezVous.create({
      data: {
        date: new Date(date),
        heure,
        motif,
        statut: "PLANIFIE",
        medecinId: parseInt(medecinId),
        patientId: patient.id
      }
    })

    res.status(201).json(rdv)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Erreur serveur"
    })
  }
}

// UPDATE RDV
const updateRDV = async (req, res) => {
  try {

    const { id } = req.params
    const { statut } = req.body

    const rdv = await prisma.rendezVous.update({
      where: {
        id: parseInt(id)
      },
      data: {
        statut
      }
    })

    res.json(rdv)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Erreur serveur"
    })
  }
}

// DELETE RDV
const deleteRDV = async (req, res) => {
  try {

    const { id } = req.params

    await prisma.rendezVous.delete({
      where: {
        id: parseInt(id)
      }
    })

    res.json({
      message: "RDV supprimé"
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Erreur serveur"
    })
  }
}

module.exports = {
  getRDV,
  createRDV,
  updateRDV,
  deleteRDV
}