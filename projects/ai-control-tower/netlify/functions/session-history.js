// Netlify Function: GET /api/sessions/:key/history
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Extract session key from path
    const sessionKey = event.queryStringParameters.key;
    const limit = parseInt(event.queryStringParameters.limit) || 20;

    if (!sessionKey) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Session key required',
          timestamp: new Date().toISOString()
        })
      };
    }

    // Execute OpenClaw CLI command
    const { stdout } = await execAsync(
      `openclaw sessions history "${sessionKey}" --limit ${limit} --json`,
      { timeout: 10000 }
    );

    const messages = JSON.parse(stdout || '[]');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionKey,
        messages,
        count: messages.length,
        limit,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error fetching history:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch history',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
