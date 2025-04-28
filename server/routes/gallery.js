const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const formidable = require('formidable');
const { sanitizeText, validateFileType } = require('../utils');

// Get all gallery items
router.get('/', async (req, res) => {
  try {
    const galleryPath = path.join(__dirname, '../../data/gallery.json');
    const galleryRaw = await fs.readFile(galleryPath, 'utf8');
    const gallery = JSON.parse(galleryRaw);
    
    // Sort by date (newest first) by default
    gallery.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return res.status(200).json(gallery);
  } catch (error) {
    console.error('Error getting gallery:', error);
    return res.status(500).json({ error: 'Failed to get gallery' });
  }
});

// Add a new gallery item
router.post('/', async (req, res) => {
  try {
    const form = formidable({
      uploadDir: path.join(__dirname, '../../uploads/photos'),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filter: ({ mimetype }) => {
        return mimetype.startsWith('image/');
      }
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error uploading photo:', err);
        return res.status(500).json({ error: 'Failed to upload photo' });
      }

      if (!files.photo) {
        return res.status(400).json({ error: 'No photo uploaded' });
      }

      const { username, caption } = fields;
      
      if (!username) {
        return res.status(400).json({ error: 'Username is required' });
      }

      const sanitizedUsername = sanitizeText(username);
      const sanitizedCaption = caption ? sanitizeText(caption) : '';
      
      const photoPath = `/uploads/photos/${path.basename(files.photo[0].filepath)}`;
      
      const newGalleryItem = {
        id: Date.now(),
        username: sanitizedUsername,
        caption: sanitizedCaption,
        photoPath,
        createdAt: new Date().toISOString()
      };
      
      const galleryPath = path.join(__dirname, '../../data/gallery.json');
      const galleryRaw = await fs.readFile(galleryPath, 'utf8');
      const gallery = JSON.parse(galleryRaw);
      
      gallery.push(newGalleryItem);
      await fs.writeFile(galleryPath, JSON.stringify(gallery, null, 2));
      
      return res.status(201).json(newGalleryItem);
    });
  } catch (error) {
    console.error('Error adding gallery item:', error);
    return res.status(500).json({ error: 'Failed to add gallery item' });
  }
});

// Get a gallery item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const galleryPath = path.join(__dirname, '../../data/gallery.json');
    const galleryRaw = await fs.readFile(galleryPath, 'utf8');
    const gallery = JSON.parse(galleryRaw);
    
    const galleryItem = gallery.find(item => item.id === parseInt(id));
    
    if (!galleryItem) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }
    
    return res.status(200).json(galleryItem);
  } catch (error) {
    console.error('Error getting gallery item:', error);
    return res.status(500).json({ error: 'Failed to get gallery item' });
  }
});

// Delete a gallery item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const galleryPath = path.join(__dirname, '../../data/gallery.json');
    const galleryRaw = await fs.readFile(galleryPath, 'utf8');
    const gallery = JSON.parse(galleryRaw);
    
    const itemToDelete = gallery.find(item => item.id === parseInt(id));
    
    if (!itemToDelete) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }
    
    // Get the file path to delete the image
    const filePath = path.join(__dirname, '../..', itemToDelete.photoPath);
    
    // Filter out the item
    const filteredGallery = gallery.filter(item => item.id !== parseInt(id));
    await fs.writeFile(galleryPath, JSON.stringify(filteredGallery, null, 2));
    
    // Try to delete the image file (but don't fail if it doesn't exist)
    try {
      await fs.unlink(filePath);
    } catch (fileError) {
      console.error('Error deleting image file:', fileError);
      // Continue since we still deleted the gallery entry
    }
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

module.exports = router; 