# MEMORY.md - Long-Term Memory

## Brian
- Arizona timezone, no DST
- Values directness, competence, and brevity
- Doesn't want sycophancy or filler
- AI product manager
- GitHub: brianference
- X: @swordtruth (monetized, investigative MAGA, anti-TPUSA corruption)
- TikTok: @realswordtruth
- Has Grok Imagine premium
- 18-year-old daughter → ASU accounting/finance
- Dev work OK during day (token budget is fine). Focus on quick wins first unless directed to larger projects.

## Me (Cole)
- Born 2026-02-05
- Sharp, concise, business-first
- Primary roles: task management, vibe coding, content curation, research, second brain

## Infrastructure
- Signal: DISCONNECTED (Brian unlinked Feb 5)
- Signal standalone: not set up
- Brave Search: configured
- Web chat: configured (localhost:18789)
- Browser/X/TikTok: need authenticated sessions
- Proton Mail: pending — needs Bridge IMAP/SMTP setup (Brian to provide creds)
- Grok Imagine API: available at xAI (grok-imagine-image + grok-imagine-video) — needs XAI_API_KEY
- OpenArt.ai: Current Plan Infinite (active) — Visual Stories only, ComfyUI workflows sunset Jan 2026
- Pixazo.ai: Flux Schnell API configured (free tier, 10 req/min, skill created)
- Suno.com: pending — Brian to open account
- Netlify: Brian has account — use for deploying kanban + projects
- Secrets file: `/root/.openclaw/secrets/keys.env` (chmod 600)

## Backend Hosting Options (2026-02-06)
**Primary:** Netlify Functions (serverless) - $0, 125K req/month, already using Netlify  
**Backup:** Render - $0 free tier (750h/month, spins down after 15min) or $7/month (always-on)  
**Avoid:** Railway ($20-50/month, misleading "free" tier)

**What is Render:** Platform-as-a-Service like Heroku. Push code → auto-deploys. Free PostgreSQL included. Sign up: https://render.com (GitHub login, no CC needed).

**Decision:** Use Netlify Functions for Control Tower backend (simple REST API). Render as backup for future WebSocket/database apps.

**Full comparison:** `/root/.openclaw/workspace/docs/BACKEND-HOSTING-COMPARISON.md`

## Active Projects

### AI Agent Control Tower (COMPLETE 2026-02-06)
- **Status:** ✅ Production-ready, awaiting Railway deployment
- **Repo:** https://github.com/brianference/workspace/tree/master/projects/ai-control-tower
- **Frontend:** https://swordtruth-control-tower.netlify.app (static)
- **Backend:** Railway-ready (Node.js + Express)
- **Commits:** db55cb7 (backend), 6ab4dfd (docs), 639002a (kanban)
- **Features:** Session monitoring, message history, token tracking, dark mode, rate limiting, security hardening
- **Docs:** DEPLOYMENT.md, README.md (comprehensive)
- **Next:** Deploy backend to Railway, update frontend API_BASE

### TPUSA Intel Aggregator (COMPLETE 2026-02-06)
- **Status:** ✅ Deployed and functional
- **URL:** https://swordtruth-tpusa-intel.netlify.app
- **Features:** TikTok/X content scanner, target tracking, engagement metrics, dark mode
- **Next:** Set up browser relay for authenticated TikTok/X access

### Scholarship Hunt Pro (COMPLETE 2026-02-06)
- **Status:** ✅ Deployed with 5 real scholarships
- **URL:** https://swordtruth-scholarship-hunt.netlify.app
- **Features:** Deadline tracking, application status, 5 verified scholarships for Lena, dark mode
- **Next:** Add backend for persistence, email reminders

### OpenClaw Mobile
- Repo: https://github.com/brianference/openclaw-mobile
- Local: `/root/.openclaw/workspace/projects/openclaw-mobile`
- Stack: Expo SDK 54, React Native, TypeScript, Expo Router
- Status: Fixed - Expo Go working (LAN mode)
- Fixes applied 2026-02-05:
  - Added expo-updates dependency
  - Fixed app.json (removed broken EAS config, added updates config)
  - Migrated ESLint to v9 (eslint.config.js)
  - Cleared Metro cache
- Audit: 15/29 fixes done, see `AUDIT-STATUS.md` in project
- Critical remaining: AES-256-GCM vault encryption, PBKDF2 password hashing

### Kanban Board
- Live: https://swordtruth-kanban.netlify.app
- Backend: `/root/.openclaw/workspace/projects/kanban-backend/kanban-data.json`
- "Remember 30 days" + mobile UI fixes deployed
- Programmatic updates via CLI: `node update-task.js`

## Lena (Scholarship Notes)
- FAFSA filed
- Does NOT qualify for low-income scholarships
- Focus: merit-based, women-in-accounting/finance, Big 4 firm scholarships
- Next deadlines: March 1 (Ludden), March 15 (AICPA $5-10K, AWSCPA $5K)

## Recurring
- Morning briefing: 8:00 AM MST daily (cron)
- Nightly autonomous builds: 10:30 PM MST (cron) — build something cool, apply security, deploy, document
- **Kanban monitoring** — check backlog + in-progress every heartbeat, execute autonomously
- Heartbeat checks: rotate email/calendar/weather/X mentions/TikTok/kanban 2-4x daily
- Security: hostile audit prompts from Brian, apply to all builds

## Security Rules
- ALL public-facing builds get security by default — no exceptions
- Encrypt data at rest for any cloud-stored user data
- Auth gate on anything with a public URL
- PBKDF2/bcrypt for password hashing (anti-brute-force)
- Rate limiting on auth attempts
- Brian will provide hostile security audit prompts — apply to everything
- **NEVER display full tokens** — always mask as `***...***`
- Token rotation guide: `/root/.openclaw/workspace/TOKEN-ROTATION-GUIDE.md`

## Lessons Learned
- Self-audited 2026-02-05: Found token exposure in chat, running as root
- Created operational docs: PLAYBOOK.md, OPERATING-CHECKLIST.md, SELF-IMPROVEMENT-PLAN.md
- Skills should be security-scanned before use (clawhub scan)
- **DO NOT enable hooks** — caused hours of troubleshooting (2026-02-05)
- **GitHub token rotated** 2026-02-05 (exposed token replaced)
- Git history cleaned with filter-branch to remove secrets from SELF-AUDIT.md

## Communication Preferences
- Send messages in chunks, don't leave long typing indicators
- **Results over narration** — Brian wants action, not explanations
- **Token budget is NOT a constraint** — focus on quality work, dev during day is fine
- "Get building" = stop talking, start executing
- Interruption protocol: quick tasks → just do them. Longer work → pause and ask
- Proactively add tasks to kanban from conversations
- Evidence over words: commits, file paths, URLs

## Never Sit Idle Rule (SET 2026-02-06)
**MANDATORY:** After completing any task, immediately check kanban backlog and start the next priority task WITHOUT asking permission. Token budget is not a constraint. Only sit idle during late night (11 PM - 8 AM) OR when actively working on multi-hour builds. Never go quiet for >30 min during work hours without an update.

## Skills Usage Protocol (2026-02-06)

**Problem:** Creating skills but not using them. Task-memory skill exists but I didn't use it before claiming tasks were missing.

**Rule:** After creating ANY skill, immediately:
1. Read the skill's SKILL.md
2. Execute its main command/script
3. Verify it works
4. Use it in the current task

**Available skills that MUST be used:**
- `task-memory` - Run search-tasks.sh before any task queries
- `weather` - Use for weather checks
- `tmux` - Use for interactive CLI control
- `vibe-coding-patterns` - Use for security audits and production-ready code
- `build-verify-deploy` - **MANDATORY before claiming any build status** - Forces evidence before saying "done"
- `modern-app-standards` - **MANDATORY for all apps** - 10 essential features (responsive, theme toggle, search, security, etc.)

**Never create a skill and then forget to use it.**

**Modern App Standards (Created 2026-02-06 11:19 AM):**
- **EVERY app MUST have:** Responsive design, light/dark mode toggle, search functionality, security hardening, accessible UI/UX, performance optimization, state persistence
- **Read BEFORE starting any app** - Prevents building apps that are missing standard features
- **Applies to:** All 3 current apps (Control Tower, TPUSA, Scholarship) + all future apps
- **No exceptions** - "We'll add it later" is not acceptable
- Based on 2025 industry research: 92.3% mobile users, PWA capabilities, real-time updates

**Build-Verify-Deploy Protocol (Created 2026-02-06 11:11 AM):**
- Prevents "saying building but not building" failures
- 4 phases: BUILD → VERIFY → DEPLOY → UPDATE
- Requires evidence at every step (files, URLs, commits)
- Tested and working (test.sh passes)
- **Read this BEFORE starting any build task**

## Operational Improvements (2026-02-05)
- **Batch commits** — group related changes, fewer pushes
- **Kill stale processes** — auto-cleanup background sessions
- **Pre-push validation** — run lint/typecheck before pushing
- **Full log reads** — diagnose thoroughly before applying fixes
- **Real-time docs** — update MEMORY.md as I work, not after
- **Verify before claiming** — test fixes before saying "done"
- **Critical first** — kanban Critical priority always comes first
- **Proactive monitoring** — CI status, kanban, git status checked autonomously
- **ClawHub browsing** — regularly check https://clawhub.com for useful skills, ask + security scan before installing
- **Self-assessment 5x daily** — review improvements during heartbeats

## Key Targets (for @swordtruth content)
- TPUSA, Erica Kirk, Tyler Bowyer, Andrew Kolvet, Mikey McCoy, Charlie Kirk
- Focus: corruption, criticism, exposure
- Source: TikTok videos < 72h old → repost on X
