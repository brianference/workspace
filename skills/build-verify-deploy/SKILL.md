---
name: build-verify-deploy
description: Systematic build protocol to prevent "saying building but not building" mistakes. Forces verification before claiming work is done.
metadata: { "openclaw": { "emoji": "🔨" } }
---

# Build-Verify-Deploy Protocol

## THE PROBLEM

**Pattern:** Saying "building now" or "in progress" without actually executing build commands.

**Failures:**
- 2026-02-06: Said "building" 10+ times, built nothing for 90 minutes
- Confusion between planning (documentation) and executing (code)
- Claims like "working on X" when no files exist

## THE SOLUTION: 3-Phase Protocol

### Phase 1: BUILD (Execute, Don't Plan)

**Before saying "building":**

```bash
# 1. Create project directory
mkdir -p /root/.openclaw/workspace/projects/[project-name]
cd /root/.openclaw/workspace/projects/[project-name]

# 2. Initialize if needed
npm init -y 2>/dev/null || true

# 3. Create core files (HTML, JS, etc)
# Use Write tool - actually create files NOW

# 4. Verify files exist
ls -la
```

**Rules:**
- ✅ DO: Run exec/write commands immediately
- ❌ DON'T: Write documentation about building
- ❌ DON'T: Say "building now" without running commands
- ❌ DON'T: Plan features before files exist

### Phase 2: VERIFY (Prove It Works)

**After building, before claiming done:**

```bash
# 1. Verify files exist
ls -la /root/.openclaw/workspace/projects/[project-name]/

# 2. Test locally if applicable
cd /root/.openclaw/workspace/projects/[project-name]
node server.js & # If backend
sleep 2
curl http://localhost:3000/api/health # Test endpoint
pkill -f server.js # Cleanup

# 3. Check file sizes (ensure not empty)
du -sh *

# 4. Git status (should show new files)
git status
```

**Evidence Required:**
- File paths with sizes
- curl/test results
- Git diff showing new code

### Phase 3: DEPLOY (Make It Live)

**After verification:**

```bash
# 1. Create netlify.toml
echo "[build]
  publish = \".\"" > netlify.toml

# 2. Deploy
source /root/.openclaw/secrets/keys.env
NETLIFY_AUTH_TOKEN=$NETLIFY_TOKEN netlify deploy \
  --prod \
  --create-site [site-name] \
  --dir=.

# 3. Get URL
netlify sites:list | grep [site-name]

# 4. Verify live
curl -s [deployment-url] | grep "<title>"
```

**Proof Required:**
- Deployment URL
- curl test showing it's live
- Git commit hash

### Phase 4: UPDATE (Kanban + Memory)

**After deploy:**

```bash
# 1. Update kanban
cd /root/.openclaw/workspace/projects/kanban-backend
node update-task.js update [task-id] done

# 2. Sync and deploy
cp kanban-data.json ../../kanban/
cd ../../kanban
git add kanban-data.json
git commit -m "Mark [task] done"
git push

# 3. Deploy kanban
source /root/.openclaw/secrets/keys.env
NETLIFY_AUTH_TOKEN=$NETLIFY_TOKEN netlify deploy \
  --prod \
  --site=51420637-9e20-4186-8e73-92108b757c0a \
  --dir=.
```

## RESPONSE TEMPLATES

### ❌ WRONG (No Evidence)
```
"Building X now..."
"Working on Y..."
"In progress..."
```

### ✅ RIGHT (With Evidence)
```
"Built and deployed X:
- URL: https://example.com
- Commit: abc1234
- Files: 3 created (12KB total)
- Test: curl shows working HTML
```

## SELF-TEST CHECKLIST

Before responding with status:

- [ ] Did I run mkdir/npm init?
- [ ] Did I use Write tool to create files?
- [ ] Do files exist? (ls -la proves it)
- [ ] Did I deploy? (netlify command)
- [ ] Can I curl the live URL?
- [ ] Did I commit to git?
- [ ] Did I update kanban?

**If ANY answer is NO: Do NOT claim work is done.**

## 5-ITERATION IMPROVEMENT PROTOCOL

When asked to "improve and iterate":

1. **Build MVP** - Get something working first
2. **Add features** - Enhance with real functionality
3. **Improve UX** - Better design, interactions
4. **Optimize** - Performance, code quality
5. **Document** - README, comments, features list

**Do NOT iterate on plans. Iterate on actual deployed code.**

## INTEGRATION WITH OTHER SKILLS

- **PRE-RESPONSE-GATE.md** - Check before claiming status
- **EXECUTION-CHECKPOINT.md** - Self-test before responding
- **task-memory** - Search tasks before claiming "done"

## FAILURE RECOVERY

If Brian says "you didn't build it":

1. **Admit immediately**: "You're right, I didn't"
2. **Show evidence**: `ls -la [project-dir]` (proves nothing exists)
3. **Build NOW**: Run all Phase 1 commands
4. **Verify**: Show proof (files, URL, commit)

## WHY THIS WORKS

**Root cause:** Confusing verbal commitment with actual execution

**Solution:** Force evidence at every step

**Result:** Can't claim work without proof

## USAGE

Read this skill BEFORE:
- Starting any build task
- Responding to "where's the app?"
- Claiming work is "in progress"
- Saying "building now"

## TESTING

Self-test:
```bash
bash /root/.openclaw/workspace/skills/build-verify-deploy/test.sh
```

This will:
1. Create a dummy project
2. Build a minimal file
3. Verify it exists
4. Clean up
5. Prove the protocol works
