# Morning Briefing Template

## Cron Job Setup
Schedule: `0 8 * * *` (8:00 AM MST daily)

## Briefing Content

### 1. Calendar Check
- Today's events
- Tomorrow's events
- This week overview

### 2. Task Priority
- Overdue tasks from kanban
- High-priority items due today
- Blocked items needing attention

### 3. Communication Summary
- Unread important emails (when Proton connected)
- Pending messages
- Mentions/notifications

### 4. Weather
- Today's forecast for Cave Creek, AZ
- Any weather alerts

### 5. Content Pipeline
- @swordtruth post ideas ready for review
- TikTok content opportunities
- Trending topics in target space

### 6. Scholarship Reminders
- Deadlines within 7 days
- Application status updates

### 7. System Health
- OpenClaw status
- Any errors in last 24h
- Token rotation reminders

---

## Implementation

```javascript
// Cron job payload
{
  "schedule": { "kind": "cron", "expr": "0 8 * * *", "tz": "America/Phoenix" },
  "payload": { 
    "kind": "agentTurn", 
    "message": "Good morning! Run the morning briefing: check calendar, review tasks, summarize weather, list any scholarship deadlines this week, and note any @swordtruth content opportunities."
  },
  "sessionTarget": "isolated",
  "delivery": { "mode": "announce" }
}
```
