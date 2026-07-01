const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*...)');
  }

  return errors;
};

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validateRpps = (rpps) => {
  if (!rpps) return 'Le numéro RPPS est obligatoire';
  if (!/^\d{11}$/.test(rpps)) return 'Le numéro RPPS doit contenir exactement 11 chiffres';
  return null;
};

const validateNss = (nss) => {
  const nssClean = nss.replace(/\s/g, '');
  if (!nss) return 'Le numéro de sécurité sociale est obligatoire';
  if (!/^\d{13,15}$/.test(nssClean)) return 'Le numéro de sécurité sociale doit contenir 13 à 15 chiffres';
  return null;
};

const validateTelephone = (telephone) => {
  const telClean = telephone.replace(/\s/g, '');
  if (!/^(\+33|0)[1-9](\d{8})$/.test(telClean)) {
    return 'Numéro de téléphone invalide (ex: +33 6 00 00 00 00 ou 06 00 00 00 00)';
  }
  return null;
};

module.exports = { validatePassword, validateEmail, validateRpps, validateNss, validateTelephone };