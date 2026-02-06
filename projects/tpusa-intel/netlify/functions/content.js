const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/intel-data.json');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Only allow GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Read data file
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const intel = JSON.parse(data);

    // Parse query params
    const params = event.queryStringParameters || {};
    const target = params.target;
    const platform = params.platform;
    const limit = parseInt(params.limit) || 50;

    // Filter content
    let content = intel.content || [];
    
    if (target) {
      content = content.filter(item => item.targetId === target);
    }
    
    if (platform) {
      content = content.filter(item => item.platform === platform);
    }

    // Sort by date descending and limit
    content = content
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        content,
        total: content.length,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error reading content:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to load content' })
    };
  }
};
