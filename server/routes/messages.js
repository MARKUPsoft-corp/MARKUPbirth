const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const { sanitizeText } = require('../utils');

// In-memory store for messages (should be replaced with a database in production)
const messages = [];

/**
 * GET /api/messages
 * Retrieve all messages
 */
router.get('/', (req, res) => {
  res.json(messages);
});

/**
 * POST /api/messages
 * Create a new message
 */
router.post('/', (req, res) => {
  const { text, userId, userName, userAvatar } = req.body;
  
  if (!text || !userId || !userName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const newMessage = {
    id: Date.now().toString(),
    text,
    userId,
    userName,
    userAvatar: userAvatar || null,
    timestamp: new Date().toISOString(),
    likes: 0,
    likedBy: []
  };
  
  messages.push(newMessage);
  res.status(201).json(newMessage);
});

/**
 * PUT /api/messages/:id/like
 * Like or unlike a message
 */
router.put('/:id/like', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }
  
  const message = messages.find(msg => msg.id === id);
  
  if (!message) {
    return res.status(404).json({ error: 'Message not found' });
  }
  
  const hasLiked = message.likedBy.includes(userId);
  
  if (hasLiked) {
    // Unlike the message
    message.likes = Math.max(0, message.likes - 1);
    message.likedBy = message.likedBy.filter(id => id !== userId);
  } else {
    // Like the message
    message.likes += 1;
    message.likedBy.push(userId);
  }
  
  res.json(message);
});

/**
 * DELETE /api/messages/:id
 * Delete a message
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = messages.findIndex(msg => msg.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Message not found' });
  }
  
  const deleted = messages.splice(index, 1)[0];
  res.json(deleted);
});

module.exports = router; 