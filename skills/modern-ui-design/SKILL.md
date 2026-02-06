# Modern UI Design - 2026 Standards (iOS HIG + Mobbin)

**Purpose:** Apply modern mobile-first design patterns to web apps using 2026 best practices from iOS Human Interface Guidelines, Mobbin.com, and Modern Mobile Design System v1.0.

---

## When to Use This Skill

Trigger words:
- "improve the design"
- "make it look modern"
- "mobile-first design"
- "redesign the UI"
- "apply modern design concepts"
- "reference mobbin"
- "iOS design"

---

## Design Principles (2026 - iOS HIG)

### Core Principles (Apple)
1. **Clarity** - Text is legible, icons are precise, functionality is obvious
2. **Deference** - Content is king, UI doesn't compete
3. **Depth** - Layering and motion provide hierarchy
4. **Consistency** - Familiar standards throughout

### 1. Mobile-First Always
- Design for 320px width minimum
- **Touch targets: MINIMUM 44px × 44px** (Apple HIG standard)
- Bottom navigation for primary actions
- Sticky headers with blur effects
- iOS safe area support: `env(safe-area-inset-*)`

### 2. Glassmorphism & Liquid Glass (iOS 26 Trend)
- Frosted glass effects with `backdrop-filter: blur(20px)`
- Semi-transparent surfaces: `rgba(255, 255, 255, 0.7)`
- Layered depth with shadows
- Liquid Glass: gradient backgrounds + saturate(200%)
- Tab bars: `rgba(255, 255, 255, 0.85)` + blur

### 3. Typography (iOS Standard)
- **System Font:** SF Pro Display/Text, Inter fallback
- **Scale:** 11pt-34pt (0.6875rem - 2.125rem)
- **Body default:** 17pt (1.0625rem)
- **Large Title:** 34pt (2.125rem)
- **Line height:** 1.2-1.6
- **Tracking:** -0.02em for titles

### 4. Color Palette Strategy (CRITICAL: Variation Not Uniformity)

**RULE:** Every app gets its own palette based on purpose/audience. Never make all apps look the same.

**Selection Guide:**
| Use Case | Palette | Reasoning |
|----------|---------|-----------|
| Pro Tools / Monitoring / Analytics | **Midnight Premium** | Dark-first, high contrast, focus-oriented |
| Professional / Finance / Intel | **Ocean Calm** | Blue = trust, authority, serious |
| Social / Consumer / Entertainment | **Sunset Vibrant** | Warm, energetic, engaging |
| Health / Wellness / Education | **Nature Soft** | Green = calming, growth, support |
| News / Editorial / Minimal | **Monochrome Minimal** | High contrast, content-first |

**Example Application:**
- AI Agent Control Tower → Midnight Premium (monitoring tool)
- TPUSA Intel → Ocean Calm (investigative research)
- Scholarship Hunt → Nature Soft (stress-reducing, hopeful)

**Layout Variation:**
- Different apps need different card styles, navigation patterns, information hierarchy
- Control Tower: Dense data grids, glow effects, gradient stats
- Content aggregator: Media-heavy cards, platform badges, filters
- Form/tracker: Status indicators, deadline urgency, progress tracking

**Reference:** `/root/.openclaw/workspace/MODERN-MOBILE-DESIGN-SYSTEM.md` has all 5 palettes with full specs.

### 5. Spacing (4px Grid)
- Base spacing: 4px, 8px, 12px, 16px, 20px, 24px, 32px
- Screen margins: 16px default, 20px large phones
- Card padding: 16-24px
- Section spacing: 24px

### 5. Touch Targets (CRITICAL)
```css
/* Apple HIG: Minimum 44x44 points */
--touch-min: 44px;          /* Absolute minimum */
--touch-comfortable: 48px;  /* Recommended */
--touch-large: 56px;        /* Hero CTAs */

/* Always wrap icons in touch targets */
.icon-button {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 6. Color Palettes (5 Options)

#### Palette A: Ocean Calm (Professional/Finance)
```css
--primary: #0A84FF;           /* iOS Blue */
--secondary: #30D158;         /* Success Green */
--surface: #FFFFFF;
--surface-secondary: #F2F2F7; /* iOS Light Gray */
--text-primary: #1C1C1E;
--text-secondary: #3C3C43;
```

#### Palette B: Sunset Vibrant (Social/Consumer)
```css
--gradient-start: #FF6B6B;    /* Coral */
--gradient-end: #FFE66D;      /* Yellow */
--primary: #FF6B6B;
--secondary: #4ECDC4;         /* Teal */
--accent: #9B5DE5;            /* Purple */
```

#### Palette C: Midnight Premium (Pro Tools)
```css
--primary: #6366F1;           /* Indigo */
--secondary: #EC4899;         /* Pink */
--surface: #0F0F0F;
--surface-elevated: #1A1A1A;
--text-primary: #FAFAFA;
```

#### Palette D: Nature Soft (Health/Wellness)
```css
--primary: #86A789;           /* Sage Green */
--secondary: #D2E3C8;
--surface: #FFFDF8;           /* Warm White */
```

#### Palette E: Monochrome Minimal (News/Editorial)
```css
--primary: #000000;
--accent: #FF4444;            /* Single accent */
--surface: #FFFFFF;
```

### 7. Border Radius
```css
--radius-sm: 6px;     /* Small chips */
--radius-md: 8px;     /* Buttons, inputs */
--radius-lg: 12px;    /* Cards */
--radius-xl: 16px;    /* Large cards */
--radius-2xl: 20px;   /* Modals */
--radius-3xl: 24px;   /* Bottom sheets */
--radius-full: 9999px; /* Pills, avatars */
```

### 8. Shadows
```css
/* Light Mode */
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

/* Dark Mode */
--shadow-dark-md: 0 4px 16px rgba(0, 0, 0, 0.5);
--glow-primary: 0 0 20px rgba(99, 102, 241, 0.3);
```

---

## Component Templates (iOS Style)

### Buttons
```html
<!-- Primary Button (44px minimum) -->
<button class="h-11 px-6 bg-primary text-white font-semibold rounded-xl active:scale-[0.98] transition-transform">
  Action
</button>

<!-- Secondary -->
<button class="h-11 px-6 bg-surface-secondary text-primary font-semibold rounded-xl active:bg-surface-tertiary">
  Secondary
</button>

<!-- Icon Button (44x44 touch target) -->
<button class="w-11 h-11 flex items-center justify-center rounded-xl active:bg-surface-secondary">
  <Icon className="w-6 h-6" />
</button>
```

### Cards
```html
<!-- Standard Card -->
<div class="bg-white rounded-xl p-4 shadow-sm border border-border">
  Content
</div>

<!-- Glass Card -->
<div class="rounded-2xl p-5 glass">
  Content
</div>

<style>
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
</style>
```

### Input Fields
```html
<!-- Standard Input (48px height recommended) -->
<input 
  class="w-full h-12 px-4 bg-surface-secondary rounded-xl text-text-primary focus:ring-2 focus:ring-primary"
  placeholder="Enter text"
/>

<!-- Search Input -->
<div class="relative">
  <Icon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
  <input class="w-full h-10 pl-10 pr-4 bg-surface-secondary rounded-full" />
</div>
```

### Bottom Tab Bar (iOS Style)
```html
<nav class="fixed bottom-0 inset-x-0 h-[84px] bg-white/90 backdrop-blur-xl border-t border-black/5 flex justify-around items-start pt-2 pb-[env(safe-area-inset-bottom)]">
  <button class="flex flex-col items-center gap-0.5 text-primary w-16">
    <Icon class="w-6 h-6" />
    <span class="text-xs font-medium">Home</span>
  </button>
  <!-- More tabs -->
</nav>
```

---

## App-Specific Palette Recommendations

| App | Palette | Reason |
|-----|---------|--------|
| **AI Control Tower** | Midnight Premium | Pro tools, technical |
| **TPUSA Intel** | Ocean Calm | Professional, investigative |
| **Scholarship Hunt** | Nature Soft | Wellness, calming, supportive |
| **Kanban Board** | Monochrome Minimal | Productivity, focus |

---

## Implementation Checklist

When redesigning an app:

- [ ] Choose appropriate color palette
- [ ] Ensure **44px minimum touch targets** (buttons, icons)
- [ ] Apply glassmorphism to headers/tab bars
- [ ] Use SF Pro Text or Inter for typography
- [ ] Implement 4px spacing grid
- [ ] Add iOS safe area support (`env()` values)
- [ ] Use 12-20px border radius (generous curves)
- [ ] Implement light + dark mode
- [ ] Test on 320px width (smallest mobile)
- [ ] Add smooth animations (0.2-0.3s ease)
- [ ] Ensure WCAG 2.1 AA color contrast (4.5:1 minimum)

---

## Reference Files

**Full Design System:** `/root/.openclaw/workspace/MODERN-MOBILE-DESIGN-SYSTEM.md`

**Sections:**
- Color palettes (5 complete sets)
- Typography scales
- Component library (buttons, cards, inputs, navigation)
- Layout patterns (Feed, Detail, Settings, Onboarding)
- Glassmorphism & Liquid Glass
- Accessibility (WCAG 2.1)
- Animation timing functions

---

## Anti-Patterns (Avoid)

❌ Touch targets < 44px  
❌ Dark-only mode (always include light)  
❌ Sharp corners (use 12px+ radius)  
❌ Flat colors only (use gradients + glassmorphism)  
❌ Tiny fonts on mobile (<14px body text)  
❌ Hover-only interactions (use :active for touch)  
❌ Ignoring safe areas (notches, home indicators)  
❌ No empty states  
❌ Cluttered spacing (use generous whitespace)  

---

**Last Updated:** 2026-02-06  
**Source:** iOS Human Interface Guidelines, Mobbin.com, Modern Mobile Design System v1.0  
**Applies to:** All web apps built by Cole AI  
**Mandatory:** Yes - all apps must follow iOS HIG standards
