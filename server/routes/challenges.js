const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const formidable = require('formidable');
const { sanitizeText, validateFileType } = require('../utils');

// Get all challenges
router.get('/', async (req, res) => {
  try {
    const challengesPath = path.join(__dirname, '../../data/challenges.json');
    const challengesRaw = await fs.readFile(challengesPath, 'utf8');
    const challenges = JSON.parse(challengesRaw);
    
    return res.status(200).json(challenges);
  } catch (error) {
    console.error('Error getting challenges:', error);
    return res.status(500).json({ error: 'Failed to get challenges' });
  }
});

// Get challenge by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const challengesPath = path.join(__dirname, '../../data/challenges.json');
    const challengesRaw = await fs.readFile(challengesPath, 'utf8');
    const challenges = JSON.parse(challengesRaw);
    
    const challenge = challenges.challenges.find(c => c.id === parseInt(id));
    
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    return res.status(200).json(challenge);
  } catch (error) {
    console.error('Error getting challenge:', error);
    return res.status(500).json({ error: 'Failed to get challenge' });
  }
});

// Submit a challenge
router.post('/:id/submit', async (req, res) => {
  try {
    const form = formidable({
      uploadDir: path.join(__dirname, '../../uploads'),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filter: ({ mimetype }) => {
        return mimetype.startsWith('image/') || mimetype.startsWith('video/');
      }
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error uploading media:', err);
        return res.status(500).json({ error: 'Failed to upload media' });
      }

      if (!files.media) {
        return res.status(400).json({ error: 'No media file uploaded' });
      }

      const { id } = req.params;
      const { username, message } = fields;
      
      if (!username) {
        return res.status(400).json({ error: 'Username is required' });
      }

      const sanitizedUsername = sanitizeText(username);
      const sanitizedMessage = message ? sanitizeText(message) : '';
      
      const file = files.media[0];
      const type = file.mimetype.startsWith('image/') ? 'photos' : 'videos';
      const newPath = path.join(__dirname, `../../uploads/${type}`, path.basename(file.filepath));
      
      await fs.rename(file.filepath, newPath);
      const mediaPath = `/uploads/${type}/${path.basename(newPath)}`;
      
      const challengesPath = path.join(__dirname, '../../data/challenges.json');
      const challengesRaw = await fs.readFile(challengesPath, 'utf8');
      const challenges = JSON.parse(challengesRaw);
      
      const challengeIndex = challenges.challenges.findIndex(c => c.id === parseInt(id));
      
      if (challengeIndex === -1) {
        return res.status(404).json({ error: 'Challenge not found' });
      }
      
      const submission = {
        id: Date.now(),
        username: sanitizedUsername,
        message: sanitizedMessage,
        mediaPath,
        mediaType: type === 'photos' ? 'image' : 'video',
        createdAt: new Date().toISOString()
      };
      
      challenges.challenges[challengeIndex].submissions.push(submission);
      await fs.writeFile(challengesPath, JSON.stringify(challenges, null, 2));
      
      return res.status(201).json(submission);
    });
  } catch (error) {
    console.error('Error submitting challenge:', error);
    return res.status(500).json({ error: 'Failed to submit challenge' });
  }
});

// Get submissions for a challenge
router.get('/:id/submissions', async (req, res) => {
  try {
    const { id } = req.params;
    const challengesPath = path.join(__dirname, '../../data/challenges.json');
    const challengesRaw = await fs.readFile(challengesPath, 'utf8');
    const challenges = JSON.parse(challengesRaw);
    
    const challenge = challenges.challenges.find(c => c.id === parseInt(id));
    
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    // Sort submissions by date (newest first)
    const sortedSubmissions = [...challenge.submissions]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return res.status(200).json(sortedSubmissions);
  } catch (error) {
    console.error('Error getting submissions:', error);
    return res.status(500).json({ error: 'Failed to get submissions' });
  }
});

// Delete a submission
router.delete('/:challengeId/submissions/:submissionId', async (req, res) => {
  try {
    const { challengeId, submissionId } = req.params;
    const challengesPath = path.join(__dirname, '../../data/challenges.json');
    const challengesRaw = await fs.readFile(challengesPath, 'utf8');
    const challenges = JSON.parse(challengesRaw);
    
    const challengeIndex = challenges.challenges.findIndex(c => c.id === parseInt(challengeId));
    
    if (challengeIndex === -1) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    const originalSubmissionsLength = challenges.challenges[challengeIndex].submissions.length;
    challenges.challenges[challengeIndex].submissions = 
      challenges.challenges[challengeIndex].submissions.filter(
        s => s.id !== parseInt(submissionId)
      );
    
    if (challenges.challenges[challengeIndex].submissions.length === originalSubmissionsLength) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    
    await fs.writeFile(challengesPath, JSON.stringify(challenges, null, 2));
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return res.status(500).json({ error: 'Failed to delete submission' });
  }
});

module.exports = router; 