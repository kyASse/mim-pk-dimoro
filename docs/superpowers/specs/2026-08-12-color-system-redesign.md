# Design Specification: Modern Islamic Oasis Color System

**Date**: 2026-08-12  
**Project**: MIM PK Dimoro Website (`app/globals.css` & `tailwind.config.ts`)  
**Design System/Skill**: `tasteskill v2 (experimental)` & `superpowers/brainstorming`  
**Mode**: `Redesign - Color Palette Upgrade`

---

## 1. Executive Summary

This design specification upgrades the color palette of the MIM PK Dimoro website from a flat 2-color binary palette (white & green) to the **Modern Islamic Oasis Color System**. This system preserves the signature Muhammadiyah Islamic green identity while introducing warm paper surfaces, sage mint secondary containers, warm amber gold accents for Tahfidz/achievements, and sky blue accents for academic programs.

---

## 2. Color Tokens & HSL Mapping

### 2.1 `app/globals.css` Tokens

```css
@layer base {
  :root {
    /* 1. Warm Base Surfaces */
    --background: 40 20% 98%;          /* Cream Paper / Warm Off-White */
    --foreground: 150 15% 12%;          /* Deep Islamic Charcoal */

    /* 2. Cards & Popovers */
    --card: 0 0% 100%;                  /* Pure White for bento card contrast */
    --card-foreground: 150 15% 12%;
    --popover: 0 0% 100%;
    --popover-foreground: 150 15% 12%;

    /* 3. Primary: Emerald Muhammadiyah Green */
    --primary: 142 70% 36%;
    --primary-foreground: 0 0% 100%;

    /* 4. Secondary: Soft Sage Mint */
    --secondary: 142 35% 94%;
    --secondary-foreground: 142 70% 20%;

    /* 5. Accent 1: Sky Blue (Academic & Klinik Belajar) */
    --accent: 199 80% 55%;
    --accent-foreground: 199 90% 15%;

    /* 6. Accent 2: Warm Amber Gold (Tahfidz Al-Qur'an & Achievements) */
    --amber-gold: 38 90% 52%;
    --amber-gold-foreground: 38 95% 15%;
    --amber-gold-surface: 38 85% 95%;

    /* 7. Muted Surface */
    --muted: 210 20% 96%;
    --muted-foreground: 215 16% 45%;

    /* 8. Border & Ring */
    --border: 142 20% 88%;
    --input: 142 20% 88%;
    --ring: 142 70% 36%;
  }

  .dark {
    --background: 150 25% 6%;
    --foreground: 40 20% 96%;
    --card: 150 20% 9%;
    --card-foreground: 40 20% 96%;
    --primary: 142 65% 48%;
    --primary-foreground: 150 25% 6%;
    --secondary: 150 25% 16%;
    --secondary-foreground: 142 50% 90%;
    --accent: 199 75% 50%;
    --accent-foreground: 0 0% 100%;
    --amber-gold: 38 85% 58%;
    --amber-gold-foreground: 150 25% 6%;
    --amber-gold-surface: 38 30% 16%;
    --muted: 150 20% 14%;
    --muted-foreground: 150 15% 65%;
    --border: 150 20% 18%;
    --input: 150 20% 18%;
    --ring: 142 65% 48%;
  }
}
```

---

## 3. Tailwind Configuration Integration

In `tailwind.config.ts`, extend the theme colors:

```typescript
colors: {
  'amber-gold': {
    DEFAULT: 'hsl(var(--amber-gold))',
    foreground: 'hsl(var(--amber-gold-foreground))',
    surface: 'hsl(var(--amber-gold-surface))',
  },
}
```

---

## 4. Semantic Rules & Quality Audits

1. **Accessibility Compliance**: `--primary-foreground` mapped to `hsl(0 0% 100%)` to ensure WCAG AA contrast ratio (> 4.5:1) against `--primary`.
2. **Zero Em-Dash Rule**: 0 em-dashes across all comments and utility strings.
3. **Color Consistency Lock**: Warm background base (`hsl(40 20% 98%)`) replaces stark 100% white, providing a soothing paper aesthetic for mobile and desktop reading.
