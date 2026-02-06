---
name: modern-app-standards
description: Essential features and best practices every modern web application must include. Use when starting any new app or auditing existing ones. Ensures apps meet 2025+ industry standards.
metadata: { "openclaw": { "emoji": "🏗️" } }
---

# Modern App Standards (2025+)

## THE MANDATE

**Every web application MUST include these features from day one.**

**NO EXCEPTIONS.** Do not skip these "because it's just an MVP" or "we'll add it later."

---

## 10 ESSENTIAL FEATURES (Non-Negotiable)

### 1. ⚡ Responsive Design
**What:** Works flawlessly on desktop, tablet, mobile (92.3% of users are mobile)

**Implementation:**
- CSS Grid/Flexbox with fluid layouts
- `@media` queries for breakpoints (768px, 1024px, 1280px)
- `viewport` meta tag
- Touch-friendly buttons (min 44x44px)
- Tested on actual devices

**Code:**
```css
:root {
  --mobile: 768px;
  --tablet: 1024px;
  --desktop: 1280px;
}

@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr; }
}
```

### 2. 🌓 Light/Dark Mode
**What:** Theme toggle with persistence (MANDATORY per Brian)

**Implementation:**
- CSS variables for all colors
- `[data-theme="dark"]` selector
- localStorage persistence
- Toggle button with sun/moon icons
- Default: dark mode

**Code Pattern (reuse from kanban):**
```javascript
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('[app]-theme', isDark ? 'light' : 'dark');
  updateThemeBtn();
}
```

### 3. 🔍 Search Functionality
**What:** Users can search/filter content (MANDATORY per Brian)

**Implementation:**
- Search bar in header or prominent location
- Real-time filtering as user types
- Debounced input (300ms delay)
- Search across relevant fields
- Clear/reset button
- Show result count
- Empty state when no results

**Code:**
```javascript
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const search = debounce((query) => {
  const results = items.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  );
  renderResults(results);
}, 300);
```

### 4. 🔒 Security (Production-Ready)
**What:** Protection against common vulnerabilities

**Mandatory:**
- HTTPS only (SSL/TLS)
- Input validation on ALL fields
- XSS prevention (escape user content)
- CSRF tokens for forms
- Rate limiting on APIs
- Helmet.js security headers
- No secrets in code (.env + .gitignore)
- Parameterized queries (no SQL injection)

**Quick Check:**
```bash
npm audit
grep -r "API_KEY\|PASSWORD\|SECRET" src/
```

### 5. 🎨 Intuitive UI/UX
**What:** Clear, consistent, accessible design

**Rules:**
- Clear navigation (breadcrumbs if nested)
- Consistent button styles
- Loading states (skeleton/spinner)
- Error states (friendly messages)
- Empty states ("No items yet")
- Success feedback (toasts/alerts)
- Keyboard navigation works
- Focus indicators visible

### 6. 📊 Performance Optimized
**What:** Fast load times and smooth interactions

**Targets:**
- First Contentful Paint < 1.8s
- Time to Interactive < 3.8s
- Cumulative Layout Shift < 0.1

**Tactics:**
- Lazy load images
- Code splitting
- Minify CSS/JS
- Compress images (WebP)
- Cache API responses
- Debounce expensive operations

### 7. ♿ Accessibility (WCAG 2.1 AA)
**What:** Usable by everyone, including screen readers

**Checklist:**
- Semantic HTML (`<header>`, `<nav>`, `<main>`)
- `alt` text on all images
- ARIA labels where needed
- Color contrast ≥ 4.5:1 for text
- Keyboard navigation
- Focus management in modals
- No auto-play media

### 8. 🔄 Real-Time Updates (Optional but Recommended)
**What:** Live data without manual refresh

**Options:**
- Polling (simple, works everywhere)
- WebSockets (true real-time)
- Server-Sent Events (one-way push)

**Example:**
```javascript
// Polling (start simple)
setInterval(fetchData, 10000); // Every 10s

// WebSocket (upgrade later)
const ws = new WebSocket('wss://api.example.com');
ws.onmessage = (event) => updateUI(JSON.parse(event.data));
```

### 9. 💾 State Persistence
**What:** Remember user preferences and data

**Use Cases:**
- Theme preference
- Filter selections
- Form drafts
- Scroll position
- Collapsed/expanded sections

**Storage:**
- localStorage (client-side, 5-10MB)
- sessionStorage (clears on tab close)
- IndexedDB (large datasets)
- Backend API (sync across devices)

### 10. 📱 PWA Capabilities (Progressive Enhancement)
**What:** Works offline, installable like native app

**Basic PWA:**
- `manifest.json` (icons, name, colors)
- Service worker (cache assets)
- Offline fallback page
- "Add to Home Screen" prompt

---

## ADDITIONAL MODERN FEATURES

### API Design (If Backend)
- RESTful or GraphQL
- JSON responses
- Proper HTTP status codes
- Error messages with structure
- API versioning (/v1/...)
- Rate limiting
- CORS configuration
- OpenAPI/Swagger docs

### Logging & Monitoring
- Structured logging (JSON in prod)
- Log levels (error, warn, info, debug)
- Error tracking (Sentry, Rollbar)
- Performance monitoring
- User analytics (optional)

### DevOps
- Environment variables (.env)
- Git ignore (.gitignore with secrets)
- README with setup instructions
- One-command dev setup
- One-command deploy
- Health check endpoint (/api/health)

### Code Quality
- ESLint/Prettier configured
- JSDoc comments
- Modular architecture
- Separation of concerns
- DRY principle
- Meaningful variable names
- Error handling everywhere

---

## IMPLEMENTATION CHECKLIST

**Before committing ANY app:**

- [ ] Responsive (tested on mobile)
- [ ] Light/dark mode toggle
- [ ] Search/filter functionality
- [ ] Security audit passed
- [ ] Loading/error/empty states
- [ ] Keyboard navigation works
- [ ] No hardcoded secrets
- [ ] README.md written
- [ ] .gitignore includes .env
- [ ] Health check endpoint
- [ ] Graceful error handling

---

## REUSABLE CODE PATTERNS

### Theme Toggle (copy from kanban)
```javascript
// In <head>
const saved = localStorage.getItem('[app]-theme') || 'dark';
document.documentElement.setAttribute('data-theme', saved);

// Toggle function
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('[app]-theme', isDark ? 'light' : 'dark');
  document.getElementById('themeBtn').textContent = isDark ? '☀️' : '🌙';
}
```

### Search with Debounce
```javascript
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const searchInput = document.getElementById('search');
searchInput.addEventListener('input', debounce((e) => {
  const query = e.target.value.toLowerCase();
  filterItems(query);
}, 300));
```

### Responsive Grid
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
```

---

## WHEN TO USE THIS SKILL

**ALWAYS** - Read this before:
- Starting any new app
- Refactoring existing apps
- Pre-launch checklist
- Code reviews
- Security audits

---

## INTEGRATION WITH OTHER SKILLS

- **vibe-coding-patterns** - Architecture and security
- **build-verify-deploy** - Deployment protocol
- **task-memory** - Track implementation progress

---

## ENFORCEMENT

If Brian reviews an app and ANY of these features are missing:
1. Stop immediately
2. Read this skill
3. Implement missing features
4. Deploy updated version
5. Verify with evidence

---

## QUICK START TEMPLATE

```bash
# New app setup
mkdir my-app && cd my-app
npm init -y

# Create structure
mkdir -p src/{components,lib,services,styles}
touch src/index.html src/styles/main.css src/lib/utils.js
touch .env.example .gitignore README.md

# .gitignore template
echo "node_modules/
.env
.env.local
*.log
dist/
.DS_Store" > .gitignore

# .env.example
echo "# App Config
PORT=3000
NODE_ENV=development" > .env.example
```

---

## TESTING CHECKLIST

Before claiming app is done:

**Desktop:**
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari

**Mobile:**
- [ ] iOS Safari
- [ ] Android Chrome

**Accessibility:**
- [ ] Keyboard only navigation
- [ ] Screen reader (NVDA/VoiceOver)
- [ ] 200% zoom works

**Performance:**
- [ ] Lighthouse score ≥ 90
- [ ] No console errors
- [ ] Network tab < 2MB initial load

---

## RESOURCES

- **Design:** Material Design, Apple HIG
- **Icons:** Heroicons, Lucide, Font Awesome
- **Colors:** Tailwind palette, Coolors.co
- **Accessibility:** WebAIM, A11y Project
- **Testing:** Lighthouse, axe DevTools

---

## VERSION

**Created:** 2026-02-06  
**Last Updated:** 2026-02-06  
**Status:** Active, mandatory for all apps

---

## SUMMARY

**Every app MUST have:**
1. Responsive design
2. Light/dark mode
3. Search functionality
4. Security hardened
5. Great UI/UX
6. Fast performance
7. Accessible
8. Real-time (where appropriate)
9. State persistence
10. PWA-ready

**No exceptions. No "we'll add it later." Build it right from day one.**
