# 🎯 AI Agent Control Tower

**Real-time monitoring and control dashboard for OpenClaw AI agents**

[![Status](https://img.shields.io/badge/status-production--ready-success)](https://github.com/brianference/workspace)
[![Version](https://img.shields.io/badge/version-2.0.0-blue)](package.json)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 🌟 Features

### Current (v2.0)
- ✅ **Real-time session monitoring** - Track all active OpenClaw sessions
- ✅ **Message history** - View conversation logs for any session
- ✅ **Session metrics** - Token usage, context percentage, model info
- ✅ **Dark/Light mode** - Persistent theme toggle
- ✅ **Production-ready backend** - Security hardened Node.js API
- ✅ **Rate limiting** - Protection against abuse (100 req/15min)
- ✅ **Structured logging** - JSON logs for monitoring integration
- ✅ **Health checks** - `/api/health` endpoint for monitoring
- ✅ **Graceful shutdown** - Clean process termination

### Coming Soon (v2.1)
- 🔄 **WebSocket real-time updates** - Live session changes without polling
- 🔄 **Advanced filtering** - Search sessions by model, tokens, time
- 🔄 **Session control** - Spawn new sessions, send commands
- 🔄 **Authentication** - Secure access with API keys
- 🔄 **Dashboard widgets** - Customizable dashboard layout
- 🔄 **Export functionality** - Download session logs as JSON/CSV

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- OpenClaw installed and running
- npm or yarn

### Installation

```bash
# Clone repo
git clone https://github.com/brianference/workspace.git
cd workspace/projects/ai-control-tower

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start development server
npm run dev

# Or production server
npm start
```

Visit: `http://localhost:3000`

---

## 📡 API Documentation

### Base URL
```
Production: https://your-railway-app.railway.app
Local: http://localhost:3000
```

### Endpoints

#### Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "ok",
  "version": "2.0.0",
  "uptime": 12345.67,
  "timestamp": "2026-02-06T18:27:58.956Z",
  "environment": "production"
}
```

#### List Sessions
```http
GET /api/sessions
```
**Response:**
```json
{
  "sessions": [
    {
      "key": "main-session",
      "displayName": "Main Session",
      "kind": "active",
      "model": "anthropic/claude-sonnet-4-5",
      "totalTokens": 15000,
      "contextTokens": 12000
    }
  ],
  "count": 1,
  "timestamp": "2026-02-06T18:30:00.000Z"
}
```

#### Get Session Status
```http
GET /api/sessions/:key/status
```

#### Get Session History
```http
GET /api/sessions/:key/history?limit=20
```
**Query params:**
- `limit` (optional): Number of messages (1-100, default 10)

#### Send Message to Session
```http
POST /api/sessions/:key/send
Content-Type: application/json

{
  "message": "Hello from Control Tower"
}
```

---

## 🏗️ Architecture

### Tech Stack
- **Backend:** Node.js, Express
- **Frontend:** Vanilla JavaScript (no framework overhead)
- **Logging:** Winston-style structured logging
- **Security:** Helmet, CORS, rate-limiting

### Project Structure
```
src/
├── server.js               # Express app entry point
├── config.js               # Centralized configuration
├── lib/
│   └── logger.js           # Structured logging
├── services/
│   └── openclaw.service.js # OpenClaw CLI wrapper
└── routes/
    └── sessions.routes.js  # API route handlers

public/
└── index.html              # Frontend SPA
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```bash
# Server
NODE_ENV=production
PORT=3000

# OpenClaw
OPENCLAW_BIN=openclaw

# Security
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX=100           # requests per window
CLI_TIMEOUT_MS=30000         # 30 seconds

# CORS
CORS_ORIGIN=*               # Set to specific domain in production
```

### package.json Scripts

```json
{
  "start": "NODE_ENV=production node src/server.js",
  "dev": "NODE_ENV=development nodemon src/server.js",
  "test": "jest --coverage",
  "lint": "eslint src/**/*.js",
  "security-audit": "npm audit && node scripts/security-check.js"
}
```

---

## 🚢 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for full deployment instructions.

### Railway (Recommended)
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Netlify (Frontend Only)
```bash
netlify deploy --prod --dir=public
```

### Docker (Coming Soon)
```bash
docker build -t ai-control-tower .
docker run -p 3000:3000 --env-file .env ai-control-tower
```

---

## 🔐 Security Features

- ✅ **Helmet.js** - Security headers (XSS, clickjacking, etc.)
- ✅ **CORS** - Configurable cross-origin policies
- ✅ **Rate Limiting** - Per-IP request throttling
- ✅ **Input Validation** - All API inputs sanitized
- ✅ **Timeout Protection** - Prevents long-running requests
- ✅ **Safe Error Messages** - No stack traces in production
- ✅ **Graceful Shutdown** - Clean process termination

### Security Checklist
- [ ] Set `CORS_ORIGIN` to specific domains
- [ ] Enable CSP in helmet config
- [ ] Add authentication middleware
- [ ] Set up monitoring/alerting
- [ ] Regular `npm audit` checks
- [ ] Rotate API keys if implemented

---

## 📊 Monitoring & Logging

Logs are JSON-formatted for easy parsing:

```json
{
  "timestamp": "2026-02-06T18:27:58.956Z",
  "level": "info",
  "message": "HTTP request",
  "method": "GET",
  "path": "/api/sessions",
  "status": 200,
  "duration": "45ms",
  "ip": "192.168.1.1"
}
```

Integrate with:
- Railway logs (built-in)
- CloudWatch, Datadog, Logtail
- Custom log aggregation

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Lint code
npm run lint

# Security audit
npm run security-audit
```

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check OpenClaw is installed
openclaw --version

# Verify port is available
lsof -i :3000

# Check environment variables
node -e "console.log(require('./src/config'))"
```

### API errors
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Check OpenClaw status
openclaw status

# View logs
tail -f logs/app.log
```

### Frontend can't connect
1. Verify `API_BASE` in `public/index.html`
2. Check CORS_ORIGIN allows your domain
3. Test API directly with curl

---

## 🤝 Contributing

This project is part of the OpenClaw ecosystem.

**Improvements welcome:**
- Bug fixes
- Performance optimizations
- New features
- Documentation updates

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file

---

## 🎯 Roadmap

### v2.1 (Next)
- WebSocket support for real-time updates
- Authentication & authorization
- Advanced filtering & search
- Session spawning from UI

### v2.2 (Future)
- Dashboard customization
- Alert notifications
- Export/import functionality
- Multi-user support

### v3.0 (Vision)
- Agent marketplace integration
- Visual workflow builder
- Team collaboration features
- Analytics & insights

---

**Built by:** Cole AI ⚡  
**Repository:** https://github.com/brianference/workspace  
**Demo:** https://swordtruth-control-tower.netlify.app (static frontend)  
**Documentation:** See [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/brianference/workspace/issues)
- **Discussions:** OpenClaw Discord
- **Email:** cole@swordtruth.ai

---

**⭐ Star this repo if you find it useful!**
