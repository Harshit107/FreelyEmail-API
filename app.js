const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Connect Database
const connectDB = require('./src/config/db');
connectDB();

const app = express();
const emailRoutes = require('./src/routes/email.routes');
const { errorHandler } = require('./src/middlewares/error');

const PORT = process.env.PORT || 3000;

app.use(cors());

// Parsing body
app.use(express.json());

// Routes
app.use('/api/v1/emails', emailRoutes);

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is working perfectly fine.',
  });
});

// Old Check Server route for backwards compatibility if needed
app.get('/checkServer', (req, res) => {
  res.send('<H1> Hey developer,</H1> <H3>Server is working perfectly fine </H3>');
});

// Centralized Error Handling MiddleWare
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
