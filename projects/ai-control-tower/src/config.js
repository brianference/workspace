/**
 * Configuration Module
 * Centralized config with environment variable validation
 * @module config
 */

const path = require('path');

/**
 * Validates required environment variables
 * @throws {Error} If required vars are missing
 */
function validateEnv() {
  const required = [];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

/**
 * Application configuration
 * @type {Object}
 */
const config = {
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  env: process.env.NODE_ENV || 'development',
  
  // Security
  corsOrigin: process.env.CORS_ORIGIN || '*',
  rateLimitWindow: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100, // requests per window
  
  // OpenClaw CLI
  openclawBin: process.env.OPENCLAW_BIN || 'openclaw',
  
  // Cache
  sessionCacheTTL: 5000, // 5 seconds
  
  // Timeouts
  cliTimeout: 30000, // 30 seconds
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Validate on load
validateEnv();

// Freeze config to prevent mutations
Object.freeze(config);

module.exports = config;
