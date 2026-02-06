# Modern Mobile-First Design System v1.0

## Overview & Philosophy

A production-ready, mobile-first design system inspired by Apple Human Interface Guidelines (iOS 18+), Mobbin.com UI patterns, and 2025-2026 design trends. Optimized for React Native, SwiftUI, Flutter, and responsive web.

**Design Philosophy**: Clarity, Deference, Depth, Consistency (Apple HIG Core Principles)

---

## Anti-Hallucination Verification

| Element | Source | Confidence |
|---------|--------|------------|
| iOS HIG Principles | Apple Developer Documentation | 95% |
| Touch Target 44x44pt | Apple HIG, MoldStud research | 95% |
| Liquid Glass trend | iOS 26 documentation, Tapptitude | 90% |
| Color palette trends | DesignRush, Envato, UXPin (2025-2026) | 90% |
| Mobbin patterns | Mobbin.com, Product Hunt reviews | 95% |
| Accessibility WCAG | W3C WCAG 2.1, interaction-design.org | 95% |
| Material You theming | Google Material Design docs | 90% |

---

## Color Palettes

### Palette A: Ocean Calm (Professional/Finance/Wellness)

```css
/* Light Mode */
--primary: #0A84FF;           /* iOS System Blue */
--primary-light: #5AC8FA;     /* Light Blue */
--secondary: #30D158;         /* Success Green */
--accent: #FF9F0A;            /* Attention Orange */
--surface: #FFFFFF;
--surface-secondary: #F2F2F7; /* iOS Light Gray */
--surface-tertiary: #E5E5EA;
--text-primary: #1C1C1E;
--text-secondary: #3C3C43;    /* 60% opacity preferred */
--text-tertiary: #8E8E93;
--border: #D1D1D6;
--error: #FF3B30;
--warning: #FF9500;
--success: #34C759;

/* Dark Mode */
--primary-dark: #0A84FF;
--surface-dark: #1C1C1E;
--surface-secondary-dark: #2C2C2E;
--surface-tertiary-dark: #3A3A3C;
--text-primary-dark: #FFFFFF;
--text-secondary-dark: rgba(235, 235, 245, 0.6);
--border-dark: #38383A;
```

### Palette B: Sunset Vibrant (Consumer/Social/Entertainment)

```css
/* Primary Gradient */
--gradient-start: #FF6B6B;    /* Coral */
--gradient-end: #FFE66D;      /* Warm Yellow */
--primary: #FF6B6B;
--secondary: #4ECDC4;         /* Teal */
--accent: #9B5DE5;            /* Purple */
--surface: #FAFAFA;
--surface-card: #FFFFFF;
--text-primary: #2D2D2D;
--text-secondary: #6B6B6B;
--success: #95D5B2;
--error: #FF8A80;
--warning: #FFCC80;
```

### Palette C: Midnight Premium (Luxury/Pro Tools/Creative)

```css
/* Dark-First Design */
--primary: #6366F1;           /* Indigo */
--primary-light: #818CF8;
--secondary: #EC4899;         /* Pink */
--accent: #10B981;            /* Emerald */
--surface: #0F0F0F;
--surface-elevated: #1A1A1A;
--surface-card: #262626;
--text-primary: #FAFAFA;
--text-secondary: #A1A1AA;
--text-muted: #71717A;
--border: #27272A;
--glass-bg: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.1);
```

### Palette D: Nature Soft (Health/Wellness/Meditation)

```css
/* Pastel & Calming */
--primary: #86A789;           /* Sage Green */
--secondary: #D2E3C8;         /* Light Sage */
--accent: #FFCBCB;            /* Blush Pink */
--surface: #FFFDF8;           /* Warm White */
--surface-card: #FFFFFF;
--text-primary: #2C3E50;
--text-secondary: #7F8C8D;
--success: #86A789;
--error: #E57373;
--warning: #FFD93D;
--border: #E8E4DC;
```

### Palette E: Monochrome Minimal (Editorial/News/Professional)

```css
/* High Contrast Black/White */
--primary: #000000;
--accent: #FF4444;            /* Single accent color */
--surface: #FFFFFF;
--surface-secondary: #FAFAFA;
--text-primary: #000000;
--text-secondary: #666666;
--text-muted: #999999;
--border: #E0E0E0;
--divider: #F0F0F0;
```

---

## Typography

### Font Stack (Platform Optimized)

```css
/* iOS Native */
--font-system: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text";

/* Cross-Platform Modern */
--font-primary: "Inter", "SF Pro Text", -apple-system, system-ui, sans-serif;
--font-display: "SF Pro Display", "Inter Display", -apple-system, sans-serif;

/* Distinctive Options (Non-Generic) */
--font-heading: "Clash Display", "Satoshi", "Plus Jakarta Sans";
--font-body: "General Sans", "Outfit", "DM Sans";
--font-mono: "JetBrains Mono", "SF Mono", "Fira Code", monospace;
```

### Type Scale (iOS Standard)

```css
/* Mobile-First Sizes (points/rem) */
--text-xs: 0.6875rem;    /* 11pt - Caption 2 */
--text-sm: 0.75rem;      /* 12pt - Caption 1 */
--text-base: 0.9375rem;  /* 15pt - Subheadline */
--text-md: 1.0625rem;    /* 17pt - Body (iOS default) */
--text-lg: 1.25rem;      /* 20pt - Title 3 */
--text-xl: 1.375rem;     /* 22pt - Title 2 */
--text-2xl: 1.75rem;     /* 28pt - Title 1 */
--text-3xl: 2.125rem;    /* 34pt - Large Title */

/* Font Weights */
--weight-regular: 400;
--weight-medium: 500;
--weight-semibold: 600;
--weight-bold: 700;

/* Line Heights */
--leading-tight: 1.2;
--leading-normal: 1.4;
--leading-relaxed: 1.6;

/* Letter Spacing */
--tracking-tight: -0.02em;
--tracking-normal: 0;
--tracking-wide: 0.02em;
```

### Typography Patterns

```tsx
// Heading Styles
const headingStyles = {
  largeTitle: "text-3xl font-bold tracking-tight leading-tight",
  title1: "text-2xl font-bold tracking-tight",
  title2: "text-xl font-semibold",
  title3: "text-lg font-semibold",
  headline: "text-md font-semibold",
  body: "text-md font-regular leading-relaxed",
  callout: "text-base font-regular",
  subheadline: "text-base font-regular text-secondary",
  footnote: "text-sm font-regular text-tertiary",
  caption: "text-xs font-regular text-tertiary uppercase tracking-wide",
};
```

---

## Spacing & Layout

### Base Unit System (4px Grid)

```css
/* Spacing Scale */
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px - Base unit */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Safe Areas & Margins

```css
/* iOS Safe Areas */
--safe-top: env(safe-area-inset-top);
--safe-bottom: env(safe-area-inset-bottom);
--safe-left: env(safe-area-inset-left);
--safe-right: env(safe-area-inset-right);

/* Content Margins */
--margin-screen: 1rem;       /* 16px - Mobile default */
--margin-screen-lg: 1.25rem; /* 20px - Larger phones */
--margin-card: 1rem;         /* 16px */
--margin-section: 1.5rem;    /* 24px */
```

### Touch Targets (CRITICAL - Accessibility)

```css
/* Minimum Touch Target: 44x44 points (Apple HIG) */
--touch-min: 44px;
--touch-comfortable: 48px;
--touch-large: 56px;

/* Button Heights */
--btn-sm: 32px;  /* Text buttons, secondary actions */
--btn-md: 44px;  /* Primary buttons - MINIMUM for touch */
--btn-lg: 56px;  /* Hero CTAs */

/* Icon Touch Areas */
--icon-touch: 44px; /* Always wrap icons in 44px touch target */
```

### Screen Widths

```css
/* Mobile Breakpoints */
--screen-xs: 320px;   /* iPhone SE */
--screen-sm: 375px;   /* iPhone 12 Mini */
--screen-md: 390px;   /* iPhone 14 */
--screen-lg: 428px;   /* iPhone 14 Pro Max */
--screen-xl: 744px;   /* iPad Mini */
--screen-2xl: 1024px; /* iPad Pro */

/* Content Width (for responsive web) */
--content-max: 440px; /* Mobile content cap */
```

---

## Border Radius

```css
/* Radius Scale */
--radius-none: 0;
--radius-sm: 0.375rem;  /* 6px - Small chips */
--radius-md: 0.5rem;    /* 8px - Buttons, inputs */
--radius-lg: 0.75rem;   /* 12px - Cards */
--radius-xl: 1rem;      /* 16px - Large cards */
--radius-2xl: 1.25rem;  /* 20px - Modals, sheets */
--radius-3xl: 1.5rem;   /* 24px - Bottom sheets */
--radius-full: 9999px;  /* Pills, avatars */

/* iOS Dynamic Island inspired */
--radius-dynamic: 2rem; /* 32px */
```

---

## Shadows & Elevation

### Light Mode Shadows

```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
--shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.16);

/* Colored Shadows (for vibrant UIs) */
--shadow-primary: 0 4px 14px rgba(10, 132, 255, 0.25);
--shadow-success: 0 4px 14px rgba(52, 199, 89, 0.25);
--shadow-error: 0 4px 14px rgba(255, 59, 48, 0.25);
```

### Dark Mode Shadows

```css
/* Dark mode uses lighter shadows + subtle borders */
--shadow-dark-sm: 0 2px 8px rgba(0, 0, 0, 0.4);
--shadow-dark-md: 0 4px 16px rgba(0, 0, 0, 0.5);
--shadow-dark-lg: 0 8px 32px rgba(0, 0, 0, 0.6);

/* Glow effects for dark mode */
--glow-primary: 0 0 20px rgba(99, 102, 241, 0.3);
--glow-accent: 0 0 20px rgba(236, 72, 153, 0.3);
```

---

## Glassmorphism & Liquid Glass (iOS 26 Trend)

```css
/* Standard Glass Effect */
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Dark Glass */
.glass-dark {
  background: rgba(30, 30, 30, 0.6);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Liquid Glass (iOS 26 Style) */
.liquid-glass {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
  backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 4px 16px rgba(0, 0, 0, 0.1);
}

/* Frosted Tab Bar */
.tab-bar-glass {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  border-top: 0.5px solid rgba(0, 0, 0, 0.1);
}
```

---

## Components

### Buttons

```tsx
/* Primary Button */
className="h-[44px] px-6 bg-primary text-white font-semibold rounded-xl active:scale-[0.98] transition-transform"

/* Secondary Button */
className="h-[44px] px-6 bg-surface-secondary text-primary font-semibold rounded-xl border border-border active:bg-surface-tertiary"

/* Ghost Button */
className="h-[44px] px-6 text-primary font-medium rounded-xl active:bg-primary/10"

/* Destructive Button */
className="h-[44px] px-6 bg-error text-white font-semibold rounded-xl active:scale-[0.98]"

/* Pill Button */
className="h-10 px-4 bg-surface-secondary text-text-primary rounded-full text-sm font-medium active:bg-surface-tertiary"

/* Icon Button */
className="w-[44px] h-[44px] flex items-center justify-center rounded-xl active:bg-surface-secondary"

/* Floating Action Button */
className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center active:scale-95"
```

### Cards

```tsx
/* Standard Card */
className="bg-white rounded-xl p-4 shadow-sm border border-border"

/* Elevated Card */
className="bg-white rounded-2xl p-5 shadow-md"

/* Glass Card */
className="rounded-2xl p-5 glass"

/* Interactive Card */
className="bg-white rounded-xl p-4 shadow-sm border border-border active:scale-[0.98] active:bg-surface-secondary transition-all"

/* Feature Card (with gradient) */
className="rounded-2xl p-6 bg-gradient-to-br from-primary to-primary-light text-white shadow-primary"
```

### Input Fields

```tsx
/* Standard Input */
className="w-full h-12 px-4 bg-surface-secondary rounded-xl text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-primary focus:bg-white border border-transparent focus:border-primary"

/* Search Input */
className="w-full h-10 pl-10 pr-4 bg-surface-secondary rounded-full text-text-primary placeholder:text-text-tertiary"

/* Text Area */
className="w-full min-h-[120px] p-4 bg-surface-secondary rounded-xl text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-primary resize-none"

/* Input with Icon */
<div className="relative">
  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
  <input className="w-full h-12 pl-10 pr-4 bg-surface-secondary rounded-xl" />
</div>
```

---

## Version History

| Version | Date | Changes |
|---------|------|----|
| 1.0 | Feb 2026 | Initial release based on iOS 18+ HIG, Mobbin patterns, 2025-2026 trends |

## Sources & References

1. Apple Human Interface Guidelines - developer.apple.com/design/human-interface-guidelines
2. Mobbin.com - UI/UX patterns library
3. iOS 26 Liquid Glass - Tapptitude, BairesDev (Aug 2025)
4. WCAG 2.1 - w3.org/WAI/WCAG21/
5. Color trends - DesignRush, Envato Elements, UXPin (2025-2026)
6. Material You - material.io/design

---

**Received:** 2026-02-06  
**From:** Brian (@swordtruth)  
**For:** UI/UX reference in all future app designs
