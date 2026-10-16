const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Connect Database
const connectDB = require('./src/config/db');
connectDB();

const app = express();
const emailRoutes = require('./src/routes/email.routes');
const { errorHandler } = require('./src/middlewares/error');
const { ROUTES, DEFAULT_CONFIG, ERROR_CODES, ERROR_MESSAGES, SUCCESS_MESSAGES } = require('./src/constants');

const PORT = process.env.PORT || DEFAULT_CONFIG.PORT;

app.use(helmet());
app.use(cors());

// Parsing body with size limit to prevent memory exhaustion
app.use(express.json({ limit: "1mb" }));

// Routes
app.use(ROUTES.EMAILS.BASE, emailRoutes);

// Health Check Endpoint
app.get(ROUTES.HEALTH, (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    message: SUCCESS_MESSAGES.HEALTH,
    error: null,
  });
});


// Old Check Server route for backwards compatibility if needed
app.get(ROUTES.LEGACY_CHECK_SERVER, (req, res) => {
  res.send('<H1> Hey developer,</H1> <H3>Server is working perfectly fine </H3>');
});

// Handle undefined routes (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    error: {
      errorCode: ERROR_CODES.ROUTE_NOT_FOUND,
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  });
});


// Centralized Error Handling Middleware
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = app;
