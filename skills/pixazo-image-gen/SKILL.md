# Pixazo Image Generation Skill

## Purpose
Generate images using Pixazo.ai's free Flux Schnell API.

## Usage
When Brian asks to generate an image, use this skill.

## Setup
- Token in `/root/.openclaw/secrets/keys.env` as `PIXAZO_TOKEN`
- Free tier: 10 requests/min
- Max resolution: 1024×1024

## How to Generate

```bash
source /root/.openclaw/secrets/keys.env && curl -X POST "https://gateway.pixazo.ai/flux-1-schnell/v1/getData" \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: $PIXAZO_TOKEN" \
--data-raw "{
  \"prompt\": \"PROMPT_HERE\",
  \"num_steps\": 4,
  \"height\": 1024,
  \"width\": 1024
}"
```

## Response Format
```json
{
  "output": "https://pub-582b7213209642b9b995c96c95a30381.r2.dev/flux-schnell-cf/prompt-XXXXX.png"
}
```

## Parameters
- `prompt` (required): Text description
- `num_steps` (optional): 4-8, default 4 (higher = better quality, slower)
- `height` (optional): pixels, default 1024
- `width` (optional): pixels, default 1024
- `seed` (optional): for reproducible results

## Tips
- Keep prompts descriptive and specific
- Default settings work well for most use cases
- Images are hosted on Cloudflare R2 (fast CDN)
- No watermarks on free tier
