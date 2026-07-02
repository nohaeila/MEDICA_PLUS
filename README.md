# MEDICA_PLUS

Plateforme de santé numérique permettant aux patients de gérer leurs rendez-vous médicaux, consulter leur dossier médical et communiquer avec leurs médecins. Les médecins disposent d'une interface web dédiée pour gérer leurs patients, ordonnances et consultations.

## EQUIPE
- Nohaeila : Application mobile (patient)
- Ingrid :  Web (médecin)

## Stack technique

- Backend
Runtime : Node.js
Framework : Express.js
ORM : Prisma
Base de données : SQLite (dev.db)
Authentification : JWT (jsonwebtoken)
Chiffrement : bcryptjs

- Application mobile (patient)
Framework : React Native (Expo)
Navigation : React Navigation
HTTP : Axios

- Application web (médecin)
Framework : React + Vite
Style : Tailwind CSS
HTTP : Axios

## Installation et lancement

- Prérequis

Node.js v18+
npm
Expo CLI (npm install -g expo-cli)

- Backend
cd backend
npm install
npx prisma migrate dev
npm run dev

- Application mobile
cd mobile
npm install

mobile/.env: 
API_URL=http://<votre-ip-locale>:5000/api

npx expo start --clear

- Application web
cd frontend-web
npm install
npm run dev

frontend-web/src/services/api.js :
baseURL: 'http://<votre-ip-locale>:5000/api'

### Fonctionnalités ###

# Application mobile (patient)

- Inscription et connexion avec validation des champs
- Réinitialisation du mot de passe via email + NSS
- Dashboard avec prochain RDV et statistiques
- Prise de rendez-vous en 3 étapes (médecin → date → confirmation)
- Fiche médecin avec itinéraire via Google Maps 
- Dossier médical (antécédents, allergies, notes du médecin)
- Saisie des informations de santé personnelles
- Gestion du profil (email, téléphone, médecin traitant)
- Ordonnances et notifications avec badge en temps réel

# Application web (médecin)

- Inscription et connexion
- Dashboard avec vue d'ensemble des rendez-vous
- Gestion des RDV (confirmation, statut)
- Dossier patient en lecture avec notes modifiables
- Création d'ordonnances et rapports de consultation
- Gestion du profil (téléphone, spécialité, adresse du cabinet)

### Sécurité

- Mots de passe hashés avec bcryptjs 
- Authentification par token JWT (expiration 7 jours)
- Middleware de vérification du token sur toutes les routes protégées
- Vérification du rôle (patient/médecin) sur les routes sensibles
- Validation des données à l'inscription (format email, téléphone, NSS, RPPS, mot de passe)