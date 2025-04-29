// API server minimaliste pour Render
const express = require('express');
const cors = require('cors');

// Configuration
const PORT = process.env.PORT || 10000;
console.log(`Démarrage du serveur API sur le port ${PORT}`);

// Créer l'application
const app = express();

// Configuration CORS
app.use(cors({
  origin: ['https://markupbirt.netlify.app', 'https://markupbirth.netlify.app', 'https://birth-6syx.netlify.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware CORS manuel pour plus de sécurité
app.use((req, res, next) => {
  console.log(`Requête reçue: ${req.method} ${req.url}`);
  const origin = req.headers.origin;
  if (origin === 'https://markupbirt.netlify.app' || origin === 'https://markupbirth.netlify.app') {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Support JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Données factices pour les messages
const messages = [
  { id: 1, author: "Marie", content: "Joyeux anniversaire Emmanuel!", likes: 5, timestamp: new Date().toISOString() },
  { id: 2, author: "Jean", content: "Merci pour cette belle journée !", likes: 3, timestamp: new Date().toISOString() },
  { id: 3, author: "Sophie", content: "Les photos sont superbes!", likes: 7, timestamp: new Date().toISOString() }
];

// Données factices pour le quiz
const quiz = [
  {
    id: 1,
    question: "Quelle est la date de naissance d'Emmanuel ?",
    options: ["1er janvier", "15 mars", "30 avril", "22 décembre"],
    correctAnswer: 2
  },
  {
    id: 2,
    question: "Quel est le plat préféré d'Emmanuel ?",
    options: ["Pizza", "Poulet DG", "Sushi", "Lasagnes"],
    correctAnswer: 1
  }
];

// Résultats du quiz
const quizResults = [
  { id: 1, userName: "Alice", score: 85, timestamp: new Date().toISOString() },
  { id: 2, userName: "Bob", score: 92, timestamp: new Date().toISOString() }
];

// Route principale
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'API server is running',
    endpoints: [
      '/api/messages',
      '/api/quiz',
      '/api/quiz/results/top'
    ]
  });
});

// Route de statut
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString()
  });
});

// Route pour les messages
app.get('/api/messages', (req, res) => {
  console.log('GET /api/messages appelé');
  res.json(messages);
});

// Route pour le quiz
app.get('/api/quiz', (req, res) => {
  console.log('GET /api/quiz appelé');
  res.json(quiz);
});

// Route pour les résultats du quiz
app.get('/api/quiz/results/top', (req, res) => {
  console.log('GET /api/quiz/results/top appelé');
  const limit = parseInt(req.query.limit) || 5;
  res.json(quizResults.slice(0, limit));
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
