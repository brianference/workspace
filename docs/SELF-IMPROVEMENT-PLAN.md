# Self-Improvement Plan — Cole (OpenClaw Instance)

## Why I Missed This

I failed to leverage OpenClaw's ecosystem:
1. **Didn't check existing skills** — 50+ skills available, didn't search
2. **Didn't suggest creating skills** — Could encode our patterns as reusable skills
3. **Didn't mention ClawHub** — Community marketplace for skills
4. **Didn't mention Discord** — OpenClaw community for support/ideas
5. **Didn't use coding-agent skill** — Could spawn Claude Code for parallel work

---

## 1. SKILLS I SHOULD INSTALL

### From ClawHub
```bash
# Install useful skills
clawhub install react-expert           # React/RN best practices
clawhub install autonomous-mobile-builder  # Mobile app building
clawhub install test-runner            # Testing automation
clawhub install storybook-gen          # Component documentation
clawhub install snapshot-writer        # Snapshot tests
```

### Already Available (Built-in)
| Skill | Use Case |
|-------|----------|
| `coding-agent` | Spawn Codex/Claude Code in parallel |
| `skill-creator` | Create custom skills |
| `clawhub` | Search/install/publish skills |
| `github` | GitHub operations |
| `tmux` | Interactive terminal control |

---

## 2. SKILLS I SHOULD CREATE

### Skill: `mobile-app-audit`
**Purpose:** Automated hostile audit for mobile apps
**Contents:**
- `SKILL.md` — Audit checklist triggers
- `references/mobile-audit-prompts.md` — Full audit templates
- `references/fix-patterns.md` — Common fixes
- `scripts/audit-report.py` — Generate markdown report

### Skill: `vibe-coding-patterns`
**Purpose:** Brian's production-ready coding standards
**Contents:**
- `SKILL.md` — When to apply patterns
- `references/security-checklist.md` — Security prompts
- `references/file-structure.md` — Standard project structure
- `assets/templates/` — Boilerplate files

### Skill: `expo-mobile`
**Purpose:** Expo/React Native development patterns
**Contents:**
- `SKILL.md` — RN best practices
- `references/expo-patterns.md` — Expo SDK patterns
- `references/navigation.md` — Expo Router patterns
- `scripts/create-screen.py` — Generate screen boilerplate

### Skill: `brian-preferences`
**Purpose:** Brian's specific preferences and patterns
**Contents:**
- Communication style
- Security requirements
- Platform formatting rules
- Deploy patterns (Netlify, GitHub)

---

## 3. HOW I SHOULD USE CODING-AGENT

### Parallel Development
Instead of writing all code myself:
```bash
# Spawn Claude Code for vault encryption
bash pty:true workdir:~/project background:true command:"claude 'Implement AES-256-GCM encryption for vault.tsx'"

# Spawn another for PBKDF2
bash pty:true workdir:~/project background:true command:"claude 'Upgrade auth.ts to use PBKDF2 with 100K iterations'"

# Monitor both
process action:list
```

### PR Reviews
```bash
bash pty:true workdir:/tmp/review command:"codex review --base main"
```

---

## 4. COMMUNITY RESOURCES

### OpenClaw Discord
- **URL:** discord.com/invite/clawd
- **Use:** Ask questions, share skills, get help
- **I should:** Suggest Brian join for community support

### ClawHub Marketplace
- **URL:** clawhub.com
- **Use:** Find/share skills
- **I should:** Search before building from scratch

### OpenClaw Docs
- **Local:** /usr/lib/node_modules/openclaw/docs
- **Web:** docs.openclaw.ai
- **I should:** Reference for config questions

---

## 5. AI-ASSISTED TESTING BEST PRACTICES

### Found: Callstack React Native Agent Skills
From search: Callstack published "React Native Best Practices for AI Agents" that install into Claude Code, Codex, Cursor. These provide patterns for:
- Code review
- Performance optimization
- Testing strategies

### Testing Approaches

**1. Snapshot Testing (React Native)**
```bash
# Install jest + react-test-renderer
npm install --save-dev jest @testing-library/react-native

# Generate snapshots
jest --updateSnapshot
```

**2. Component Testing with Testing Library**
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { ChatScreen } from './ChatScreen';

test('sends message on button press', () => {
  const { getByPlaceholder, getByRole } = render(<ChatScreen />);
  fireEvent.changeText(getByPlaceholder('Type a message...'), 'Hello');
  fireEvent.press(getByRole('button'));
  // Assert message sent
});
```

**3. E2E Testing with Maestro**
```yaml
# maestro/auth-flow.yaml
appId: com.openclaw.mobile
---
- launchApp
- tapOn: "Enter passphrase"
- inputText: "testpassphrase123"
- tapOn: "Unlock"
- assertVisible: "Welcome to OpenClaw"
```

**4. AI-Assisted Test Generation**
Prompt pattern:
```
Review [component] and generate:
1. Unit tests for all functions
2. Snapshot tests for UI states
3. Edge case tests (empty, error, loading)
4. Accessibility tests
```

---

## 6. MOBILE UX BEST PRACTICES

### Touch Targets
- Minimum 44x44px (iOS) / 48x48dp (Android)
- Current app: ✓ Send button 40x40 (borderline)

### Loading States
- Always show skeleton/spinner
- Current app: ✓ Has typing indicator
- Missing: Skeleton on initial load

### Error States
- Clear error messages
- Retry options
- Current app: ✓ Error banner, ⚠️ No retry button

### Accessibility
- Labels on all interactive elements
- Color contrast WCAG AA
- Current app: ⚠️ Needs accessibility audit

### Offline Support
- Cache critical data
- Show offline indicator
- Current app: ✓ Messages cached, ⚠️ No offline indicator

---

## 7. ACTION ITEMS

### Immediate (Today)
1. [x] Install clawhub CLI
2. [ ] Install `react-expert` skill
3. [ ] Install `autonomous-mobile-builder` skill

### This Week
4. [ ] Create `vibe-coding-patterns` skill from PLAYBOOK.md
5. [ ] Create `mobile-app-audit` skill from audit templates
6. [ ] Set up Maestro for E2E testing
7. [ ] Add snapshot tests to mobile app

### Ongoing
8. [ ] Use coding-agent for parallel development
9. [ ] Search ClawHub before building from scratch
10. [ ] Suggest community resources to Brian
11. [ ] Publish useful skills to ClawHub

---

## 8. HOW WE SHOULD INTERACT DIFFERENTLY

### Before Starting Work
- [ ] Check if a skill exists for this task
- [ ] Suggest relevant community resources
- [ ] Propose parallel coding-agent spawns for complex work

### During Development
- [ ] Use skills for patterns, not memory
- [ ] Spawn helpers for independent subtasks
- [ ] Reference docs instead of guessing

### After Completion
- [ ] Suggest creating a skill if pattern is reusable
- [ ] Offer to publish useful skills to ClawHub
- [ ] Update TOOLS.md with new capabilities

---

## Summary

I have access to:
- **50+ built-in skills** — Should use them
- **ClawHub marketplace** — Should search before building
- **Coding-agent skill** — Should spawn parallel helpers
- **Skill-creator** — Should encode our patterns as skills
- **Community** — Should leverage Discord/docs

Going forward, I'll proactively suggest these resources instead of doing everything from scratch.
