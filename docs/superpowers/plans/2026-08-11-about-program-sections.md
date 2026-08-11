# AboutSection & ProgramSection Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate and refine `AboutSection` (Headmaster Welcome) and `ProgramSection` (Flagship Programs Bento Grid) on the MIM PK Dimoro Home Page following `tasteskill v2` guidelines.

**Architecture:** Use centralized school data (`lib/school-data.ts`) for Headmaster Welcome and Excellent Programs, applying an asymmetric split storytelling layout for `AboutSection` and a bento grid for `ProgramSection`. Ensure zero em-dashes, `useReducedMotion()` accessibility, and WCAG AA contrast compliance.

**Tech Stack:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Motion (`motion/react`), Vitest, Testing Library.

---

### Task 1: Refine `AboutSection` Component

**Files:**
- Modify: `components/home/AboutSection.tsx`
- Test: `components/home/__tests__/home-sections.test.tsx`

- [ ] **Step 1: Verify `AboutSection` test suite passes before modifications**

Run: `npm test -- components/home/__tests__/home-sections.test.tsx`
Expected: PASS

- [ ] **Step 2: Update `AboutSection.tsx` for asymmetric split layout**

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Award, Heart, Users, ChevronRight, Quote } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { SCHOOL_NAME } from "@/lib/school-config";
import { HEADMASTER_WELCOME } from "@/lib/school-data";

export default function AboutSection() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="py-20 bg-background overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left: Text Content & Welcome */}
                    <motion.div 
                        initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-6"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20">
                            <Quote className="h-3.5 w-3.5" />
                            <span>Sambutan Kepala Madrasah</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4 leading-tight">
                            Selamat Datang di {SCHOOL_NAME}
                        </h2>
                        
                        <p className="text-base text-muted-foreground leading-relaxed mb-6 font-medium italic border-l-4 border-primary pl-4 py-1">
                            {HEADMASTER_WELCOME.summary}
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shrink-0 mt-1">
                                    <Award className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base text-foreground mb-1">
                                        Pendidikan Berkualitas
                                    </h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                        Kurikulum terintegrasi antara pendidikan nasional dan ilmu keislaman secara seimbang.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1">
                                    <Heart className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base text-foreground mb-1">
                                        Pembentukan Karakter
                                    </h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                        Menanamkan kebiasaan ibadah harian dan akhlakul karimah sejak dini.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0 mt-1">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base text-foreground mb-1">
                                        Pendidik Berdedikasi
                                    </h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                        Guru yang berpengalaman dalam membimbing dan mengayomi potensi setiap siswa.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Link 
                                href="/tentang-kami" 
                                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 group transition-colors"
                            >
                                <span>Baca Sambutan Selengkapnya</span>
                                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right: Visual Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-6 relative"
                    >
                        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-border/50 bg-card">
                            <div className="relative aspect-[4/3] w-full overflow-hidden">
                                <Image
                                    src="/images/mim_tahfidz_learning.jpg"
                                    alt={`Kegiatan pembelajaran siswa di ${SCHOOL_NAME}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                            <div className="p-4 bg-card text-card-foreground border-t border-border/40 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-sm text-foreground">{HEADMASTER_WELCOME.name}</h3>
                                    <p className="text-xs text-muted-foreground">{HEADMASTER_WELCOME.title}</p>
                                </div>
                                <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                                    Kepala Madrasah
                                </span>
                            </div>
                        </div>

                        <div className="hidden sm:block absolute -bottom-6 -right-6 p-5 bg-card border border-border/80 rounded-2xl shadow-xl max-w-xs z-10">
                            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Lingkungan Kondusif</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Ruang kelas ramah anak dengan suasana belajar yang aman, nyaman, dan menyenangkan.
                            </p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
```

- [ ] **Step 3: Run unit tests to verify `AboutSection` passes**

Run: `npm test -- components/home/__tests__/home-sections.test.tsx`
Expected: PASS

- [ ] **Step 4: Commit `AboutSection` updates**

```bash
git add components/home/AboutSection.tsx
git commit -m "feat(home): refine AboutSection with headmaster welcome and asymmetric split storytelling"
```

---

### Task 2: Refine `ProgramSection` & `ProgramCard` Components

**Files:**
- Modify: `components/home/ProgramSection.tsx`
- Modify: `components/home/ProgramCard.tsx`
- Test: `components/home/__tests__/home-sections.test.tsx`

- [ ] **Step 1: Update `ProgramSection.tsx` with centralized `EXCELLENT_PROGRAMS` data**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import ProgramCard from "./ProgramCard";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { EXCELLENT_PROGRAMS } from "@/lib/school-data";

const programs = [
    {
        title: EXCELLENT_PROGRAMS.tahfidz.title,
        description: EXCELLENT_PROGRAMS.tahfidz.target,
        image: "/images/mim_tahfidz_learning.jpg",
        href: "/program/tahfidz"
    },
    {
        title: EXCELLENT_PROGRAMS.klinikBelajar.title,
        description: EXCELLENT_PROGRAMS.klinikBelajar.description,
        image: "/images/mim_hero_main.jpg",
        href: "/program/klinik-belajar"
    },
    {
        title: "Ekstrakurikuler",
        description: "Berbagai pilihan kegiatan mulai dari seni bela diri Tapak Suci, kepanduan Hizbul Wathan (HW), hingga Robotika.",
        image: "/images/mim_tahfidz_learning.jpg",
        href: "/program/ekstrakurikuler"
    }
];

export default function ProgramSection() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="py-20 bg-muted/40 border-y border-border/40">
            <div className="container mx-auto px-4">
                
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                        Program Unggulan Madrasah
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                        Kami menyediakan program akademik dan keislaman terpadu untuk mengembangkan seluruh minat, bakat, dan potensi setiap siswa secara optimal.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {programs.map((program, index) => (
                        <motion.div
                            key={program.title}
                            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <ProgramCard
                                title={program.title}
                                description={program.description}
                                image={program.image}
                                href={program.href}
                            />
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/program">
                        <Button className="rounded-full border-border hover:bg-muted font-semibold px-6" variant="outline">
                            <span>Lihat Semua Program Unggulan</span>
                            <ChevronRight className="ml-1.5 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

            </div>
        </section>
    );
}
```

- [ ] **Step 2: Update `ProgramCard.tsx` for clean interactive button accessibility**

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface ProgramCardProps {
    title: string;
    description: string;
    image: string;
    href: string;
}

export default function ProgramCard({ title, description, image, href }: ProgramCardProps) {
    return (
        <div className="overflow-hidden rounded-3xl bg-card border border-border/60 shadow-sm flex flex-col h-full hover:shadow-md hover:border-primary/40 transition-all group">
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
                    <h3 className="text-xl font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                        {description}
                    </p>
                </div>

                <Link href={href} className="w-full block">
                    <Button variant="outline" className="w-full rounded-full border-border/80 hover:bg-primary/10 hover:text-primary hover:border-primary/40 font-semibold justify-between">
                        <span>Pelajari Program</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
```

- [ ] **Step 3: Run full Vitest test suite and TypeScript type check**

Run: `npx tsc --noEmit; npm test`
Expected: 0 TS errors, 16 test files passed (87 tests)

- [ ] **Step 4: Commit `ProgramSection` updates**

```bash
git add components/home/ProgramSection.tsx components/home/ProgramCard.tsx
git commit -m "feat(home): update ProgramSection to use EXCELLENT_PROGRAMS with responsive bento cards"
```
