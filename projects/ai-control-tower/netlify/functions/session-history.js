// Netlify Function: GET /api/session-history?sessionKey=xxx
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Mock history fallback
const mockHistory = {
  "main-20260206": [
    {
      role: "user",
      content: "What's the status of all my apps?",
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
    },
    {
      role: "assistant",
      content: "All 3 apps are deployed and live:\n1. Control Tower\n2. TPUSA Intel\n3. Scholarship Hunt",
      timestamp: new Date(Date.now() - 9 * 60 * 1000).toISOString()
    }
  ]
};

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

  const sessionKey = event.queryStringParameters?.sessionKey;
  
  if (!sessionKey) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'sessionKey parameter required' })
    };
  }

  try {
    // Try OpenClaw CLI
    const { stdout } = await execAsync(`openclaw sessions history ${sessionKey} --json`, {
      timeout: 5000
    });

    const data = JSON.parse(stdout || '{"messages":[]}');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        messages: data.messages || [],
        sessionKey,
        source: 'live',
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    // Fallback to mock data
    console.log('Using mock history (OpenClaw CLI not available)');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        messages: mockHistory[sessionKey] || [],
        sessionKey,
        source: 'mock',
        timestamp: new Date().toISOString()
      })
    };
  }
};
