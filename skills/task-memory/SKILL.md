---
name: task-memory
description: Systematic task tracking and memory protocol to prevent context loss across sessions. Mandatory for all task-related queries.
metadata: { "openclaw": { "emoji": "🧠" } }
---

# Task Memory Protocol

## MANDATORY: Read This Before Any Task-Related Response

Before responding to "what tasks exist?" or "what's missing?" or "did you do X?":

### 1. CHECK ALL TASK SOURCES (IN ORDER)

```bash
# Run this search script first
bash /root/.openclaw/workspace/skills/task-memory/search-tasks.sh
```

This searches:
- ✅ COMMITMENTS.md (active commitments)
- ✅ Kanban JSON backend (current tasks)
- ✅ MEMORY.md (long-term context)
- ✅ memory/YYYY-MM-DD.md (recent daily notes)
- ✅ Project README/AUDIT files
- ✅ Session history (if needed)

### 2. NEVER CLAIM "NOTHING EXISTS" WITHOUT SEARCHING

If you can't find tasks:
1. Run the search script
2. Check the output
3. If still empty, ask the user for specifics
4. NEVER guess or assume tasks don't exist

### 3. ALWAYS UPDATE AFTER COMPLETION

When completing ANY task:
```bash
# Update kanban
cd /root/.openclaw/workspace/projects/kanban-backend
node update-task.js update <task-id> done

# Sync to live board
cp kanban-data.json ../../kanban/
cd ../../kanban
git add kanban-data.json
git commit -m "Mark task-XXX done"
git push

# Deploy
source /root/.openclaw/secrets/keys.env
NETLIFY_AUTH_TOKEN=$NETLIFY_TOKEN netlify deploy --prod \
  --site=51420637-9e20-4186-8e73-92108b757c0a --dir=.
```

### 4. WHEN CREATING NEW TASKS

Always create in kanban backend:
```bash
cd /root/.openclaw/workspace/projects/kanban-backend
node update-task.js create "Task Title" "Description" <priority> <tags> <status>
```

Then sync and deploy (see step 3).

## Why This Exists

**Problem:** Sessions restart. Context is lost. Tasks are forgotten.

**Solution:** Systematic external memory in files + automated search.

## Emergency Recovery

If Brian says "you're missing tasks":

```bash
# Run comprehensive search
bash /root/.openclaw/workspace/skills/task-memory/recover-tasks.sh

# This will search:
# - All markdown files in workspace
# - All project folders
# - All memory files
# - Session transcripts
# - Git commit messages
```

## Rules

1. **Check before claiming** - Always search before saying tasks don't exist
2. **Update immediately** - No delay between completion and kanban update
3. **One source of truth** - Kanban JSON backend is canonical
4. **Document everything** - Every commitment goes in COMMITMENTS.md AND kanban
5. **Never rely on memory** - Text > Brain. Files survive. Memory doesn't.

## Integration with COMMITMENTS.md

This skill enforces the COMMITMENTS.md protocol but adds:
- Automated search scripts
- Systematic file-based memory
- Recovery procedures
- Pre-response checklists

## When to Use This Skill

**ALWAYS use before:**
- Answering "what tasks do we have?"
- Responding to "you forgot X"
- Claiming no tasks exist
- Any task status update

**NEVER skip this when:**
- Brian asks about missing tasks
- You're unsure what was committed
- Session just restarted
- Context seems incomplete

## Self-Test

Before responding to task queries, answer:
1. ❓ Did I run search-tasks.sh?
2. ❓ Did I check COMMITMENTS.md?
3. ❓ Did I check kanban-data.json?
4. ❓ Did I check memory files?

If any answer is NO, do not respond yet.
