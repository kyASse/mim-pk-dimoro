# Color System Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the **Modern Islamic Oasis Color System** across Home Page and Tentang Kami components.

**Architecture:** Map semantic color tokens: Amber Gold for Tahfidz Al-Qur'an & Achievements, Sky Blue for Klinik Belajar & Academic features, Soft Sage Mint for Character & Extra-curriculars, and Emerald Green for Primary Identity.

**Tech Stack:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Vitest.

---

### Task 1: Update Home Page Components (`ProgramSection`, `ProgramCard`, `FeaturesSection`)

**Files:**
- Modify: `components/home/ProgramSection.tsx`
- Modify: `components/home/ProgramCard.tsx`
- Modify: `components/home/FeaturesSection.tsx`
- Test: `components/home/__tests__/home-sections.test.tsx`

- [ ] **Step 1: Update `ProgramCard.tsx` to support semantic variant styles**

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface ProgramCardProps {
    title: string;
    description: string;
    image: string;
    href: string;
    variant?: "tahfidz" | "klinik" | "default";
}

export default function ProgramCard({ title, description, image, href, variant = "default" }: ProgramCardProps) {
    return (
        <div className={cn(
            "overflow-hidden rounded-3xl bg-card border shadow-sm flex flex-col h-full transition-all group",
            variant === "tahfidz" && "border-amber-gold/40 bg-amber-gold-surface hover:shadow-md hover:border-amber-gold/60",
            variant === "klinik" && "border-sky-500/30 bg-sky-500/5 hover:shadow-md hover:border-sky-500/50",
            variant === "default" && "border-border/60 hover:shadow-md hover:border-primary/40"
        )}>
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            
            <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                    {variant === "tahfidz" && (
                        <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-gold/20 text-amber-800 dark:text-amber-200 mb-3">
                            Target Hafalan Mutqin
                        </span>
                    )}
                    {variant === "klinik" && (
                        <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-300 mb-3">
                            Bimbingan Personal Gratis
                        </span>
                    )}
                    {variant === "default" && (
                        <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary mb-3">
                            Karakter & Talent
                        </span>
                    )}

                    <h3 className="text-xl font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                        {description}
                    </p>
                </div>

                <Button asChild variant={variant === "tahfidz" ? "default" : "outline"} className={cn(
                    "w-full rounded-full font-semibold justify-between min-h-[44px]",
                    variant === "tahfidz" && "bg-amber-gold hover:bg-amber-gold/90 text-amber-gold-foreground border-amber-gold",
                    variant === "klinik" && "border-sky-500/40 text-sky-700 dark:text-sky-300 hover:bg-sky-500/10",
                    variant === "default" && "border-border/80 hover:bg-primary/10 hover:text-primary hover:border-primary/40"
                )}>
                    <Link href={href}>
                        <span>Pelajari Program</span>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
```

- [ ] **Step 2: Pass variants in `ProgramSection.tsx`**

```tsx
const programs = [
    {
        title: EXCELLENT_PROGRAMS.tahfidz.title,
        description: EXCELLENT_PROGRAMS.tahfidz.target,
        image: "/images/mim_tahfidz_learning.jpg",
        href: "/program/tahfidz",
        variant: "tahfidz" as const
    },
    {
        title: EXCELLENT_PROGRAMS.klinikBelajar.title,
        description: EXCELLENT_PROGRAMS.klinikBelajar.description,
        image: "/images/mim_hero_main.jpg",
        href: "/program/klinik-belajar",
        variant: "klinik" as const
    },
    {
        title: "Ekstrakurikuler",
        description: "Berbagai pilihan kegiatan mulai dari seni bela diri Tapak Suci, kepanduan Hizbul Wathan (HW), hingga Robotika.",
        image: "/images/mim_tahfidz_learning.jpg",
        href: "/program/ekstrakurikuler",
        variant: "default" as const
    }
];
```

- [ ] **Step 3: Update `FeaturesSection.tsx` with semantic accent color badges**

- [ ] **Step 4: Run unit tests to verify `home-sections.test.tsx` passes**

Run: `npm test -- components/home/__tests__/home-sections.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit Task 1 changes**

```bash
git add components/home/ProgramSection.tsx components/home/ProgramCard.tsx components/home/FeaturesSection.tsx
git commit -m "feat(home): integrate Modern Islamic Oasis color mapping on ProgramCard and FeaturesSection"
```

---

### Task 2: Update Tentang Kami Components (`ValueCard`, `Achievements`)

**Files:**
- Modify: `components/tentang-kami/ValueCard.tsx`
- Modify: `components/tentang-kami/Achievements.tsx`
- Test: `components/tentang-kami/__tests__/tentang-kami-sections.test.tsx`

- [ ] **Step 1: Update `ValueCard.tsx` to support `amber-gold` and `sky-blue` token classes**

```tsx
const getColorClasses = (colorName: string) => {
    switch (colorName) {
        case 'primary':
            return {
                bg: 'bg-primary/10',
                border: 'border-primary/30',
                text: 'text-primary',
                hover: 'hover:border-primary/50'
            };
        case 'highlight':
            return {
                bg: 'bg-amber-gold-surface',
                border: 'border-amber-gold/40',
                text: 'text-amber-gold',
                hover: 'hover:border-amber-gold/60'
            };
        case 'secondary':
            return {
                bg: 'bg-sky-500/10',
                border: 'border-sky-500/30',
                text: 'text-sky-700 dark:text-sky-300',
                hover: 'hover:border-sky-500/50'
            };
        case 'accent':
            return {
                bg: 'bg-secondary/40',
                border: 'border-primary/20',
                text: 'text-secondary-foreground',
                hover: 'hover:border-primary/40'
            };
        default:
            return {
                bg: 'bg-primary/10',
                border: 'border-primary/30',
                text: 'text-primary',
                hover: 'hover:border-primary/50'
            };
    }
};
```

- [ ] **Step 2: Update `Achievements.tsx` level badges with `amber-gold` theme**

- [ ] **Step 3: Run Vitest test suite for `tentang-kami-sections.test.tsx`**

Run: `npm test -- components/tentang-kami/__tests__/tentang-kami-sections.test.tsx`
Expected: PASS

- [ ] **Step 4: Commit Task 2 changes**

```bash
git add components/tentang-kami/ValueCard.tsx components/tentang-kami/Achievements.tsx
git commit -m "feat(tentang-kami): apply Modern Islamic Oasis color palette to ValueCard and Achievements"
```

---

### Task 3: Full Verification & Remote Push

- [ ] **Step 1: Run TypeScript type check**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 2: Run full Vitest test suite**

Run: `npm test`
Expected: 16 test files passed (87 tests)

- [ ] **Step 3: Push changes to `origin feat/redesign-home-tasteskill-v2`**

```bash
git push origin feat/redesign-home-tasteskill-v2
```
