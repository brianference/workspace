/**
 * Logger Module
 * Production-safe logging with levels
 * @module logger
 */

const config = require('../config');

const LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const COLORS = {
  error: '\x1b[31m', // Red
  warn: '\x1b[33m',  // Yellow
  info: '\x1b[36m',  // Cyan
  debug: '\x1b[90m', // Gray
  reset: '\x1b[0m',
};

/**
 * Get current log level threshold
 * @returns {number}
 */
function getLogLevel() {
  return LEVELS[config.logLevel] || LEVELS.info;
}

/**
 * Format log message
 * @param {string} level - Log level
 * @param {string} message - Message
 * @param {Object} [meta] - Additional context
 * @returns {string}
 */
function formatMessage(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  
  if (config.env === 'production') {
    // Structured JSON for production
    return JSON.stringify({ timestamp, level, message, ...meta });
  } else {
    // Colored output for development
    const color = COLORS[level] || '';
    return `${color}[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}${COLORS.reset}`;
  }
}

/**
 * Log at specified level
 * @param {string} level - Log level
 * @param {string} message - Message
 * @param {Object} [meta] - Additional context
 */
function log(level, message, meta = {}) {
  if (LEVELS[level] <= getLogLevel()) {
    const formatted = formatMessage(level, message, meta);
    
    if (level === 'error') {
      console.error(formatted);
    } else {
      console.log(formatted);
    }
  }
}

/**
 * Logger instance
 */
const logger = {
  error: (message, meta) => log('error', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  info: (message, meta) => log('info', message, meta),
  debug: (message, meta) => log('debug', message, meta),
};

module.exports = logger;
