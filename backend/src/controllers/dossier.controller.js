const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

// GET /api/dossier/patient/:patientId
const getDossierPatient = async (req, res) => {
  try {
    const { patientId } = req.params

    const medecin = await prisma.medecin.findUnique({
      where: { userId: req.user.id }
    })
    if (!medecin) {
      return res.status(404).json({ message: "Médecin introuvable" })
    }

    const rdv = await prisma.rendezVous.findFirst({
      where: {
        patientId: parseInt(patientId),
        medecinId: medecin.id
      }
    })
    if (!rdv) {
      return res.status(403).json({ message: "Accès refusé : aucun RDV avec ce patient" })
    }

    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(patientId) },
      include: {
        ordonnances: { orderBy: { createdAt: "desc" } },
        rapports: { orderBy: { createdAt: "desc" } },
        rendezvous: {
          where: { medecinId: medecin.id },
          orderBy: { date: "asc" }
        },
        dossier: true
      }
    })
    if (!patient) {
      return res.status(404).json({ message: "Patient introuvable" })
    }

    res.json(patient)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// PUT /api/dossier/patient/:patientId/notes
const updateNotesDossier = async (req, res) => {
  try {
    const { patientId } = req.params
    const { notes } = req.body

    if (req.user.role !== "MEDECIN") {
      return res.status(403).json({ message: "Accès refusé" })
    }

    const medecin = await prisma.medecin.findUnique({
      where: { userId: req.user.id }
    })
    if (!medecin) {
      return res.status(404).json({ message: "Médecin introuvable" })
    }

    const rdv = await prisma.rendezVous.findFirst({
      where: {
        patientId: parseInt(patientId),
        medecinId: medecin.id
      }
    })
    if (!rdv) {
      return res.status(403).json({ message: "Aucun RDV avec ce patient" })
    }

    // Cherche un rapport existant, sinon en crée un
    const rapportExistant = await prisma.rapport.findFirst({
      where: {
        patientId: parseInt(patientId),
        medecinId: medecin.id
      }
    })

    let rapport
    if (rapportExistant) {
      rapport = await prisma.rapport.update({
        where: { id: rapportExistant.id },
        data: { contenu: notes }
      })
    } else {
      rapport = await prisma.rapport.create({
        data: {
          contenu: notes,
          medecinId: medecin.id,
          patientId: parseInt(patientId)
        }
      })
    }

    res.json({ message: "Notes mises à jour", rapport })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

module.exports = { getDossierPatient, updateNotesDossier }