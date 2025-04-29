const { spawn } = require('child_process');
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Utilisation des variables d'environnement pour les ports
const API_PORT = process.env.API_PORT || 3001;
const MAIN_PORT = process.env.PORT || 10000;

// Déterminer si nous sommes en mode production
const isProd = process.env.NODE_ENV === 'production';

console.log(`Environnement: ${isProd ? 'PRODUCTION' : 'DÉVELOPPEMENT'}`);

// Démarrer le backend API
console.log(`Démarrage du serveur API sur le port ${API_PORT}...`);
const backend = spawn('node', ['start-backend.js'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: API_PORT }
});

// Attendre un peu pour que le serveur API démarre complètement
setTimeout(() => {
  // En production sur Render, le frontend est servi par le build statique
  if (!isProd) {
    console.log(`Démarrage du serveur frontend Nuxt sur le port ${MAIN_PORT}...`);
    const frontend = spawn('node', ['start-frontend.js'], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, PORT: MAIN_PORT }
    });

    // Gérer les erreurs du frontend
    frontend.on('error', (error) => {
      console.error('Erreur lors du démarrage du frontend:', error);
    });

    // Gérer la terminaison propre
    process.on('SIGINT', () => {
      console.log('Arrêt des serveurs...');
      
      if (backend.pid) {
        process.kill(backend.pid);
      }
      
      if (frontend.pid) {
        process.kill(frontend.pid);
      }
      
      process.exit(0);
    });
  } else {
    // En production, nous servons le build statique de Nuxt via Express
    console.log(`Mode production: démarrage du serveur principal sur le port ${MAIN_PORT}`);
    
    // Créer un serveur Express pour servir les fichiers statiques et rediriger les API
    const app = express();
    
    // Rediriger les requêtes /api vers le backend
    app.use('/api', createProxyMiddleware({ 
      target: `http://localhost:${API_PORT}`,
      changeOrigin: true,
      pathRewrite: {'^/api': ''}
    }));
    
    // Servir les fichiers statiques générés par Nuxt
    app.use(express.static(path.join(__dirname, '.output/public')));
    
    // Pour toutes les autres routes, renvoyer l'index.html de Nuxt
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '.output/public/index.html'));
    });
    
    // Démarrer le serveur principal
    app.listen(MAIN_PORT, () => {
      console.log(`Serveur principal démarré sur le port ${MAIN_PORT}`);
    });
    
    // Gérer la terminaison propre
    process.on('SIGINT', () => {
      console.log('Arrêt des serveurs...');
      
      if (backend.pid) {
        process.kill(backend.pid);
      }
      
      process.exit(0);
    });
  }
}, 2000);

// Gérer les erreurs du backend
backend.on('error', (error) => {
  console.error('Erreur lors du démarrage du backend:', error);
});

console.log(`Serveurs en cours de démarrage : ${!isProd ? 'Frontend (port ' + MAIN_PORT + '), ' : 'Principal (port ' + MAIN_PORT + '), '}Backend (port ${API_PORT})`);
console.log('Appuyez sur Ctrl+C pour arrêter les serveurs'); 