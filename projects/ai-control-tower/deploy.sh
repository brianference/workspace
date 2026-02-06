#!/bin/bash
set -e

echo "🚀 Deploying Control Tower to Netlify..."

# Deploy using Netlify CLI
echo "📤 Deploying to Netlify..."
netlify deploy --prod --dir=.

echo "✅ Deployment complete!"
echo "🌐 URL: https://swordtruth-control-tower.netlify.app"
