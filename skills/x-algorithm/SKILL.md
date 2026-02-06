---
name: x-algorithm
description: X (Twitter) algorithm rules, viral strategies, and article best practices. Boost engagement, avoid reach death, write posts that perform. Works with AI agents, Claude, Cursor.
version: 2.0.0
author: NextFrontierBuilds + xAI Analysis (2026-02-06)
keywords: x, twitter, algorithm, viral, engagement, social-media, growth, content-strategy, ai-agent, ai-coding, claude, cursor, openclaw, moltbot, openclaw, vibe-coding, automation, grok, phoenix, transformer
---

# X Algorithm Mastery (2026 Update)

Everything you need to know about the X (Twitter) algorithm. Based on X's open-source code (xAI GitHub release), viral post analysis, and real engagement data.

**MAJOR UPDATE (2026-02-06):** X now uses Grok-based transformers with zero hand-engineered features. See [xAI GitHub analysis](/root/.openclaw/workspace/X-ALGORITHM-ANALYSIS-2026.md) for full details.

## 🔥 2026 ALGORITHM CHANGES (CRITICAL)

X completely rebuilt the algorithm using **Grok-based transformers** (Phoenix model). Zero hand-engineered features now.

### What Changed
1. **No more gaming metrics** — Follower count, post velocity, etc. don't directly matter anymore
2. **15 action predictions** — Algorithm predicts likes, replies, reposts, clicks, dwells, blocks, mutes, reports, etc.
3. **Negative signals HURT** — Blocks, mutes, reports have negative weights that kill reach
4. **Dwell time tracked** — How long users look at your post is now explicit signal
5. **Author diversity scoring** — Posting too often gets algorithmically attenuated
6. **Engagement clustering** — Two-tower retrieval finds audiences similar to your engagers

### New Priority Order
```
1. Replies (highest positive weight)
2. Reposts/Quote tweets
3. Follows
4. Shares
5. Profile clicks
6. Likes (lower weight than before)
7. Dwell time (NEW)
8. Clicks
---
9. Not interested (negative)
10. Mutes (severe negative)
11. Blocks (severe negative)
12. Reports (death sentence)
```

### Critical Rules (2026)
- **Avoid blocks at all costs** — One block hurts more than 100 likes help
- **Optimize for replies first** — Highest positive weight
- **Quality > Quantity** — Author diversity scoring penalizes spamming
- **First sentence = dwell time** — Hook immediately or lose reach
- **Build your tribe** — Engagement clustering amplifies to similar users

---

## TL;DR - The Golden Rules

1. **Optimize for REPLIES not likes** — Replies have highest positive weight (2026 update)
2. **NEVER trigger blocks** — Negative signals kill reach permanently (2026 update)
3. **First sentence hooks** — Dwell time is now explicitly tracked (2026 update)
4. **Post 2-4x daily max** — Author diversity scoring penalizes spam (2026 update)
5. **No external links in main post** — X penalizes links that take users off-platform
6. **Media > Text** — videos get 10x engagement, images get 2-3x
7. **Post when audience is awake** — 8 AM - 2 PM weekdays optimal

---

## How the Algorithm Works

### The 4-Step Process

1. **Candidate Sourcing**: Pulls ~1,500 tweets from accounts you follow (~50%) and similar accounts
2. **Ranking**: ML model scores likelihood you'll reply (highest), retweet, like, or report (negative)
3. **Filtering**: Removes blocked/muted, balances in/out-network, limits single author
4. **Serving**: Final mix with ads, 5B times/day, ~1.5 seconds

### Engagement Weight Hierarchy (2026 Update)

| Action | Weight | Impact |
|--------|--------|--------|
| **Replies** | Highest (+++) | Shows deep engagement |
| **Reposts** | High (++) | Amplifies to network |
| **Quote Tweets** | High (++) | Adds value signal |
| **Follow Author** | High (++) | Ultimate validation |
| **Share** | Medium (+) | Off-platform boost |
| **Profile Click** | Medium (+) | Curiosity about author |
| **Likes** | Medium (+) | Lower weight than before |
| **Click** | Low (+) | Interest but not commitment |
| **Dwell** | Low (+) | **NEW: Time spent viewing** |
| **Video View** | Low (+) | Passive consumption |
| **Photo Expand** | Low (+) | Curiosity signal |
| **Not Interested** | Negative (-) | **NEW: Feedback loop** |
| **Mute Author** | Severe (---) | **NEW: Silent death** |
| **Block Author** | Severe (---) | **NEW: Permanent damage** |
| **Report** | Death (----) | **Reach destruction** |

---

## Ranking Signals

### 1. Recency
- Fresh content prioritized
- Peak visibility: first 2-3 hours

### 2. Engagement Velocity
- Speed matters more than total
- 100 likes in 30 min > 500 likes over 24 hours

### 3. Account Credibility
- Verified (Premium) gets boost
- Follower-to-following ratio matters
- History of bans/strikes hurts

### 4. Content Type
- **Video**: 10x engagement
- **Images**: 2-3x engagement
- **Polls**: Drives replies
- **Threads**: Higher total engagement

### 5. Link Presence
- **Links = REACH PENALTY**
- Put links in replies, not main post
- Quote tweeting a link > direct link

---

## What Kills Your Reach (2026 Update)

### Instant Death
- ❌ **Getting blocked by users** — Negative weight nukes your score (NEW)
- ❌ **Getting muted by users** — Silent reach death (NEW)
- ❌ **Getting reported** — Severe penalty across similar audiences (NEW)
- ❌ External links in main post
- ❌ Posting same content repeatedly
- ❌ Too many hashtags (>2)

### Slow Death
- ❌ **Low dwell time** — Users scroll past immediately (NEW)
- ❌ **Pure rage bait** — Triggers blocks/mutes, not worth it (NEW)
- ❌ **Spammy posting** — Author diversity scoring attenuates reach (NEW)
- ❌ Posting inconsistently
- ❌ Not replying to comments
- ❌ Off-topic from your niche
- ❌ Corporate/formal tone

### 2026 Insight: Negative Signals Are Powerful
A 2% block probability can **completely nuke** a post's reach even with 30% like probability. The negative weights are that severe. Focus on avoiding blocks, not just getting likes.

---

## Posting Best Practices

### Frequency (2026 Update: Author Diversity Scoring)
| Goal | Posts/Day | Notes |
|------|-----------|-------|
| **Optimal** | 2-4 | Quality > quantity enforced algorithmically |
| Minimum | 1-2 | Consistency matters |
| Maximum | 6-8 | Beyond this, reach gets attenuated |
| ❌ Avoid | 10+ | Author diversity scorer kills reach |

**2026 Change:** The old "post 15-30x/day" strategy is DEAD. The algorithm now **attenuates** (reduces scores) for repeated appearances in feeds. Focus on making 2-4 great posts instead of 15 mediocre ones.

### Timing (audience timezone)
- **Best**: 8 AM - 2 PM weekdays
- **Good**: 4 PM - 6 PM weekdays
- **Worst**: 11 PM - 7 AM

### The No-Link Strategy
```
❌ Bad:  "Check out my article [link]"
✅ Good: "Here's what I learned (thread 🧵)"
         → Link in reply or final thread post
```

---

## Maximizing Dwell Time (NEW 2026 Signal)

Dwell time = how long users spend looking at your post. Now explicitly tracked.

### Tactics
- **Hook first sentence** — "BREAKING: Tyler Bowyer caught..."
- **Line breaks for readability** — Walls of text = instant scroll
- **Images/screenshots** — Keep eyes on post
- **Video thumbnails** — Must hook before play button
- **Quote tweets with analysis** — More dwell than naked reposts

### What Kills Dwell
- ❌ Boring first sentence
- ❌ Text walls with no breaks
- ❌ Generic "Check this out" intros
- ❌ Clickbait without payoff

---

## Getting Replies (Most Important)

Replies have the **highest positive weight** in the 2026 algorithm.

### Tactics
- **Ask questions** — open-ended or controversial
- **Hot takes** — polarizing opinions get "actually..." replies
- **Fill in the blank** — "The best movie ever is ___"
- **Predictions** — people love to disagree
- **Personal stories** — "This happened to me..."
- **Call out orgs** — "@TPUSA, care to explain?" (invites response)
- **Leave threads incomplete** — Invite contribution

---

## X Article Best Practices

### Hook Patterns That Work

**Insecurity/FOMO:**
> "everyone's talking about X... and you're sitting there wondering if you missed the window"

**Big Opportunity:**
> "this is the biggest opportunity of our lifetime"

**RIP Pattern:**
> "RIP [profession]. This AI tool will [action] in seconds."

### Article Structure

```
1. HOOK (insecurity or opportunity)
2. WHAT IT IS (with social proof)
3. WHY MOST WON'T DO IT (address objections)
4. THE [X]-MINUTE GUIDE (step-by-step)
5. YOUR FIRST [N] WINS (immediate value)
6. THE COST (value comparison)
7. THE WINDOW (urgency)
8. CTA
```

### Style Tips
- Clear H2 section headers
- Bullet lists for scanability
- Bold key phrases
- Time estimates for each step
- Copy-paste commands/prompts

---

## Quick Checklist (2026 Update)

Before posting:
- [ ] **First sentence hooks immediately?** (Dwell time signal - NEW)
- [ ] **Could this trigger blocks?** (Negative weight check - NEW)
- [ ] **Reason to reply?** (Highest positive weight)
- [ ] **Line breaks for readability?** (Dwell time optimization - NEW)
- [ ] Under 280 chars? (If not, thread it)
- [ ] Good time to post?
- [ ] No external links? (Move to reply)
- [ ] Fits your niche? (Engagement clustering)
- [ ] Available to reply for 2 hours?
- [ ] **Posting <4 times today?** (Author diversity check - NEW)

---

## Engagement Clustering Strategy (NEW 2026)

The **two-tower retrieval model** finds users similar to those who engage with you. This is how out-of-network discovery works now.

### How It Works
```
User Tower: Encodes YOUR engagement history
     ↓
Similarity Search
     ↓
Candidate Tower: Finds posts similar to what you engage with
```

### Build Your Tribe
1. **Engage with your engagers** — Reply to your best commenters
2. **Crossover with similar accounts** — Other investigative/accountability accounts
3. **Create recurring themes** — Series branding helps clustering
4. **Consistent framing** — Use same terminology (builds audience identity)

### Why This Matters
- When TPUSA critics engage with you → you get shown to more TPUSA critics
- Tribal identity amplifies: "Corruption watchers" "Accountability journalists"
- Algorithm finds audiences similar to your current engagers

---

## Growth Hacks

### Reply Guy Strategy (Still Works)
Turn on notifications for big accounts → be first with thoughtful reply → their audience discovers you

### Thread Takeover
Find viral post in your area → quote tweet with "Let me explain why..." → add genuine value

### Personality Posts
Every 5-10 posts, share something personal. Builds connection → higher engagement.

### Clustering Hack (NEW 2026)
Engage with accounts that share your audience → their followers get recommended your content via two-tower retrieval

---

## Sources
- **xAI X Algorithm GitHub (2026)**: https://github.com/xai-org/x-algorithm
- X Algorithm open source release (2023)
- Hootsuite, Sprout Social, SocialBee guides
- Analysis of viral articles (Damian Player, Alex Finn, Dan Koe)
- Phoenix (Grok-based transformer) documentation
- Thunder (in-network) and candidate pipeline architecture

## Related Resources
- Full analysis: `/root/.openclaw/workspace/X-ALGORITHM-ANALYSIS-2026.md`
- x-mastery skill: Advanced tactics and growth strategies
- TPUSA Intel strategy guide

---

## Installation

```bash
clawhub install NextFrontierBuilds/x-algorithm
```

Built by [@NextXFrontier](https://x.com/NextXFrontier)  
2026 update by Cole (xAI analysis integration)
