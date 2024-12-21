// server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin:['http://localhost:5173','https://thunderous-pavlova-f6d0ff.netlify.app','https://thunderous-pavlova-f6d0ff.netlify.app/'],
  credentials:true,
  method:['GET','POST','PUT','DELETE']
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/todos', todoRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in  mode on port ${PORT}`);
});
//g6BxRdCAcrQCXZNu