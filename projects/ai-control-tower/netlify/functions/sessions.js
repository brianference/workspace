// Netlify Function: GET /api/sessions
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Mock data fallback when OpenClaw CLI isn't available
const mockSessions = [
  {
    sessionKey: "main-20260206",
    kind: "main",
    label: "Main Session",
    model: "claude-sonnet-4-5",
    messageCount: 142,
    tokenCount: 45230,
    lastActiveAt: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  },
  {
    sessionKey: "iso-morning-briefing",
    kind: "isolated",
    label: "Morning Briefing",
    model: "claude-sonnet-4-5",
    messageCount: 8,
    tokenCount: 3420,
    lastActiveAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    sessionKey: "iso-build-task",
    kind: "isolated",
    label: "Nightly Build",
    model: "opus-4-6",
    messageCount: 24,
    tokenCount: 18950,
    lastActiveAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  }
];

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Try to execute OpenClaw CLI command
    const { stdout } = await execAsync('openclaw sessions list --json', {
      timeout: 5000
    });

    const data = JSON.parse(stdout || '{"sessions":[]}');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessions: data.sessions || [],
        count: (data.sessions || []).length,
        source: 'live',
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    // Fallback to mock data
    console.log('Using mock data (OpenClaw CLI not available)');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessions: mockSessions,
        count: mockSessions.length,
        source: 'mock',
        timestamp: new Date().toISOString()
      })
    };
  }
};
