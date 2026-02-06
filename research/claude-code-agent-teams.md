# Claude Code Agent Teams — Research

## What It Is
Launched alongside Opus 4.6 (Feb 5, 2026). A multi-agent orchestration feature in Claude Code CLI where one session acts as **team lead** and spawns multiple **teammates** — each an independent Claude Code instance with its own context window.

## Key Differentiator vs Subagents
- **Subagents**: run within a single session, report back to main agent only
- **Agent Teams**: fully independent sessions that can **message each other directly**, coordinate via shared task list, and work in parallel

## Architecture
| Component | Role |
|-----------|------|
| Team Lead | Main Claude Code session — creates team, spawns teammates, coordinates |
| Teammates | Separate Claude Code instances with own context windows |
| Task List | Shared work items teammates claim and complete (file-lock based) |
| Mailbox | Messaging system for inter-agent communication |

## How to Enable
Still experimental. Set env var:
```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```
Or in `~/.claude/settings.json`:
```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

## Display Modes
1. **In-process** — all teammates in one terminal (Shift+Up/Down to select)
2. **Split panes** — each teammate gets own tmux/iTerm2 pane
3. **Auto** (default) — split panes if in tmux, otherwise in-process

## Best Use Cases
- **Parallel code review** (security + performance + test coverage reviewers)
- **Competing hypotheses debugging** (agents debate root cause)
- **New modules/features** (each teammate owns a piece)
- **Cross-layer coordination** (frontend, backend, tests — separate owners)
- **Research & review** (investigate different aspects simultaneously)

## Key Features
- **Delegate mode** (Shift+Tab): restricts lead to coordination only, no coding
- **Plan approval**: require teammates to plan before implementing
- **Task dependencies**: automatic unblocking when deps complete
- **Direct messaging**: talk to any teammate without going through lead
- **Broadcast**: send to all teammates (costs scale with team size)

## Permissions
- Teammates inherit lead's permission settings
- If lead has `--dangerously-skip-permissions`, teammates do too
- Can change individual teammate modes after spawning

## Token Cost
- **Significantly higher** than single session (each teammate = separate context)
- Worth it for complex parallel work; overkill for sequential tasks

## Storage
- Team config: `~/.claude/teams/{team-name}/config.json`
- Task list: `~/.claude/tasks/{team-name}/`

## Installation Required
Claude Code CLI: `npm install -g @anthropic-ai/claude-code`
Auth: Uses Anthropic API key or OAuth token

## Integration with OpenClaw
OpenClaw already has Claude as its backbone. To use Agent Teams:
1. Install Claude Code CLI globally
2. Enable experimental flag
3. Can invoke via OpenClaw's exec tool or tmux skill
4. Brian's Max plan OAuth token should work for auth
