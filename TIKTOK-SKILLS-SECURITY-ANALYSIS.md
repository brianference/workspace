# TikTok Skills Security Analysis - 2026-02-06

Comprehensive security scan of 4 TikTok-related skills from ClawHub, plus overall recommendations combining X and TikTok capabilities.

---

## Executive Summary

**CLEAN:** All 4 TikTok skills are SAFE (0% malware rate)

| Status | Count | Skills |
|--------|-------|--------|
| ✅ **SAFE** | 4 | tiktok-teneo, postiz, tiktok, tiktok-ai-model-generator |
| 🚨 **MALICIOUS** | 0 | None |
| ⚠️ **COMMERCIAL** | 2 | tiktok-teneo (Teneo Protocol), postiz |

**Key Finding:** TikTok skills are cleaner than X skills (0% vs 22% malware rate).

---

## Detailed Analysis

### ✅ SAFE SKILLS

#### 1. tiktok-teneo (FireStream792) ⭐⭐⭐
**Status:** ✅ **SAFE - COMMERCIAL (Teneo Protocol)**

**Purpose:** Extract TikTok data via paid API  
**Type:** Decentralized AI agent network  
**Auth:** Ethereum wallet + USDC payments

**Features:**
- ✅ Extract video metadata
- ✅ Extract profile details
- ✅ Extract hashtag posts
- ✅ WebSocket-based API

**Commands:**
```bash
@tiktok video <url>        # $0.01/query
@tiktok profile <username> # $0.01/query
@tiktok hashtag <hashtag>  # $0.01/item
@tiktok help               # Free
```

**Payment:**
- USDC on Base, Peaq, or Avalanche networks
- Requires crypto wallet and funds
- Micropayments per query

**Use Case:** Decentralized TikTok scraping (if comfortable with crypto payments)

**Security:** ✅ Clean - WebSocket API, no malicious code

**Usefulness:** ⭐⭐⭐ (3/5) - Good for crypto-native users, overkill for basic scraping

**Pros:**
- Decentralized (no single point of failure)
- Structured API (WebSocket)
- Per-query pricing (pay only for what you use)

**Cons:**
- Requires crypto setup (Ethereum wallet, USDC)
- Cost per query ($0.01 adds up quickly)
- Complex setup for non-crypto users
- Not ideal for high-volume scraping

---

#### 2. postiz (nevo-david) ⭐⭐⭐⭐
**Status:** ✅ **SAFE - COMMERCIAL (Multi-Platform)**

**Purpose:** Schedule posts to 28+ social platforms  
**Platforms:** TikTok, X, Instagram, YouTube, LinkedIn, Facebook, etc.  
**Auth:** API key from platform.postiz.com

**Features:**
- ✅ Schedule posts to 28+ channels
- ✅ Upload files (images, videos)
- ✅ Upload from URL
- ✅ Post management (list, delete, update)
- ✅ Find next available slot

**API Endpoints:**
```bash
GET  /integrations          # List connected channels
GET  /find-slot/:id         # Next available post slot
POST /upload                # Upload file
POST /upload-from-url       # Upload from URL
GET  /posts                 # List posts
POST /posts                 # Schedule new post
DELETE /posts/:id           # Delete post
```

**Pricing:** Unknown (requires account at platform.postiz.com)

**Use Case:** **EXCELLENT for multi-platform posting automation**

**Security:** ✅ Clean - REST API wrapper

**Usefulness:** ⭐⭐⭐⭐ (4/5) - Best for posting to TikTok + other platforms

**Pros:**
- Multi-platform (TikTok + X + 26 others)
- Comprehensive API
- Post scheduling
- File upload support
- Well-documented

**Cons:**
- Commercial service (costs money)
- Requires account setup
- No free tier mentioned
- Not for reading/scraping (posting only)

---

#### 3. tiktok (0xterrybit)
**Status:** ✅ **SAFE - BASIC**

**Purpose:** Basic TikTok integration  
**Type:** Documentation-only skill  
**Auth:** TikTok API access token

**Features:**
- Video management
- Analytics and insights
- Trending sounds
- Hashtag research
- Engagement tracking

**Note:** Very minimal documentation. Appears to be a placeholder or wrapper for TikTok's official API.

**Use Case:** Basic TikTok API wrapper

**Security:** ✅ Clean - documentation only

**Usefulness:** ⭐⭐ (2/5) - Too basic, lacks implementation details

**Pros:**
- Simple
- Official API-based

**Cons:**
- Minimal documentation
- No executable code
- Requires TikTok API access token (hard to get)
- Better alternatives exist

---

#### 4. tiktok-ai-model-generator (hhhh124hhhh) ⭐⭐⭐⭐⭐
**Status:** ✅ **SAFE - EDUCATIONAL (Content Creation)**

**Purpose:** Generate AI-powered TikTok product videos  
**Type:** Workflow guide + Python script  
**Tools:** Pinterest, Claude, Nano Banana Pro, Veo/Kling

**Workflow:**
1. Pinterest reference selection
2. Claude JSON prompt generation
3. Nano Banana Pro image generation (AI model wearing product)
4. Veo/Kling video animation

**Use Case:** **GOLDMINE for e-commerce TikTok content creation**

**Features:**
- ✅ 4-step workflow (under 5 minutes per video)
- ✅ AI-generated fashion models
- ✅ Product showcase videos
- ✅ No human models needed
- ✅ Scalable content production

**Perfect For:**
- E-commerce sellers (fashion, jewelry, accessories)
- TikTok livestream automation (24/7 AI model streams)
- Product showcase videos
- A/B testing different styles

**Cost:**
- Skill: Free (MIT license)
- Tools: Free tiers available (Claude, Higgsfield)
- Commercial use: Verify tool licensing

**Security:** ✅ Clean - Python script is safe (prompt generator)

**Usefulness:** ⭐⭐⭐⭐⭐ (5/5) - EXCEPTIONAL for content creation

**Pros:**
- Comprehensive workflow guide
- Time savings: 95%+ vs traditional photoshoots
- No human models needed
- Scalable (generate 10-50 videos/hour)
- Well-documented with examples

**Cons:**
- Not for scraping (for content creation)
- Requires access to multiple paid tools
- Learning curve for workflow
- Best suited for e-commerce products

---

## Comparison: X vs TikTok Skills

| Metric | X Skills (9 total) | TikTok Skills (4 total) |
|--------|-------------------|------------------------|
| **Malware Rate** | 22% (2/9 MALICIOUS) | 0% (0/4 clean) ✅ |
| **Free Options** | bird (FREE) | agent-browser (FREE) |
| **Commercial** | 3 (x-api, upload-post, x-twitter) | 2 (teneo, postiz) |
| **Educational** | 2 (x-algorithm, x-mastery) | 1 (ai-model-generator) |
| **Usefulness** | High (bird + x-api) | Medium (agent-browser better) |

**Key Insight:** TikTok skills on ClawHub are safer but less feature-rich than X skills.

---

## Overall Recommendations for TPUSA Intel

### Recommended Stack: agent-browser (Best Option)

**Why agent-browser beats TikTok-specific skills:**
1. ✅ Already installed and working (v0.9.1)
2. ✅ Free (no API costs)
3. ✅ Authenticated browser sessions (cookies)
4. ✅ Works for BOTH TikTok AND X
5. ✅ Flexible snapshot-based scraping
6. ✅ No dependencies on commercial services

**agent-browser workflow:**
```bash
# One-time setup: Login and save state
agent-browser open https://www.tiktok.com/login
# Fill login form...
agent-browser state save tiktok-auth.json

# Scraping (reusable)
agent-browser state load tiktok-auth.json
agent-browser open https://www.tiktok.com/@ericakirk
agent-browser snapshot -i --json
# Parse snapshot for video data
```

---

### Alternative Stack Comparison

| Stack | TikTok | X/Twitter | Cost | Setup | Best For |
|-------|--------|-----------|------|-------|----------|
| **A: agent-browser + bird** ⭐⭐⭐⭐⭐ | ✅ | ✅ | $0 | Easy | **RECOMMENDED** - Reading/scraping |
| **B: tiktok-teneo + x-api** | ✅ | ✅ | $$$$ | Hard | Crypto-native users, posting |
| **C: postiz** | ✅ | ✅ | $$$ | Medium | Multi-platform posting |
| **D: Official APIs** | ⚠️ | ✅ | $-$$$ | Hard | Official access required |

**Winner:** Stack A (agent-browser + bird) - FREE, easy, works for both platforms.

---

## Implementation Plan for TPUSA Intel

### Phase 1: TikTok Scraping (FREE) ✅
**Use:** agent-browser CLI (already installed)

**Steps:**
1. Authenticate to TikTok with agent-browser
2. Save authentication state (`tiktok-auth.json`)
3. Update scan function:
   ```javascript
   // Load saved auth
   await execPromise('agent-browser state load tiktok-auth.json');
   await execPromise(`agent-browser open https://www.tiktok.com/@${handle}`);
   
   // Get snapshot
   const { stdout } = await execPromise('agent-browser snapshot -i --json');
   const snapshot = JSON.parse(stdout);
   
   // Parse for video data
   const videos = extractVideosFromSnapshot(snapshot);
   ```
4. Deploy and test

**Timeline:** 2-3 hours  
**Cost:** $0

---

### Phase 2: X/Twitter Scraping (FREE) ✅
**Use:** bird CLI

**Steps:**
1. Install bird: `brew install steipete/tap/bird`
2. Authenticate via browser cookies
3. Update scan function:
   ```javascript
   const { stdout } = await execPromise('bird user-tweets @ericakirk -n 20 --json');
   const tweets = JSON.parse(stdout);
   ```

**Timeline:** 1 hour  
**Cost:** $0

---

### Phase 3: Multi-Platform Posting (LATER, if needed)
**Use:** postiz (commercial)

**Steps:**
1. Sign up at platform.postiz.com
2. Connect TikTok + X accounts
3. Get API key
4. Schedule posts via API

**Timeline:** 1-2 hours  
**Cost:** Unknown (requires account)

---

## Content Creation Bonus: AI Model Videos

### For @swordtruth Content

**Use Case:** Generate AI-generated spokesperson videos for TPUSA criticism

**Skill:** tiktok-ai-model-generator

**Workflow:**
1. Pinterest reference: Find serious/professional presenter pose
2. Claude prompt: "Generate JSON for news anchor presenting TPUSA scandal"
3. Nano Banana Pro: Generate AI anchor image
4. Veo animation: Animate with serious expression, gestures
5. Post to TikTok/X with audio overlay (AI voice or Brian's commentary)

**Benefits:**
- No need to be on camera
- Professional-looking content
- Scalable (generate multiple videos)
- Consistent brand aesthetic

**Timeline:** 5 minutes per video  
**Cost:** Free tier (Claude + Higgsfield)

---

## Security Lessons

### TikTok Skills: Cleaner Than X Skills

**Why TikTok skills are safer:**
1. Smaller ecosystem (less malware uploaded)
2. Newer platform (less time for malware to accumulate)
3. More commercial services (vetted by companies)

**X Skills Had 22% Malware:**
- blrd (zaycv) - MALWARE
- twitter-sum (moonshine-100rze) - MALWARE
- Both used same malware infrastructure (91.92.242.30)

**TikTok Skills: 0% Malware** ✅

---

## Final Recommendations

### For TPUSA Intel (Reading/Scraping)

**PRIMARY STACK:** ⭐⭐⭐⭐⭐
- **TikTok:** agent-browser (authenticated browser)
- **X/Twitter:** bird (cookie-based, free)
- **Cost:** $0
- **Timeline:** 3-4 hours to functional

**Why This Stack:**
1. ✅ Already have agent-browser installed
2. ✅ Both tools are FREE
3. ✅ No API keys required
4. ✅ Cookie/session-based (bypass API limits)
5. ✅ Full control over scraping logic
6. ✅ Works for BOTH platforms

---

### For Multi-Platform Posting (Later)

**If budget allows:**
- **postiz** - Post to TikTok + X + 26 other platforms
- **Cost:** Requires paid account
- **Use when:** Scaling to multi-platform automation

---

### For Content Creation (Bonus)

**For AI-generated videos:**
- **tiktok-ai-model-generator** - Generate AI spokesperson videos
- **Cost:** Free tier available
- **Use for:** @swordtruth video content (TPUSA criticism)

---

## Summary

### ✅ INSTALL FOR TPUSA INTEL:
1. **agent-browser** (already installed) - TikTok + X scraping
2. **bird** (steipete) - X reading/searching (free)

### ⚠️ CONSIDER IF BUDGET ALLOWS:
3. **postiz** - Multi-platform posting (commercial)

### 📚 EDUCATIONAL:
4. **tiktok-ai-model-generator** - AI video creation workflow
5. **x-algorithm** (from X skills scan) - Viral content strategies

### 🚫 SKIP:
- tiktok-teneo (too expensive, crypto-only)
- tiktok (too basic, no implementation)

---

## Next Steps

**Immediate (Tonight):**
1. Set up agent-browser authentication for TikTok
2. Save tiktok-auth.json state file
3. Update scan.js to scrape TikTok with agent-browser
4. Install bird for X/Twitter scraping
5. Test both scrapers
6. Deploy functional TPUSA Intel

**Timeline:** 3-4 hours total  
**Cost:** $0

**Later (Optional):**
7. Try tiktok-ai-model-generator for content creation
8. Evaluate postiz for multi-platform posting
9. Apply x-algorithm strategies to @swordtruth content

---

**Scanned:** 2026-02-06  
**By:** Cole AI ⚡  
**For:** Brian (@swordtruth)  
**Malware Found:** 0/4 (0%) ✅  
**Overall Malware Rate (X + TikTok):** 2/13 (15.4%)  
**Recommendation:** Use agent-browser + bird stack (FREE, works for both platforms)
