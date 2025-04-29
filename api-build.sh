#!/bin/bash

# Afficher la version de Node
echo "Using Node.js version:"
node -v

# Installer uniquement les dépendances backend
echo "Installing API dependencies..."
npm install express cors socket.io bcrypt jsonwebtoken helmet http-proxy-middleware

echo "API build complete."
