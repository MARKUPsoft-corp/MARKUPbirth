// Script simplifié pour déployer l'application sur Render
const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// Ports
const PORT = process.env.PORT || 10000;
const API_PORT = process.env.API_PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

console.log(`Mode: ${isProd ? 'PRODUCTION' : 'DÉVELOPPEMENT'}`);

// Démarrer le backend API
console.log(`Démarrage du serveur API sur le port ${API_PORT}...`);
const backend = spawn('node', ['start-backend.js'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: API_PORT }
});

// Créer un serveur Express
const app = express();

// Si nous sommes en production, on sert les fichiers statiques
if (isProd) {
  // Configurer CORS pour l'API
  app.use('/api', require('http-proxy-middleware').createProxyMiddleware({
    target: `http://localhost:${API_PORT}`,
    changeOrigin: true,
    pathRewrite: {'^/api': ''}
  }));

  // Chercher les fichiers statiques dans plusieurs emplacements possibles
  const possibleStaticPaths = [
    path.join(__dirname, '.output/public'),
    path.join(__dirname, 'dist'),
    path.join(__dirname, '.nuxt/dist/client')
  ];

  // Trouver le premier chemin valide
  let staticPath = null;
  for (const p of possibleStaticPaths) {
    if (fs.existsSync(p)) {
      staticPath = p;
      console.log(`Utilisation des fichiers statiques depuis: ${p}`);
      break;
    }
  }

  if (staticPath) {
    // Servir les fichiers statiques
    app.use(express.static(staticPath));
    
    // Si c'est le dossier .nuxt, configurer aussi le chemin _nuxt
    if (staticPath.includes('.nuxt')) {
      app.use('/_nuxt', express.static(path.join(__dirname, '.nuxt/dist/client')));
    }
  }

  // Pour toutes les autres routes, essayer de servir index.html
  app.get('*', (req, res) => {
    // Rechercher index.html dans plusieurs emplacements
    for (const p of possibleStaticPaths) {
      const indexPath = path.join(p, 'index.html');
      if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
      }
    }
    
    // Si index.html n'existe pas, servir la page de secours
    const fallbackPath = path.join(__dirname, 'fallback.html');
    if (fs.existsSync(fallbackPath)) {
      console.log('Utilisation de la page fallback.html');
      return res.sendFile(fallbackPath);
    }
    
    // Dernier recours: la page index.vue source
    const pagesPath = path.join(__dirname, 'pages/index.vue');
    if (fs.existsSync(pagesPath)) {
      // Extraire le contenu du template dans index.vue
      const content = fs.readFileSync(pagesPath, 'utf8');
      const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
      
      if (templateMatch && templateMatch[1]) {
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Anniversaire d'Emmanuel YAKAM TCHAMEGNI</title>
          <style>
            body { font-family: 'Poppins', sans-serif; margin: 0; padding: 20px; }
            .container { max-width: 1200px; margin: 0 auto; }
            h1 { color: #FF8B00; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Anniversaire d'Emmanuel YAKAM TCHAMEGNI</h1>
            <div>${templateMatch[1]}</div>
            <p>Note: Cette page est une version simplifiée en raison de limitations de déploiement.</p>
          </div>
        </body>
        </html>`;
        
        return res.send(htmlContent);
      }
    }
    
    res.status(404).send('Application non disponible. Veuillez réessayer plus tard.');
  });
} else {
  // En développement, démarrer le frontend Nuxt
  console.log(`Démarrage du serveur frontend Nuxt sur le port ${PORT}...`);
  const frontend = spawn('node', ['start-frontend.js'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT }
  });
  
  frontend.on('error', (error) => {
    console.error('Erreur lors du démarrage du frontend:', error);
  });
  
  process.on('SIGINT', () => {
    if (frontend.pid) process.kill(frontend.pid);
    if (backend.pid) process.kill(backend.pid);
    process.exit(0);
  });
}

// Démarrer le serveur principal
if (isProd) {
  app.listen(PORT, () => {
    console.log(`Serveur principal démarré sur le port ${PORT}`);
  });
}

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
