# Skills Usage Plan - 2026-02-06

Strategic plan for maximizing value from newly installed skills.

---

## New Skills Inventory

| Skill | Version | Installed | Purpose |
|-------|---------|-----------|---------|
| **agent-browser-3** | 0.1.0 | 2026-02-06 | Browser automation (Playwright-based) |
| **playwright-cli-2** | 0.1.0 | 2026-02-06 | Playwright CLI automation |
| **test-master** | 0.1.0 | 2026-02-06 | Testing methodology & QA |
| **pentest** | 1.0.0 | 2026-02-06 | Security audits & penetration testing |

**CLI Tools:**
- `agent-browser` v0.9.1 (npm global)
- `playwright-cli` v0.0.66 (npm global)

---

## 1. TPUSA Intel Aggregator (Immediate Priority)

### Current State
- ✅ Backend deployed (Netlify Functions)
- ✅ Frontend with API integration
- ⚠️ No content - needs authenticated scraping

### Skills to Use

#### agent-browser-3 (PRIMARY)
**Use for:** TikTok & X/Twitter content scraping

**Implementation Plan:**
1. **Manual Login & State Save** (One-time setup)
   ```bash
   # TikTok authentication
   agent-browser open https://www.tiktok.com/login
   agent-browser snapshot -i
   # Fill login form manually...
   agent-browser state save tiktok-auth.json
   
   # X/Twitter authentication
   agent-browser open https://twitter.com/login
   agent-browser snapshot -i
   # Fill login form...
   agent-browser state save twitter-auth.json
   ```

2. **Update Scan Function** (`netlify/functions/scan.js`)
   ```javascript
   // Load saved authentication
   await execPromise('agent-browser state load tiktok-auth.json');
   await execPromise(`agent-browser open https://www.tiktok.com/@${handle}`);
   await execPromise('agent-browser snapshot -i --json');
   
   // Parse snapshot for video data
   const snapshot = JSON.parse(stdout);
   // Extract: title, views, likes, shares, thumbnail, videoUrl
   ```

3. **Content Extraction Logic**
   - Parse snapshot for video elements
   - Extract engagement metrics (views, likes, shares)
   - Download thumbnails
   - Store in backend (contentStore)

4. **Scheduled Scanning** (Later)
   - Set up cron job to scan every 6-12 hours
   - Auto-scan all targets
   - Store results in database (when migrated from in-memory)

**Timeline:** 1-2 hours to implement  
**Priority:** HIGH - Brian wants content flowing

---

## 2. Security Audits with pentest

### When to Use
- **Before production deployment** (all apps)
- **After major features** (auth, payments, file uploads)
- **On user request** ("hostile audit", "security review")
- **Pre-release** (final security gate)

### Application to Current Projects

#### A. OpenClaw Mobile (NEXT AUDIT)
**Remaining Issues:**
- HIGH: Implement kanban sync
- HIGH: Add passphrase setup rollback
- MEDIUM: App switcher blur, data export

**Audit Plan:**
1. Read `pentest` skill methodology
2. Run SAST tools:
   - ESLint with security plugins
   - npm audit for dependencies
3. Manual review:
   - Auth flow (passphrase, biometric)
   - Vault encryption implementation
   - AsyncStorage security
4. Test attack surface:
   - Brute force protection (5 attempts)
   - Encrypted data tampering
   - Session management
5. Document findings with severity ratings

**Timeline:** 2-3 hours  
**Priority:** MEDIUM (critical items already fixed)

---

#### B. AI Agent Control Tower
**Audit Focus:**
- Authentication/authorization (gateway token handling)
- API security (rate limiting, input validation)
- WebSocket security (if implemented)
- Session hijacking prevention

**Timeline:** 1-2 hours  
**Priority:** MEDIUM

---

#### C. TPUSA Intel Aggregator
**Audit Focus:**
- API endpoint security (Netlify Functions)
- Rate limiting on scan endpoint
- Input validation (targetId, platform)
- XSS prevention (user-generated content display)
- Secrets management (no tokens in frontend)

**Timeline:** 1 hour  
**Priority:** HIGH (public-facing, handles scraped content)

---

#### D. Scholarship Hunt Pro
**Audit Focus:**
- Data validation (scholarship entries)
- XSS prevention (scholarship descriptions)
- State persistence security
- No sensitive data exposure

**Timeline:** 30 minutes  
**Priority:** LOW (minimal attack surface)

---

## 3. Testing with test-master

### When to Use
- **New features** - Write tests before claiming "done"
- **Critical paths** - Auth, payments, data storage
- **Regression prevention** - Break once, test forever
- **CI/CD integration** - Automated testing on deploy

### Testing Strategy by Project

#### A. TPUSA Intel Aggregator
**Test Coverage Needed:**
1. **Unit Tests** (Jest/Vitest)
   - API endpoint logic
   - Content parsing functions
   - Filter/search logic
   
2. **Integration Tests**
   - Netlify Functions end-to-end
   - Database operations (when migrated)
   - Authentication flow
   
3. **E2E Tests** (Playwright)
   - User workflow: view targets → scan → see content
   - Filter chips functionality
   - Dark mode toggle
   
4. **Security Tests**
   - Rate limiting enforcement
   - Input validation
   - XSS prevention

**Implementation:**
```bash
# Create test structure
mkdir -p tests/{unit,integration,e2e}

# Install dependencies
npm install --save-dev vitest @playwright/test

# Write tests following test-master methodology
# Run in CI/CD before deploy
```

**Timeline:** 3-4 hours  
**Priority:** MEDIUM (after authenticated scraping works)

---

#### B. OpenClaw Mobile
**Test Coverage Needed:**
1. **Unit Tests**
   - Vault encryption/decryption
   - PBKDF2 hashing
   - Auth store logic
   
2. **Integration Tests**
   - Vault CRUD operations
   - Auth flow with SecureStore
   - Kanban sync (when implemented)
   
3. **E2E Tests** (Detox for React Native)
   - Login flow
   - Vault item management
   - Device checks
   - Settings

**Timeline:** 4-5 hours  
**Priority:** HIGH (production release gate)

---

## 4. playwright-cli-2 (Alternative to agent-browser)

### When to Use Over agent-browser

**Use playwright-cli when:**
- Need Playwright-specific features (tracing, video recording)
- Working with complex SPAs (better wait strategies)
- Need Firefox/WebKit testing (agent-browser is Chromium-only)
- Want native Playwright test generation

**Use agent-browser when:**
- Simpler CLI syntax preferred
- Quick scraping tasks
- Already have agent-browser state files

### Practical Applications

#### A. Test Automation
**Use for:** E2E testing of web apps
```bash
# Generate tests by recording interactions
playwright-cli tracing-start
playwright-cli open https://app.example.com
# Perform actions...
playwright-cli tracing-stop trace.zip

# Convert trace to test code
playwright codegen https://app.example.com
```

#### B. Multi-Browser Testing
**Use for:** Cross-browser compatibility
```bash
playwright-cli open --browser=chrome https://app.com
playwright-cli open --browser=firefox https://app.com
playwright-cli open --browser=webkit https://app.com
```

#### C. Browser Debugging
**Use for:** Troubleshooting scraping issues
```bash
playwright-cli open --headed https://tiktok.com
playwright-cli console  # View browser console
playwright-cli network  # Monitor network requests
```

**Timeline:** As needed  
**Priority:** LOW (agent-browser covers most use cases)

---

## 5. Combined Workflows (Maximum Value)

### Workflow A: Secure Feature Development
**Skills:** vibe-coding-patterns + test-master + pentest

1. **Design** - Read vibe-coding-patterns for standards
2. **Build** - Write feature with security in mind
3. **Test** - Use test-master for comprehensive coverage
4. **Audit** - Run pentest skill security review
5. **Deploy** - Ship with confidence

**Apply to:** All new features, especially auth/payment/data

---

### Workflow B: Web Scraping Pipeline
**Skills:** agent-browser-3 + test-master + pentest

1. **Setup** - Authenticate and save state (agent-browser)
2. **Extract** - Build scraping logic
3. **Test** - Validate extraction accuracy (test-master)
4. **Secure** - Audit for injection/XSS (pentest)
5. **Schedule** - Automate with cron

**Apply to:** TPUSA Intel, future scraping projects

---

### Workflow C: Production Deployment
**Skills:** build-verify-deploy + test-master + pentest

1. **Build** - Complete feature
2. **Test** - Run full test suite (test-master)
3. **Audit** - Security review (pentest)
4. **Verify** - Evidence-based completion (build-verify-deploy)
5. **Deploy** - Push to production

**Apply to:** All deployments (mandatory)

---

## 6. Immediate Action Items (Next 24-48h)

### Priority 1: Make TPUSA Intel Functional
**Skills:** agent-browser-3  
**Time:** 2-3 hours  
**Steps:**
1. Authenticate to TikTok/X manually with agent-browser
2. Save state files (tiktok-auth.json, twitter-auth.json)
3. Update scan.js to use saved state
4. Test scraping on one target (Erica Kirk)
5. Deploy updated backend
6. Verify content appears in frontend

**Blocker:** Need to decide on authentication method:
- Option A: Manual login + state save (quick, works offline)
- Option B: Browser Relay (requires setup, real-time auth)

**Recommendation:** Start with Option A (state save) for quick win.

---

### Priority 2: Security Audit TPUSA Intel
**Skills:** pentest  
**Time:** 1-2 hours  
**Steps:**
1. Read pentest skill workflow
2. Run automated scans (npm audit, ESLint security)
3. Manual review (API endpoints, input validation)
4. Document findings
5. Fix Critical/High issues before promoting

---

### Priority 3: Test Coverage for OpenClaw Mobile
**Skills:** test-master  
**Time:** 3-4 hours  
**Steps:**
1. Set up test framework (Jest for React Native)
2. Write unit tests for vault crypto
3. Write integration tests for auth flow
4. Document test coverage
5. Add to CI/CD (if applicable)

---

## 7. Long-Term Integration (Next 30 Days)

### Week 1: TPUSA Intel Production
- ✅ Authenticated scraping working
- ✅ Security audit complete
- ✅ Test coverage >70%
- ✅ Database migration (Supabase)
- ✅ Scheduled scanning (cron)

### Week 2: Mobile App Hardening
- ✅ Remaining HIGH issues fixed
- ✅ Security audit complete
- ✅ Test coverage >80%
- ✅ Beta release to TestFlight/Google Play

### Week 3: Control Tower Enhancement
- ✅ Security audit
- ✅ Test coverage
- ✅ Real-time features (WebSocket)

### Week 4: New Projects
- Apply all skills to new builds
- Document lessons learned
- Refine workflows

---

## 8. Skills Synergy Matrix

| Project | agent-browser | playwright-cli | test-master | pentest |
|---------|---------------|----------------|-------------|---------|
| **TPUSA Intel** | ⭐⭐⭐ PRIMARY | ⭐ BACKUP | ⭐⭐ MEDIUM | ⭐⭐⭐ HIGH |
| **OpenClaw Mobile** | ❌ N/A | ❌ N/A | ⭐⭐⭐ HIGH | ⭐⭐⭐ HIGH |
| **Control Tower** | ⭐ LOW | ⭐ LOW | ⭐⭐ MEDIUM | ⭐⭐ MEDIUM |
| **Scholarship Hunt** | ⭐ LOW | ⭐ LOW | ⭐ LOW | ⭐ LOW |
| **Future Scraping** | ⭐⭐⭐ PRIMARY | ⭐⭐ BACKUP | ⭐⭐ MEDIUM | ⭐⭐ MEDIUM |
| **All New Builds** | ⭐ AS-NEEDED | ⭐ AS-NEEDED | ⭐⭐⭐ MANDATORY | ⭐⭐⭐ MANDATORY |

---

## 9. ROI Analysis

### High ROI Skills (Use Often)
1. **pentest** - Prevents security incidents, builds trust
2. **test-master** - Catches bugs early, reduces rework
3. **agent-browser-3** - Enables content aggregation, automation

### Medium ROI Skills (Use Selectively)
4. **playwright-cli-2** - Redundant with agent-browser, niche use cases

### Skill Combinations (Maximum Value)
- **pentest + vibe-coding-patterns** = Production-ready code
- **agent-browser + test-master** = Reliable scraping
- **test-master + build-verify-deploy** = Zero-defect releases

---

## 10. Training & Documentation

### Self-Training Checklist
- [x] Read all SKILL.md files
- [x] Understand when to use each skill
- [ ] Build test project with agent-browser (TPUSA Intel)
- [ ] Run pentest audit on existing project
- [ ] Write comprehensive tests with test-master
- [ ] Document lessons learned

### Documentation to Create
- [ ] Agent-browser authentication guide
- [ ] Pentest audit template (project-specific)
- [ ] Test coverage standards
- [ ] Skills decision tree (which skill for which task)

---

## Summary

**Immediate Focus:**
1. **agent-browser-3** → Make TPUSA Intel functional (authenticate + scrape)
2. **pentest** → Security audit TPUSA Intel + OpenClaw Mobile
3. **test-master** → Add test coverage to critical projects

**Long-Term Value:**
- **pentest** → Mandatory for all production releases
- **test-master** → Prevent regressions, build confidence
- **agent-browser** → Enable content aggregation business

**Next Steps:**
1. Authenticate TikTok/X with agent-browser (save state)
2. Update TPUSA scan function
3. Deploy and test
4. Run security audit
5. Add test coverage

**Timeline:** 3-5 hours to make TPUSA fully functional with content flowing.

---

**Created:** 2026-02-06  
**For:** Brian (@swordtruth)  
**By:** Cole AI ⚡
