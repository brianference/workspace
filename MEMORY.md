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

## Active Projects

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

### Kanban
- Live: https://swordtruth-kanban.netlify.app
- "Remember 30 days" + mobile UI fixes deployed

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
- Stop over-explaining — results over process narration
- Interruption protocol: quick tasks → just do them. Longer work → pause and ask
- Proactively add tasks to kanban from conversations
- Quick wins first, bigger projects when directed
- Dev work OK during day (token budget is fine)

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
