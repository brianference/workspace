#!/usr/bin/env node
/**
 * Playwright Screenshot Tool for Claude Code
 * 
 * Usage:
 *   node screenshot.js <url> [output-path]
 *   npm run screenshot <url> [output-path]
 * 
 * Examples:
 *   node screenshot.js https://swordtruth-control-tower.netlify.app
 *   node screenshot.js https://example.com ./screenshots/example.png
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function takeScreenshot(url, outputPath) {
  // Default output path
  if (!outputPath) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const domain = new URL(url).hostname.replace(/\./g, '_');
    outputPath = path.join(__dirname, '../screenshots', `${domain}_${timestamp}.png`);
  }

  // Ensure screenshots directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  console.log(`📸 Taking screenshot of ${url}...`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 }, // iPhone 14 size
      deviceScaleFactor: 3
    });

    await page.goto(url, { waitUntil: 'networkidle' });

    // Wait a bit for any animations
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: outputPath,
      fullPage: true
    });

    console.log(`✅ Screenshot saved to: ${outputPath}`);
    console.log(`📁 Absolute path: ${path.resolve(outputPath)}`);

    return outputPath;
  } catch (error) {
    console.error(`❌ Error taking screenshot: ${error.message}`);
    throw error;
  } finally {
    await browser.close();
  }
}

// CLI usage
if (require.main === module) {
  const url = process.argv[2];
  const outputPath = process.argv[3];

  if (!url) {
    console.error('Usage: node screenshot.js <url> [output-path]');
    process.exit(1);
  }

  takeScreenshot(url, outputPath)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { takeScreenshot };
