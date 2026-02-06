# Security Checklist

## Pre-Commit Validation

```
[ ] No hardcoded secrets (grep for API_KEY, PASSWORD, SECRET, TOKEN)
[ ] All user inputs validated (Zod schemas or equivalent)
[ ] SQL queries use parameterized statements
[ ] XSS prevention (sanitize HTML output)
[ ] CSRF tokens on forms
[ ] Rate limiting on auth endpoints
[ ] Proper CORS configuration
[ ] Secure headers (Helmet.js or equivalent)
```

## Secret Handling

```
[ ] .env files in .gitignore
[ ] No secrets in logs or error messages
[ ] No secrets in client-side code
[ ] Environment variables for all config
```

## Output Format

For each finding:
1. State the issue
2. File and line number
3. Severity (Critical/High/Medium/Low)
4. Recommended fix

```
PASS: [item] - verified at [location]
FAIL: [item] - [issue] at [location] - Fix: [recommendation]
```

## Auto High-Severity Red Flags

### Database
- No FK constraints but code assumes relations
- No UNIQUE constraints but code assumes uniqueness
- Multi-table writes without transactions
- "Latest" reads without deterministic tie-breaker
- DB errors mapped to empty success outputs

### UI
- Score without confidence/provenance
- Green check implying correctness
- "Live/monitoring" semantics without consent
- Empty clean state after failure
- Export without scope/timestamp/source
