/**
 * OpenClaw Service
 * Wraps OpenClaw CLI commands with error handling and validation
 * @module services/openclaw
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const logger = require('../lib/logger');
const config = require('../config');

const execAsync = promisify(exec);

/**
 * Execute OpenClaw CLI command
 * @param {string} command - Command to execute
 * @param {number} [timeout] - Timeout in ms
 * @returns {Promise<string>} - Command output
 * @throws {Error} If command fails or times out
 */
async function execOpenClaw(command, timeout = config.cliTimeout) {
  const fullCommand = `${config.openclawBin} ${command}`;
  
  logger.debug('Executing OpenClaw command', { command: fullCommand });
  
  try {
    const { stdout, stderr } = await execAsync(fullCommand, { timeout });
    
    if (stderr && !stderr.includes('warning')) {
      logger.warn('OpenClaw stderr output', { stderr });
    }
    
    return stdout.trim();
  } catch (error) {
    logger.error('OpenClaw command failed', {
      command: fullCommand,
      error: error.message,
      code: error.code,
    });
    throw new Error(`OpenClaw CLI error: ${error.message}`);
  }
}

/**
 * Parse JSON output from OpenClaw
 * @param {string} output - JSON string
 * @returns {Object} - Parsed object
 * @throws {Error} If JSON is invalid
 */
function parseJSON(output) {
  try {
    return JSON.parse(output);
  } catch (error) {
    logger.error('Failed to parse OpenClaw JSON output', { output });
    throw new Error('Invalid JSON response from OpenClaw');
  }
}

/**
 * Get all active sessions
 * @returns {Promise<Array>} - Array of session objects
 */
async function getSessions() {
  try {
    const output = await execOpenClaw('sessions list --json');
    const data = parseJSON(output || '{"sessions":[]}');
    
    return Array.isArray(data.sessions) ? data.sessions : [];
  } catch (error) {
    logger.error('Failed to fetch sessions', { error: error.message });
    return [];
  }
}

/**
 * Get session status
 * @param {string} sessionKey - Session key
 * @returns {Promise<Object>} - Session status
 * @throws {Error} If session not found
 */
async function getSessionStatus(sessionKey) {
  if (!sessionKey || typeof sessionKey !== 'string') {
    throw new Error('Invalid session key');
  }
  
  const output = await execOpenClaw(`sessions status "${sessionKey}" --json`);
  return parseJSON(output || '{}');
}

/**
 * Get session message history
 * @param {string} sessionKey - Session key
 * @param {number} [limit=10] - Number of messages
 * @returns {Promise<Array>} - Array of message objects
 */
async function getSessionHistory(sessionKey, limit = 10) {
  if (!sessionKey || typeof sessionKey !== 'string') {
    throw new Error('Invalid session key');
  }
  
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new Error('Limit must be between 1 and 100');
  }
  
  const output = await execOpenClaw(`sessions history "${sessionKey}" --limit ${limit} --json`);
  const data = parseJSON(output || '[]');
  
  return Array.isArray(data) ? data : [];
}

/**
 * Send message to session
 * @param {string} sessionKey - Session key
 * @param {string} message - Message to send
 * @returns {Promise<void>}
 * @throws {Error} If send fails
 */
async function sendMessage(sessionKey, message) {
  if (!sessionKey || typeof sessionKey !== 'string') {
    throw new Error('Invalid session key');
  }
  
  if (!message || typeof message !== 'string' || message.length === 0) {
    throw new Error('Message cannot be empty');
  }
  
  if (message.length > 10000) {
    throw new Error('Message too long (max 10000 characters)');
  }
  
  // Escape quotes in message
  const escapedMessage = message.replace(/"/g, '\\"');
  
  await execOpenClaw(`sessions send "${sessionKey}" "${escapedMessage}"`);
  logger.info('Message sent to session', { sessionKey, messageLength: message.length });
}

module.exports = {
  getSessions,
  getSessionStatus,
  getSessionHistory,
  sendMessage,
};
