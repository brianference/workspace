#!/bin/bash

# TPUSA Intel Deployment Script

set -e

echo "🚀 Deploying TPUSA Intel to Netlify..."

# Load secrets
source /root/.openclaw/secrets/keys.env

# Check if netlify token exists
if [ -z "$NETLIFY_TOKEN" ]; then
  echo "❌ NETLIFY_TOKEN not found in secrets file"
  exit 1
fi

# Set Netlify token
export NETLIFY_AUTH_TOKEN="$NETLIFY_TOKEN"

# Navigate to project directory
cd /root/.openclaw/workspace/projects/tpusa-intel

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Deploy to Netlify
echo "📤 Deploying to Netlify..."
netlify deploy --prod --dir=. --functions=netlify/functions

echo "✅ Deployment complete!"
echo "🌐 URL: https://swordtruth-tpusa-intel.netlify.app"
