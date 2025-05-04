const dotenv = require('dotenv');
// Load environment variables FIRST
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Debug config - uncomment for troubleshooting env vars
// require('./config/debug-config');

// Routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const testRoutes = require('./routes/testRoutes');

// Initialize express
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // For serving profile images

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/test', testRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Authentication API is running');
});

// 404 middleware
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
