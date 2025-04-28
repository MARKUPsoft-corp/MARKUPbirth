const express = require('express');
const bcrypt = require('bcrypt');
const { makeId } = require('../utils');
const router = express.Router();

// In-memory user store (should be replaced with a database in production)
const users = [];

/**
 * GET /api/users
 * Get list of users (excluding sensitive info)
 */
router.get('/', (req, res) => {
  // Return users without sensitive information
  const safeUsers = users.map(({ password, ...user }) => user);
  res.json(safeUsers);
});

/**
 * GET /api/users/:id
 * Get user by ID
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const user = users.find(user => user.id === id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Return user without password
  const { password, ...safeUser } = user;
  res.json(safeUser);
});

/**
 * POST /api/users/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  const { username, email, password, avatar } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Check if user already exists
  if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  
  if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
    return res.status(409).json({ error: 'Username already taken' });
  }
  
  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = {
      id: makeId(8),
      username,
      email,
      password: hashedPassword,
      avatar: avatar || null,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    // Return user without password
    const { password: _, ...safeUser } = newUser;
    res.status(201).json(safeUser);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

/**
 * POST /api/users/login
 * Login user
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  try {
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Return user without password
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * PUT /api/users/:id
 * Update user profile
 */
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, avatar } = req.body;
  
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Check if username is taken by another user
  if (username && username !== users[userIndex].username && 
      users.some(user => user.id !== id && user.username.toLowerCase() === username.toLowerCase())) {
    return res.status(409).json({ error: 'Username already taken' });
  }
  
  // Update user fields if provided
  if (username) users[userIndex].username = username;
  if (email) users[userIndex].email = email;
  if (avatar !== undefined) users[userIndex].avatar = avatar;
  
  // Return updated user without password
  const { password, ...safeUser } = users[userIndex];
  res.json(safeUser);
});

module.exports = router; 