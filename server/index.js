const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const downloadRoutes = require('./routes/download');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, error: 'Too many requests, try again later! 😎', medias: null, metadata: null }
}));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../client')));

// Routes
app.use('/', downloadRoutes);

// Serve API docs
app.get('/api-docs.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'api-docs.html'));
});

// Serve index.html for other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
