# QR Code Generation Skill

## Purpose
Generate QR codes for URLs, text, or data. Outputs PNG file and optional HTML viewer.

## Usage
When Brian needs a QR code for sharing links, especially for mobile apps (Expo, etc.)

## Dependencies
- `qrencode` (pre-installed)
- Python 3 HTTP server for viewing

## Generate QR Code

```bash
# Basic PNG generation
qrencode -s 10 -o output.png "URL_OR_TEXT_HERE"

# With custom size (scale factor)
qrencode -s 15 -o output.png "text"

# High error correction (L/M/Q/H)
qrencode -l H -s 10 -o output.png "text"
```

## HTML Viewer Template

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>QR Code</title>
<style>
  body {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #0a0e27;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #fff;
  }
  .container { text-align: center; padding: 40px 20px; }
  h1 { font-size: 24px; margin-bottom: 10px; font-weight: 600; }
  .subtitle { font-size: 14px; color: #8b92a8; margin-bottom: 40px; }
  .qr-container {
    background: #fff;
    padding: 30px;
    border-radius: 20px;
    display: inline-block;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    margin-bottom: 30px;
  }
  .url {
    font-size: 16px;
    color: #4a9eff;
    background: #1a1f3a;
    padding: 12px 20px;
    border-radius: 8px;
    display: inline-block;
    font-family: 'Courier New', monospace;
    margin-top: 20px;
    word-break: break-all;
    max-width: 90%;
  }
  .instructions {
    margin-top: 30px;
    font-size: 14px;
    color: #8b92a8;
    max-width: 400px;
  }
</style>
</head>
<body>
<div class="container">
  <h1>📱 QR Code</h1>
  <p class="subtitle">Scan to open</p>
  
  <div class="qr-container">
    <div id="qrcode"></div>
  </div>
  
  <div class="url" id="url">Loading...</div>
  
  <div class="instructions">
    Point your camera at the QR code to scan
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
<script>
const url = 'REPLACE_WITH_URL';
document.getElementById('url').textContent = url;

QRCode.toCanvas(url, {
  errorCorrectionLevel: 'M',
  width: 300,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#ffffff'
  }
}, function (err, canvas) {
  if (err) {
    console.error(err);
    document.getElementById('qrcode').innerHTML = '<p style="color:#f85149">QR generation failed</p>';
    return;
  }
  document.getElementById('qrcode').appendChild(canvas);
});
</script>
</body>
</html>
```

## Quick Workflow

```bash
# Generate QR code
qrencode -s 10 -o qr.png "https://example.com"

# Start local server to view
cd $(dirname qr.png)
python3 -m http.server 8765 --bind 0.0.0.0 &

# Access at http://localhost:8765/qr.png
```

## Tips
- Size `-s 10` works well for most uses
- Error correction `M` (default) balances size and reliability
- For Expo URLs, use `exp://` scheme
- Always test scan with actual device before sharing
