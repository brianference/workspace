#!/usr/bin/env node
/**
 * AI Agent Control Tower - Production Server
 * @module server
 */

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const config = require('./config');
const logger = require('./lib/logger');
const sessionsRoutes = require('./routes/sessions.routes');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for now, enable in production
}));

// CORS
app.use(cors({
  origin: config.corsOrigin,
  methods: ['GET', 'POST'],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindow,
  max: config.rateLimitMax,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });
  
  next();
});

// Serve static files
app.use(express.static('public'));

// API Routes
app.use('/api/sessions', sessionsRoutes);

/**
 * Health check endpoint
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '2.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Error handler
 */
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
  });
  
  res.status(err.status || 500).json({
    error: config.env === 'production' 
      ? 'Internal server error' 
      : err.message,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Graceful shutdown
 */
function shutdown() {
  logger.info('Shutting down gracefully...');
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

/**
 * Start server
 */
const server = app.listen(config.port, () => {
  logger.info('AI Agent Control Tower started', {
    port: config.port,
    environment: config.env,
    pid: process.pid,
  });
  logger.info(`Health check: http://localhost:${config.port}/api/health`);
});

module.exports = { app, server };
