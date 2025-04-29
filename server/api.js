const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const formidable = require('formidable');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { makeId, validateFileType, getExtensionFromMimetype } = require('./utils');

// Routes
const messagesRoutes = require('./routes/messages');
const quizRoutes = require('./routes/quiz');
const pollsRoutes = require('./routes/polls');
const playlistRoutes = require('./routes/playlist');
const galleryRoutes = require('./routes/gallery');
const usersRoutes = require('./routes/users');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8000", "http://127.0.0.1:8000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  }
});

// Create uploads directories if they don't exist
const photoDir = path.join(__dirname, '../uploads/photos');
const videoDir = path.join(__dirname, '../uploads/videos');

if (!fs.existsSync(photoDir)) {
  fs.mkdirSync(photoDir, { recursive: true });
}

if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8000", "http://127.0.0.1:8000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', apiLimiter);

// File upload endpoint
app.post('/api/upload/:type', (req, res) => {
  const form = formidable({
    uploadDir: path.join(__dirname, '../uploads'),
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    filter: ({ mimetype }) => {
      const fileType = req.params.type || 'photos';
      return validateFileType(mimetype, fileType);
    }
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).json({ error: 'Failed to upload file' });
    }

    if (!files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = files.file[0];
    const fileType = file.mimetype.startsWith('image/') ? 'photos' : 'videos';
    const newPath = path.join(__dirname, `../uploads/${fileType}`, path.basename(file.filepath));
    
    fs.rename(file.filepath, newPath, (err) => {
      if (err) {
        console.error('Error moving file:', err);
        return res.status(500).json({ error: 'Failed to save file' });
      }

      const filePath = `/uploads/${fileType}/${path.basename(newPath)}`;
      return res.status(200).json({ filePath });
    });
  });
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/messages', messagesRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/polls', pollsRoutes);
app.use('/api/playlist', playlistRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/users', usersRoutes);

// Socket.IO
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Handle room joining
  socket.on('join', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });
  
  // Handle messages
  socket.on('message', async (messageData) => {
    try {
      // Process and save the message
      const messagesPath = path.join(__dirname, '../data/messages.json');
      const messagesRaw = await fs.promises.readFile(messagesPath, 'utf8');
      const messages = JSON.parse(messagesRaw);
      
      const newMessage = {
        id: Date.now(),
        username: messageData.username,
        message: messageData.message,
        photoPath: messageData.photoPath,
        createdAt: new Date().toISOString(),
        likes: 0
      };
      
      messages.push(newMessage);
      await fs.promises.writeFile(messagesPath, JSON.stringify(messages, null, 2));
      
      // Broadcast to all clients in the room
      io.to('messages').emit('new-message', newMessage);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
  
  // Handle likes
  socket.on('like-message', async (messageId) => {
    try {
      const messagesPath = path.join(__dirname, '../data/messages.json');
      const messagesRaw = await fs.promises.readFile(messagesPath, 'utf8');
      const messages = JSON.parse(messagesRaw);
      
      const messageIndex = messages.findIndex(m => m.id === messageId);
      
      if (messageIndex !== -1) {
        messages[messageIndex].likes = (messages[messageIndex].likes || 0) + 1;
        await fs.promises.writeFile(messagesPath, JSON.stringify(messages, null, 2));
        
        // Broadcast the updated likes
        io.to('messages').emit('message-liked', {
          id: messageId,
          likes: messages[messageIndex].likes
        });
      }
    } catch (error) {
      console.error('Error processing like:', error);
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
}); 