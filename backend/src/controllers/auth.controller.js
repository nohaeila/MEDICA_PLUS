const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const register = async (req, res) => {
  try {
    const { email, password, role, nom, prenom, specialite, ville, nss } = req.body

    const userExiste = await prisma.user.findUnique({ where: { email } })
    if (userExiste) return res.status(400).json({ message: "Email déjà utilisé" })

    const hash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        role,
      }
    })

    if (role === "MEDECIN") {
      await prisma.medecin.create({
        data: { nom, prenom, specialite, ville, userId: user.id }
      })
    } else {
      await prisma.patient.create({
        data: { nom, prenom, nss, userId: user.id }
      })
    }

    res.status(201).json({ message: "Compte créé avec succès" })
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" })

    const valide = await bcrypt.compare(password, user.password)
    if (!valide) return res.status(401).json({ message: "Mot de passe incorrect" })

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "24h" }
    )

    res.json({ token, role: user.role, userId: user.id })
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error })
  }
}

module.exports = { register, login }