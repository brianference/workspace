# Token Rotation Walkthrough

**Why:** Tokens were displayed in chat history. Rotate to prevent unauthorized use.

---

## 1. GitHub Token Rotation

### Step 1: Go to GitHub Settings
```
https://github.com/settings/tokens
```
Or: GitHub → Profile icon → Settings → Developer settings → Personal access tokens → Tokens (classic)

### Step 2: Find Current Token
Look for token starting with `ghp_mRs...` (created for brianference)

### Step 3: Regenerate or Delete + Create New
**Option A: Regenerate**
- Click the token name
- Click "Regenerate token"
- Set expiration (recommend 90 days)
- Copy new token immediately (only shown once)

**Option B: Delete and Create New**
- Delete old token
- Click "Generate new token (classic)"
- Name: `openclaw-cole`
- Expiration: 90 days
- Scopes needed: `repo` (full control of private repos)
- Click "Generate token"
- Copy immediately

### Step 4: Update Secrets File
```bash
# On your machine (WSL)
nano /root/.openclaw/secrets/keys.env

# Replace the old token:
GITHUB_TOKEN=ghp_YOUR_NEW_TOKEN_HERE

# Save: Ctrl+O, Enter, Ctrl+X
```

### Step 5: Test
```bash
source /root/.openclaw/secrets/keys.env
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
# Should show your GitHub username
```

---

## 2. Netlify Token Rotation

### Step 1: Go to Netlify User Settings
```
https://app.netlify.com/user/applications#personal-access-tokens
```
Or: Netlify → User icon → User settings → Applications → Personal access tokens

### Step 2: Delete Old Token
Find token `nfp_GqM...` and delete it

### Step 3: Create New Token
- Click "New access token"
- Description: `openclaw-cole`
- Expiration: 90 days (or never, your choice)
- Click "Generate token"
- Copy immediately

### Step 4: Update Secrets File
```bash
nano /root/.openclaw/secrets/keys.env

# Replace the old token:
NETLIFY_TOKEN=nfp_YOUR_NEW_TOKEN_HERE

# Save: Ctrl+O, Enter, Ctrl+X
```

### Step 5: Test
```bash
source /root/.openclaw/secrets/keys.env
curl -H "Authorization: Bearer $NETLIFY_TOKEN" https://api.netlify.com/api/v1/sites
# Should list your sites including swordtruth-kanban
```

---

## 3. After Rotation

### Verify Both Work
```bash
# Load new tokens
source /root/.openclaw/secrets/keys.env

# Test GitHub
curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user | grep login

# Test Netlify  
curl -s -H "Authorization: Bearer $NETLIFY_TOKEN" https://api.netlify.com/api/v1/sites | grep name
```

### Tell Cole
Just say "tokens rotated" and I'll use the new ones from the secrets file.

---

## 4. Optional: Move Config Secrets to Env

Currently `openclaw.json` contains:
- Telegram bot token
- Brave Search API key
- Gateway token

These could be moved to environment variables for better security. We can do this together if you want.

---

## Quick Reference

| Service | Token Location | Rotation URL |
|---------|---------------|--------------|
| GitHub | Settings → Developer settings → PAT | github.com/settings/tokens |
| Netlify | User settings → Applications | app.netlify.com/user/applications |

| File | Purpose |
|------|---------|
| `/root/.openclaw/secrets/keys.env` | Where tokens are stored |
| `/root/.openclaw/openclaw.json` | OpenClaw config (has other tokens) |

---

## Time Estimate

- GitHub rotation: 2 minutes
- Netlify rotation: 2 minutes
- Testing: 1 minute
- **Total: ~5 minutes**
