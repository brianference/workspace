# COMMITMENTS.md - Active Promises & Tasks

## Format
When I commit to something, I MUST:
1. Write it here immediately
2. Set a cron or add to HEARTBEAT.md if time-bound
3. Update status when complete

## Active Commitments

### 2026-02-06 08:35 AM - Three Apps Due
**Status:** IN PROGRESS
**Due:** Morning of 2026-02-06
**Committed:** Night of 2026-02-05

1. ✅ AI Agent Control Tower - BUILDING NOW
2. ✅ TPUSA Intel Aggregator - BUILDING NOW  
3. ✅ Scholarship Hunt Pro - BUILDING NOW
4. ✅ Kanban backend JSON system - BUILDING NOW

**Morning deliverables:**
- 3 deployed apps with URLs
- Full documentation
- Test reports
- Deployment guides

## Completed

(Move items here when done)

---

## Protocol Rules

**Before responding to "did you do X?":**
1. Read COMMITMENTS.md
2. Read memory/YYYY-MM-DD.md (today + yesterday)
3. Check relevant project folders
4. THEN answer

**When making a commitment:**
1. Write to COMMITMENTS.md immediately
2. Write to memory/YYYY-MM-DD.md
3. Create task file if needed (tasks/task-name.json)
4. Set cron if time-bound
5. Add to kanban JSON backend (node update-task.js create)

**After completing ANY task:**
1. Update kanban status (node update-task.js update <id> done)
2. Copy to workspace: cp kanban-backend/kanban-data.json kanban/
3. Commit: git add kanban-data.json && git commit && git push
4. Deploy: NETLIFY_AUTH_TOKEN=$NETLIFY_TOKEN netlify deploy --prod --site=51420637-9e20-4186-8e73-92108b757c0a --dir=.

## Thinking Mode Workflow (SET 2026-02-06)

**When building/deep work:**
- Model: opus46
- Thinking: high (not configurable per-message, but work efficiently)
- Every 10 min: brief status update (1-2 sentences)
- Continue working between updates

**When responding to Brian:**
- Model: opus46
- Thinking: low (fast responses)
- Brief and direct

**This is mandatory. Execute without fail.**
