const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const { sanitizeText } = require('../utils');

// Get the playlist
router.get('/', async (req, res) => {
  try {
    const playlistPath = path.join(__dirname, '../../data/playlist.json');
    const playlistRaw = await fs.readFile(playlistPath, 'utf8');
    const playlist = JSON.parse(playlistRaw);
    
    // Sort by votes if requested
    if (req.query.sort === 'popular') {
      playlist.tracks.sort((a, b) => b.votes - a.votes);
    }
    
    return res.status(200).json(playlist);
  } catch (error) {
    console.error('Error getting playlist:', error);
    return res.status(500).json({ error: 'Failed to get playlist' });
  }
});

// Add a track to the playlist
router.post('/', async (req, res) => {
  try {
    const { title, artist, username, spotifyId } = req.body;
    
    if (!title || !artist || !username) {
      return res.status(400).json({ error: 'Title, artist, and username are required' });
    }
    
    const sanitizedTitle = sanitizeText(title);
    const sanitizedArtist = sanitizeText(artist);
    const sanitizedUsername = sanitizeText(username);
    
    const playlistPath = path.join(__dirname, '../../data/playlist.json');
    const playlistRaw = await fs.readFile(playlistPath, 'utf8');
    const playlist = JSON.parse(playlistRaw);
    
    // Check if track already exists
    const trackExists = playlist.tracks.some(
      t => t.title.toLowerCase() === sanitizedTitle.toLowerCase() && 
           t.artist.toLowerCase() === sanitizedArtist.toLowerCase()
    );
    
    if (trackExists) {
      return res.status(400).json({ error: 'This track is already in the playlist' });
    }
    
    const newTrack = {
      id: Date.now(),
      title: sanitizedTitle,
      artist: sanitizedArtist,
      addedBy: sanitizedUsername,
      spotifyId: spotifyId || null,
      votes: 0,
      createdAt: new Date().toISOString()
    };
    
    playlist.tracks.push(newTrack);
    await fs.writeFile(playlistPath, JSON.stringify(playlist, null, 2));
    
    return res.status(201).json(newTrack);
  } catch (error) {
    console.error('Error adding track:', error);
    return res.status(500).json({ error: 'Failed to add track' });
  }
});

// Vote for a track
router.post('/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const playlistPath = path.join(__dirname, '../../data/playlist.json');
    const playlistRaw = await fs.readFile(playlistPath, 'utf8');
    const playlist = JSON.parse(playlistRaw);
    
    const trackIndex = playlist.tracks.findIndex(t => t.id === parseInt(id));
    
    if (trackIndex === -1) {
      return res.status(404).json({ error: 'Track not found' });
    }
    
    playlist.tracks[trackIndex].votes++;
    await fs.writeFile(playlistPath, JSON.stringify(playlist, null, 2));
    
    return res.status(200).json({ votes: playlist.tracks[trackIndex].votes });
  } catch (error) {
    console.error('Error voting for track:', error);
    return res.status(500).json({ error: 'Failed to vote for track' });
  }
});

// Delete a track
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const playlistPath = path.join(__dirname, '../../data/playlist.json');
    const playlistRaw = await fs.readFile(playlistPath, 'utf8');
    const playlist = JSON.parse(playlistRaw);
    
    const originalTracksLength = playlist.tracks.length;
    playlist.tracks = playlist.tracks.filter(t => t.id !== parseInt(id));
    
    if (playlist.tracks.length === originalTracksLength) {
      return res.status(404).json({ error: 'Track not found' });
    }
    
    await fs.writeFile(playlistPath, JSON.stringify(playlist, null, 2));
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting track:', error);
    return res.status(500).json({ error: 'Failed to delete track' });
  }
});

// Get top tracks
router.get('/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const playlistPath = path.join(__dirname, '../../data/playlist.json');
    const playlistRaw = await fs.readFile(playlistPath, 'utf8');
    const playlist = JSON.parse(playlistRaw);
    
    // Sort by votes (highest first) and limit
    const topTracks = [...playlist.tracks]
      .sort((a, b) => b.votes - a.votes)
      .slice(0, limit);
    
    return res.status(200).json(topTracks);
  } catch (error) {
    console.error('Error getting top tracks:', error);
    return res.status(500).json({ error: 'Failed to get top tracks' });
  }
});

module.exports = router; 