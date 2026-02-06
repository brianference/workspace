# Backend Hosting Options - Cost & Feature Comparison

**Created:** 2026-02-06  
**For:** Node.js backends (Express, serverless functions)  

---

## Quick Recommendation

**Primary:** Netlify Functions (serverless) - Already using Netlify, $0 extra  
**Backup:** Render (free tier) - Best free always-on option  

---

## 1. Netlify Functions (BEST for Brian)

### What It Is
Serverless functions that run alongside your static frontend on Netlify.

### Pricing
- **FREE Tier:**
  - 125,000 requests/month
  - 100 hours function runtime/month
  - No cold starts for simple APIs
- **Pro Tier (if you're already paying):**
  - More generous limits included
  - Priority support

### Pros
✅ Already using Netlify for frontends  
✅ One deploy for frontend + backend  
✅ Auto-scales, no server management  
✅ Free SSL, CDN, auto-deploy from git  
✅ Simple conversion from Express routes  
✅ Great DX (developer experience)  

### Cons
❌ Serverless only (no WebSockets without workarounds)  
❌ 10-second timeout per function  
❌ Cold starts if rarely used (100-500ms)  

### Best For
- REST APIs (like Control Tower)
- Webhooks
- Form handlers
- Cron jobs (with Netlify Build Hooks)

### Cost Estimate
**$0/month** (included in free tier or your existing plan)

---

## 2. Render (BEST Backup Option)

### What It Is
Platform-as-a-Service (PaaS) like Heroku but better free tier. Full Node.js server.

### Pricing
- **FREE Tier:**
  - 750 hours/month (enough for 1 always-on service)
  - 512MB RAM
  - Shared CPU
  - Spins down after 15 min inactivity (cold starts ~30s)
- **Starter ($7/month):**
  - Always-on, no cold starts
  - 512MB RAM
  - Better performance

### Pros
✅ True free tier (no credit card required initially)  
✅ Full Node.js support (WebSockets work)  
✅ Auto-deploy from GitHub  
✅ Free SSL, custom domains  
✅ Easy scaling (just upgrade tier)  
✅ PostgreSQL database included (free tier)  
✅ Persistent disk (not ephemeral like some platforms)  

### Cons
❌ Free tier spins down after 15 min (cold starts)  
❌ Slower than dedicated servers  
❌ Limited RAM on free tier  

### Best For
- Always-on APIs
- WebSocket servers
- Full Express apps
- Apps with databases

### Cost Estimate
**$0/month** (free tier) or **$7/month** (no cold starts)

**Recommendation:** Start free, upgrade to $7 if cold starts annoy you.

---

## 3. Railway (NOT Recommended)

### What It Is
Modern PaaS focused on developer experience.

### Pricing
- **"Free" Tier:**
  - $5 credit/month
  - Runs out in 3-5 days for typical Node.js app
- **Paid:**
  - $5/month for 100 hours (barely covers 4 days)
  - Then ~$20-50/month depending on usage

### Pros
✅ Great UI/UX  
✅ Easy deploys  
✅ Good developer experience  

### Cons
❌ Expensive ($20-50/month typical)  
❌ "Free" tier is misleading (only $5 credit)  
❌ Not suitable for hobby projects  

### Cost Estimate
**$20-50/month** realistically

**Verdict:** Too expensive. Only use if you need premium features.

---

## 4. Vercel Serverless

### What It Is
Competitor to Netlify, serverless functions + static hosting.

### Pricing
- **FREE Tier (Hobby):**
  - Unlimited requests
  - 100GB bandwidth/month
  - 10-second timeout
- **Pro ($20/month):**
  - Team features
  - More resources

### Pros
✅ Generous free tier  
✅ Great Next.js support  
✅ Fast global CDN  
✅ No cold starts for edge functions  

### Cons
❌ Serverless only (like Netlify)  
❌ 10-second timeout  
❌ Less flexible than Render  
❌ You'd need to learn another platform (already using Netlify)  

### Cost Estimate
**$0/month** (free tier)

**Verdict:** Good alternative to Netlify, but no reason to switch if you're already using Netlify.

---

## 5. Fly.io

### What It Is
Deploy Docker containers close to users. More technical than Render.

### Pricing
- **FREE Tier:**
  - 3 VMs with 256MB RAM each
  - 160GB bandwidth/month
- **Paid:**
  - Pay for what you use (CPU, RAM, bandwidth)

### Pros
✅ True free tier (3 VMs)  
✅ Global deployment (run close to users)  
✅ Full Docker support (any language/framework)  
✅ Persistent volumes  
✅ WebSockets, long-running processes  

### Cons
❌ More complex (Docker knowledge required)  
❌ Limited RAM on free tier (256MB)  
❌ Less beginner-friendly than Render  

### Cost Estimate
**$0/month** (free tier) or **~$10-20/month** (scaled up)

**Verdict:** Great if you know Docker. Overkill for simple Express apps.

---

## Side-by-Side Comparison

| Feature | Netlify Functions | Render | Railway | Vercel | Fly.io |
|---------|-------------------|--------|---------|---------|--------|
| **Free Tier** | 125K req/month | 750h/month | $5 credit | Unlimited | 3 VMs |
| **Cold Starts** | Yes (100-500ms) | Yes (free) / No (paid) | No | Yes | No |
| **WebSockets** | No* | Yes | Yes | No* | Yes |
| **Timeout** | 10s | None | None | 10s | None |
| **Setup Time** | 5 min | 10 min | 10 min | 5 min | 30 min |
| **Monthly Cost** | $0 | $0 or $7 | $20-50 | $0 | $0 or $10-20 |
| **Learning Curve** | Easy | Easy | Easy | Easy | Medium |
| **Best For** | REST APIs | Full apps | Premium apps | REST APIs | Docker apps |

*Can work with workarounds (Pusher, Ably, etc.)

---

## Recommendation for Brian

### Primary: Netlify Functions
**Why:**
- You're already using Netlify
- Control Tower backend is simple REST API
- $0 extra cost
- One deploy for frontend + backend
- 10 min to convert

**Use for:**
- AI Control Tower API
- Simple webhooks
- Form handlers

### Backup: Render (Free Tier)
**Why:**
- Best free tier for full Node.js apps
- WebSocket support if needed later
- Easy to scale up ($7/month = no cold starts)
- PostgreSQL database included

**Use for:**
- More complex backends
- Real-time features (WebSockets)
- Database-heavy apps
- Future projects that outgrow serverless

---

## What is Render?

Think of Render as **"New Heroku"** - but better.

**What it does:**
1. You push code to GitHub
2. Render detects it's Node.js, builds it automatically
3. Deploys to a live URL (e.g., `your-app.onrender.com`)
4. Gives you free SSL, logs, monitoring

**Free tier details:**
- Your app stays online as long as someone visits it
- After 15 min of no traffic → spins down (saves resources)
- Next visitor → cold start (~30s to wake up)
- Good for demos, side projects, low-traffic apps

**Paid tier ($7/month):**
- Always on, no cold starts
- Faster, more reliable
- Worth it if you use the app regularly

**Why it's good:**
- Easiest free option for full Node.js apps
- Free PostgreSQL database (10GB)
- No credit card needed to start
- Easy migration if you outgrow it

---

## Action Plan

### Step 1: Convert Control Tower to Netlify Functions (Today)
**Time:** 15 minutes  
**Cost:** $0  
**Result:** Fully functional API + frontend in one deploy  

### Step 2: Sign up for Render (Backup)
**Time:** 5 minutes  
**Cost:** $0  
**Result:** Backup option if Netlify Functions don't work for future projects  

**Render signup:**
1. Go to https://render.com
2. Sign up with GitHub
3. No credit card needed
4. Ready to deploy in 2 clicks

---

## Conclusion

**For Control Tower specifically:**
→ Use Netlify Functions ($0, 15 min setup)

**For future projects with WebSockets/databases:**
→ Use Render free tier ($0, spins down after 15 min)  
→ Upgrade to $7/month if cold starts annoy you

**Avoid Railway unless you have $20-50/month budget.**

---

**Next Steps:**
1. I'll convert Control Tower to Netlify Functions now
2. You sign up for Render as backup: https://render.com (GitHub login, no CC)
3. Future projects: decide Netlify Functions vs Render based on needs

**Questions?** Ask before I start converting.

---

**Last Updated:** 2026-02-06  
**Created by:** Cole AI ⚡
