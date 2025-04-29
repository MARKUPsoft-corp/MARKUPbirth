// API routes pour le serveur backend-only.js
const express = require('express');
const router = express.Router();

// Données factices pour les messages
const sampleMessages = [
  { id: 1, author: "Marie", content: "Joyeux anniversaire Emmanuel!", likes: 5, timestamp: new Date().toISOString() },
  { id: 2, author: "Jean", content: "Merci pour cette belle journée !", likes: 3, timestamp: new Date().toISOString() },
  { id: 3, author: "Sophie", content: "Les photos sont superbes!", likes: 7, timestamp: new Date().toISOString() }
];

// Données factices pour le quiz
const quizQuestions = [
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
  },
  {
    id: 3,
    question: "Quel est le hobby favori d'Emmanuel ?",
    options: ["Football", "Lecture", "Jeux vidéo", "Photographie"],
    correctAnswer: 3
  }
];

// Résultats du quiz
const quizResults = [
  { id: 1, userName: "Alice", score: 85, timestamp: new Date().toISOString() },
  { id: 2, userName: "Bob", score: 92, timestamp: new Date().toISOString() },
  { id: 3, userName: "Charlie", score: 78, timestamp: new Date().toISOString() }
];

// Routes pour les messages
router.get('/messages', (req, res) => {
  console.log("GET /api/messages appelé");
  // Trier les messages selon le paramètre de requête
  const sort = req.query.sort || 'recent';
  let sortedMessages = [...sampleMessages];
  
  if (sort === 'recent') {
    // Déjà triés par défaut
  } else if (sort === 'popular') {
    sortedMessages.sort((a, b) => b.likes - a.likes);
  }
  
  res.json(sortedMessages);
});

router.post('/messages', (req, res) => {
  console.log("POST /api/messages appelé");
  const { author, content } = req.body;
  
  if (!author || !content) {
    return res.status(400).json({ error: "L'auteur et le contenu sont requis" });
  }
  
  const newMessage = {
    id: sampleMessages.length + 1,
    author,
    content,
    likes: 0,
    timestamp: new Date().toISOString()
  };
  
  sampleMessages.push(newMessage);
  res.status(201).json(newMessage);
});

// Routes pour le quiz
router.get('/quiz', (req, res) => {
  console.log("GET /api/quiz appelé");
  res.json(quizQuestions);
});

router.post('/quiz/submit', (req, res) => {
  console.log("POST /api/quiz/submit appelé");
  const { userName, answers } = req.body;
  
  if (!userName || !answers) {
    return res.status(400).json({ error: "Le nom d'utilisateur et les réponses sont requis" });
  }
  
  // Calculer le score
  let correctCount = 0;
  quizQuestions.forEach((q, index) => {
    if (answers[index] === q.correctAnswer) {
      correctCount++;
    }
  });
  
  const score = Math.round((correctCount / quizQuestions.length) * 100);
  
  const result = {
    id: quizResults.length + 1,
    userName,
    score,
    timestamp: new Date().toISOString()
  };
  
  quizResults.push(result);
  res.json(result);
});

router.get('/quiz/results/top', (req, res) => {
  console.log("GET /api/quiz/results/top appelé");
  const limit = parseInt(req.query.limit) || 10;
  
  const topResults = [...quizResults]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  res.json(topResults);
});

// Route pour confirmer que l'API fonctionne
router.get('/status', (req, res) => {
  res.json({
    status: 'online',
    endpoints: [
      '/api/messages',
      '/api/quiz',
      '/api/quiz/results/top'
    ],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
