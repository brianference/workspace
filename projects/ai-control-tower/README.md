# AI Agent Control Tower v2.0

**Production-ready monitoring and control dashboard for OpenClaw AI agents.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

## Features

### ✅ Current (v2.0)
- **Live Session Monitoring** - Real-time visibility into all active OpenClaw agents
- **Token Usage Tracking** - Monitor token consumption and costs
- **Message History** - View conversation history for any session
- **RESTful API** - Well-documented endpoints for integration
- **Rate Limiting** - Prevent abuse with configurable limits
- **Security Hardened** - Helmet, CORS, input validation
- **Production Ready** - Structured logging, error handling, graceful shutdown

### 🚧 Roadmap
- [ ] WebSocket real-time updates (eliminate polling)
- [ ] Cost tracking with pricing API integration
- [ ] Agent spawn/kill controls
- [ ] Budget alerts (email/Telegram)
- [ ] Multi-user authentication
- [ ] Database persistence (PostgreSQL)

## Architecture

```
src/
├── config.js                 # Centralized configuration
├── server.js                 # Main Express server
├── lib/
│   └── logger.js            # Production-safe logging
├── services/
│   └── openclaw.service.js  # OpenClaw CLI wrapper
└── routes/
    └── sessions.routes.js   # API endpoints
```

## Requirements

- Node.js >= 18.0.0
- OpenClaw CLI installed and in PATH
- npm >= 8.0.0

## Installation

```bash
# Clone repository
git clone https://github.com/brianference/workspace.git
cd workspace/projects/ai-control-tower

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit configuration
vim .env
```

## Configuration

See `.env.example` for all available options.

**Key settings:**

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `NODE_ENV` | development | Environment (development/production) |
| `CORS_ORIGIN` | * | Allowed CORS origins |
| `LOG_LEVEL` | info | Logging verbosity |

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Testing
```bash
npm test
```

### Security Audit
```bash
npm run security-audit
```

## API Endpoints

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "version": "2.0.0",
  "uptime": 12345.67,
  "timestamp": "2026-02-06T18:00:00.000Z",
  "environment": "production"
}
```

### GET /api/sessions
List all active sessions.

**Response:**
```json
{
  "sessions": [{
    "key": "agent:main:main",
    "kind": "direct",
    "model": "claude-sonnet-4-5",
    "totalTokens": 98000,
    "contextTokens": 1000000
  }],
  "count": 1,
  "timestamp": "2026-02-06T18:00:00.000Z"
}
```

### GET /api/sessions/:key/status
Get detailed status for a specific session.

**Parameters:**
- `key` (string, required) - Session key

**Response:**
```json
{
  "key": "agent:main:main",
  "model": "claude-sonnet-4-5",
  "totalTokens": 98000,
  "contextTokens": 1000000,
  "updatedAt": 1738851600000
}
```

### GET /api/sessions/:key/history
Get message history for a session.

**Parameters:**
- `key` (string, required) - Session key  
- `limit` (integer, optional) - Number of messages (1-100, default 10)

**Response:**
```json
{
  "sessionKey": "agent:main:main",
  "messages": [{
    "role": "user",
    "content": "Hello"
  }],
  "count": 1,
  "limit": 10,
  "timestamp": "2026-02-06T18:00:00.000Z"
}
```

### POST /api/sessions/:key/send
Send a message to a session.

**Parameters:**
- `key` (string, required) - Session key

**Body:**
```json
{
  "message": "Your message here"
}
```

**Response:**
```json
{
  "success": true,
  "sessionKey": "agent:main:main",
  "timestamp": "2026-02-06T18:00:00.000Z"
}
```

## Security

### Built-in Protections
- ✅ Rate limiting (100 requests/15 min by default)
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Input validation
- ✅ No secrets in logs
- ✅ Graceful error handling

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper `CORS_ORIGIN`
- [ ] Use HTTPS (reverse proxy recommended)
- [ ] Set up authentication
- [ ] Configure rate limits for your use case
- [ ] Monitor logs for suspicious activity
- [ ] Regular security audits (`npm run security-audit`)

## Deployment

### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### PM2 (Self-hosted)
```bash
npm install -g pm2
pm2 start src/server.js --name control-tower
pm2 save
pm2 startup
```

## Development

### Code Style
- ES6+ JavaScript
- JSDoc comments for all functions
- Modular architecture
- Service layer pattern
- Error-first callbacks

### Adding Features
1. Create service in `src/services/`
2. Add routes in `src/routes/`
3. Update config if needed
4. Write tests
5. Update README

### Testing
```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Troubleshooting

### "OpenClaw CLI error"
**Cause:** OpenClaw not in PATH or not installed  
**Solution:** Install OpenClaw or set `OPENCLAW_BIN` in .env

### "Rate limit exceeded"
**Cause:** Too many requests  
**Solution:** Increase `rateLimitMax` in config or wait

### Port already in use
**Cause:** Port 3000 already occupied  
**Solution:** Change `PORT` in .env or kill existing process

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and lint
5. Submit a pull request

## License

MIT © 2026 Cole AI

## Links

- **GitHub:** https://github.com/brianference/workspace/tree/master/projects/ai-control-tower
- **OpenClaw:** https://openclaw.ai
- **Live Demo:** https://swordtruth-control-tower.netlify.app (static version)

## Support

For issues, questions, or feature requests:
- GitHub Issues: https://github.com/brianference/workspace/issues
- Telegram: @swordtruth
