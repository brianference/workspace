# X Algorithm Analysis - xAI GitHub Release 2026

**Source:** https://github.com/xai-org/x-algorithm  
**Analyzed:** 2026-02-06  
**For:** @swordtruth content strategy

## Executive Summary

X has completely rebuilt their For You feed algorithm using **Grok-based transformers**, eliminating all hand-engineered features. The system now relies purely on ML predictions from user engagement history. This represents a fundamental shift in how content gets recommended.

---

## 🔥 CRITICAL CHANGES

### 1. **No More Hand-Engineered Features**
**What changed:** The old algorithm used hundreds of manually tuned signals (follower count, tweet velocity, author authority, etc.). The new system has **ZERO hand-engineered features**.

**What this means for you:**
- Gaming specific metrics (like follower count) no longer works
- The algorithm learns purely from engagement patterns
- Focus on **authentic engagement signals** rather than vanity metrics

### 2. **Grok-Based Transformer Model (Phoenix)**
**What it is:** X now uses a variant of their Grok-1 model to predict engagement probabilities for every post.

**How it works:**
```
User Context (Your Engagement History)
    ↓
Grok Transformer
    ↓
Predictions for 15 Different Actions:
├── P(favorite) ⭐
├── P(reply) 💬
├── P(repost) 🔄
├── P(quote) 📝
├── P(click) 👆
├── P(profile_click) 👤
├── P(video_view) 🎥
├── P(photo_expand) 🖼️
├── P(share) 📤
├── P(dwell) ⏱️ [NEW]
├── P(follow_author) ➕
├── P(not_interested) ⚠️
├── P(block_author) 🚫
├── P(mute_author) 🔇
├── P(report) 🚩
└── [Weighted combination] → Final Score
```

**Strategic insight:** The algorithm predicts **15 different actions** per post, not just "will they like it?"

### 3. **Negative Signals Are Powerful**
**New understanding:** Block, mute, report, and "not interested" have **negative weights** that actively push down similar content.

**What this means:**
- If users block/mute you → your reach dies across similar audiences
- "Not interested" clicks are tracked and hurt distribution
- Controversy that triggers blocks/reports is **worse than no engagement**

**For TPUSA content:**
- ✅ Expose corruption with evidence
- ❌ Avoid inflammatory bait that triggers blocks
- Focus on **"this is important to know"** not **"this will make you angry"**

### 4. **Dwell Time Is Now Explicitly Tracked**
**NEW metric:** `P(dwell)` - how long users spend looking at your post.

**Strategy:**
- First line must hook immediately (dwell = early drop-off)
- Video thumbnails matter (dwell before clicking play)
- Quote tweets with commentary get higher dwell than naked reposts
- Text walls = low dwell unless first sentence is irresistible

### 5. **Author Diversity Scoring**
**What it does:** If you appear too often in someone's feed, your scores get **attenuated** (reduced) to ensure feed diversity.

**Implications:**
- Posting frequency has diminishing returns
- Quality > quantity is now algorithmically enforced
- Multi-post threads may hurt subsequent post reach
- Space out your best content (don't cluster)

### 6. **Two-Tower Retrieval Model**
**How discovery works:**
- **User Tower:** Encodes YOUR engagement history into an embedding
- **Candidate Tower:** Encodes ALL posts into embeddings
- **Similarity Search:** Finds posts similar to what you've engaged with

**Strategic insight:**
- The algorithm finds content **similar to posts you've engaged with**
- If TPUSA critics engage with your posts → you get shown to more TPUSA critics
- Engagement clustering is real: build your audience tribe

---

## 📊 SCORING SYSTEM

### Positive Weights (Boost Reach)
```
High Value:
- Reply (💬) - Shows deep engagement
- Repost (🔄) - Amplifies to their network
- Quote (📝) - Adds value, shows thought
- Follow author (➕) - Ultimate signal of value
- Share (📤) - Off-platform amplification

Medium Value:
- Favorite (⭐) - Easy signal, lower weight
- Click (👆) - Interest but not commitment
- Profile click (👤) - Curiosity about author

Low Value:
- Video view (🎥) - Passive consumption
- Photo expand (🖼️) - Curiosity, not endorsement
- Dwell (⏱️) - Time spent (NEW)
```

### Negative Weights (Kill Reach)
```
Death Sentence:
- Report (🚩) - Severe penalty
- Block author (🚫) - Permanent damage
- Mute author (🔇) - Silent death

Warning Signs:
- Not interested (⚠️) - Feedback loop starts
```

### The Weighted Formula
```
Final Score = Σ (weight_i × P(action_i))

Example:
  (3.0 × 0.1) [reply]
+ (2.5 × 0.05) [repost]
+ (1.0 × 0.3) [favorite]
+ (0.5 × 0.6) [dwell]
- (5.0 × 0.02) [block]
= Weighted Score
```

**Key insight:** A 2% block probability can **nuke** your score even with 30% like probability.

---

## 🎯 STRATEGIC RECOMMENDATIONS FOR @SWORDTRUTH

### Content Strategy Adjustments

#### 1. **Optimize for Replies, Not Just Likes**
**Why:** Replies have the highest positive weight.

**Tactics:**
- End posts with questions: "Have you seen this?" "What do you think?"
- Call out specific orgs: "@TPUSA, care to explain?"
- Leave threads slightly incomplete to invite contribution
- Controversial takes → ask for counterarguments

#### 2. **Avoid Block/Mute Triggers**
**Why:** Negative weights are devastating.

**Before posting, ask:**
- Could this trigger an immediate block? (personal attacks)
- Is this pure rage bait with no substance?
- Will TPUSA supporters just mute me?

**Better approach:**
- Lead with evidence, not emotion
- "Here's what documents show" > "They're corrupt scumbags"
- Investigative framing > angry ranting

#### 3. **Maximize Dwell Time**
**Why:** New explicit signal.

**Tactics:**
- First sentence = hook: "BREAKING: Tyler Bowyer caught in..."
- Use line breaks for readability
- Images/screenshots keep eyes on post
- Video clips > static images (but thumbnail matters)
- Quote tweets with your analysis > naked reposts

#### 4. **Build Engagement Clustering**
**Why:** Two-tower retrieval finds similar users.

**Strategy:**
- When TPUSA critics engage with you → you reach more TPUSA critics
- Reply to other investigative accounts (crossover audiences)
- Engage with journalists covering TPUSA stories
- Build tribal identity: "Corruption watchers"

#### 5. **Quality Over Frequency**
**Why:** Author diversity scoring attenuates repeat appearances.

**Rules:**
- Don't post 10 mid-tier posts/day → post 2 great ones
- Your best content should be spaced 6-12 hours apart
- Threads hurt reach of later posts (diminishing returns)
- Save weaker content for off-peak times

#### 6. **Optimize for Quote Tweets**
**Why:** Higher dwell time + adds value signal.

**When reposting TikTok content:**
- Don't just share the video link
- Quote tweet with YOUR take: "Watch Erica Kirk admit..."
- Add context: "This confirms the leaked documents from..."
- Make the quote tweet valuable standalone content

---

## 🚨 WHAT TO AVOID (REACH KILLERS)

### 1. **Pure Rage Bait**
- Old strategy: Make them angry → engagement
- New reality: Anger → blocks/mutes → score death
- Adjust: Make them **concerned** not **enraged**

### 2. **Spammy Posting Patterns**
- Old strategy: Post 20x/day to maximize impressions
- New reality: Author diversity scoring kills reach after a few posts
- Adjust: 2-4 high-quality posts/day maximum

### 3. **Naked Link Drops**
- Old strategy: Share TikTok links with minimal text
- New reality: Low dwell time, no added value
- Adjust: Always add commentary/context

### 4. **Personal Attacks**
- Old strategy: Call them names, get engagement
- New reality: Triggers blocks/reports → permanent damage
- Adjust: Attack the actions/evidence, not the person

### 5. **Thread Spam**
- Old strategy: 15-tweet threads to dominate timelines
- New reality: Diversity scorer attenuates after first few
- Adjust: Keep threads to 3-5 tweets max, or use thread breaks

---

## 🔧 TECHNICAL INSIGHTS

### Pipeline Stages
```
1. Query Hydration
   └─ Fetch your recent engagement history

2. Candidate Sourcing
   ├─ Thunder: Posts from accounts you follow (in-network)
   └─ Phoenix Retrieval: ML-discovered posts (out-of-network)

3. Candidate Hydration
   └─ Enrich with metadata (author info, video duration, etc.)

4. Pre-Scoring Filters
   ├─ Remove duplicates
   ├─ Remove blocked/muted authors
   ├─ Remove muted keywords
   └─ Remove previously seen posts

5. Scoring
   ├─ Phoenix Scorer (Grok transformer predictions)
   ├─ Weighted Scorer (combine predictions)
   ├─ Author Diversity Scorer (attenuate repeated authors)
   └─ OON Scorer (adjust out-of-network content)

6. Selection
   └─ Sort by final score, select top K

7. Post-Selection Filters
   └─ Remove spam/violence/gore/deleted posts
```

### Candidate Isolation
**Key design:** During scoring, each post candidate **cannot see other candidates** in the batch. This ensures:
- Your score is consistent regardless of what else is being scored
- No gaming by "batching" with low-quality posts
- Scores are cacheable

### Hash-Based Embeddings
- Both retrieval and ranking use multiple hash functions
- This enables real-time updates without full re-training
- Your engagement history updates incrementally

---

## 📈 METRICS TO TRACK

### Primary Success Signals (High Weight)
1. **Reply rate** - Aim for 2-5% of impressions
2. **Repost rate** - Aim for 1-3% of impressions
3. **Quote tweet rate** - Aim for 0.5-1% of impressions
4. **Profile clicks** - Shows curiosity about you as a source

### Warning Signals (Track Closely)
1. **Block/mute rate** - Should be <0.1%
2. **Report rate** - Should be near zero
3. **"Not interested" rate** - Unknown, but track drops in reach

### Vanity Metrics (Lower Weight Now)
1. **Like rate** - Still matters but less than replies
2. **Video views** - Passive signal
3. **Impressions** - Output metric, not input

---

## 🎬 VIDEO CONTENT STRATEGY

### TikTok → X Workflow
Based on the algorithm analysis:

**Current workflow:**
1. Find TPUSA TikTok content (last 72h)
2. Download video
3. Repost on X

**Optimized workflow:**
1. Find TPUSA TikTok content (last 72h)
2. Download video
3. **Add strong first-frame hook** (text overlay if needed)
4. **Quote tweet with analysis**: "This video shows Erica Kirk admitting [specific thing]. Context: [evidence]."
5. **Add question**: "How is she still employed?"
6. Post during peak hours (6-9 AM or 6-9 PM MST)

**Why this works:**
- Text overlay → increases dwell time
- Quote tweet → adds value signal
- Question → invites replies (highest weight)
- Peak hours → more initial engagement → clustering boost

---

## 🧠 ENGAGEMENT CLUSTERING STRATEGY

### Build Your Tribe
The two-tower retrieval model finds users **similar to those who engage with you**.

**Actionable tactics:**
1. **Engage with your engagers**
   - Reply to your best commenters
   - Repost their good takes
   - Build reciprocal engagement

2. **Crossover with similar accounts**
   - Other TPUSA watchdogs
   - Investigative journalists
   - Political accountability accounts

3. **Create recurring themes**
   - "TPUSA Corruption Files" series
   - "Daily Grift Watch"
   - Branding helps algorithm cluster audience

4. **Use consistent framing**
   - "Corruption" not "bad people"
   - "Evidence" not "rumors"
   - "Accountability" not "revenge"

---

## 🎯 ACTION PLAN FOR NEXT 30 DAYS

### Week 1: Baseline & Test
- [ ] Track current metrics (replies, reposts, blocks if possible)
- [ ] Test 2-4 posts/day vs current volume
- [ ] A/B test: Question endings vs statement endings
- [ ] Monitor which content type gets most replies

### Week 2: Optimize Dwell
- [ ] Add text overlays to video clips (first frame hooks)
- [ ] Test: Quote tweets vs naked reposts
- [ ] Improve first-sentence hooks
- [ ] Track engagement by post format

### Week 3: Reduce Negative Signals
- [ ] Review last 50 posts: which could trigger blocks?
- [ ] Adjust tone: evidence-first, not emotion-first
- [ ] Test: Investigative framing vs outrage framing
- [ ] Monitor reach changes

### Week 4: Build Clustering
- [ ] Engage with 5-10 similar accounts daily
- [ ] Create recurring series branding
- [ ] Reply to your best commenters
- [ ] Build tribal identity around "corruption watchers"

---

## 📚 RESOURCES

### Algorithm Documentation
- Main repo: https://github.com/xai-org/x-algorithm
- Phoenix (ranking model): https://github.com/xai-org/x-algorithm/tree/main/phoenix
- Thunder (in-network): https://github.com/xai-org/x-algorithm/tree/main/thunder
- Candidate pipeline: https://github.com/xai-org/x-algorithm/tree/main/candidate-pipeline

### Related Skills
- `/root/.openclaw/workspace/skills/x-algorithm/SKILL.md`
- `/root/.openclaw/workspace/skills/x-mastery/SKILL.md`

### Tools
- agent-browser: Browser automation for authenticated scraping
- bird CLI: X reading/searching (free, authenticated)
- TPUSA Intel Aggregator: https://swordtruth-tpusa-intel.netlify.app

---

## 🔄 COMPARISON: OLD vs NEW ALGORITHM

| Aspect | Old Algorithm (2023) | New Algorithm (2026) |
|--------|---------------------|---------------------|
| **Feature Engineering** | Hundreds of hand-tuned signals | Zero hand-engineered features |
| **Model Type** | Multiple specialized models | Single Grok-based transformer |
| **Scoring** | Single relevance score | 15 multi-action predictions |
| **Negative Signals** | Implicit (low engagement) | Explicit (block/mute penalties) |
| **Dwell Time** | Not explicitly tracked | New P(dwell) signal |
| **Author Diversity** | Hard limits | Soft attenuation scoring |
| **Follower Count** | Strong signal | No direct signal |
| **Post Velocity** | Gaming metric | No direct signal |
| **Engagement Clustering** | Weak | Strong (two-tower model) |

---

## 💡 KEY TAKEAWAYS

1. **The algorithm is now pure ML** - No gaming specific metrics
2. **Replies > Likes** - Optimize for conversation, not validation
3. **Blocks are death** - Avoid triggering blocks at all costs
4. **Dwell time matters** - First sentence is critical
5. **Quality > Quantity** - Author diversity scoring enforces this
6. **Clustering is real** - Build your tribe through engagement
7. **Quote tweets > Reposts** - Add value to shared content
8. **Evidence > Emotion** - Investigative framing beats rage bait

---

**Next steps:**
1. Update x-algorithm skill with these insights
2. Update x-mastery skill with strategic recommendations
3. Apply to TPUSA Intel Aggregator content strategy
4. Test and measure over next 30 days

**Analysis by:** Cole (@AI Assistant)  
**For:** Brian (@swordtruth)  
**Date:** 2026-02-06
