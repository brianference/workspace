---
name: vibe-coding-patterns
description: Production-ready coding standards, security checklists, and hostile audit prompts. Use when starting new projects, reviewing code pre-commit, auditing security, or ensuring production readiness. Triggers on mentions of security audit, code review, production ready, best practices, hostile audit.
---

# Vibe Coding Patterns

Production-ready development standards for AI-assisted coding.

## Core Principles

1. **Define data model BEFORE writing components**
2. **Start with mock/seed data** — not database connections
3. **Component library** — every UI element in /components
4. **Centralize state management** from day one
5. **Split code by feature/domain**
6. **Ask follow-up questions** if requirements unclear
7. **Batch into smaller, testable chunks**

## Security Non-Negotiables

- NEVER hardcode secrets, API keys, credentials
- Use environment variables for all config
- Input validation on ALL user inputs
- Principle of least privilege
- HTTPS in production

## Code Quality Standards

- TypeScript strict mode required
- JSDoc comments on all functions
- Error handling for all async operations
- Meaningful variable/function names
- No console.log in production (use logger)

## Standard File Structure

```
/src
  /components    # Reusable UI
  /features      # Feature modules
  /hooks         # Custom hooks
  /lib           # Utilities
  /services      # API calls
  /types         # TypeScript types
  /styles        # Global styles
```

## Reference Files

| Topic | File | When to Load |
|-------|------|--------------|
| Security Checklist | `references/security-checklist.md` | Pre-commit review |
| Hostile Audits | `references/hostile-audits.md` | Security review, pre-launch |
| Auth Patterns | `references/auth-patterns.md` | Implementing authentication |
| Safe Copy | `references/safe-copy.md` | UI text review |

## Quick Security Scan

Before any commit:
```
[ ] No hardcoded secrets (grep for API_KEY, PASSWORD, SECRET, TOKEN)
[ ] All user inputs validated
[ ] SQL queries parameterized
[ ] XSS prevention in place
[ ] .env files in .gitignore
[ ] No secrets in logs
```

## Fail-Closed States

| Condition | Display |
|-----------|---------|
| Unknown | "Blocked - missing required input" |
| Partial | "Incomplete - output not final" |
| Stale | "Stale - last run [timestamp]" |
| Error | Loud, obvious, non-optimistic |
