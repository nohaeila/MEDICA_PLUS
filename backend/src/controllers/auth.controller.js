const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { validatePassword, validateEmail, validateTelephone, validateRpps, validateNss } = require('../utils/validators');

const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const { email, password, confirm, role, prenom, nom, telephone, specialite, rpps, dateNaissance, nss } = req.body;

    // Validation champs obligatoires communs
    if (!prenom || !nom) {
      return res.status(400).json({ error: 'Le prénom et le nom sont obligatoires' });
    }

    // Validation email
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Adresse email invalide (ex: exemple@medica.fr)' });
    }

    // Validation téléphone
    const telError = validateTelephone(telephone);
    if (telError) {
      return res.status(400).json({ error: telError });
    }

    // Validation mot de passe
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Mot de passe invalide :', 
        details: passwordErrors 
      });
    }

    // Validation champs médecin
    if (role === 'medecin') {
      if (!specialite) {
        return res.status(400).json({ error: 'Veuillez sélectionner une spécialité' });
      }
      const rppsError = validateRpps(rpps);
      if (rppsError) {
        return res.status(400).json({ error: rppsError });
      }
    }
    if (password !== confirm) {
  return res.status(400).json({
    error: 'Les mots de passe ne correspondent pas'
  });
}

    // Validation champs patient
    if (role === 'patient') {
      if (!dateNaissance) {
        return res.status(400).json({ error: 'La date de naissance est obligatoire' });
      }
      const nssError = validateNss(nss);
      if (nssError) {
        return res.status(400).json({ error: nssError });
      }
    }

    // Vérifier si email déjà utilisé
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Cette adresse email est déjà associée à un compte' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer le user
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role }
    });

    if (role === 'medecin') {
      const existingRpps = await prisma.medecin.findUnique({ where: { rpps } });
      if (existingRpps) {
        await prisma.user.delete({ where: { id: user.id } });
        return res.status(400).json({ error: 'Ce numéro RPPS est déjà associé à un compte médecin' });
      }
      await prisma.medecin.create({
        data: { userId: user.id, prenom, nom, telephone, specialite, rpps }
      });
    }

    if (role === 'patient') {
      const existingNss = await prisma.patient.findUnique({ where: { nss } });
      if (existingNss) {
        await prisma.user.delete({ where: { id: user.id } });
        return res.status(400).json({ error: 'Ce numéro de sécurité sociale est déjà associé à un compte' });
      }
      const newPatient = await prisma.patient.create({
        data: { userId: user.id, prenom, nom, telephone, dateNaissance, nss }
      });
      await prisma.dossier.create({
        data: { patientId: newPatient.id }
      });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Compte créé avec succès',
      token,
      role: user.role
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validation email
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Adresse email invalide' });
    }

    // Trouver le user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le role
    if (user.role !== role) {
      return res.status(401).json({ error: 'Role incorrect pour ce compte' });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Connexion réussie',
      token,
      role: user.role
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { register, login };