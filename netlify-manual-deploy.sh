#!/bin/bash

# Couleurs pour meilleure lisibilité
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Démarrage du déploiement manuel sur Netlify...${NC}"

# Générer le build statique
echo -e "${GREEN}1. Génération du build Nuxt...${NC}"
npm run generate

# Vérifier si la génération a réussi
if [ $? -ne 0 ]; then
  echo -e "\033[0;31mErreur lors de la génération du build. Déploiement annulé.${NC}"
  exit 1
fi

echo -e "${GREEN}2. Déploiement sur Netlify...${NC}"
echo -e "${YELLOW}Si vous n'avez pas encore installé Netlify CLI, exécutez : npm install -g netlify-cli${NC}"

# Déployer sur Netlify
# --dir spécifie le répertoire à déployer (doit correspondre à ce qui est dans netlify.toml)
netlify deploy --dir=.output/public --prod

echo -e "${GREEN}Opération terminée.${NC}"
