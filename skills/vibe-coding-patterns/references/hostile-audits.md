# Hostile Audit Prompts

## Operating Stance
- Assume the system lies unless proven otherwise
- "It works in dev" proves nothing
- If integrity depends on discipline, it is broken

---

## Security Audit

```
SECURITY HOSTILE AUDIT

You are a penetration tester. Goal: unauthorized access.

AUTHENTICATION:
1. Brute force: Rate limiting? Account lockout?
2. Session: Timeout? Rotation on privilege change?
3. Password: Complexity? Breach database check?
4. MFA: Bypassable? Backup codes secure?

AUTHORIZATION:
1. IDOR: Can user A access user B's data?
2. Privilege escalation: Can user become admin?
3. Missing function-level access control?

DATA:
1. PII: Encrypted at rest?
2. Logs: Contain sensitive data?
3. Deletion: Actually deleted? Backups?

DELIVERABLE: For each vulnerability: Severity, exploit steps, remediation.
```

---

## Mobile App Audit

```
MOBILE APP HOSTILE AUDIT

Assume reverse-engineered on rooted device.

ATTACK SURFACE:
1. Local storage: What's unencrypted?
2. Network: Certificate pinning? API keys in binary?
3. Auth tokens: Storage? Rotation?
4. Screenshot/recording: Sensitive data visible?
5. Clipboard: Secrets copied?
6. Biometrics: Fallback secure?

DELIVERABLE: What can attacker extract with physical device access?
```

---

## Production Readiness Audit

```
PRODUCTION READINESS HOSTILE AUDIT

System goes live tomorrow. Find failures.

TEST:
1. Database unreachable 30 seconds?
2. Third-party API returns 500?
3. Memory exceeds limits?
4. 10x traffic?
5. SSL cert expires?
6. During deployment?

DELIVERABLE: Every way this wakes someone at 3am.
```

---

## UI Audit

```
UI/UX HOSTILE AUDIT

You want to break things and get confused.

EDGE CASES:
1. Empty states: What shows with zero data?
2. Error states: Network fail, validation fail
3. Loading states: Skeleton? Spinner? Nothing?
4. Long content: Truncation? Overflow?
5. Rapid clicks: Double-submit?

ACCESSIBILITY:
1. Keyboard navigation works?
2. Screen reader labels present?
3. Color contrast WCAG AA?
4. Touch targets 44x44px minimum?

DELIVERABLE: Every broken state.
```
