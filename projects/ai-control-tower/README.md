# AI Agent Control Tower - MVP

**Live monitoring and control for OpenClaw AI agents.**

## Features (MVP)

✅ **Live Session Monitoring** - Real-time view of all active OpenClaw sessions
✅ **Token Usage Dashboard** - Track token consumption across all agents
✅ **Session History Viewer** - See conversation history for any session
✅ **Auto-refresh** - Updates every 10 seconds
✅ **Session Details** - Model info, context usage, token counts

## Architecture

- **Backend:** Node.js + Express (wraps OpenClaw CLI)
- **Frontend:** Vanilla JS + HTML/CSS (no build step)
- **API:** REST endpoints for session data
- **Refresh:** Polling every 10s (WebSockets coming in v2)

## Quick Start

### Install Dependencies
```bash
npm install
```

### Start Backend
```bash
node server.js
# Runs on http://localhost:3000
```

### Open Frontend
```bash
open app.html
# Or visit http://localhost:3000/app.html
```

## API Endpoints

### GET /api/health
Health check

### GET /api/sessions  
List all active sessions

Response:
```json
{
  "sessions": [{
    "key": "agent:main:main",
    "kind": "direct",
    "model": "claude-sonnet-4-5",
    "totalTokens": 98000,
    "contextTokens": 1000000
  }],
  "timestamp": 1234567890
}
```

### GET /api/sessions/:key/status
Get detailed status for a session

### GET /api/sessions/:key/history?limit=10
Get message history for a session

### POST /api/sessions/:key/send
Send message to a session

Body:
```json
{
  "message": "Your message here"
}
```

## Deployment

### Option 1: Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 2: Netlify Functions
Convert `server.js` endpoints to Netlify Functions (see `/netlify/functions/`)

### Option 3: Self-hosted
```bash
# Use PM2 for production
npm install -g pm2
pm2 start server.js --name control-tower
pm2 save
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `OPENCLAW_PATH` - Path to openclaw CLI (auto-detected)

## Roadmap

### Phase 2
- [ ] WebSocket support for real-time updates
- [ ] Cost tracking with pricing API integration
- [ ] Agent spawn/kill controls
- [ ] Budget alerts

### Phase 3
- [ ] Multi-user workspaces
- [ ] Cost allocation by user/project
- [ ] Agent templates
- [ ] Approval workflows

### Phase 4
- [ ] Agent marketplace
- [ ] Skill library integration
- [ ] White-label option

## Tech Stack

- **Backend:** Node.js 22+, Express 4
- **Frontend:** Vanilla JS (ES6+), no framework
- **Styling:** Custom CSS (dark theme)
- **Icons:** Emoji (no dependencies)

## Security

⚠️ **This MVP has no authentication.** 

For production use:
- Add JWT authentication
- Rate limiting
- HTTPS only
- Environment-based secrets

## License

MIT

## Links

- **Live Demo:** https://swordtruth-control-tower.netlify.app (static version)
- **GitHub:** https://github.com/brianference/workspace/tree/master/projects/ai-control-tower
- **OpenClaw:** https://openclaw.ai
