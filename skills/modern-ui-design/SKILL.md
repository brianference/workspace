# Modern UI Design - 2026 Standards

**Purpose:** Apply modern mobile-first design patterns to web apps using 2026 best practices from mobbin.com, Banani, Lapa Ninja, and competitors.

---

## When to Use This Skill

Trigger words:
- "improve the design"
- "make it look modern"
- "mobile-first design"
- "redesign the UI"
- "apply modern design concepts"
- "reference mobbin"

---

## Design Principles (2026)

### 1. Mobile-First Always
- Design for 320px width minimum
- Touch targets: minimum 44px × 44px
- Bottom navigation for primary actions
- Sticky headers with blur effects
- iOS safe area support

### 2. Glassmorphism
- Frosted glass effects with `backdrop-filter: blur(20px)`
- Semi-transparent surfaces: `rgba(255, 255, 255, 0.1)`
- Layered depth with shadows
- Subtle borders: `rgba(255, 255, 255, 0.2)`

### 3. Gradients
- Purple/blue: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Success: `linear-gradient(135deg, #48bb78 0%, #38a169 100%)`
- Danger: `linear-gradient(135deg, #f56565 0%, #e53e3e 100%)`
- Text gradients with `-webkit-background-clip: text`

### 4. Spacing & Typography
- Base spacing: 4px grid (8px, 12px, 16px, 20px, 24px)
- Font sizes: 12px (label), 14px (body), 16px (heading), 20px (title), 32px (hero)
- Line height: 1.5-1.6 for readability
- Font weight: 400 (normal), 600 (semibold), 700 (bold)

### 5. Animations
- Transitions: `all 0.2s ease` or `all 0.3s ease`
- Hover: `transform: translateY(-2px)` + shadow
- Active: `transform: scale(0.98)`
- Loading: Spinner with `animation: spin 0.8s linear infinite`

### 6. Light/Dark Mode
- Default: Light mode (better accessibility)
- Toggle: Top right or bottom nav
- CSS variables for theming
- Smooth transitions: `transition: background 0.3s, color 0.3s`
- Persist choice in `localStorage`

### 7. Cards & Surfaces
- Border radius: 12px-20px (generous curves)
- Shadows: `0 10px 40px rgba(0, 0, 0, 0.15)`
- Padding: 16px-24px
- Hover effects on interactive cards

### 8. Empty States
- Large icon: 64px, opacity 0.5
- Friendly message: "No items yet"
- Optional CTA button

### 9. Status Indicators
- Badges with rounded pills
- Color-coded: success (green), warning (orange), danger (red)
- Pulse animations for live status

### 10. Touch-Friendly
- Button height: minimum 44px
- Generous padding: 12px 20px
- No hover-only interactions
- Pull-to-refresh where appropriate

---

## Color Palettes (2026)

### Primary Gradients
```css
--purple-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--blue-gradient: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
--green-gradient: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
--red-gradient: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
--orange-gradient: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
```

### Light Mode
```css
:root {
  --bg: #f7fafc;
  --surface: rgba(255, 255, 255, 0.95);
  --text: #1a202c;
  --text-dim: #718096;
  --border: rgba(0, 0, 0, 0.1);
}
```

### Dark Mode
```css
[data-theme="dark"] {
  --bg: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  --surface: rgba(45, 55, 72, 0.95);
  --text: #f7fafc;
  --text-dim: #a0aec0;
  --border: rgba(255, 255, 255, 0.1);
}
```

---

## Component Patterns

### Glassmorphic Card
```css
.card {
  background: var(--surface);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid var(--border);
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}
```

### Gradient Button
```css
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:active {
  transform: scale(0.98);
}
```

### Status Badge
```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-success {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
}
```

### Bottom Navigation
```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--surface);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--border);
  padding: 12px 20px;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border-radius: 12px;
  color: var(--text-dim);
  transition: all 0.2s ease;
}

.nav-item.active {
  color: var(--primary);
  background: rgba(102, 126, 234, 0.1);
}
```

---

## Responsive Breakpoints

```css
/* Mobile first (default) */
/* 320px - 767px */

/* Tablet */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

---

## Inspiration Sources

1. **mobbin.com** - 1000+ iOS/web apps, 500K+ screens
2. **banani.co** - Free mobbin alternative
3. **lapa.ninja** - Landing page inspiration
4. **uxarchive.com** - User flow patterns
5. **refero.design** - Component patterns
6. **dribbble.com** - Visual design trends

---

## Implementation Checklist

When redesigning an app:

- [ ] Add light/dark mode toggle
- [ ] Apply glassmorphism to cards
- [ ] Use gradient accents
- [ ] Increase touch target sizes (44px min)
- [ ] Add bottom navigation
- [ ] Implement smooth animations
- [ ] Create empty states with icons
- [ ] Add status indicators with pulse
- [ ] Ensure responsive grid
- [ ] Add iOS safe area support
- [ ] Test on mobile (320px width)
- [ ] Add loading states with spinners
- [ ] Persist theme choice
- [ ] Use modern border radius (12px-20px)
- [ ] Apply proper spacing (4px grid)

---

## Anti-Patterns (Avoid)

❌ Dark-only mode (always include light)  
❌ Small touch targets (<44px)  
❌ Harsh shadows (use soft, large shadows)  
❌ Sharp corners (use generous radius)  
❌ Flat colors only (use gradients for depth)  
❌ Tiny fonts on mobile (<14px body text)  
❌ Hover-only interactions (use :active for touch)  
❌ No empty states (always show friendly message)  
❌ Cluttered spacing (use generous whitespace)  
❌ No animations (add smooth transitions)  

---

## Quick Reference: Modern vs Old

| Old Style | Modern Style |
|-----------|--------------|
| Dark backgrounds | Light default + dark mode |
| Flat colors | Gradients |
| Sharp corners | Rounded (12-20px) |
| Solid backgrounds | Glassmorphism |
| Small padding | Generous spacing |
| No animations | Smooth transitions |
| Desktop-first | Mobile-first |
| Tiny touch targets | 44px minimum |

---

**Last Updated:** 2026-02-06  
**Applies to:** All web apps built by Cole AI  
**Mandatory:** Yes - all new apps must follow these patterns
