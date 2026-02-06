# 🔗 Claude Code + OpenClaw Integration Guide

**Created:** 2026-02-06  
**Status:** Experimental - Both systems installed and operational  

---

## Overview

You now have **two powerful AI coding systems** running on the same machine:

1. **OpenClaw** (v2026.2.3-1) - Your current system
   - Telegram integration
   - `sessions_spawn` for subagents
   - Multi-channel messaging
   - Cron jobs & heartbeats
   - Gateway management

2. **Claude Code** (v2.1.34) - Just installed
   - Agent teams (Opus 4.6 feature)
   - Git worktrees for parallel sessions
   - Interactive mode with task lists
   - Terminal-native experience

---

## Installation Complete ✅

**Claude Code Location:** `~/.local/bin/claude`  
**Version:** 2.1.34  
**Installation Method:** Native (recommended)  

**Test it:**
```bash
claude --version
# Output: 2.1.34 (Claude Code)
```

---

## Agent Teams Setup

### Enable Agent Teams
Add to your shell profile (`.bashrc` or `.zshrc`):
```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

Or add to Claude Code's `settings.json`:
```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

**Settings location:** `~/.claude.json`

### Start Your First Team

```bash
cd /root/.openclaw/workspace
claude

# Then in Claude Code:
"Create an agent team with 3 teammates to work on the scholarship 
hunt app. One teammate on backend API, one on database schema, 
one on frontend integration. Use Sonnet for each teammate."
```

---

## Integration Strategies

### Strategy 1: Sequential Handoff
**Use OpenClaw for coordination, Claude Code for complex builds**

```
OpenClaw (You):
1. Receive request from Brian via Telegram
2. Break down complex task
3. Spawn Claude Code team for implementation
4. Monitor progress, report back to Brian

Claude Code Teams:
1. Parallel implementation (3-5 teammates)
2. Git worktrees for separate branches
3. Review each other's code
4. Merge when complete

OpenClaw (You):
1. Verify build
2. Deploy to Netlify/Railway
3. Update kanban
4. Notify Brian
```

**Example:**
```bash
# In OpenClaw session (Telegram chat with Brian):
"I'm spawning a Claude Code agent team to rebuild the Control Tower 
backend with WebSocket support. They'll work in parallel on:
- WebSocket server (teammate 1)
- Frontend integration (teammate 2)
- Load testing (teammate 3)

I'll monitor and deploy when ready."

# Then you run:
cd /root/.openclaw/workspace/projects/ai-control-tower
claude

# In Claude Code:
"Create a team of 3 to add WebSocket real-time updates to this app..."
```

---

### Strategy 2: Parallel Sessions
**OpenClaw for daily operations, Claude Code for deep work**

**OpenClaw handles:**
- Telegram responses
- Kanban updates
- Scholarship research
- Content curation for @swordtruth
- Heartbeats & cron jobs

**Claude Code handles:**
- Multi-file refactors
- Complex debugging (competing hypotheses)
- Security audits (multiple reviewers)
- New feature builds (parallel modules)

**When to use each:**

| Task | Tool | Why |
|------|------|-----|
| "Fix this bug" | OpenClaw | Single-file, quick fix |
| "Debug this complex issue" | Claude Code | Spawn 5 teammates with competing theories |
| "Build scholarship app" | OpenClaw | Straightforward CRUD app |
| "Rebuild Control Tower with 10 new features" | Claude Code | Parallel implementation by teammates |
| "Answer Brian's question" | OpenClaw | Telegram integration |
| "Run parallel code review" | Claude Code | Security, performance, tests in parallel |

---

### Strategy 3: Hybrid Workflow
**Use both simultaneously for maximum productivity**

**Example: Scholarship Essay Generator**

```
OpenClaw (Session 1):
- Fetch scholarship requirements from 30 websites
- Parse eligibility criteria
- Structure data for essays

Claude Code (Team):
- Teammate 1: Generate 10 essay variations for AICPA
- Teammate 2: Generate 10 essay variations for Deloitte
- Teammate 3: Review both sets, score quality
- All 3: Debate best approach, synthesize top essays

OpenClaw (Session 1):
- Review Claude Code's output
- Format for Lena
- Commit to repo
- Update kanban
```

**How to coordinate:**
1. OpenClaw preps data → writes to files
2. Claude Code reads files → generates outputs
3. OpenClaw reviews outputs → deploys/notifies

---

## Agent Teams Use Cases

### 1. Parallel Code Review
**Before (OpenClaw):** You review code sequentially (security → tests → performance)  
**After (Claude Code Teams):** 3 teammates review simultaneously

```bash
cd /root/.openclaw/workspace/projects/ai-control-tower
claude

"Create a team of 3 reviewers for this codebase:
- Security reviewer (focus on auth, input validation, rate limiting)
- Performance reviewer (focus on N+1 queries, caching, load times)
- Test coverage reviewer (focus on critical paths, edge cases)

Have them review independently, then discuss findings."
```

### 2. Competing Hypotheses Debugging
**When:** Bug with unclear root cause

```bash
"Users report app crashes after 1 message. Create 5 agent teammates 
to investigate different hypotheses:
- H1: Memory leak in WebSocket connections
- H2: Database connection pool exhaustion
- H3: Rate limiting triggering too aggressively
- H4: Frontend state management issue
- H5: OpenClaw CLI timeout problem

Have them debate and disprove each other's theories."
```

### 3. Build New Modules in Parallel
**When:** Adding multiple independent features

```bash
"Create a team of 4 to add these features to Scholarship Hunt Pro:
- Backend API with Express + PostgreSQL (teammate 1)
- Email reminder system with SendGrid (teammate 2)
- Essay review AI with Claude API (teammate 3)
- Mobile-responsive redesign (teammate 4)

Each teammate owns their module. Coordinate on shared models."
```

---

## Authentication

Claude Code needs an Anthropic API key or Claude Pro/Max subscription.

**Option 1: Use OpenClaw's API Key**
```bash
# If OpenClaw is using Anthropic API:
export ANTHROPIC_API_KEY="your-key-here"
claude
```

**Option 2: Claude Pro Subscription**
```bash
# Login with Claude.ai account:
claude
# Follow OAuth prompts
```

**Option 3: Separate API Key for Claude Code**
```bash
# Create new key at https://console.anthropic.com
export ANTHROPIC_API_KEY="sk-ant-..."
claude
```

**Check authentication:**
```bash
claude --help
# If authenticated, you'll see model info
```

---

## Best Practices

### When to Use Agent Teams

✅ **Good use cases:**
- Code review (security/performance/tests in parallel)
- Debugging with competing hypotheses
- Building multiple independent modules
- Parallel research (scholarship sources, TPUSA content, etc.)

❌ **Bad use cases:**
- Single-file edits (use OpenClaw)
- Tasks with many dependencies (use sequential)
- Quick responses to Brian (use OpenClaw's Telegram integration)

### Coordination Tips

1. **File-based handoff:** OpenClaw writes data → Claude Code reads → OpenClaw deploys
2. **Git worktrees:** Claude Code uses separate branches, OpenClaw merges
3. **Task delegation:** OpenClaw breaks down work, Claude Code executes, OpenClaw verifies
4. **Separate contexts:** Don't mix Telegram conversations with Claude Code teams

### Cost Management

**Token usage:**
- OpenClaw: Shared context, cheaper for incremental work
- Claude Code Teams: Separate contexts per teammate, expensive for coordination

**Rule of thumb:**
- <3 files or <500 lines → OpenClaw
- >5 files or complex logic → Consider Claude Code Teams
- Parallel work with clear boundaries → Claude Code Teams
- Sequential work or tight dependencies → OpenClaw

---

## Example Workflows

### Workflow 1: "Build Three Apps" Task

**What we did (OpenClaw only):**
- Built AI Control Tower, TPUSA Intel, Scholarship Hunt sequentially
- ~4 hours total, one agent

**What we could do (Claude Code Teams):**
- Spawn 3 teammates, each builds one app simultaneously
- ~1.5 hours total, 3 agents in parallel
- Cost: 3x tokens, but 2.6x faster

**When to use teams:** If Brian says "I need these 3 apps by EOD" and it's already 3 PM.

---

### Workflow 2: Security Audit

**What we did (OpenClaw only):**
- Ran hostile audits sequentially, applied fixes one by one

**What we could do (Claude Code Teams):**
```bash
"Create a team of 4 security reviewers:
- SQL injection & XSS specialist
- Authentication & authorization specialist  
- Rate limiting & DoS specialist
- Data encryption & secrets specialist

Have them audit the Control Tower codebase independently, 
then debate priorities and create a unified fix list."
```

**Result:** Find more issues, prioritize better, parallelize fixes.

---

### Workflow 3: Scholarship Research

**What we did (OpenClaw only):**
- Sequential web searches (hit rate limit)
- Wrote master plan in one session

**What we could do (Claude Code Teams):**
```bash
"Create a team of 5 researchers for Lena's scholarships:
- Big 4 accounting firm scholarships (teammate 1)
- Women in business scholarships (teammate 2)
- Arizona-specific scholarships (teammate 3)
- Merit-based national scholarships (teammate 4)
- Essay strategy & application timeline (teammate 5)

Each teammate deep-dives their category, then all collaborate 
on the master plan."
```

**Result:** More comprehensive research, better prioritization, 5x throughput.

---

## Troubleshooting

### Claude Code won't start
```bash
# Check installation:
claude --version

# Check authentication:
claude
# If it asks for API key, set:
export ANTHROPIC_API_KEY="your-key"

# Enable debug mode:
claude --debug
```

### Agent teams not available
```bash
# Enable experimental feature:
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1

# Or add to ~/.claude.json:
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

### OpenClaw and Claude Code conflict
**They shouldn't conflict** - they're separate tools. But if they do:
- Use separate directories for each
- Don't run both in the same terminal simultaneously
- OpenClaw handles Telegram, Claude Code handles teams

### "Too many tokens" errors
Agent teams use significantly more tokens (3-5x).
- Use teams sparingly for complex tasks only
- Consider cost vs. time tradeoff
- Monitor usage in Anthropic Console

---

## Next Steps

### Immediate:
1. [ ] Set up Claude Code authentication
2. [ ] Enable agent teams feature
3. [ ] Test first team (simple 2-teammate task)
4. [ ] Document learnings

### Short-term:
1. [ ] Rebuild Control Tower backend with Claude Code team (WebSocket + auth)
2. [ ] Run parallel security audit on all 3 apps
3. [ ] Scholarship research with 5-teammate team
4. [ ] Compare results: OpenClaw vs. Claude Code Teams

### Long-term:
1. [ ] Develop standard workflows for each tool
2. [ ] Create coordination scripts (OpenClaw → Claude Code handoff)
3. [ ] Train Brian on when to request teams vs. single agent
4. [ ] Build custom MCP servers for integration

---

## Documentation & Resources

**Claude Code Docs:**
- Setup: https://code.claude.com/docs/en/setup
- Agent Teams: https://code.claude.com/docs/en/agent-teams
- Settings: https://code.claude.com/docs/en/settings

**OpenClaw Docs:**
- Sessions: Check `/root/.openclaw/workspace/docs/`
- Subagents: `sessions_spawn` command
- Cron: For scheduled tasks

**This Document:**
- Location: `/root/.openclaw/workspace/docs/CLAUDE-CODE-OPENCLAW-INTEGRATION.md`
- Update as we learn more about integration patterns

---

**Status:** Claude Code installed, agent teams ready to enable, integration strategies documented.  
**Next Action:** Authenticate Claude Code and run first test team.  
**Owner:** Cole AI ⚡  
**Updated:** 2026-02-06
