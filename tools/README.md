# Workspace Tools

## Screenshot Tool

**Problem:** Playwright requires system dependencies (`libnspr4.so`, `libnss3.so`, etc.) that aren't available in this WSL environment.

### Solution Options:

#### 1. Use Browser Relay (Recommended)
Connect to your host Chrome browser:
```bash
# On host machine, start OpenClaw with Browser Relay enabled
# Then use the browser tool from OpenClaw
```

#### 2. Use Screenshot API (Alternative)
Use an external screenshot service:
```bash
# Example using screenshotapi.net (if you have API key)
curl "https://shot.screenshotapi.net/screenshot?token=YOUR_TOKEN&url=https://swordtruth-control-tower.netlify.app&output=image&file_type=png&wait_for_event=load" > screenshot.png
```

#### 3. Install System Dependencies (If you have sudo)
```bash
# Ubuntu/Debian
sudo apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2

# Then run
npx playwright install-deps
npx playwright install chromium
```

### Quick Screenshot Script (No Dependencies)

For testing deployed apps, use `curl` to verify HTML:

\`\`\`bash
# Check if app is loading
curl -s https://swordtruth-control-tower.netlify.app | grep -E "Control Tower|command-bar|hex-stat" | head -5

# Check TPUSA Intel
curl -s https://swordtruth-tpusa-intel.netlify.app | grep -E "TPUSA Intel|messages.html|settings.html"

# Check Scholarship Hunt  
curl -s https://swordtruth-scholarship-hunt.netlify.app | grep -E "Scholarship Hunt|calendar.html|profile.html"
\`\`\`

## Usage from Claude Code

Since Playwright doesn't work in this environment, the tool is provided for future use when dependencies are available or when running on a system with proper browser support.

**Current workaround:** Have Brian test the apps on his phone/browser and send screenshots via Telegram.
