#!/bin/bash
# Emergency Task Recovery - Deep search when tasks are missing

WORKSPACE="/root/.openclaw/workspace"

echo "🚨 EMERGENCY TASK RECOVERY"
echo "========================================"
echo "Performing deep search across workspace..."
echo ""

# 1. All markdown files with task keywords
echo "📝 MARKDOWN FILES WITH TASKS:"
find "$WORKSPACE" -name "*.md" -type f 2>/dev/null | xargs grep -l -E "task|TODO|backlog|build|complete" 2>/dev/null | head -20

echo ""
echo "📋 TASK-RELATED CONTENT:"
find "$WORKSPACE" -name "*.md" -type f 2>/dev/null | xargs grep -h -E "^- \[ \]|^- \[x\]|^## (Active|Backlog|TODO)" 2>/dev/null | head -30

# 2. Git commit messages (recent tasks)
echo ""
echo "📜 GIT COMMIT HISTORY (last 20):"
cd "$WORKSPACE" 2>/dev/null && git log --oneline -20 2>/dev/null | grep -E "task|build|add|create|fix" || echo "  (no git history)"

# 3. Project directories
echo ""
echo "📦 ALL PROJECTS:"
find "$WORKSPACE/projects" -maxdepth 1 -type d 2>/dev/null | tail -n +2

# 4. JSON data files
echo ""
echo "💾 DATA FILES:"
find "$WORKSPACE" -name "*.json" -type f 2>/dev/null | grep -E "kanban|task|data" | head -10

echo ""
echo "========================================"
echo "💡 RECOVERY TIPS:"
echo "  1. Check COMMITMENTS.md for active commitments"
echo "  2. Check kanban-data.json for current board state"
echo "  3. Check memory/YYYY-MM-DD.md for recent context"
echo "  4. Ask Brian for specifics if still unclear"
echo ""
