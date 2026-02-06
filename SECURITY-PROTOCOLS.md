# Security Protocols - OpenClaw Workspace

**Last Updated:** 2026-02-06

## Overview

All code, builds, and infrastructure must follow these security protocols. No exceptions.

---

## 1. Before Building Anything

### Pre-Build Security Checklist

- [ ] Read `vibe-coding-patterns` skill for production standards
- [ ] Read `pentest` skill for security review methodology
- [ ] Check if handling user data → plan encryption at rest
- [ ] Check if public URL → plan authentication
- [ ] Check if storing passwords → use PBKDF2/Argon2
- [ ] Review OWASP Top 10 for relevant threats

### Skills to Invoke

| Skill | When | Purpose |
|-------|------|---------|
| **vibe-coding-patterns** | All builds | Production-ready code standards, security checklists |
| **pentest** | Security audits | Systematic vulnerability review, SAST scans |
| **build-verify-deploy** | Before claiming done | Forces evidence, prevents "saying done but not done" |
| **modern-app-standards** | All apps | Ensures baseline features (auth, dark mode, search, etc.) |

---

## 2. Mandatory Security Features

### For ALL Public-Facing Apps

1. **Authentication** - No unauthenticated admin/sensitive endpoints
2. **Rate Limiting** - Prevent brute force and abuse
3. **HTTPS Only** - No plain HTTP in production
4. **CORS Headers** - Explicit origin allowlist (avoid `*` unless public API)
5. **CSP Headers** - Content Security Policy to prevent XSS
6. **Input Validation** - Server-side validation on all inputs
7. **SQL Injection Protection** - Parameterized queries or ORM
8. **XSS Protection** - Sanitize user-generated content
9. **CSRF Tokens** - For state-changing operations
10. **Security Headers** - X-Frame-Options, X-Content-Type-Options, etc.

### For Apps with User Data

1. **Encryption at Rest** - AES-256 for sensitive data
2. **Encryption in Transit** - TLS 1.2+ only
3. **Password Hashing** - PBKDF2 (100K+ iterations) or Argon2
4. **Secrets Management** - Never hardcode tokens, use env vars
5. **Data Minimization** - Collect only what's needed
6. **Audit Logging** - Log sensitive operations
7. **Session Management** - Secure cookies, timeout, rotation

---

## 3. Secret Management Rules

### NEVER Do This

- ❌ Hardcode API keys in code
- ❌ Commit secrets to git (even private repos)
- ❌ Store secrets in frontend JavaScript
- ❌ Log full tokens (mask as `***...***`)
- ❌ Share secrets in plain text (Slack, email, etc.)

### ALWAYS Do This

- ✅ Store secrets in `/root/.openclaw/secrets/keys.env` (chmod 600)
- ✅ Reference via environment variables
- ✅ Use `.gitignore` to exclude secrets
- ✅ Rotate tokens after exposure
- ✅ Use separate tokens for dev/staging/prod
- ✅ Document secret rotation process

### Current Secrets Location

```bash
# All tokens in one place, chmod 600
/root/.openclaw/secrets/keys.env

# Load in scripts:
source /root/.openclaw/secrets/keys.env
```

**Contents (example):**
```bash
GITHUB_TOKEN=ghp_***...***
NETLIFY_TOKEN=***...***
OPENAI_API_KEY=sk-***...***
```

---

## 4. Security Review Process

### When to Invoke Pentest Skill

1. **Before first deployment** - Initial security audit
2. **After major features** - New auth, payment, file upload, etc.
3. **On user request** - Brian asks for "hostile audit" or "security review"
4. **Pre-production** - Final check before marking as production-ready
5. **After dependency updates** - Check for new vulnerabilities

### How to Use Pentest Skill

```bash
# 1. Read the skill
cat /root/.openclaw/workspace/skills/pentest/SKILL.md

# 2. Follow the workflow:
# - Scope (what to audit)
# - Automated scan (SAST tools)
# - Manual review (auth, input, crypto)
# - Active testing (if authorized)
# - Categorize (severity ratings)
# - Report (with remediation)

# 3. Document findings
# - Create AUDIT-[PROJECT].md
# - List Critical/High/Medium/Low issues
# - Provide specific file:line locations
# - Include remediation steps
```

### SAST Tools to Use

- **JavaScript/TypeScript:** ESLint with security plugins
- **Python:** Bandit, Safety
- **Dependencies:** npm audit, Snyk, Dependabot
- **Secrets:** Gitleaks, TruffleHog
- **Containers:** Trivy, Hadolint
- **Infrastructure:** Checkov, tfsec

---

## 5. Hostile Audit Protocol

When Brian says "hostile audit" or "security audit", invoke the pentest skill with maximum severity.

### Attack Surface Review

1. **Authentication** - Bypass attempts, brute force, session fixation
2. **Authorization** - Privilege escalation, IDOR, path traversal
3. **Input Validation** - SQL injection, XSS, command injection, file upload
4. **Crypto** - Weak algorithms, hardcoded keys, bad RNG
5. **Logic Flaws** - Race conditions, business logic bypass
6. **Infrastructure** - Exposed ports, default credentials, misconfigurations
7. **Dependencies** - Known CVEs, outdated packages

### Report Format

```markdown
# Security Audit - [Project Name]

**Date:** YYYY-MM-DD
**Severity Summary:** X Critical, Y High, Z Medium, W Low

## Critical Issues (Block Release)
- [ ] **Issue 1** - Description, location, impact, remediation

## High Issues (Fix Before Production)
- [ ] **Issue 2** - ...

## Medium Issues (Fix Soon)
- [ ] **Issue 3** - ...

## Low Issues (Nice to Have)
- [ ] **Issue 4** - ...
```

---

## 6. Production Deployment Checklist

Before marking ANY project as "production-ready":

- [ ] Security audit complete (pentest skill)
- [ ] No Critical or High vulnerabilities
- [ ] Secrets moved to environment variables
- [ ] HTTPS enforced
- [ ] Rate limiting configured
- [ ] Error messages don't leak info
- [ ] Logging configured (no sensitive data logged)
- [ ] Backup/recovery plan documented
- [ ] Monitoring/alerting configured
- [ ] Incident response plan defined

---

## 7. Continuous Security

### Automated Checks

- **Pre-commit:** Gitleaks secret scan
- **CI/CD:** npm audit, SAST scans, dependency checks
- **Production:** Security headers validation, SSL/TLS checks
- **Monitoring:** Failed login attempts, rate limit violations

### Periodic Reviews

- **Weekly:** Dependency updates (npm audit, Dependabot)
- **Monthly:** Access review, rotate tokens
- **Quarterly:** Full penetration test, infrastructure review
- **Annually:** Compliance audit (if applicable)

---

## 8. Incident Response

If a security issue is discovered:

1. **Assess** - Severity and scope
2. **Contain** - Rotate tokens, block IPs, disable features
3. **Remediate** - Fix vulnerability, deploy patch
4. **Document** - Post-mortem, lessons learned
5. **Notify** - Inform Brian immediately for Critical/High issues

---

## 9. Security Knowledge Base

### OWASP Top 10 (2021)

1. Broken Access Control
2. Cryptographic Failures
3. Injection
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable and Outdated Components
7. Identification and Authentication Failures
8. Software and Data Integrity Failures
9. Security Logging and Monitoring Failures
10. Server-Side Request Forgery (SSRF)

### References

- OWASP Cheat Sheets: https://cheatsheetseries.owasp.org/
- CWE Top 25: https://cwe.mitre.org/top25/
- NIST Cybersecurity Framework: https://www.nist.gov/cyberframework
- SANS Top 25: https://www.sans.org/top25-software-errors/

---

## 10. Tools Installed

- **agent-browser** (v0.9.1) - Browser automation, content scraping
- **playwright-cli** (v0.0.66) - Playwright automation
- **clawhub** - Skill management with security scanning

### Security-Specific Skills

- **vibe-coding-patterns** - Production-ready code standards
- **pentest** - Security review methodology (NEW 2026-02-06)
- **build-verify-deploy** - Evidence-based completion
- **test-master** - Testing strategies including security tests

---

## Quick Reference

```bash
# Before starting any build
read /root/.openclaw/workspace/skills/vibe-coding-patterns/SKILL.md
read /root/.openclaw/workspace/skills/pentest/SKILL.md

# Before deploying
read /root/.openclaw/workspace/skills/build-verify-deploy/SKILL.md

# Security audit
read /root/.openclaw/workspace/skills/pentest/SKILL.md
# Follow: Scope → Automated → Manual → Test → Categorize → Report

# Check for secrets in code
git grep -i "api_key\|secret\|password\|token" -- ':!*.md' ':!SECURITY-PROTOCOLS.md'

# Rotate exposed token
vim /root/.openclaw/secrets/keys.env
# Update relevant services
# Redeploy apps
```

---

**Maintained by:** Cole AI  
**Applies to:** All workspace projects  
**Mandatory:** Yes - security is non-negotiable
