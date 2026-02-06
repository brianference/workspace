/**
 * Sessions API Routes
 * RESTful endpoints for session management
 * @module routes/sessions
 */

const express = require('express');
const openclawService = require('../services/openclaw.service');
const logger = require('../lib/logger');

const router = express.Router();

/**
 * Error response helper
 * @param {Object} res - Express response
 * @param {number} status - HTTP status code
 * @param {string} message - Error message
 * @param {Object} [details] - Additional details
 */
function sendError(res, status, message, details = {}) {
  logger.warn('API error response', { status, message, ...details });
  res.status(status).json({
    error: message,
    ...details,
    timestamp: new Date().toISOString(),
  });
}

/**
 * GET /api/sessions
 * List all active sessions
 */
router.get('/', async (req, res) => {
  try {
    const sessions = await openclawService.getSessions();
    
    res.json({
      sessions,
      count: sessions.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    sendError(res, 500, 'Failed to fetch sessions', { error: error.message });
  }
});

/**
 * GET /api/sessions/:key/status
 * Get session status and metrics
 */
router.get('/:key/status', async (req, res) => {
  try {
    const { key } = req.params;
    const status = await openclawService.getSessionStatus(key);
    
    res.json(status);
  } catch (error) {
    const status = error.message.includes('Invalid session') ? 400 : 500;
    sendError(res, status, error.message);
  }
});

/**
 * GET /api/sessions/:key/history
 * Get message history for session
 * Query params:
 *   - limit: number of messages (default 10, max 100)
 */
router.get('/:key/history', async (req, res) => {
  try {
    const { key } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    
    if (limit < 1 || limit > 100) {
      return sendError(res, 400, 'Limit must be between 1 and 100');
    }
    
    const messages = await openclawService.getSessionHistory(key, limit);
    
    res.json({
      sessionKey: key,
      messages,
      count: messages.length,
      limit,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const status = error.message.includes('Invalid') ? 400 : 500;
    sendError(res, status, error.message);
  }
});

/**
 * POST /api/sessions/:key/send
 * Send message to session
 * Body: { message: string }
 */
router.post('/:key/send', async (req, res) => {
  try {
    const { key } = req.params;
    const { message } = req.body;
    
    if (!message) {
      return sendError(res, 400, 'Message is required');
    }
    
    await openclawService.sendMessage(key, message);
    
    res.json({
      success: true,
      sessionKey: key,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const status = error.message.includes('Invalid') || error.message.includes('too long') 
      ? 400 
      : 500;
    sendError(res, status, error.message);
  }
});

module.exports = router;
