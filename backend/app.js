// server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
app.use(helmet());

// Add compression
app.use(compression());
// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://thunderous-pavlova-f6d0ff.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  maxAge: 86400 // Cache CORS preflight requests for 24 hours
}));

// Only use morgan in development
if (process.env.NODE_ENV === 'development') {
//   console.log('Morgan enabled');
  app.use(morgan('dev'));
}

// Increase payload limit if needed
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/todos', todoRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});//g6BxRdCAcrQCXZNu