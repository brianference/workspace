// Default data (in-memory for MVP)
const DEFAULT_DATA = {
  targets: [
    {
      id: "erica-kirk",
      name: "Erica Kirk",
      platform: "tiktok",
      handle: "@ericakirk",
      lastScanned: null,
      contentCount: 0
    },
    {
      id: "tyler-bowyer",
      name: "Tyler Bowyer",
      platform: "tiktok",
      handle: "@tylerbowyer",
      lastScanned: null,
      contentCount: 0
    },
    {
      id: "andrew-kolvet",
      name: "Andrew Kolvet",
      platform: "tiktok",
      handle: "@andrewkolvet",
      lastScanned: null,
      contentCount: 0
    },
    {
      id: "charlie-kirk",
      name: "Charlie Kirk",
      platform: "tiktok",
      handle: "@charliekirk",
      lastScanned: null,
      contentCount: 0
    }
  ],
  content: []
};

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
    // Use in-memory data (MVP - migrate to database later)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        targets: DEFAULT_DATA.targets,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error loading targets:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to load targets' })
    };
  }
};
