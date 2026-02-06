# Production-Ready Vibe Coding Development Playbook

This playbook provides development standards, security checklists, and hostile audit prompts for building production-grade software. Copy-paste the prompts directly into Claude or your AI assistant to run comprehensive audits.

## Quick Reference - When to Use What

| Situation | Use This |
|-----------|----------|
| Starting new project | Core Development Rules |
| Pre-commit review | Security Checklist Prompt |
| Database design review | Database Audit Prompt |
| Mobile app review | Mobile App Audit Prompt |
| Pre-launch review | Production Readiness Prompt |
| Performance concerns | Scalability Audit Prompt |
| Security review | Security Audit Prompt |
| Backend/API review | Systems Audit Prompt |
| UI/UX review | UI Audit Prompt |

## Core Development Rules

### Non-Negotiable Principles:
- Define data model BEFORE writing component code
- Start with mock/seed data instead of database connections
- Create component library - every UI element in /components
- Centralize state management from day one
- Split code into multiple files by feature/domain
- Double-check you're changing the correct files
- Ask follow-up questions if requirements are unclear
- Batch implementation into smaller, testable chunks

### Security Requirements:
- NEVER hardcode secrets, API keys, or credentials
- Use environment variables for all configuration
- Implement input validation on ALL user inputs
- Apply principle of least privilege
- Use HTTPS in production

### Code Quality Standards:
- TypeScript strict mode required
- All functions must have JSDoc comments
- Error handling for all async operations
- Meaningful variable/function names
- No console.log in production (use proper logger)

### Standard File Structure:
```
/src
  /components    # Reusable UI components
  /features      # Feature-based modules
  /hooks         # Custom React hooks
  /lib           # Utilities, helpers, config
  /services      # API calls, external services
  /types         # TypeScript type definitions
  /styles        # Global styles, theme
```

## Pre-Implementation Checklist

Before implementing, clarify:
- Which Tailwind version? (v3 vs v4 syntax differs)
- What authentication provider? (Clerk, Auth0, custom)
- Existing component library to match?
- Design system or brand guidelines?

## Authentication Pattern Options

### Option 1: Clerk (Recommended for rapid dev)
- Pros: Drop-in components, social login, org management
- Cons: External dependency, cost at scale

### Option 2: Auth.js (NextAuth)
- Pros: Flexible, many providers, open source
- Cons: More setup, session management complexity

### Option 3: Supabase Auth
- Pros: Integrated with DB, Row Level Security
- Cons: Tied to Supabase ecosystem

### For Enterprise:
- Microsoft Entra (Azure AD) via OIDC
- SCIM 2.0 for user provisioning
- MFA required for admin roles

## Security Checklist Prompt

Copy and run this prompt to validate security before commit:

```
SECURITY SCAN CHECKLIST - RUN NOW

Review this codebase and verify each item:

PRE-COMMIT VALIDATION:
- [ ] No hardcoded secrets (grep for API_KEY, PASSWORD, SECRET, TOKEN)
- [ ] All user inputs validated (Zod schemas or equivalent)
- [ ] SQL queries use parameterized statements
- [ ] XSS prevention (sanitize HTML output)
- [ ] CSRF tokens on forms
- [ ] Rate limiting on auth endpoints
- [ ] Proper CORS configuration
- [ ] Secure headers (Helmet.js or equivalent)

SECRET HANDLING:
- [ ] .env files in .gitignore
- [ ] No secrets in logs or error messages
- [ ] No secrets in client-side code
- [ ] Environment variables for all config

For each finding:
1. State the issue
2. File and line number
3. Severity (Critical/High/Medium/Low)
4. Recommended fix

Output format:
PASS: [item] - verified at [location]
FAIL: [item] - [issue] at [location] - Fix: [recommendation]
```

## Hostile Audit Prompts

### Operating Stance for All Audits:
- Assume the system lies unless proven otherwise
- "It works in dev" proves nothing
- If integrity depends on discipline, it is broken

---

## Database Audit Prompt

```
DATABASE HOSTILE AUDIT

You are a hostile database auditor. Your job is to find every way this schema fails.

ATTACK VECTORS TO TEST:
1. Injection: Can raw SQL be injected anywhere?
2. Data integrity: What happens with NULL, empty string, max-length?
3. Race conditions: Concurrent writes to same record?
4. Cascade failures: DELETE on parent - what breaks?
5. Index abuse: Queries that will full-table scan at scale?
6. Type coercion: Implicit casts that lose precision?

FOR EACH TABLE:
- What's the cardinality? Will it scale?
- Are foreign keys enforced at DB level?
- Is there an audit trail?
- Can data be soft-deleted and restored?

DELIVERABLE:
List every failure mode. No "looks good" allowed.
```

## Mobile App Audit Prompt

```
MOBILE APP HOSTILE AUDIT

Assume this app will be reverse-engineered, decompiled, and run on rooted/jailbroken devices.

ATTACK SURFACE:
1. Local storage: What's stored unencrypted?
2. Network: Certificate pinning? API keys in binary?
3. Auth tokens: How are they stored? Rotation policy?
4. Deep links: Can malicious links trigger actions?
5. Screenshot/screen recording: Sensitive data visible?
6. Clipboard: Secrets copied to clipboard?
7. Biometrics: Fallback if Face ID fails?
8. Offline mode: What cached data is accessible?

PERMISSION AUDIT:
- List every permission requested
- Justify each one
- Flag any that seem excessive

BINARY ANALYSIS:
- Can API endpoints be extracted?
- Are there debug flags left enabled?
- Obfuscation level?

DELIVERABLE:
Assume attacker has physical device access. What can they extract?
```

## Production Readiness Prompt

```
PRODUCTION READINESS HOSTILE AUDIT

This system goes live tomorrow. Find every way it will fail in production.

FAILURE MODES TO TEST:
1. What happens when the database is unreachable for 30 seconds?
2. What happens when a third-party API returns 500?
3. What happens when memory exceeds limits?
4. What happens at 10x current traffic?
5. What happens when SSL cert expires?
6. What happens during deployment (zero-downtime?)?

OPERATIONAL READINESS:
- [ ] Health check endpoints exist and are meaningful
- [ ] Structured logging with correlation IDs
- [ ] Error tracking (Sentry or equivalent)
- [ ] Alerting configured for critical paths
- [ ] Runbooks for common incidents
- [ ] Backup and restore tested (not just configured)

ROLLBACK PLAN:
- How do you rollback a bad deploy?
- How do you rollback a bad migration?
- What's the data loss window?

DELIVERABLE:
List every way this will wake someone up at 3am. Be specific.
```

## Scalability Audit Prompt

```
SCALABILITY HOSTILE AUDIT

Assume traffic will 100x overnight. Find every bottleneck.

LOAD ANALYSIS:
1. Identify the slowest endpoint. Why is it slow?
2. What's the DB query with highest cost?
3. Where are N+1 queries hiding?
4. What operations are synchronous that should be async?
5. What's the cache hit ratio? Cache invalidation strategy?

RESOURCE LIMITS:
- Connection pool sizes
- Worker/thread counts
- Memory limits per process
- File descriptor limits
- Rate limits (and what happens when hit)

HORIZONTAL SCALING:
- Can you add more instances? What breaks?
- Session affinity required? Why?
- Shared state between instances?

DELIVERABLE:
Graph the expected failure point. At what load does each component break?
```

## Security Audit Prompt

```
SECURITY HOSTILE AUDIT

You are a penetration tester. Your goal is unauthorized access.

AUTHENTICATION:
1. Brute force: Rate limiting? Account lockout?
2. Session: Timeout? Rotation on privilege change?
3. Password: Complexity? Breach database check?
4. MFA: Bypassable? Backup codes secure?
5. OAuth: State parameter validated? Token storage?

AUTHORIZATION:
1. IDOR: Can user A access user B's data by changing IDs?
2. Privilege escalation: Can user become admin?
3. Missing function-level access control?
4. Direct object references in URLs?

DATA:
1. PII: Where is it? Encrypted at rest?
2. Logs: Do they contain sensitive data?
3. Exports: Can users export others' data?
4. Deletion: Is it actually deleted? Backups?

INFRASTRUCTURE:
1. Exposed ports/services?
2. Outdated dependencies with CVEs?
3. Default credentials anywhere?
4. Debug endpoints in production?

DELIVERABLE:
For each vulnerability: Severity, exploit steps, remediation.
```

## Systems Audit Prompt

```
SYSTEMS/BACKEND HOSTILE AUDIT

You are auditing the backend for reliability and correctness.

API DESIGN:
1. Are all endpoints idempotent that should be?
2. Pagination: Cursor-based or offset? What at 1M records?
3. Versioning strategy?
4. Error responses: Consistent? Informative but not leaky?

DATA CONSISTENCY:
1. Transactions: Where are they missing?
2. Eventual consistency: Is it handled correctly?
3. Distributed operations: Two-phase commit needed?
4. Duplicate requests: Idempotency keys?

FAILURE HANDLING:
1. Retry logic: Exponential backoff? Jitter?
2. Circuit breakers: Configured for external services?
3. Timeouts: Set on all external calls?
4. Dead letter queues: For failed async jobs?

OBSERVABILITY:
1. Can you trace a request end-to-end?
2. Are business metrics exposed?
3. Can you replay failed operations?

DELIVERABLE:
List every way data can become inconsistent. Be exhaustive.
```

## UI Audit Prompt

```
UI/UX HOSTILE AUDIT

You are a user who wants to break things and get confused.

EDGE CASES:
1. Empty states: What shows with zero data?
2. Error states: Network fail, validation fail, server error
3. Loading states: Skeleton? Spinner? Nothing?
4. Long content: Truncation? Overflow? Layout break?
5. Rapid clicks: Double-submit? Race conditions?

ACCESSIBILITY:
1. Keyboard navigation: Can you tab through everything?
2. Screen reader: ARIA labels present?
3. Color contrast: WCAG AA compliant?
4. Focus indicators: Visible?
5. Touch targets: 44x44px minimum?

RESPONSIVENESS:
1. Mobile: Does it work at 320px width?
2. Tablet: Awkward middle ground handled?
3. Desktop: Wasted space at 2560px?
4. Orientation: Landscape mode work?

PERFORMANCE:
1. First paint: Under 1.5s?
2. Interaction delay: Under 100ms?
3. Bundle size: Code splitting?
4. Images: Lazy loaded? Optimized formats?

DELIVERABLE:
Screenshot or describe every broken state you can find.
```

---

---

## Quick Copy Replacements Reference

| Dangerous Term | Safe Replacement |
|----------------|------------------|
| Guaranteed | Estimated |
| Verified | Derived from provided inputs |
| Recommendation | Option summary |
| Should | Consider |
| Accurate | Best-effort; may be incomplete |
| Monitoring | User-initiated refresh |
| Live | Last run at [timestamp] |
| will never | unlikely to |
| always | typically |
| impossible | extremely difficult |

## Default Fail-Closed States Reference

| Condition | Display Message |
|-----------|-----------------|
| Unknown | "Blocked - missing required input" |
| Partial | "Incomplete - output not final" |
| Stale | "Stale - last run [timestamp]; rerun required" |
| Mismatch | "Invalid scope - output belongs to different subject" |
| Backend down | "Unavailable - no output produced" |

## Auto High-Severity Red Flags

### Database:
- No FK constraints but code assumes relations
- No UNIQUE constraints but code assumes uniqueness
- Multi-table writes without transactions
- "Latest" reads without deterministic tie-breaker
- Offset pagination on rapidly changing datasets
- App starts on wrong schema and "mostly works"
- DB errors mapped to empty success outputs
- Backups claimed but never restore-tested

### UI:
- Score without confidence/provenance
- Green check implying correctness
- "Live/monitoring" semantics without consent
- Empty clean state after failure
- Export without scope/timestamp/source
- Execution/advice-implying buttons

---

## Usage Notes

1. **Run audits early and often** — don't wait until pre-launch
2. **Document findings** — create tickets for each issue
3. **Prioritize by severity** — Critical/High first
4. **Re-audit after fixes** — verify remediations work
5. **Automate what you can** — security scans in CI/CD
6. **Silent success is forbidden** — every failure must be visible
