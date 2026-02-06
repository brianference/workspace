const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);
const DATA_FILE = path.join(__dirname, '../../data/intel-data.json');

// Rate limiting
const scanQueue = new Map();
const SCAN_COOLDOWN = 60000; // 1 minute between scans per target

async function scanTikTok(targetId, handle) {
  try {
    // Use agent-browser to scrape TikTok profile
    const url = `https://www.tiktok.com/@${handle.replace('@', '')}`;
    
    // Open page and get snapshot
    await execPromise(`agent-browser open "${url}"`);
    await execPromise(`agent-browser wait 2000`); // Wait for load
    
    // Get page snapshot to extract video data
    const { stdout } = await execPromise(`agent-browser snapshot -i --json`);
    
    // Close browser
    await execPromise(`agent-browser close`);

    // Parse snapshot and extract video links
    // Note: TikTok requires authentication for full access
    // This is a MVP that shows structure - need authenticated session
    const snapshot = JSON.parse(stdout);
    
    // Extract video data from snapshot (simplified)
    const videos = [];
    // TODO: Parse snapshot for video elements and extract:
    // - videoId, title, thumbnail, views, likes, shares, comments, timestamp
    
    return videos;
  } catch (error) {
    console.error('TikTok scan error:', error);
    throw new Error(`Failed to scan TikTok: ${error.message}`);
  }
}

async function scanTwitter(targetId, handle) {
  try {
    // Use agent-browser to scrape X/Twitter profile
    const url = `https://twitter.com/${handle.replace('@', '')}`;
    
    // Open page and get snapshot
    await execPromise(`agent-browser open "${url}"`);
    await execPromise(`agent-browser wait 2000`);
    
    // Get page snapshot
    const { stdout } = await execPromise(`agent-browser snapshot -i --json`);
    
    // Close browser
    await execPromise(`agent-browser close`);

    // Parse snapshot and extract tweets
    // Note: Twitter requires authentication for full access
    const snapshot = JSON.parse(stdout);
    
    const tweets = [];
    // TODO: Parse snapshot for tweet elements and extract data
    
    return tweets;
  } catch (error) {
    console.error('Twitter scan error:', error);
    throw new Error(`Failed to scan Twitter: ${error.message}`);
  }
}

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const { targetId, platform } = JSON.parse(event.body || '{}');

    if (!targetId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'targetId required' })
      };
    }

    // Check rate limit
    const queueKey = `${targetId}-${platform}`;
    const lastScan = scanQueue.get(queueKey);
    
    if (lastScan && Date.now() - lastScan < SCAN_COOLDOWN) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ 
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((SCAN_COOLDOWN - (Date.now() - lastScan)) / 1000)
        })
      };
    }

    // Read current data
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const intel = JSON.parse(data);

    // Find target
    const target = intel.targets.find(t => t.id === targetId);
    if (!target) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Target not found' })
      };
    }

    // Perform scan based on platform
    let newContent = [];
    
    if (platform === 'tiktok' || target.platform === 'tiktok') {
      newContent = await scanTikTok(targetId, target.handle);
    } else if (platform === 'twitter' || target.platform === 'twitter') {
      newContent = await scanTwitter(targetId, target.handle);
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid platform' })
      };
    }

    // Update intel data
    intel.content = [...intel.content, ...newContent];
    target.lastScanned = new Date().toISOString();
    target.contentCount += newContent.length;

    // Save updated data
    await fs.writeFile(DATA_FILE, JSON.stringify(intel, null, 2));

    // Update rate limit
    scanQueue.set(queueKey, Date.now());

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        targetId,
        platform: platform || target.platform,
        newContent: newContent.length,
        lastScanned: target.lastScanned
      })
    };
  } catch (error) {
    console.error('Scan error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Scan failed',
        message: error.message 
      })
    };
  }
};
