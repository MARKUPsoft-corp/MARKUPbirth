// Serveur Express simple pour servir les fichiers statiques et l'API
const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// Configuration
const PORT = process.env.PORT || 10000;
const API_PORT = process.env.API_PORT || 3001;

console.log('Démarrage du serveur simplifié...');

// Créer l'application Express
const app = express();

// Démarrer le serveur API
console.log(`Démarrage de l'API sur le port ${API_PORT}...`);
const apiProcess = spawn('node', ['start-backend.js'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: API_PORT }
});

// Configurer le proxy pour l'API
app.use('/api', require('http-proxy-middleware').createProxyMiddleware({
  target: `http://localhost:${API_PORT}`,
  changeOrigin: true,
  pathRewrite: {'^/api': ''}
}));

// Vérifier et servir les fichiers statiques
console.log('Recherche des fichiers statiques...');
let staticPath = null;

// Liste des chemins possibles pour les fichiers statiques
const paths = [
  path.join(__dirname, '.output/public'),
  path.join(__dirname, 'dist'),
  path.join(__dirname, '.nuxt/dist/client')
];

// Trouver le premier chemin valide
for (const p of paths) {
  if (fs.existsSync(p)) {
    staticPath = p;
    console.log(`Fichiers statiques trouvés dans: ${p}`);
    break;
  }
}

// Servir les fichiers statiques s'ils existent
if (staticPath) {
  app.use(express.static(staticPath));
  
  // Configuration spéciale pour les fichiers Nuxt
  if (staticPath.includes('.nuxt')) {
    app.use('/_nuxt', express.static(path.join(__dirname, '.nuxt/dist/client')));
  }
}

// Servir index.html pour toutes les autres routes (SPA routing)
app.get('*', (req, res) => {
  // Servir la page hardcodée garantie
  const hardcodedPath = path.join(__dirname, 'hardcoded-index.html');
  if (fs.existsSync(hardcodedPath)) {
    console.log(`Servir hardcoded-index.html pour ${req.path}`);
    return res.sendFile(hardcodedPath);
  }
  
  // Fallback à un message simple en cas de problème
  res.send(`
    <html>
      <head>
        <title>Anniversaire d'Emmanuel</title>
        <style>
          body { font-family: Arial; padding: 40px; line-height: 1.6; text-align: center; }
          h1 { color: #FF8B00; }
        </style>
      </head>
      <body>
        <h1>Anniversaire d'Emmanuel YAKAM TCHAMEGNI</h1>
        <p>Le site est en cours de chargement. Merci de votre patience.</p>
      </body>
    </html>
  `);
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
});

// Gérer les erreurs et la terminaison
apiProcess.on('error', (error) => {
  console.error('Erreur API:', error);
});

process.on('SIGINT', () => {
  console.log('Arrêt des serveurs...');
  if (apiProcess.pid) {
    process.kill(apiProcess.pid);
  }
  process.exit(0);
});
