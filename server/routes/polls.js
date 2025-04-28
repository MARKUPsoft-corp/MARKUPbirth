const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs/promises');

// Get all polls
router.get('/', async (req, res) => {
  try {
    const pollsPath = path.join(__dirname, '../../data/polls.json');
    const pollsRaw = await fs.readFile(pollsPath, 'utf8');
    const polls = JSON.parse(pollsRaw);
    
    return res.status(200).json(polls);
  } catch (error) {
    console.error('Error getting polls:', error);
    return res.status(500).json({ error: 'Failed to get polls' });
  }
});

// Get poll by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pollsPath = path.join(__dirname, '../../data/polls.json');
    const pollsRaw = await fs.readFile(pollsPath, 'utf8');
    const polls = JSON.parse(pollsRaw);
    
    const poll = polls.find(p => p.id === parseInt(id));
    
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }
    
    return res.status(200).json(poll);
  } catch (error) {
    console.error('Error getting poll:', error);
    return res.status(500).json({ error: 'Failed to get poll' });
  }
});

// Vote in a poll
router.post('/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const { optionIndex } = req.body;
    
    if (optionIndex === undefined) {
      return res.status(400).json({ error: 'Option index is required' });
    }
    
    const pollsPath = path.join(__dirname, '../../data/polls.json');
    const pollsRaw = await fs.readFile(pollsPath, 'utf8');
    const polls = JSON.parse(pollsRaw);
    
    const pollIndex = polls.findIndex(p => p.id === parseInt(id));
    
    if (pollIndex === -1) {
      return res.status(404).json({ error: 'Poll not found' });
    }
    
    if (optionIndex < 0 || optionIndex >= polls[pollIndex].options.length) {
      return res.status(400).json({ error: 'Invalid option index' });
    }
    
    polls[pollIndex].votes[optionIndex]++;
    
    await fs.writeFile(pollsPath, JSON.stringify(polls, null, 2));
    
    return res.status(200).json(polls[pollIndex]);
  } catch (error) {
    console.error('Error voting in poll:', error);
    return res.status(500).json({ error: 'Failed to vote in poll' });
  }
});

// Get poll results
router.get('/:id/results', async (req, res) => {
  try {
    const { id } = req.params;
    const pollsPath = path.join(__dirname, '../../data/polls.json');
    const pollsRaw = await fs.readFile(pollsPath, 'utf8');
    const polls = JSON.parse(pollsRaw);
    
    const poll = polls.find(p => p.id === parseInt(id));
    
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }
    
    // Calculate percentages
    const totalVotes = poll.votes.reduce((sum, count) => sum + count, 0);
    const results = poll.options.map((option, index) => {
      const voteCount = poll.votes[index];
      const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
      
      return {
        option,
        votes: voteCount,
        percentage
      };
    });
    
    return res.status(200).json({
      id: poll.id,
      question: poll.question,
      results,
      totalVotes
    });
  } catch (error) {
    console.error('Error getting poll results:', error);
    return res.status(500).json({ error: 'Failed to get poll results' });
  }
});

module.exports = router; 