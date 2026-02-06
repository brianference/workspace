# Top 10 OpenClaw Advanced Tips

**Created:** 2026-02-05  
**Status:** Safe improvements (no hooks, no risky features)

---

## 1. Config Includes ($include) — Split Large Configs
Split your config into multiple files for organization:
```json5
// ~/.openclaw/openclaw.json
{
  gateway: { port: 18789 },
  agents: { $include: "./agents.json5" },
}
```
**Risk:** Low — just file organization  
**Benefit:** Cleaner configs, easier to manage multiple agents

---

## 2. Env Var Substitution in Config
Reference environment variables directly in config strings:
```json5
{
  gateway: {
    auth: { token: "${OPENCLAW_GATEWAY_TOKEN}" }
  }
}
```
**Risk:** Low — keeps secrets out of config files  
**Benefit:** Security + portability

---

## 3. config.patch for Safe Partial Updates
Use `config.patch` instead of `config.apply` to change specific keys without clobbering the whole config:
```bash
openclaw gateway call config.patch --params '{
  "raw": "{ channels: { telegram: { groups: { \"*\": { requireMention: false } } } } }",
  "baseHash": "<from-config.get>"
}'
```
**Risk:** Low — safer than full config replacement  
**Benefit:** Surgical config changes, less risk of breaking things

---

## 4. Per-Agent Identity (SOUL.md alternative in config)
Set identity directly in config for consistent defaults:
```json5
{
  agents: {
    list: [{
      id: "main",
      identity: {
        name: "Cole",
        emoji: "⚡",
        avatar: "avatars/cole.png"
      }
    }]
  }
}
```
**Risk:** Low — just metadata  
**Benefit:** Auto-generates mention patterns, reaction emoji

---

## 5. Cron Jobs for Scheduled Tasks
Use `cron` tool for precise scheduling instead of heartbeat for everything:
```
Morning briefing at 8 AM
Weekly reports on Fridays
One-shot reminders
```
**Risk:** Low — isolated execution  
**Benefit:** Exact timing, different models per job, no session context pollution

---

## 6. DM Pairing Mode (Security)
Set `dmPolicy: "pairing"` so unknown senders get a code you must approve:
```json5
{
  channels: {
    telegram: { dmPolicy: "pairing" }
  }
}
```
**Risk:** None — improves security  
**Benefit:** Strangers can't talk to your bot without approval

---

## 7. Logging Redaction
Automatically redact sensitive data from logs:
```json5
{
  logging: {
    redactSensitive: "tools",
    file: "/tmp/openclaw/openclaw.log"
  }
}
```
**Risk:** None — just logging config  
**Benefit:** Prevents token leaks in logs

---

## 8. Sub-Agent Spawning (sessions_spawn)
Offload complex tasks to isolated sub-agents:
```
sessions_spawn with different model
Run in background, announces result when done
Keeps main session responsive
```
**Risk:** Low — isolated sessions  
**Benefit:** Parallel work, different models for different tasks

---

## 9. Security Audit + Doctor
Run regularly:
```bash
openclaw security audit --deep
openclaw doctor --fix
```
**Risk:** None — just diagnostics  
**Benefit:** Catches misconfigurations before they cause problems

---

## 10. Sandbox Mode for Untrusted Operations
Use sandbox for risky operations:
```json5
{
  agents: {
    defaults: {
      sandbox: { mode: "all", scope: "session" }
    }
  }
}
```
**Risk:** None — adds protection  
**Benefit:** Isolates exec commands from host system

---

## ⚠️ AVOID THESE (Known Issues)

- **Hooks** — Caused hours of troubleshooting (2026-02-05). Don't enable.
- **Full config.apply** without backup — Use config.patch instead
- **groupPolicy: "open"** — Security risk
- **Running as root** — Create dedicated user if possible

---

## Next Steps to Implement

1. [ ] Add logging redaction to config
2. [ ] Set up morning briefing cron (8 AM MST)
3. [ ] Run security audit
4. [ ] Consider sandbox mode for risky operations

---

*Sources: docs.openclaw.ai, Habr security guide, Creator Economy tutorial*
