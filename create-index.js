const fs = require('fs');
const path = require('path');

// Créer un fichier index.html avec le code nécessaire pour charger l'application Nuxt
const indexHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Anniversaire d'Emmanuel YAKAM TCHAMEGNI</title>
  <!-- Chargement des scripts Nuxt -->
  <script>window.__NUXT__={};window.__NUXT__.config={}</script>
</head>
<body>
  <div id="__nuxt"></div>
  <script>
    // Détection du chemin des assets
    const scriptTags = document.createElement('script');
    scriptTags.setAttribute('src', '/_nuxt/entry.js');
    document.body.appendChild(scriptTags);
  </script>
</body>
</html>`;

// Créer le dossier .output/public s'il n'existe pas
const outputDir = path.join(__dirname, '.output', 'public');
fs.mkdirSync(outputDir, { recursive: true });

// Écrire le fichier index.html
fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);

console.log('Index.html créé avec succès dans', outputDir);

// Si le dossier .nuxt/dist/client existe, créer un lien symbolique
const nuxtClientDir = path.join(__dirname, '.nuxt', 'dist', 'client');
const outputNuxtDir = path.join(outputDir, '_nuxt');

if (fs.existsSync(nuxtClientDir)) {
  console.log(`Copie des fichiers depuis ${nuxtClientDir} vers ${outputNuxtDir}...`);
  
  // Créer le dossier _nuxt si nécessaire
  fs.mkdirSync(outputNuxtDir, { recursive: true });
  
  // Copier tous les fichiers de façon récursive
  copyFolderRecursiveSync(nuxtClientDir, outputNuxtDir);
  
  console.log('Fichiers copiés avec succès!');
} else {
  console.log(`Le répertoire ${nuxtClientDir} n'existe pas.`);
}

// Fonction pour copier un dossier de façon récursive
function copyFolderRecursiveSync(source, target) {
  // Vérifie si la source est un dossier
  const stats = fs.statSync(source);
  if (stats.isDirectory()) {
    // Crée le dossier cible s'il n'existe pas
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }

    // Lit le contenu du dossier source
    const entries = fs.readdirSync(source);

    // Copie chaque entrée
    for (const entry of entries) {
      const srcPath = path.join(source, entry);
      const trgPath = path.join(target, entry);
      
      copyFolderRecursiveSync(srcPath, trgPath);
    }
  } else {
    // C'est un fichier, donc le copier directement
    fs.copyFileSync(source, target);
  }
}
