// Serveur backend uniquement pour Render
const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');

// Configuration
const PORT = process.env.PORT || 10000;
const API_PORT = process.env.API_PORT || 3001;

console.log('Mode API-only activé');

// Créer l'application principale qui sera exposée sur Render
const app = express();

// Configurer CORS pour autoriser explicitement le domaine Netlify
app.use(cors({
  origin: ['https://markupbirth.netlify.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Ajouter des en-têtes CORS manuellement pour s'assurer qu'ils sont bien configurés
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://markupbirth.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Répondre immédiatement aux requêtes OPTIONS (préflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Ajouter la prise en charge de JSON pour les requêtes POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importer et utiliser les routes API
const apiRoutes = require('./api-routes');
app.use('/api', apiRoutes);

// Route de base pour confirmer que le serveur est en ligne
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'API server for Birth application is running',
    time: new Date().toISOString(),
    endpoints: [
      '/api/messages',
      '/api/quiz',
      '/api/quiz/results/top',
      '/api/status'
    ]
  });
});

// Middleware pour journaliser toutes les requêtes (débogage)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `La route ${req.originalUrl} n'existe pas`,
    availableEndpoints: [
      '/api/messages',
      '/api/quiz',
      '/api/quiz/results/top',
      '/api/status'
    ]
  });
});

// Démarrer le backend API sur un port local
console.log(`Démarrage de l'API sur le port ${API_PORT}...`);
const apiProcess = spawn('node', ['start-backend.js'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: API_PORT }
});

// Rediriger toutes les autres requêtes vers le backend API
app.use('/', require('http-proxy-middleware').createProxyMiddleware({
  target: `http://localhost:${API_PORT}`,
  changeOrigin: true
}));

// Démarrer le serveur principal
app.listen(PORT, () => {
  console.log(`Serveur API principal démarré sur le port ${PORT}`);
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
