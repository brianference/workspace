#!/usr/bin/env node
/**
 * AI Agent Control Tower - Backend Server
 * Integrates with OpenClaw via CLI commands
 */

const express = require('express');
const { exec } = require('child_process');
const { promisify } = require('util');
const cors = require('cors');

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Cache for session data
let sessionsCache = [];
let lastUpdate = 0;
const CACHE_TTL = 5000; // 5 seconds

/**
 * Get all active sessions from OpenClaw
 */
async function getActiveSessions() {
  const now = Date.now();
  if (sessionsCache.length && (now - lastUpdate) < CACHE_TTL) {
    return sessionsCache;
  }

  try {
    // Call OpenClaw CLI to get sessions
    const { stdout } = await execAsync('openclaw sessions list --json 2>/dev/null || echo "[]"');
    const sessions = JSON.parse(stdout || '[]');
    
    sessionsCache = sessions;
    lastUpdate = now;
    return sessions;
  } catch (error) {
    console.error('Failed to fetch sessions:', error.message);
    return [];
  }
}

/**
 * Get session status (token usage, etc)
 */
async function getSessionStatus(sessionKey) {
  try {
    const { stdout } = await execAsync(`openclaw sessions status ${sessionKey} --json 2>/dev/null || echo "{}"`);
    return JSON.parse(stdout || '{}');
  } catch (error) {
    console.error('Failed to fetch session status:', error.message);
    return {};
  }
}

/**
 * Get session history
 */
async function getSessionHistory(sessionKey, limit = 10) {
  try {
    const { stdout } = await execAsync(`openclaw sessions history ${sessionKey} --limit ${limit} --json 2>/dev/null || echo "[]"`);
    return JSON.parse(stdout || '[]');
  } catch (error) {
    console.error('Failed to fetch session history:', error.message);
    return [];
  }
}

// Routes

app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await getActiveSessions();
    res.json({ sessions, timestamp: Date.now() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/sessions/:key/status', async (req, res) => {
  try {
    const status = await getSessionStatus(req.params.key);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/sessions/:key/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const history = await getSessionHistory(req.params.key, limit);
    res.json({ messages: history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sessions/:key/send', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }
    
    const escapedMessage = message.replace(/"/g, '\\"');
    await execAsync(`openclaw sessions send ${req.params.key} "${escapedMessage}"`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎯 AI Agent Control Tower API running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
