const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const { sanitizeText } = require('../utils');

// Get all quiz questions
router.get('/', async (req, res) => {
  try {
    const quizPath = path.join(__dirname, '../../data/quiz.json');
    const quizRaw = await fs.readFile(quizPath, 'utf8');
    const quiz = JSON.parse(quizRaw);
    
    // Hide answers if requested
    if (req.query.hideAnswers === 'true') {
      const quizWithoutAnswers = quiz.map(q => {
        const { answer, ...questionWithoutAnswer } = q;
        return questionWithoutAnswer;
      });
      return res.status(200).json(quizWithoutAnswers);
    }
    
    return res.status(200).json(quiz);
  } catch (error) {
    console.error('Error getting quiz:', error);
    return res.status(500).json({ error: 'Failed to get quiz questions' });
  }
});

// Submit quiz result
router.post('/results', async (req, res) => {
  try {
    const { username, score, badge } = req.body;
    
    if (!username || score === undefined || !badge) {
      return res.status(400).json({ error: 'Username, score, and badge are required' });
    }
    
    const sanitizedUsername = sanitizeText(username);
    
    const result = {
      id: Date.now(),
      username: sanitizedUsername,
      score,
      badge,
      createdAt: new Date().toISOString()
    };
    
    const resultsPath = path.join(__dirname, '../../data/quizResults.json');
    const resultsRaw = await fs.readFile(resultsPath, 'utf8');
    const results = JSON.parse(resultsRaw);
    
    results.push(result);
    await fs.writeFile(resultsPath, JSON.stringify(results, null, 2));
    
    return res.status(201).json(result);
  } catch (error) {
    console.error('Error submitting quiz result:', error);
    return res.status(500).json({ error: 'Failed to submit quiz result' });
  }
});

// Get top quiz results
router.get('/results/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const resultsPath = path.join(__dirname, '../../data/quizResults.json');
    const resultsRaw = await fs.readFile(resultsPath, 'utf8');
    const results = JSON.parse(resultsRaw);
    
    // Sort by score (highest first) and limit
    const topResults = [...results]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    return res.status(200).json(topResults);
  } catch (error) {
    console.error('Error getting top results:', error);
    return res.status(500).json({ error: 'Failed to get top quiz results' });
  }
});

// Check quiz answer
router.post('/check/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    const { answerIndex } = req.body;
    
    if (answerIndex === undefined) {
      return res.status(400).json({ error: 'Answer index is required' });
    }
    
    const quizPath = path.join(__dirname, '../../data/quiz.json');
    const quizRaw = await fs.readFile(quizPath, 'utf8');
    const quiz = JSON.parse(quizRaw);
    
    const question = quiz.find(q => q.id === parseInt(questionId));
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    const isCorrect = question.answer === answerIndex;
    
    return res.status(200).json({
      isCorrect,
      correctAnswer: question.answer
    });
  } catch (error) {
    console.error('Error checking answer:', error);
    return res.status(500).json({ error: 'Failed to check answer' });
  }
});

module.exports = router; 