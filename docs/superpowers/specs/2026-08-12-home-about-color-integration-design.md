# Design Specification: Color System Integration for Home & Tentang Kami Pages

**Date**: 2026-08-12  
**Project**: MIM PK Dimoro Website (`app/page.tsx`, `app/tentang-kami/page.tsx`, `components/home/*`, `components/tentang-kami/*`)  
**Design System/Skill**: `tasteskill v2 (experimental)` & `superpowers/brainstorming`  
**Mode**: `Redesign - Full Semantic Color Integration`

---

## 1. Executive Summary

This design specification details the integration of the **Modern Islamic Oasis Color System** into the Home page (`app/page.tsx`) and Tentang Kami page (`app/tentang-kami/page.tsx`), as well as their respective child components. The system maps distinct semantic colors to educational offerings:
- **Amber Gold** (`--amber-gold`): Tahfidz Al-Qur'an & Prestasi Madrasah
- **Sky Blue** (`--accent`): Klinik Belajar & Fitur Akademik
- **Sage Mint** (`--secondary`): Pembinaan Karakter & Ekstrakurikuler
- **Emerald Green** (`--primary`): Identitas Utama Muhammadiyah & Call-To-Action (PPDB)
- **Warm Off-White** (`--background`): Surfaces & alternating section backgrounds

---

## 2. Component Specifications

### 2.1 Home Page Components (`components/home/*`)

1. **`ProgramSection.tsx` & `ProgramCard.tsx`**:
   - **Tahfidz Al-Qur'an Card**: Uses `bg-amber-gold-surface border-amber-gold/40 shadow-sm`, badge `bg-amber-gold/20 text-amber-800 dark:text-amber-200`, and button `bg-amber-gold hover:bg-amber-gold/90 text-amber-gold-foreground`.
   - **Klinik Belajar Card**: Uses `bg-sky-500/5 border-sky-500/30 shadow-sm`, badge `bg-sky-500/15 text-sky-700 dark:text-sky-300`, and outline button `border-sky-500/40 text-sky-700 dark:text-sky-300 hover:bg-sky-500/10`.
   - **Ekstrakurikuler Card**: Uses `bg-secondary/40 border-primary/30 shadow-sm`, badge `bg-primary/10 text-primary`, and button `bg-primary hover:bg-primary/90 text-primary-foreground`.

2. **`FeaturesSection.tsx`**:
   - 4 Bento cells with distinct semantic color badges:
     - Cell 1 (Kurikulum Terpadu): Primary Green
     - Cell 2 (Tahfidz Al-Qur'an): Amber Gold
     - Cell 3 (Pembinaan Karakter): Sage Mint
     - Cell 4 (Ekstrakurikuler): Sky Blue

3. **`AboutSection.tsx` & `CTASection.tsx`**:
   - Warm paper background `bg-background` (`hsl(40 20% 98%)`), quote blockquote `border-l-4 border-primary pl-4 py-1 bg-muted/20 rounded-r-xl`.

---

### 2.2 Tentang Kami Page Components (`components/tentang-kami/*`)

1. **`ValueCard.tsx`**:
   - *Religius*: Theme `primary` (`bg-primary/10 border-primary/30 text-primary hover:bg-primary/20`)
   - *Integritas*: Theme `amber-gold` (`bg-amber-gold-surface border-amber-gold/40 text-amber-gold hover:bg-amber-gold/20`)
   - *Cerdas*: Theme `accent` / Sky Blue (`bg-sky-500/10 border-sky-500/30 text-sky-700 dark:text-sky-300 hover:bg-sky-500/20`)
   - *Mandiri*: Theme `secondary` / Sage Mint (`bg-secondary/50 border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary/70`)

2. **`Achievements.tsx`**:
   - Year-grouped achievement bento containers using `bg-card border border-border/60 rounded-3xl`, with `amber-gold` level badges (`bg-amber-gold-surface text-amber-gold border-amber-gold/30`).

3. **`VisionMission.tsx` & `EducatorsSection.tsx`**:
   - Vision Card uses `bg-card border-primary/30 shadow-sm` with glowing radial blur `bg-primary/10`.
   - Vision & Mission bento grids use `bg-card border-border/60 rounded-3xl` with pillar badges `bg-primary/10 text-primary`.

---

## 3. Quality & Accessibility Audits

1. **WCAG AA Compliance**: All button and badge text combinations pass contrast ratios (> 4.5:1 for body copy).
2. **Zero Em-Dash Rule**: 0 em-dashes across all copy.
3. **Reduced Motion**: Supported via `useReducedMotion()`.
