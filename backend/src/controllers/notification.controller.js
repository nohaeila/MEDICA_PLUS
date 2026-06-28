const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params
    const notifications = await prisma.notification.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: "desc" }
    })
    res.json(notifications)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error })
  }
}

const marquerLu = async (req, res) => {
  try {
    const { id } = req.params
    const notification = await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { lu: true }
    })
    res.json(notification)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error })
  }
}

module.exports = { getNotifications, marquerLu }