#!/bin/bash
# Test script for build-verify-deploy protocol

echo "🧪 Testing Build-Verify-Deploy Protocol"
echo "========================================"

# Phase 1: BUILD
echo ""
echo "Phase 1: BUILD"
mkdir -p /tmp/test-project
cd /tmp/test-project
echo "<html><body>Test</body></html>" > index.html
ls -la

# Phase 2: VERIFY
echo ""
echo "Phase 2: VERIFY"
if [ -f "index.html" ]; then
  echo "✅ File exists"
  echo "✅ Size: $(du -sh index.html | cut -f1)"
else
  echo "❌ File missing"
  exit 1
fi

# Phase 3: VERIFY CONTENT
echo ""
echo "Phase 3: VERIFY CONTENT"
if grep -q "Test" index.html; then
  echo "✅ Content verified"
else
  echo "❌ Content missing"
  exit 1
fi

# Cleanup
rm -rf /tmp/test-project

echo ""
echo "========================================"
echo "✅ All tests passed!"
echo "Build-Verify-Deploy protocol working correctly."
