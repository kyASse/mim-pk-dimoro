# Design Specification: AboutSection & ProgramSection Integration for Home Page

**Date**: 2026-08-11  
**Project**: MIM PK Dimoro Website (`app/page.tsx`)  
**Design System/Skill**: `tasteskill v2 (experimental)` & `superpowers/brainstorming`  
**Mode**: `Redesign - Preserve` (Muhammadiyah Islamic Green brand identity & centralized school data preservation)

---

## 1. Executive Summary

This design document specifies the visual architecture, data flow, component layout, and taste-skill compliance for integrating **`AboutSection.tsx`** (Sambutan Kepala Sekolah & Profil Madrasah) and **`ProgramSection.tsx`** (Program Unggulan Madrasah) on the MIM PK Dimoro Home Page.

---

## 2. Goals & Key Objectives

1. **Build Parent Trust (PPDB Conversion)**: Highlight the official Headmaster Welcome (`HEADMASTER_WELCOME`) with an asymmetric storytelling layout featuring Headmaster profile information and institutional credibility.
2. **Promote Flagship Educational Programs**: Present `EXCELLENT_PROGRAMS` (Tahfidz Al-Qur'an, Klinik Belajar, Ekstrakurikuler) with rich bento-card layouts and clear target indicators.
3. **Enforce Tasteskill v2 Guardrails**:
   - Zero em-dash (`—`) or en-dash (`–`) enforcement across all visible copy.
   - Accessible motion scaling via `useReducedMotion()` for `prefers-reduced-motion` compliance.
   - High-contrast typography and single source-of-truth data binding from `lib/school-data.ts` and `lib/school-config.ts`.

---

## 3. Component Specifications

### 3.1 `AboutSection.tsx`

* **Layout Paradigm**: Asymmetric 12-Column Split (`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center`).
* **Left Column (`lg:col-span-6`)**:
  - **Pill Badge**: `Sambutan Kepala Madrasah` with `Quote` icon (`bg-primary/10 text-primary border border-primary/20 rounded-full`).
  - **Headline (H2)**: `Selamat Datang di MI Muhammadiyah Dimoro` (`text-3xl sm:text-4xl font-bold tracking-tight text-foreground`).
  - **Blockquote Summary**: `HEADMASTER_WELCOME.summary` rendered in italic typography with a signature Muhammadiyah green vertical border (`border-l-4 border-primary pl-4 py-1`).
  - **3 Value Propositions**:
    1. *Pendidikan Berkualitas*: Integrated national and Islamic curriculum.
    2. *Pembentukan Karakter*: Daily worship habits and noble character.
    3. *Pendidik Berdedikasi*: Experienced teachers nurturing individual student potential.
  - **CTA Navigation**: Clickable link `Baca Sambutan Selengkapnya` (`href="/tentang-kami"`) with subtle hover arrow translation.
* **Right Column (`lg:col-span-6`)**:
  - **Card Container**: `rounded-3xl` overflow-hidden container showcasing learning photography (`/images/mim_tahfidz_learning.jpg`).
  - **Footer Badge Bar**: Displays `HEADMASTER_WELCOME.name` ("Hj. Anik Sulityowati, S.Ag.") and `HEADMASTER_WELCOME.title` ("Kepala MI Muhammadiyah Dimoro") with a "Kepala Madrasah" pill.
  - **Floating Sub-Card**: `hidden sm:block absolute -bottom-6 -right-6` highlight card ("Lingkungan Kondusif & Ramah Anak").

---

### 3.2 `ProgramSection.tsx`

* **Layout Paradigm**: 3-Column Asymmetric Bento Grid (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`).
* **Section Header**:
  - **Headline (H2)**: `Program Unggulan Madrasah` (`text-3xl md:text-4xl font-bold tracking-tight text-foreground`).
  - **Subtext**: Concise explainer paragraph on integrated academic and keislaman development.
* **Program Cards**:
  1. **Tahfidz Al-Qur'an**:
     - Title: `EXCELLENT_PROGRAMS.tahfidz.title` ("Program Tahfidz Al-Qur'an")
     - Description: `EXCELLENT_PROGRAMS.tahfidz.target` ("Minimal hafal 1 juz (Juz 30) saat lulus...")
     - Image: `/images/mim_tahfidz_learning.jpg`
     - Link: `/program/tahfidz`
  2. **Klinik Belajar**:
     - Title: `EXCELLENT_PROGRAMS.klinikBelajar.title` ("Klinik Belajar")
     - Description: `EXCELLENT_PROGRAMS.klinikBelajar.description` ("Layanan bimbingan belajar intensif dan pendampingan personal...")
     - Image: `/images/mim_hero_main.jpg`
     - Link: `/program/klinik-belajar`
  3. **Ekstrakurikuler**:
     - Title: `Ekstrakurikuler`
     - Description: `Berbagai pilihan kegiatan mulai dari seni bela diri Tapak Suci, kepanduan Hizbul Wathan (HW), hingga Robotika.`
     - Image: `/images/mim_tahfidz_learning.jpg`
     - Link: `/program/ekstrakurikuler`
* **Footer Action**: Rounded-full button pill `Lihat Semua Program Unggulan` (`href="/program"`).

---

## 4. Quality & Compliance Audits

1. **Em-Dash Audit**: Zero instances of `—` or `–` across all copy.
2. **Preset Dials**: `DESIGN_VARIANCE: 6`, `MOTION_INTENSITY: 6`, `VISUAL_DENSITY: 4`.
3. **Accessibility**: WCAG AA contrast ratio (> 4.5:1 for body copy), `useReducedMotion()` applied to all motion elements.
4. **Testing Coverage**: Verified against `components/home/__tests__/home-sections.test.tsx` and all Vitest suites.
