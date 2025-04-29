#!/bin/bash

# Afficher la version de Node
echo "Using Node version:"
node -v

# Installer les dépendances
echo "Installing dependencies..."
npm install

# Générer l'application Nuxt (build au lieu de generate)
echo "Building Nuxt application..."
npm run build

# Lister les répertoires disponibles
echo "Listing available directories:"
ls -la .
echo "Contents of .nuxt (if exists):"
if [ -d ".nuxt" ]; then
  ls -la .nuxt
  echo "Contents of .nuxt/dist (if exists):"
  if [ -d ".nuxt/dist" ]; then
    ls -la .nuxt/dist
    echo "Contents of .nuxt/dist/client (if exists):"
    if [ -d ".nuxt/dist/client" ]; then
      ls -la .nuxt/dist/client
    fi
  fi
fi

# Exécuter notre script personnalisé pour créer un index.html et copier les assets
echo "Creating index.html and copying assets..."
node create-index.js

# Vérifier que le dossier .output/public existe
if [ ! -d ".output/public" ]; then
  echo "Creating .output/public directory..."
  mkdir -p .output/public
fi

# S'assurer que le fichier index.html existe
if [ ! -f ".output/public/index.html" ]; then
  echo "No index.html was created. Copying fallback..."
  cp fallback.html .output/public/index.html
fi

# Vérifier le contenu final
echo "Final contents of .output/public:"
ls -la .output/public

echo "Build process complete."
