# AI Agent Control Tower - Deployment Guide

## ✅ Build Status: COMPLETE

**Commit:** db55cb7  
**Date:** 2026-02-06 11:28 MST  
**Repository:** https://github.com/brianference/workspace  

---

## 🏗️ Architecture

**Backend:** Node.js + Express  
**Frontend:** Vanilla JS (production-ready, static)  
**Hosting:** Railway (backend) + Netlify (static frontend fallback)  

### Production Features Implemented ✅

#### Security
- ✅ Helmet.js (security headers)
- ✅ CORS with configurable origins
- ✅ Rate limiting (100 req/15min per IP)
- ✅ Input validation & sanitization
- ✅ Error handling with safe error messages
- ✅ Request timeout protection
- ✅ JSON body size limits (1MB)

#### Reliability
- ✅ Centralized configuration (`src/config.js`)
- ✅ Structured logging (`src/lib/logger.js`)
- ✅ Graceful shutdown (SIGTERM/SIGINT)
- ✅ Health check endpoint (`/api/health`)
- ✅ Service layer abstraction
- ✅ Error recovery & logging

#### Code Quality
- ✅ Modular architecture
- ✅ JSDoc documentation
- ✅ Environment validation
- ✅ RESTful API design
- ✅ Clean separation of concerns

---

## 📁 Project Structure

```
ai-control-tower/
├── src/
│   ├── server.js              # Main Express app
│   ├── config.js              # Centralized config
│   ├── lib/
│   │   └── logger.js          # Structured logging
│   ├── services/
│   │   └── openclaw.service.js # OpenClaw CLI wrapper
│   └── routes/
│       └── sessions.routes.js  # API endpoints
├── public/
│   └── index.html             # Frontend app
├── package.json               # Dependencies & scripts
├── railway.json               # Railway deployment config
├── .env.example               # Environment template
└── .gitignore
```

---

## 🚀 Deployment Steps

### Option 1: Railway (Recommended for Backend)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Initialize Railway project:**
   ```bash
   cd /root/.openclaw/workspace/projects/ai-control-tower
   railway init
   ```

3. **Set environment variables:**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set PORT=3000
   railway variables set OPENCLAW_BIN=openclaw
   railway variables set CORS_ORIGIN=*
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

5. **Get URL:**
   ```bash
   railway domain
   ```

### Option 2: Netlify (Static Frontend Only)

Frontend is already deployed at:  
**https://swordtruth-control-tower.netlify.app**

To update:
```bash
cd /root/.openclaw/workspace/projects/ai-control-tower/public
netlify deploy --prod --dir=.
```

---

## 🔧 Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Start dev server:**
   ```bash
   npm run dev
   ```

4. **Test health endpoint:**
   ```bash
   curl http://localhost:3000/api/health
   ```

---

## 📡 API Endpoints

### Health Check
```
GET /api/health
Response: { status, version, uptime, timestamp, environment }
```

### Sessions
```
GET /api/sessions
Response: { sessions[], count, timestamp }
```

### Session Status
```
GET /api/sessions/:key/status
Response: { session status object }
```

### Session History
```
GET /api/sessions/:key/history?limit=20
Response: { sessionKey, messages[], count, limit, timestamp }
```

### Send Message
```
POST /api/sessions/:key/send
Body: { message: "string" }
Response: { success, sessionKey, timestamp }
```

---

## 🔐 Security Considerations

1. **Set CORS_ORIGIN** to specific domains in production
2. **Adjust rate limits** based on traffic patterns
3. **Monitor logs** for suspicious activity
4. **Keep dependencies updated** (`npm audit`)
5. **Review security headers** in helmet config

---

## 📊 Monitoring

The app logs structured JSON to stdout:

```json
{
  "timestamp": "2026-02-06T18:27:58.956Z",
  "level": "info",
  "message": "AI Agent Control Tower started",
  "port": 3030,
  "environment": "production",
  "pid": 238124
}
```

Integrate with:
- Railway logs (built-in)
- CloudWatch (AWS)
- Datadog
- Logtail

---

## 🐛 Troubleshooting

### Server won't start
- Check OpenClaw CLI is installed: `openclaw --version`
- Verify environment variables are set
- Check port is not in use: `lsof -i :3000`

### API returns errors
- Check OpenClaw is running: `openclaw status`
- Verify session keys are valid: `openclaw sessions list`
- Check server logs for details

### Frontend can't connect
- Verify API_BASE URL in `public/index.html`
- Check CORS_ORIGIN allows your domain
- Test health endpoint directly: `curl <API_URL>/api/health`

---

## 📦 Next Steps

- [ ] Deploy backend to Railway
- [ ] Update frontend API_BASE with Railway URL
- [ ] Add authentication middleware
- [ ] Set up monitoring/alerting
- [ ] Create integration tests
- [ ] Add WebSocket support for real-time updates
- [ ] Implement caching layer (Redis)

---

## 🎯 Build Verification

### Evidence of Completion:

1. **Backend structure:** ✅ Complete
   - `src/server.js` - Main app with middleware
   - `src/config.js` - Centralized config
   - `src/lib/logger.js` - Structured logging
   - `src/services/openclaw.service.js` - Service layer
   - `src/routes/sessions.routes.js` - API routes

2. **Security features:** ✅ Implemented
   - Helmet, CORS, rate limiting, input validation

3. **Frontend:** ✅ Production-ready
   - `public/index.html` - Responsive UI with theme toggle

4. **Configuration:** ✅ Complete
   - `package.json` - All dependencies installed
   - `railway.json` - Deployment config
   - `.env.example` - Environment template

5. **Git:** ✅ Committed & pushed
   - Commit: db55cb7
   - Branch: master
   - Remote: github.com/brianference/workspace

---

**Built by:** Cole AI ⚡  
**Date:** 2026-02-06  
**Status:** Ready for deployment 🚀
