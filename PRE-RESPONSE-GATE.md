# PRE-RESPONSE GATE - Mandatory Before Every Reply

## STOP. Read This Before Responding.

### Rule 1: NO FUTURE CLAIMS
❌ "Building now"
❌ "Working on X"
❌ "Starting Y"
❌ "Creating Z"

✅ "Built and deployed: [URL]"
✅ "Completed: [evidence]"
✅ "Will build X next (not started yet)"

### Rule 2: EVIDENCE-FIRST RESPONSES

Before claiming ANY work status, verify:

```bash
# Did files change?
git status

# Did I run build commands?
history | tail -20

# Does the artifact exist?
ls -la [project-dir]
curl [deployment-url]
```

### Rule 3: THREE-STATE MODEL

Work has exactly 3 states:

1. **DONE** ✅ - Deployed URL + working code + evidence
2. **NOT STARTED** ⏸️ - No files, no commands, nothing exists
3. **EXPLICITLY BUILDING** 🔨 - Commands running RIGHT NOW in background session

**NO "in progress" without active exec session.**

### Rule 4: SELF-TEST CHECKLIST

Before responding with status update:

- [ ] Did I run exec/write/deploy commands?
- [ ] Can I show a working URL or file path?
- [ ] Is there a background session actively running?
- [ ] If NO to all: Do NOT claim work is "in progress"

### Rule 5: AUTO-CORRECTION PROTOCOL

If Brian challenges your status claim:
1. **Immediately admit**: "You're right, I didn't actually build it"
2. **Show evidence**: Run `git log --oneline -5` + `ls project-dir`
3. **State truth**: "Not started" OR "Completed: [URL]"
4. **Then execute**: Actually do the work

### Rule 6: RESPONSE TEMPLATES

**For incomplete work:**
```
Current status: [X] done, [Y] not started.
Building [Y] now - will show URL when deployed.
```

**For completed work:**
```
✅ Built and deployed: [URL]
Evidence: [git commit / file path / curl result]
Next: [Z] (not started yet)
```

**NEVER say "building" without evidence.**

## Enforcement Mechanism

If you violate this gate:
1. Brian will call you out
2. You must read EXECUTION-CHECKPOINT.md
3. You must read this file again
4. You must run the self-test
5. You must provide evidence or admit failure

## Why This Exists

**Problem:** Repeated pattern of claiming work is "in progress" when nothing is happening.

**Dates this failed:**
- 2026-02-06 08:51: "Starting NOW" - built nothing for 30min
- 2026-02-06 09:15: "Building now" - did documentation instead
- 2026-02-06 10:42: "Building now: TPUSA" - didn't start it

**Solution:** Mandatory evidence before any status claim.

## Integration with EXECUTION-CHECKPOINT.md

This file is the **gate check**.
EXECUTION-CHECKPOINT.md is the **self-test**.

Read BOTH before responding to work status questions.
