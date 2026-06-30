const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

// GET /api/dossier/patient/:patientId
const getDossierPatient = async (req, res) => {
  try {
    const { patientId } = req.params

    // Vérifie qu'un RDV existe entre le médecin connecté et ce patient
    const rdv = await prisma.rDV.findFirst({
      where: {
        patientId: parseInt(patientId),
        medecinId: req.user.id
      }
    })

    if (!rdv) {
      return res.status(403).json({
        message: "Accès refusé : aucun RDV avec ce patient"
      })
    }

    // Récupération du dossier réel
    const dossier = await prisma.dossier.findUnique({
      where: {
        patientId: parseInt(patientId)
      },
      include: {
        patient: true
      }
    })

    if (!dossier) {
      return res.status(404).json({
        message: "Dossier introuvable"
      })
    }

    res.json(dossier)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Erreur serveur"
    })
  }
}

// PUT /api/dossier/patient/:patientId/notes
const updateNotesDossier = async (req, res) => {
  try {
    const { patientId } = req.params
    const { notes } = req.body

    // Vérifie rôle médecin
    if (req.user.role !== "MEDECIN") {
      return res.status(403).json({
        message: "Accès refusé"
      })
    }

    // Vérifie relation médecin-patient via RDV
    const rdv = await prisma.rDV.findFirst({
      where: {
        patientId: parseInt(patientId),
        medecinId: req.user.id
      }
    })

    if (!rdv) {
      return res.status(403).json({
        message: "Aucun RDV avec ce patient"
      })
    }

    // Mise à jour des notes
    const dossier = await prisma.dossier.update({
      where: {
        patientId: parseInt(patientId)
      },
      data: {
        notes
      }
    })

    res.json({
      message: "Notes mises à jour",
      dossier
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Erreur serveur"
    })
  }
}

module.exports = {
  getDossierPatient,
  updateNotesDossier
}