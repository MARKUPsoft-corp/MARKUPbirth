#!/bin/bash

# Afficher la version de Node
echo "Using Node version:"
node -v

# Installer les dépendances
echo "Installing dependencies..."
npm install

# Générer la version statique de l'application
echo "Generating static site..."
npm run generate

# Vérifier si le dossier dist existe
if [ -d ".output/public" ]; then
  echo "Build successful! Directory .output/public exists."
  ls -la .output/public
else
  echo "Directory .output/public does not exist. Checking for dist..."
  if [ -d "dist" ]; then
    echo "Found dist directory instead."
    ls -la dist
    echo "Creating .output/public directory..."
    mkdir -p .output/public
    echo "Copying files from dist to .output/public..."
    cp -r dist/* .output/public/
  else
    echo "ERROR: No static files were generated!"
    echo "Creating minimal index.html..."
    mkdir -p .output/public
    cp fallback.html .output/public/index.html
  fi
fi

# S'assurer que le fichier index.html existe
if [ ! -f ".output/public/index.html" ]; then
  echo "No index.html found in .output/public. Copying fallback..."
  cp fallback.html .output/public/index.html
fi

echo "Build process complete."
