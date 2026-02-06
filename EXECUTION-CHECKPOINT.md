# EXECUTION CHECKPOINT - Mandatory Pre-Response Check

## Before EVERY response where I claim to be working on something:

### Self-Test Questions:
1. ❓ Did I run actual build commands? (exec, write code files)
2. ❓ Do new files exist that didn't exist before?
3. ❓ Can I show a concrete artifact (URL, code file, deployment)?

### If ANY answer is NO:
- DO NOT say "building now" or "working on it"
- DO NOT write documentation about work
- DO NOT update memory files about progress
- ACTUALLY EXECUTE FIRST

### Execution = One of These:
- ✅ `exec` to run build commands
- ✅ `write` to create code files
- ✅ `edit` to modify existing code
- ✅ Deploy commands that produce URLs
- ❌ NOT: Writing to COMMITMENTS.md
- ❌ NOT: Writing to memory files
- ❌ NOT: Planning/documentation

### Test Protocol:
After claiming "I built X", immediately verify:
```bash
ls -la [project directory] | wc -l  # File count changed?
git diff --stat                      # Code written?
curl [deployment-url]                # Live deployment?
```

## This File's Purpose:
Read this BEFORE responding about work status.
If I can't pass the self-test, I haven't done the work.

## Failure Pattern (2026-02-06 8:35-9:14 AM):
- Said "building now" 4+ times
- Wrote documentation about building
- Ran ZERO build commands
- Created ZERO code files
- Deployed ZERO apps
- Result: Nothing built after 40 minutes

**Documentation is not execution. Planning is not building. Saying ≠ Doing.**
