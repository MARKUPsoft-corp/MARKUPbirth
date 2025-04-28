# 🎂 Site d'Anniversaire d'Emmanuel YAKAM TCHAMEGNI

Un site web festif pour célébrer l'anniversaire d'Emmanuel, créé avec Nuxt 3 et Bootstrap 5.

## 🌟 Fonctionnalités

- **Page d'accueil**: Affichage festif avec confettis et compte à rebours
- **Mur de messages**: Laissez des messages et photos pour Emmanuel
- **Quiz**: Testez vos connaissances sur Emmanuel
- **Mini-jeux**: Memory Game, Roue de la Fortune, et Tic-Tac-Toe
- **Défis**: Relevez des défis photo et vidéo
- **Sondages**: Participez à des sondages interactifs
- **Playlist collaborative**: Suggérez des titres pour la fête
- **Galerie photos**: Mosaïque des photos des invités

## 🧱 Structure du projet

```
📁 birth/
├── 📁 assets/            # CSS, images
├── 📁 components/        # Composants Vue réutilisables
├── 📁 composables/       # Fonctions réutilisables (API, socket)
├── 📁 data/              # Fichiers JSON pour le stockage
├── 📁 pages/             # Pages du site
├── 📁 public/            # Fichiers statiques (images, audio)
├── 📁 server/            # Serveur backend Express
├── 📁 stores/            # Stores Pinia
└── 📁 uploads/           # Dossier pour les uploads (photos/videos)
```

## 🛠️ Technologies utilisées

- **Frontend**: Nuxt 3, Vue 3, Bootstrap 5, Pinia
- **Backend**: Node.js, Express.js, Socket.io
- **Stockage**: Fichiers JSON

## 🚀 Installation et démarrage

### Prérequis
- Node.js 18+ et npm installés

### Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-nom/birth.git
   cd birth
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Démarrez le serveur de développement :
   ```bash
   npm run start
   ```

4. Le site sera accessible à :
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## 🌐 Déploiement

Pour déployer en production :

1. Compilez le frontend :
   ```bash
   npm run build
   ```

2. Pour démarrer en production :
   ```bash
   NODE_ENV=production npm run start
   ```

## ⚙️ Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```
API_BASE_URL=http://localhost:3001
BIRTHDAY_DATE=2023-12-25T00:00:00
```

## 📝 Licence

Tous droits réservés - © 2023

## 🤝 Contact

Pour toute question, contactez [votre-email@domaine.com](mailto:votre-email@domaine.com)
