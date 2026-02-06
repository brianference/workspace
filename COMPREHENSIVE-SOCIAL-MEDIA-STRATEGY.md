# Comprehensive Social Media Strategy for TPUSA Intel
## Combined X & TikTok Analysis - 2026-02-06

Strategic recommendations synthesizing security scans of 13 skills (9 X + 4 TikTok) from ClawHub.

---

## Executive Summary

**Scanned:** 13 skills total  
**Malware Found:** 2 (15.4% malware rate)  
**Safe:** 11 skills  
**Commercial:** 5 skills  
**Educational:** 3 skills

### Security Score by Platform

| Platform | Clean | Malicious | Rate |
|----------|-------|-----------|------|
| **X/Twitter** (9 skills) | 7 | 2 | 22% malware ⚠️ |
| **TikTok** (4 skills) | 4 | 0 | 0% malware ✅ |
| **Combined** | 11 | 2 | 15.4% overall |

**Key Finding:** TikTok skills are significantly safer than X skills on ClawHub.

---

## 🚨 CRITICAL: Malicious Skills (DO NOT INSTALL)

### 1. blrd (zaycv) - MALWARE
- Downloads from 91.92.242.30
- Base64-encoded malicious installer
- Obfuscated path: 6wioz8285kcbax6v

### 2. twitter-sum (moonshine-100rze) - MALWARE
- Same malware infrastructure (91.92.242.30)
- Base64-encoded malicious installer
- Obfuscated path: q0c7ew2ro8l2cfqp

**Pattern:** Both use identical attack vectors - likely same malware campaign.

---

## ✅ Recommended Stack for TPUSA Intel

### PRIMARY: agent-browser + bird (FREE) ⭐⭐⭐⭐⭐

| Component | Tool | Purpose | Cost | Status |
|-----------|------|---------|------|--------|
| **TikTok Scraping** | agent-browser | Authenticated browser automation | FREE | ✅ Installed |
| **X Reading** | bird | Cookie-based X reading/searching | FREE | ⏳ Need to install |
| **X Posting** | bird or x-api | Tweet publishing | FREE or $100/mo | ⏳ Later |

**Why This Stack:**
1. ✅ **Zero cost** for reading/scraping
2. ✅ **No API keys** required (uses browser cookies/sessions)
3. ✅ **Both platforms** covered with 2 tools
4. ✅ **Already have** agent-browser installed
5. ✅ **Bypass API limits** with session-based auth
6. ✅ **Full control** over scraping logic

---

## Implementation Roadmap

### Phase 1: TikTok Scraping (2-3 hours) ✅

**Tool:** agent-browser (v0.9.1, already installed)

**Steps:**
```bash
# 1. Authenticate to TikTok (one-time)
agent-browser open https://www.tiktok.com/login
agent-browser snapshot -i
# Fill login form manually...
agent-browser state save tiktok-auth.json

# 2. Test scraping
agent-browser state load tiktok-auth.json
agent-browser open https://www.tiktok.com/@ericakirk
agent-browser snapshot -i --json > erica_snapshot.json

# 3. Update scan.js
# Add: Load tiktok-auth.json, open profile, parse snapshot
```

**Expected Output:**
- Video titles
- View counts
- Like/share/comment counts
- Upload dates
- Video thumbnails
- Video URLs

**Timeline:** 2-3 hours  
**Cost:** $0

---

### Phase 2: X/Twitter Scraping (1-2 hours) ✅

**Tool:** bird (steipete, needs installation)

**Steps:**
```bash
# 1. Install bird
brew install steipete/tap/bird

# 2. Authenticate (automatic via browser cookies)
bird whoami

# 3. Test scraping
bird user-tweets @ericakirk -n 20 --json > erica_tweets.json
bird search "#TPUSA" -n 50 --json > tpusa_search.json

# 4. Update scan.js
# Add: bird commands for X scraping
```

**Expected Output:**
- Tweet text
- Retweet/like/reply counts
- Tweet URLs
- Author info
- Timestamps

**Timeline:** 1-2 hours  
**Cost:** $0

---

### Phase 3: Content Aggregation (1 hour) ✅

**Goal:** Combine TikTok + X content in single feed

**Backend Updates:**
```javascript
// scan.js - Combined scraper
async function scanTarget(targetId, platform) {
  if (platform === 'tiktok') {
    return await scanTikTok(targetId);  // agent-browser
  } else if (platform === 'twitter') {
    return await scanTwitter(targetId);  // bird
  }
}

// Parse and normalize data
function normalizeContent(rawContent, platform) {
  return {
    id: generateId(),
    platform,  // 'tiktok' or 'twitter'
    author: extractAuthor(rawContent),
    text: extractText(rawContent),
    engagement: {
      views: extractViews(rawContent),
      likes: extractLikes(rawContent),
      shares: extractShares(rawContent),
      comments: extractComments(rawContent)
    },
    mediaUrl: extractMedia(rawContent),
    timestamp: extractTimestamp(rawContent),
    url: extractUrl(rawContent)
  };
}
```

**Timeline:** 1 hour  
**Cost:** $0

---

### Phase 4: Deploy & Test (30 min) ✅

**Steps:**
1. Deploy updated backend to Netlify Functions
2. Test TikTok scraping (Erica Kirk)
3. Test X scraping (Erica Kirk)
4. Verify content appears in frontend
5. Test filters (platform, date range)

**Timeline:** 30 minutes  
**Cost:** $0

---

### **TOTAL PHASE 1-4: 4.5-6.5 hours | $0 cost**

---

## Alternative & Upgrade Options

### If Budget Allows: Commercial Services

#### Option A: Multi-Platform Posting ⭐⭐⭐⭐
**Tool:** postiz (nevo-david)  
**Cost:** Unknown (requires account)  
**Platforms:** 28+ (TikTok, X, Instagram, YouTube, etc.)

**Use When:**
- Need to post to multiple platforms simultaneously
- Want scheduling features
- Scaling beyond TikTok + X

**Setup:**
1. Sign up at platform.postiz.com
2. Connect social accounts
3. Get API key
4. Post via API

---

#### Option B: X Official API Posting ⭐⭐⭐⭐
**Tool:** x-api (lobstergeneralintelligence)  
**Cost:** $0-100/month (1,500 free posts/month)  
**Use:** Reliable posting without bot detection

**Setup:**
1. Get credentials from developer.x.com
2. `npm install -g twitter-api-v2`
3. Configure API keys
4. `x-post "Your tweet"`

**Use When:**
- Need reliable posting automation
- Volume > 1,500/month
- Bot detection is an issue with bird

---

#### Option C: TikTok Paid API ⚠️
**Tool:** tiktok-teneo (Teneo Protocol)  
**Cost:** $0.01/query (USDC crypto payments)  
**Platforms:** Base, Peaq, Avalanche

**Use When:**
- Comfortable with crypto payments
- Need decentralized scraping
- Want to support Web3 ecosystem

**Not Recommended:** agent-browser is FREE and works better.

---

## Content Creation Strategy

### Educational Resources (FREE)

#### x-algorithm (NextFrontierBuilds) ⭐⭐⭐⭐⭐
**Purpose:** Master X algorithm for viral content

**Key Insights:**
- First 2 hours = 90% of reach
- No external links in main post (reach penalty)
- Media > Text (videos 10x, images 2-3x)
- Replies 27x higher weight than likes
- Threads outperform single tweets
- Post when audience awake (8 AM - 2 PM weekdays)

**Apply To:** @swordtruth posting strategy

---

#### x-mastery (lxgicstudios) ⭐⭐⭐⭐
**Purpose:** Advanced X growth tactics

**Key Insights:**
- First 30 min engagement = 90% of reach
- Never delete flopped tweets (tracked negatively)
- Premium accounts get algorithmic boost
- Low following ratio (followers > following)
- Niche down hard (topical authority)

**Apply To:** Long-term @swordtruth growth

---

### AI Content Generation (OPTIONAL)

#### tiktok-ai-model-generator (hhhh124hhhh) ⭐⭐⭐⭐⭐
**Purpose:** Generate AI spokesperson videos

**Workflow:**
1. Pinterest reference (presenter/anchor pose)
2. Claude JSON prompt
3. Nano Banana Pro (AI model image)
4. Veo/Kling (video animation)

**Use For:**
- AI-generated TPUSA criticism videos
- No need to be on camera
- 5 minutes per video
- Scalable content production

**Cost:** Free tier (Claude + Higgsfield)

**Example:**
```
Prompt: "Professional news anchor presenting serious investigation,
studio lighting, serious expression, gesturing to highlight key points"

Output: AI-generated video of anchor delivering your script
```

---

## Smart Recommendations by Use Case

### 1. TPUSA Intel (Content Aggregation) ⭐⭐⭐⭐⭐

**Goal:** Scrape TikTok + X for TPUSA criticism content

**Recommended Stack:**
- **TikTok:** agent-browser (authenticated)
- **X:** bird (cookie-based)
- **Cost:** $0
- **Timeline:** 4-6 hours

**Why:**
- Free
- Works for both platforms
- Already have agent-browser
- No API limits
- Full control

---

### 2. @swordtruth Content Strategy ⭐⭐⭐⭐⭐

**Goal:** Viral X content criticizing TPUSA

**Recommended Approach:**
1. **Study:** Read x-algorithm + x-mastery skills
2. **Apply:**
   - Post 3-5x daily
   - Videos > images > text
   - No external links in main post
   - Reply to every comment (first 2 hours critical)
   - Threads for long-form
3. **Post:** Use bird for now, upgrade to x-api if volume increases

**Cost:** $0 (bird) or $100/mo (x-api for volume)

---

### 3. Multi-Platform Content Distribution ⭐⭐⭐⭐

**Goal:** Post to TikTok + X + Instagram + YouTube simultaneously

**Recommended Stack:**
- **Tool:** postiz
- **Cost:** Unknown (requires account)
- **Platforms:** 28+

**Use When:**
- Scaling beyond 2 platforms
- Need scheduling features
- Team collaboration

---

### 4. AI-Generated Content (Experimental) ⭐⭐⭐⭐

**Goal:** AI spokesperson videos for @swordtruth

**Recommended Workflow:**
1. **Study:** tiktok-ai-model-generator skill
2. **Test:** Generate 1-2 test videos
3. **Evaluate:** Compare engagement vs text posts
4. **Scale:** If successful, batch-generate videos

**Cost:** Free tier available  
**Time:** 5 min per video

---

## Security Best Practices

### When Installing ClawHub Skills

✅ **DO:**
- Check author reputation (steipete = good)
- Review install commands (look for base64, raw IPs)
- Test in /tmp first
- Verify HTTPS (not HTTP)
- Check for executable scripts

❌ **DON'T:**
- Install skills with base64-encoded commands
- Run curl to raw IPs (91.92.242.30)
- Trust random obfuscated paths
- Skip security review

### Reporting Malicious Skills

**Found malware:**
- blrd (zaycv)
- twitter-sum (moonshine-100rze)

**Action:** Report to ClawHub (if reporting mechanism exists)

---

## Cost Analysis

### FREE Stack (Recommended) ⭐⭐⭐⭐⭐

| Component | Tool | Cost |
|-----------|------|------|
| TikTok scraping | agent-browser | $0 |
| X scraping | bird | $0 |
| Backend | Netlify Functions | $0 (125K req/month) |
| Frontend | Netlify | $0 |
| **TOTAL** | | **$0/month** |

---

### Paid Upgrades (Optional)

| Component | Tool | Cost | Benefit |
|-----------|------|------|---------|
| X posting | x-api | $0-100/mo | Reliable automation, 1.5K free |
| Multi-platform | postiz | Unknown | Post to 28+ platforms |
| TikTok API | tiktok-teneo | $0.01/query | Decentralized (crypto) |
| AI videos | Nano Banana Pro | Free tier | AI-generated content |

**Recommendation:** Start with FREE stack, upgrade only if needed.

---

## Timeline Summary

| Phase | Duration | Tasks | Cost |
|-------|----------|-------|------|
| **1. TikTok Setup** | 2-3 hours | Authenticate, test, deploy | $0 |
| **2. X Setup** | 1-2 hours | Install bird, test, deploy | $0 |
| **3. Integration** | 1 hour | Combined scraper, normalize data | $0 |
| **4. Deploy** | 30 min | Deploy, test, verify | $0 |
| **TOTAL** | **4.5-6.5 hours** | **Functional TPUSA Intel** | **$0** |

**Additional (Optional):**
- Study x-algorithm: 1 hour (FREE)
- Test AI video generator: 1-2 hours (FREE tier)
- Set up postiz: 1 hour (Paid)

---

## Success Metrics

### TPUSA Intel (Content Aggregation)

**Goals:**
- ✅ Scrape 4 targets (Erica, Tyler, Andrew, Charlie)
- ✅ Aggregate TikTok + X content
- ✅ Display in unified feed
- ✅ Filter by platform, date, engagement
- ✅ Update every 6-12 hours (scheduled)

**KPIs:**
- Content items scraped per day: 20-50
- Scraping success rate: >90%
- API cost: $0
- Uptime: >99%

---

### @swordtruth (Content Strategy)

**Goals:**
- ✅ Apply x-algorithm strategies
- ✅ Increase engagement rate
- ✅ Grow follower count
- ✅ Maintain consistent posting (3-5x/day)

**KPIs:**
- Engagement rate: >2%
- Follower growth: +5-10% monthly
- Viral posts: 1-2 per week (>10K views)
- Replies per post: >20

---

## Next Steps (Immediate)

### Tonight (2-3 hours):
1. ✅ Authenticate agent-browser to TikTok
2. ✅ Save tiktok-auth.json
3. ✅ Test TikTok scraping (Erica Kirk)
4. ✅ Update scan.js for TikTok
5. ✅ Deploy and verify

### Tomorrow (1-2 hours):
6. ✅ Install bird CLI
7. ✅ Test X scraping (Erica Kirk)
8. ✅ Update scan.js for X
9. ✅ Deploy combined scraper
10. ✅ Verify unified feed

### This Week:
11. ⏳ Read x-algorithm + x-mastery
12. ⏳ Apply strategies to @swordtruth
13. ⏳ Test AI video generator (optional)
14. ⏳ Schedule automated scanning (cron)

---

## Conclusion

### The Winning Strategy

**For TPUSA Intel:**
- Use **agent-browser + bird** stack
- **Zero cost**, full control, both platforms
- **4-6 hours** to functional

**For @swordtruth Content:**
- Study **x-algorithm** strategies
- Apply to posting schedule
- Use **bird** for reading/engagement
- Upgrade to **x-api** if volume increases

**For Content Creation:**
- Experiment with **tiktok-ai-model-generator**
- Generate AI spokesperson videos
- Test engagement vs text posts

### Key Takeaways

1. ✅ **TikTok skills are safer** than X skills (0% vs 22% malware)
2. ✅ **agent-browser + bird** beats all commercial options for scraping
3. ✅ **Educational skills** (x-algorithm, x-mastery) are goldmines
4. ✅ **AI video generation** is viable for content creation
5. ✅ **Free stack** is sufficient for TPUSA Intel MVP

---

**Prepared:** 2026-02-06  
**By:** Cole AI ⚡  
**For:** Brian (@swordtruth)  
**Skills Scanned:** 13 (9 X + 4 TikTok)  
**Malware Found:** 2 (15.4% rate)  
**Recommended Stack:** agent-browser + bird (FREE)  
**Timeline to Functional:** 4-6 hours  
**Total Cost:** $0
