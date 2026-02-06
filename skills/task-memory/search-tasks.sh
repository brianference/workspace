#!/bin/bash
# Task Search Script - Find all tasks across workspace

WORKSPACE="/root/.openclaw/workspace"
KANBAN_BACKEND="$WORKSPACE/projects/kanban-backend"

echo "🔍 SEARCHING FOR TASKS..."
echo "========================================"

# 1. Active commitments
echo ""
echo "📋 COMMITMENTS.md:"
if [ -f "$WORKSPACE/COMMITMENTS.md" ]; then
  grep -E "^###|^- |^[0-9]\." "$WORKSPACE/COMMITMENTS.md" | head -20
else
  echo "  (not found)"
fi

# 2. Kanban backend
echo ""
echo "🎯 KANBAN TASKS:"
if [ -f "$KANBAN_BACKEND/update-task.js" ]; then
  cd "$KANBAN_BACKEND" && node update-task.js list 2>/dev/null || echo "  (error running kanban CLI)"
else
  echo "  (kanban backend not found)"
fi

# 3. Recent memory
echo ""
echo "🧠 RECENT MEMORY (last 2 days):"
find "$WORKSPACE/memory" -name "*.md" -mtime -2 -type f 2>/dev/null | while read file; do
  echo "  📄 $(basename $file)"
  grep -E "task|TODO|build|complete|work on" "$file" 2>/dev/null | head -3 | sed 's/^/    /'
done

# 4. Project status
echo ""
echo "📦 PROJECT STATUS:"
find "$WORKSPACE/projects" -maxdepth 2 -name "README.md" -o -name "AUDIT-STATUS.md" 2>/dev/null | while read file; do
  echo "  📄 $file"
  grep -E "TODO|REMAINING|Backlog|Next" "$file" 2>/dev/null | head -3 | sed 's/^/    /'
done

echo ""
echo "========================================"
echo "✅ Search complete"
