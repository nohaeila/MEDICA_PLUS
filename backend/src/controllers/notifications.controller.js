const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.notification.update({
      where: { id },
      data: { lu: true }
    });

    return res.status(200).json({ message: 'Notification lue' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    await prisma.notification.updateMany({
      where: { userId },
      data: { lu: true }
    });

    return res.status(200).json({ message: 'Toutes les notifications lues' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

const createNotification = async (userId, message) => {
  try {
    await prisma.notification.create({
      data: { userId, message }
    });
  } catch (error) {
    console.error('Erreur création notification:', error);
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, createNotification };