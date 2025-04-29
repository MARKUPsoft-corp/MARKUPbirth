#!/bin/bash

# Afficher la version de Node
echo "Using Node.js version:"
node -v

# Installer les dépendances
echo "Installing dependencies..."
npm install

# Essayer de générer les fichiers statiques
echo "Building Nuxt app..."
npm run build

# Vérifier que la page d'accueil hardcodée existe
if [ ! -f "hardcoded-index.html" ]; then
  echo "ERREUR: hardcoded-index.html introuvable!"
  exit 1
fi

echo "Build process complete."
echo "Ready to serve with server-static.js"
