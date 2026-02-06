# TPUSA Intel Aggregator

Automated TikTok/X content scanner for tracking TPUSA-related content.

## Features

- **Real-time content scanning** - Uses agent-browser to scrape TikTok/X
- **Target tracking** - Monitor specific people/accounts
- **Engagement metrics** - Likes, shares, comments tracking
- **Platform filtering** - Filter by TikTok or X/Twitter
- **Dark mode** - Light/dark theme toggle
- **Mobile-first UI** - Responsive design with glassmorphism
- **Netlify Functions backend** - Serverless API endpoints

## Architecture

### Frontend
- Static HTML/CSS/JS hosted on Netlify
- Modern UI with glassmorphism and gradients
- Real-time stats and content feed
- Filter chips for platform/time filtering

### Backend (Netlify Functions)
- `functions/targets.js` - GET tracked targets
- `functions/content.js` - GET scraped content (with filters)
- `functions/stats.js` - GET aggregate statistics
- `functions/scan.js` - POST trigger scan for target

### Data Storage
- `data/intel-data.json` - JSON file storing targets and content
- Rate limiting: 1 scan per target per minute
- Content sorted by timestamp (newest first)

### Browser Automation
- Uses `agent-browser` CLI (Playwright-based)
- Snapshots interactive elements from TikTok/X pages
- Extracts video/tweet data from page structure
- **Note**: Requires authenticated browser session for full access

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Install agent-browser CLI

```bash
npm install -g agent-browser
```

### 3. Configure Authentication

For full functionality, you need authenticated browser sessions:

#### Option A: Browser Relay (Recommended)
- Use OpenClaw's browser relay feature
- Attach Chrome tab with extension
- Provides authenticated TikTok/X access

#### Option B: Manual Login
- Use `agent-browser` to login and save state
- Save cookies/session storage
- Reuse in scan functions

### 4. Deploy to Netlify

```bash
# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

## API Endpoints

### GET /api/targets
Returns list of tracked targets.

**Response:**
```json
{
  "targets": [
    {
      "id": "erica-kirk",
      "name": "Erica Kirk",
      "platform": "tiktok",
      "handle": "@ericakirk",
      "lastScanned": "2026-02-06T20:30:00Z",
      "contentCount": 12
    }
  ],
  "timestamp": "2026-02-06T20:45:00Z"
}
```

### GET /api/content
Returns scraped content with optional filters.

**Query params:**
- `target` - Filter by target ID
- `platform` - Filter by platform (tiktok/twitter)
- `limit` - Max results (default: 50)

**Response:**
```json
{
  "content": [
    {
      "id": "video-123",
      "targetId": "erica-kirk",
      "platform": "tiktok",
      "author": "Erica Kirk",
      "title": "Video title",
      "thumbnail": "https://...",
      "videoUrl": "https://...",
      "views": 10000,
      "likes": 500,
      "shares": 50,
      "comments": 100,
      "timestamp": "2026-02-06T10:00:00Z"
    }
  ],
  "total": 1,
  "timestamp": "2026-02-06T20:45:00Z"
}
```

### GET /api/stats
Returns aggregate statistics.

**Response:**
```json
{
  "stats": {
    "totalTargets": 4,
    "totalContent": 45,
    "totalEngagement": 12000,
    "recentContent": 5,
    "platformBreakdown": {
      "tiktok": 30,
      "twitter": 15
    },
    "lastUpdate": "2026-02-06T20:45:00Z"
  }
}
```

### POST /api/scan
Triggers a scan for a specific target.

**Request body:**
```json
{
  "targetId": "erica-kirk",
  "platform": "tiktok"
}
```

**Response:**
```json
{
  "success": true,
  "targetId": "erica-kirk",
  "platform": "tiktok",
  "newContent": 3,
  "lastScanned": "2026-02-06T20:45:00Z"
}
```

**Rate limiting:** 1 scan per target per minute (429 if exceeded).

## Development

### Local Testing

```bash
# Start Netlify Dev server
netlify dev
```

This runs the frontend on `http://localhost:8888` and functions on `http://localhost:8888/.netlify/functions/*`.

### Adding New Targets

Edit `data/intel-data.json`:

```json
{
  "targets": [
    {
      "id": "new-target",
      "name": "New Target Name",
      "platform": "tiktok",
      "handle": "@newtarget",
      "lastScanned": null,
      "contentCount": 0
    }
  ]
}
```

## Security

- CORS headers configured for cross-origin access
- Rate limiting on scan endpoint (1/min per target)
- Input validation on all endpoints
- CSP headers in netlify.toml
- No tokens/secrets in frontend code

## Limitations

### Current
- **Authentication required** - TikTok/X need logged-in sessions
- **No persistence** - Data stored in JSON file (resets on deploy)
- **Basic scraping** - Simple snapshot parsing (needs refinement)
- **No scheduling** - Manual scan triggers only

### Planned Improvements
1. **Database integration** - Move from JSON to Supabase/PostgreSQL
2. **Authenticated sessions** - Browser Relay or saved state
3. **Scheduled scans** - Cron job to scan targets every N hours
4. **Advanced parsing** - Better video/tweet data extraction
5. **Notifications** - Alert when new content found
6. **Download/repost** - Auto-download videos and post to X

## Deployment URL

**Production:** https://swordtruth-tpusa-intel.netlify.app

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS (mobile-first, glassmorphism)
- **Backend:** Netlify Functions (Node.js, serverless)
- **Browser:** agent-browser CLI (Playwright-based)
- **Hosting:** Netlify (static + functions)
- **Storage:** JSON file (MVP, migrate to database later)

## License

Private project for @swordtruth
