// Script ULTRA-SIMPLE pour servir directement le contenu statique
const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// Ports
const PORT = process.env.PORT || 10000;
const API_PORT = process.env.API_PORT || 3001;

console.log(`Démarrage en mode direct et simple...`);

// Démarrer le backend API
console.log(`Démarrage du serveur API sur le port ${API_PORT}...`);
const backend = spawn('node', ['start-backend.js'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: API_PORT }
});

// Créer un serveur Express
const app = express();

// Rediriger les requêtes API vers le backend
app.use('/api', require('http-proxy-middleware').createProxyMiddleware({
  target: `http://localhost:${API_PORT}`,
  changeOrigin: true,
  pathRewrite: {'^/api': ''}
}));

// Servir directement notre page d'accueil codée en dur
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'hardcoded-index.html');
  if (fs.existsSync(indexPath)) {
    console.log('Affichage de la page d\'accueil codée en dur');
    res.sendFile(indexPath);
  } else {
    res.send(`
      <html>
        <head>
          <title>Anniversaire d'Emmanuel YAKAM TCHAMEGNI</title>
          <style>
            body { font-family: Arial; margin: 40px; line-height: 1.6; }
            h1 { color: #FF8B00; }
          </style>
        </head>
        <body>
          <h1>Anniversaire d'Emmanuel YAKAM TCHAMEGNI</h1>
          <p>Bienvenue sur le site de l'anniversaire!</p>
          <p>Le site complet est en cours de chargement...</p>
        </body>
      </html>
    `);
  }
});

// Essayer de servir les fichiers statiques s'ils existent
app.use(express.static(path.join(__dirname, '.output/public')));
app.use(express.static(path.join(__dirname, '.nuxt/dist/client')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/_nuxt', express.static(path.join(__dirname, '.nuxt/dist/client')));

// Pour toutes les autres routes qui ne sont pas des fichiers statiques, renvoyer à la page d'accueil
app.use((req, res, next) => {
  // Si c'est une demande d'API, continuer normalement
  if (req.path.startsWith('/api')) {
    return next();
  }
  
  // Si c'est une demande de fichier statique (avec extension), vérifier s'il existe
  if (path.extname(req.path)) {
    const staticFile = path.join(__dirname, '.output/public', req.path);
    if (fs.existsSync(staticFile)) {
      return res.sendFile(staticFile);
    }
    
    const nuxtFile = path.join(__dirname, '.nuxt/dist/client', req.path);
    if (fs.existsSync(nuxtFile)) {
      return res.sendFile(nuxtFile);
    }
  }
  
  // Pour toutes les autres routes (navigation SPA), servir la page d'accueil
  const indexPath = path.join(__dirname, 'hardcoded-index.html');
  if (fs.existsSync(indexPath)) {
    console.log(`Route ${req.path} -> hardcoded-index.html`);
    return res.sendFile(indexPath);
  }
  
  // Si tout échoue, renvoyer un message simple
  res.send(`
    <html>
      <head>
        <title>Anniversaire d'Emmanuel YAKAM TCHAMEGNI</title>
        <style>
          body { font-family: Arial; margin: 40px; line-height: 1.6; }
          h1 { color: #FF8B00; }
        </style>
      </head>
      <body>
        <h1>Anniversaire d'Emmanuel YAKAM TCHAMEGNI</h1>
        <p>Bienvenue sur le site de l'anniversaire!</p>
        <p>Le site complet est en cours de chargement...</p>
      </body>
    </html>
  `);
});

// Démarrer le serveur principal
app.listen(PORT, () => {
  console.log(`Serveur principal démarré sur le port ${PORT}`);
});

// Gérer les erreurs du backend
backend.on('error', (error) => {
  console.error('Erreur lors du démarrage du backend:', error);
});

// Gérer la terminaison propre
process.on('SIGINT', () => {
  console.log('Arrêt des serveurs...');
  if (backend.pid) {
    process.kill(backend.pid);
  }
  process.exit(0);
});
