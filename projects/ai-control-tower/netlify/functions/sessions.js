// Netlify Function: GET /api/sessions
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

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
    // Execute OpenClaw CLI command
    const { stdout } = await execAsync('openclaw sessions list --json', {
      timeout: 10000
    });

    const data = JSON.parse(stdout || '{"sessions":[]}');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessions: data.sessions || [],
        count: (data.sessions || []).length,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error fetching sessions:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch sessions',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
