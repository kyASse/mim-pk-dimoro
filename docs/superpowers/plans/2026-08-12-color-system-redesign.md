# Modern Islamic Oasis Color System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the site-wide color palette in `app/globals.css` and `tailwind.config.ts` to the **Modern Islamic Oasis Color System**.

**Architecture:** Replace stark binary white/green variables with warm paper background surfaces (`hsl(40 20% 98%)`), white primary text contrast (`hsl(0 0% 100%)`), soft sage mint secondary containers, warm amber gold tokens for Tahfidz/achievements, and sky blue accents for academic programs.

**Tech Stack:** Next.js 15+ (App Router), Tailwind CSS v3/v4, TypeScript, Vitest.

---

### Task 1: Update CSS Color Tokens in `app/globals.css`

**Files:**
- Modify: `app/globals.css`
- Test: `lib/__tests__/color-contrast.test.ts`

- [ ] **Step 1: Update `app/globals.css` with Modern Islamic Oasis tokens**

```css
@layer base {
  :root {
    --background: 40 20% 98%;
    --foreground: 150 15% 12%;
    --card: 0 0% 100%;
    --card-foreground: 150 15% 12%;
    --popover: 0 0% 100%;
    --popover-foreground: 150 15% 12%;

    /* Primary: Emerald Muhammadiyah Green */
    --primary: 142 70% 36%;
    --primary-foreground: 0 0% 100%;

    /* Secondary: Soft Sage Mint */
    --secondary: 142 35% 94%;
    --secondary-foreground: 142 70% 20%;

    /* Accent: Sky Blue */
    --accent: 199 80% 55%;
    --accent-foreground: 199 90% 15%;

    /* Amber Gold: Tahfidz & Achievements */
    --amber-gold: 38 90% 52%;
    --amber-gold-foreground: 38 95% 15%;
    --amber-gold-surface: 38 85% 95%;

    /* Muted & Neutral */
    --muted: 210 20% 96%;
    --muted-foreground: 215 16% 45%;

    /* Highlight & Attention */
    --highlight: 340 100% 95%;
    --highlight-foreground: 340 80% 30%;
    --attention: 30 100% 65%;
    --attention-foreground: 0 0% 100%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 142 20% 88%;
    --input: 142 20% 88%;
    --ring: 142 70% 36%;
    --radius: 1rem;
  }

  .dark {
    --background: 150 25% 6%;
    --foreground: 40 20% 96%;
    --card: 150 20% 9%;
    --card-foreground: 40 20% 96%;
    --popover: 150 20% 9%;
    --popover-foreground: 40 20% 96%;
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
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 150 20% 18%;
    --input: 150 20% 18%;
    --ring: 142 65% 48%;
  }
}
```

- [ ] **Step 2: Run color contrast test suite to verify WCAG AA pass**

Run: `npm test -- lib/__tests__/color-contrast.test.ts`
Expected: PASS

- [ ] **Step 3: Commit `globals.css` updates**

```bash
git add app/globals.css
git commit -m "style(theme): update globals.css with Modern Islamic Oasis HSL tokens"
```

---

### Task 2: Extend Tailwind Theme Colors in `tailwind.config.ts`

**Files:**
- Modify: `tailwind.config.ts`
- Test: `npm test`

- [ ] **Step 1: Extend Tailwind config with `amber-gold` color tokens**

```typescript
// Add to extend.colors in tailwind.config.ts:
'amber-gold': {
  DEFAULT: 'hsl(var(--amber-gold))',
  foreground: 'hsl(var(--amber-gold-foreground))',
  surface: 'hsl(var(--amber-gold-surface))',
},
```

- [ ] **Step 2: Run TypeScript compilation and full Vitest test suite**

Run: `npx tsc --noEmit; npm test`
Expected: 0 TS errors, all test files passing.

- [ ] **Step 3: Commit `tailwind.config.ts` updates**

```bash
git add tailwind.config.ts
git commit -m "feat(theme): extend tailwind config with amber-gold tokens"
```
