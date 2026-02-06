# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Secrets

All tokens stored in `/root/.openclaw/secrets/keys.env` (chmod 600, outside workspace).
- `GITHUB_TOKEN` — brianference, repo scope, expires ~May 2026
- `NETLIFY_TOKEN` — swordtruth-kanban deploys

To load in scripts: `source /root/.openclaw/secrets/keys.env`

**Rules:**
- Never hardcode tokens in workspace files, scripts, or HTML
- Never commit secrets to git
- Always reference via env vars or the secrets file
- Rotate tokens if exposed in logs

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
