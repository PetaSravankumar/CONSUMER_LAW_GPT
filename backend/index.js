const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const logger = require('./utils/logger');

// Load environment variables from .env file
dotenv.config();

// Configuration
const PORT = parseInt(process.env.PORT || '5000', 10);
const MONGO_URI = process.env.MONGO_URI;
const isDev = process.env.NODE_ENV !== 'production';

// Validate Mongo URI
if (!MONGO_URI) {
  logger.error('❌ MONGO_URI is not defined in .env');
  process.exit(1);
}

const app = express();

// Request logging
app.use(
  morgan(isDev ? 'dev' : 'combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// CORS Setup - adjust frontend origin based on environment
app.use(
  cors({
    origin: isDev ? 'http://localhost:5173' : process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Route Imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboard');
const chatbotRoutes = require('./routes/chatbotRoutes'); // ✅ Chatbot routes added

// Route Registration
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chat', chatbotRoutes); // ✅ Mounting chatbot routes

// Health Check / Root Route
app.get('/', (req, res) => {
  res.send('🚀 Backend API is up and running');
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    logger.info('✅ MongoDB Connected Successfully');
    app.listen(PORT, () => {
      logger.info(`🚀 Server is running at: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('❌ Failed to connect to MongoDB: %s', err.message, { error: err });
    process.exit(1);
  });

// Global Error Handler
app.use((err, req, res, next) => {
  if (err instanceof Error) {
    logger.error('❌ Unhandled Error: %s', err.message);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
  } else {
    logger.error('❌ Unhandled Error:', err);
    res.status(500).json({ message: 'Something went wrong!' });
  }
});
