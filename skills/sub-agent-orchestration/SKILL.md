---
name: sub-agent-orchestration
description: Orchestrate multiple sub-agents to work in parallel on complex tasks. Use when tasks can be parallelized or require different expertise. Ensures sub-agents follow standards and work together effectively.
version: 1.0.0
author: Cole
keywords: sub-agents, parallel-processing, task-orchestration, agent-teams, coordination, claude-teams
---

# Sub-Agent Orchestration

## When to Use Sub-Agents

### ✅ Good Use Cases
- **Parallel work:** Multiple independent pages/components to build
- **Different expertise:** UI design + backend API + testing
- **Time-critical:** Need multiple things done simultaneously
- **Complex projects:** Break down into smaller, focused tasks
- **Repetitive work:** Same pattern applied to multiple items

### ❌ Bad Use Cases
- **Sequential dependencies:** Task B requires Task A's output
- **Simple tasks:** Faster to do yourself than coordinate
- **Exploratory work:** Requirements unclear or evolving
- **Single file edits:** No parallelization benefit

---

## Spawning Sub-Agents

### Task Description Template

```markdown
Build [WHAT] at [PATH]

Requirements:
- [Specific requirement 1]
- [Specific requirement 2]
- Use [DESIGN_SYSTEM] palette ([COLOR_CODE])
- Match design system from [REFERENCE_FILE]
- [Functionality requirement]
- Mobile-first responsive
- 44px touch targets (Apple HIG)

Deploy when done using [DEPLOY_METHOD].
```

### Example: Good Task Description

```javascript
sessions_spawn({
  agentId: "main",
  label: "Messages Page",
  task: `Build a functional Messages page for TPUSA Intel app at /root/.openclaw/workspace/projects/tpusa-intel/messages.html

Requirements:
- Ocean Calm palette (iOS Blue #0A84FF)
- Message thread list view
- Each message shows: sender name, preview, timestamp, unread indicator
- Click opens message detail view
- Search bar at top
- Filter by: All, Unread, Flagged
- Bottom nav with Messages tab active
- Match the design system from index.html
- Use mock data (5-10 sample messages)
- Mobile-first responsive

Deploy when done using the deploy.sh script in the project folder.`,
  model: "anthropic/claude-sonnet-4-5",
  runTimeoutSeconds: 600
});
```

### Example: Bad Task Description

```javascript
// ❌ Too vague
sessions_spawn({
  label: "Fix the messages",
  task: "Make the messages page work better"
});

// ❌ No context
sessions_spawn({
  label: "Build page",
  task: "Build messages.html"
});
```

---

## Monitoring Sub-Agents

### Check Status

```javascript
// List all active sub-agents
const subs = await sessions_list({
  kinds: ["isolated"],
  limit: 10,
  messageLimit: 2
});

// Check specific sub-agent
const history = await sessions_history({
  sessionKey: "agent:main:subagent:xxx"
});
```

### Signs of Progress
- ✅ Tool calls visible in messages
- ✅ Files being created/modified
- ✅ Commits to git
- ✅ Deployment logs

### Signs of Problems
- ❌ No tool calls after 30+ seconds
- ❌ Repeated errors in messages
- ❌ "I need more information" responses
- ❌ Stuck in a loop

---

## Coordination Patterns

### Pattern 1: Parallel Independent Pages

**Scenario:** Build 3 separate pages that don't depend on each other

```javascript
// Spawn all at once
const [messages, settings, profile] = await Promise.all([
  sessions_spawn({ label: "Messages Page", task: messagesTask }),
  sessions_spawn({ label: "Settings Page", task: settingsTask }),
  sessions_spawn({ label: "Profile Page", task: profileTask })
]);

// Continue with other work
// Sub-agents will notify when complete
```

**Best for:** UI pages, separate components, multiple small apps

### Pattern 2: Staggered Start

**Scenario:** Later tasks might benefit from earlier results

```javascript
// Start first batch
const design = await sessions_spawn({ 
  label: "Design System", 
  task: "Create design tokens..." 
});

// Wait a bit for design tokens to be ready
await new Promise(resolve => setTimeout(resolve, 60000));

// Start tasks that use the design system
const [page1, page2] = await Promise.all([
  sessions_spawn({ label: "Page 1", task: "Use design tokens from..." }),
  sessions_spawn({ label: "Page 2", task: "Use design tokens from..." })
]);
```

**Best for:** Design system → components, API → frontend, schema → CRUD

### Pattern 3: Coordinator + Workers

**Scenario:** One sub-agent manages, others execute

```javascript
// Coordinator plans the work
const coordinator = await sessions_spawn({
  label: "Project Coordinator",
  task: "Analyze requirements and break into 5-10 tasks. Output task list with clear descriptions."
});

// Wait for task list
// Then spawn workers based on coordinator's output
```

**Best for:** Large projects, unclear scope, research-heavy work

---

## Standards & Quality Control

### Ensure Sub-Agents Follow Standards

**In task description:**
```markdown
Design System:
- Read /root/.openclaw/workspace/MODERN-MOBILE-DESIGN-SYSTEM.md
- Use [PALETTE] palette
- 44px minimum touch targets (Apple HIG)
- 4px spacing grid
- Match style from [REFERENCE_FILE]

Code Quality:
- Follow vibe-coding-patterns skill
- Run security audit before deploying
- Add comments for complex logic
- No hardcoded secrets

Deployment:
- Test locally first
- Commit to git with descriptive message
- Deploy to Netlify
- Verify deployment worked
```

### Pre-Flight Checklist

Before spawning sub-agents:
- [ ] Clear, specific task descriptions written
- [ ] Reference files exist and are accessible
- [ ] Design system/palette specified
- [ ] Deployment method documented
- [ ] Success criteria defined
- [ ] Timeout appropriate (5-10 min usually)

---

## Handling Sub-Agent Results

### When Sub-Agent Completes Successfully

```javascript
// You'll receive a notification with findings
// Example:
// "✅ Task Complete - Messages Page
// Built functional message list with search, filters...
// Live at: https://example.com/messages.html"

// Your job:
1. Review the work (check files, test URL)
2. Update any nav links in other files
3. Verify it matches standards
4. If issues, spawn another sub-agent to fix OR fix yourself
5. Update kanban/memory with completion
```

### When Sub-Agent Fails

```javascript
// If sub-agent reports errors or gets stuck:

// Option 1: Provide more context
sessions_send({
  sessionKey: "agent:main:subagent:xxx",
  message: "The API endpoint is at /.netlify/functions/messages, not /api/messages"
});

// Option 2: Spawn replacement with better task description
const retry = await sessions_spawn({
  label: "Messages Page (Retry)",
  task: "Previous attempt failed because [REASON]. Now try with [FIX]..."
});

// Option 3: Do it yourself
// Sometimes faster than debugging a sub-agent
```

---

## Best Practices

### DO ✅

1. **Spawn multiple sub-agents for parallel work**
   - Building 3 separate pages? Spawn 3 agents
   - Each can work independently

2. **Give complete context in task description**
   - File paths (absolute)
   - Design system to use
   - Reference files to copy style from
   - Deployment instructions

3. **Monitor progress**
   - Check sessions_list every few minutes
   - Look for completed notifications
   - Verify deployed URLs work

4. **Update interconnected files yourself**
   - Sub-agents build their pages
   - You update the nav links between pages
   - Ensures consistency

5. **Use appropriate timeouts**
   - Simple page: 300s (5 min)
   - Complex app: 600s (10 min)
   - Research task: 900s (15 min)

### DON'T ❌

1. **Don't spawn for trivial tasks**
   - Changing one line? Do it yourself
   - Faster than spawning + monitoring

2. **Don't create circular dependencies**
   - Sub-agent A needs output from sub-agent B
   - Sub-agent B needs output from sub-agent A
   - Recipe for deadlock

3. **Don't forget to update nav/links**
   - Sub-agents build their pages
   - But main index.html still has old "coming soon" links
   - You must update the connections

4. **Don't spawn without clear requirements**
   - "Build something cool" → confusion
   - "Build X with Y features using Z design" → success

5. **Don't ignore completion notifications**
   - Sub-agent finished 10 minutes ago
   - You're still working on other stuff
   - Review and integrate their work promptly

---

## Common Workflows

### Workflow 1: Multi-Page App Build

```javascript
// 1. Spawn sub-agents for each page
const pages = await Promise.all([
  sessions_spawn({ label: "Messages", task: messagesTask }),
  sessions_spawn({ label: "Settings", task: settingsTask }),
  sessions_spawn({ label: "Profile", task: profileTask })
]);

// 2. Continue with other work (they run in parallel)
// Update documentation, plan next features, etc.

// 3. When notifications arrive:
//    - Review each page
//    - Update nav links in index.html
//    - Deploy updated index.html
//    - Test all links work

// 4. Update kanban/memory
```

### Workflow 2: Design System → Components

```javascript
// 1. Create design system first (do yourself for control)
// Write DESIGN-SYSTEM.md with colors, spacing, components

// 2. Spawn sub-agents to build components using it
const components = await Promise.all([
  sessions_spawn({ 
    label: "Button Component",
    task: "Build reusable button using DESIGN-SYSTEM.md..."
  }),
  sessions_spawn({
    label: "Card Component", 
    task: "Build card component using DESIGN-SYSTEM.md..."
  })
]);

// 3. They reference your design system
// 4. Review and integrate
```

### Workflow 3: App + Tests + Docs

```javascript
// 1. Spawn in sequence (later ones reference earlier)

// App first
const app = await sessions_spawn({
  label: "Main App",
  task: "Build app with these features..."
});

// Wait for app to finish (you'll get notification)

// Then tests + docs in parallel
const [tests, docs] = await Promise.all([
  sessions_spawn({
    label: "Tests",
    task: "Write tests for the app at [PATH]. Test all major features."
  }),
  sessions_spawn({
    label: "Documentation", 
    task: "Write README.md documenting the app at [PATH]."
  })
]);
```

---

## Troubleshooting

### "Sub-agent didn't deploy"

**Solution:** Add explicit deployment instructions in task:
```markdown
Deploy when done:
1. cd /root/.openclaw/workspace/projects/my-app
2. bash deploy.sh
3. Verify URL returns HTTP 200
4. Report live URL in completion message
```

### "Sub-agent used wrong design"

**Solution:** Be more specific about design system:
```markdown
Design Requirements:
- Read /path/to/DESIGN-SYSTEM.md FIRST
- Use Ocean Calm palette (NOT Midnight Premium or others)
- Primary color: #0A84FF (copy this exact value)
- Match card style from /path/to/index.html lines 150-200
```

### "Sub-agents' work doesn't integrate"

**Solution:** You're the integrator:
- Sub-agents build their pieces
- You update the glue code (nav links, imports, etc.)
- You ensure consistency across all pieces

### "Sub-agent asking for clarification"

**Options:**
- Send clarification via `sessions_send`
- Or kill it and respawn with better task description
- Usually respawn is faster

---

## Example: Today's Success

**Scenario:** TPUSA Intel needs Messages and Settings pages

```javascript
// Spawned 2 sub-agents in parallel
const [messages, settings] = await Promise.all([
  sessions_spawn({
    label: "TPUSA Intel - Messages Page",
    task: `Build Messages page...
    - Ocean Calm palette
    - Thread list with search
    - Deploy with deploy.sh`
  }),
  sessions_spawn({
    label: "TPUSA Intel - Settings Page", 
    task: `Build Settings page...
    - Ocean Calm palette
    - Notification toggles
    - Deploy with deploy.sh`
  })
]);

// Both finished in ~3 minutes
// Both deployed successfully
// I updated index.html nav links to point to them
// Result: Fully functional app in <5 minutes total
```

---

## Metrics to Track

**Successful sub-agent use:**
- Task completion rate: >80%
- Average time: 3-5 minutes per page
- Deployments successful: >90%
- Requires fixes from you: <20%

**If metrics are worse:**
- Task descriptions too vague
- Requirements changing mid-task
- Design system not clear enough
- Deployment instructions missing

---

## Reference

**OpenClaw Sessions API:**
- `sessions_spawn()` - Create sub-agent
- `sessions_list()` - List sub-agents
- `sessions_history()` - Get sub-agent messages
- `sessions_send()` - Send message to sub-agent

**Models:**
- `claude-sonnet-4-5` - Default, good for most tasks
- `claude-opus-4-6` - Use for complex/research tasks
- Timeout: 300-600s (5-10 min) for building tasks

**Announcement:**
- Sub-agents auto-announce completion to requester
- You'll get notification with summary
- Review and integrate their work

---

Built: 2026-02-06  
Last Updated: 2026-02-06  
Version: 1.0.0
