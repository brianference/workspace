// In-memory data store (MVP - migrate to database later)
const DEFAULT_TARGETS = [
  { id: "erica-kirk", name: "Erica Kirk", platform: "tiktok", handle: "@ericakirk", lastScanned: null, contentCount: 0 },
  { id: "tyler-bowyer", name: "Tyler Bowyer", platform: "tiktok", handle: "@tylerbowyer", lastScanned: null, contentCount: 0 },
  { id: "andrew-kolvet", name: "Andrew Kolvet", platform: "tiktok", handle: "@andrewkolvet", lastScanned: null, contentCount: 0 },
  { id: "charlie-kirk", name: "Charlie Kirk", platform: "tiktok", handle: "@charliekirk", lastScanned: null, contentCount: 0 }
];

let contentStore = [];

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
    // Calculate stats
    const content = contentStore;
    const targets = DEFAULT_TARGETS;

    // Total engagement
    const totalEngagement = content.reduce((sum, item) => {
      return sum + (item.likes || 0) + (item.shares || 0) + (item.comments || 0);
    }, 0);

    // Content by platform
    const platformBreakdown = content.reduce((acc, item) => {
      acc[item.platform] = (acc[item.platform] || 0) + 1;
      return acc;
    }, {});

    // Recent activity (last 24h)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentContent = content.filter(item => 
      new Date(item.timestamp) > yesterday
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        stats: {
          totalTargets: targets.length,
          totalContent: content.length,
          totalEngagement,
          recentContent: recentContent.length,
          platformBreakdown,
          lastUpdate: new Date().toISOString()
        }
      })
    };
  } catch (error) {
    console.error('Error calculating stats:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to calculate stats' })
    };
  }
};
