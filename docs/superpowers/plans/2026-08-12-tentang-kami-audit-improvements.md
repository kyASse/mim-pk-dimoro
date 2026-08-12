# Tentang Kami Page Taste-Skill Refinements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the Tentang Kami page to strictly align with `tasteskill v2` guidelines (restrain eyebrows to max 3, upgrade SchoolIdentity to bento grid, add skeletal loader for Achievements).

**Architecture:** Mute secondary eyebrow pills to maintain visual rhythm, rewrite `SchoolIdentity` to render as an asymmetric bento grid, and implement skeletal animations for Supabase loading states in `Achievements`.

**Tech Stack:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Motion, Vitest.

---

### Task 1: Restrain Section Eyebrow Badges

**Files:**
- Modify: `app/tentang-kami/page.tsx`
- Modify: `components/tentang-kami/VisionMission.tsx`
- Modify: `components/tentang-kami/EducatorsSection.tsx`
- Modify: `components/tentang-kami/SchoolIdentity.tsx`
- Modify: `components/tentang-kami/Achievements.tsx`
- Test: `components/tentang-kami/__tests__/tentang-kami-sections.test.tsx`

- [ ] **Step 1: Update `app/tentang-kami/page.tsx` to remove eyebrow badge on Profil Lulusan**

Keep eyebrow badges ONLY on:
1. Sambutan Kepala Sekolah
2. Visi & Misi Madrasah (in `VisionMission.tsx`)
3. Nilai-Nilai Kami

Remove eyebrow badges on:
1. Profil Lulusan (in `page.tsx`)
2. Pendidik (in `EducatorsSection.tsx`)
3. Identitas Resmi (in `SchoolIdentity.tsx`)
4. Prestasi (in `Achievements.tsx`)

- [ ] **Step 2: Update `VisionMission.tsx`, `EducatorsSection.tsx`, `SchoolIdentity.tsx`, and `Achievements.tsx` accordingly**

Remove the `inline-flex items-center` badge divs from `EducatorsSection`, `SchoolIdentity`, and `Achievements`. Keep it in `VisionMission.tsx`.

- [ ] **Step 3: Run Vitest on `tentang-kami-sections.test.tsx` to verify all test suites pass**

Run: `npm test -- components/tentang-kami/__tests__/tentang-kami-sections.test.tsx`
Expected: PASS

- [ ] **Step 4: Commit Task 1 changes**

```bash
git add app/tentang-kami/page.tsx components/tentang-kami/VisionMission.tsx components/tentang-kami/EducatorsSection.tsx components/tentang-kami/SchoolIdentity.tsx components/tentang-kami/Achievements.tsx
git commit -m "style(tentang-kami): restrain eyebrow pills to max 3 sections per tasteskill guidelines"
```

---

### Task 2: Upgrade `SchoolIdentity.tsx` to Bento Grid Layout

**Files:**
- Modify: `components/tentang-kami/SchoolIdentity.tsx`
- Test: `components/tentang-kami/__tests__/tentang-kami-sections.test.tsx`

- [ ] **Step 1: Rewrite `SchoolIdentity.tsx` as asymmetric bento grid**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import {
    Building2,
    Calendar,
    Award,
    School2,
    MapPin,
    Hash
} from "lucide-react";
import { SCHOOL_NAME } from "@/lib/school-config";

const identityData = [
    { label: "Tanggal Berdiri", value: "1 September 1967", icon: Calendar },
    { label: "Status Sekolah", value: "Swasta", icon: School2 },
    { label: "Akreditasi", value: "A", icon: Award },
    { label: "Bentuk Pendidikan", value: "Madrasah Ibtidaiyah", icon: Building2 },
    { label: "Alamat", value: "Sudimoro, RT.003/RW.X", icon: MapPin },
    { label: "Desa/Kelurahan", value: "Parangjoro", icon: MapPin },
    { label: "Kecamatan", value: "Grogol", icon: MapPin },
    { label: "Kabupaten", value: "Sukoharjo", icon: MapPin },
    { label: "Provinsi", value: "Jawa Tengah", icon: MapPin },
];

export default function SchoolIdentity() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="py-16 md:py-24 bg-muted/20 border-y border-border/40 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                        Identitas Resmi {SCHOOL_NAME}
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        Data legalitas dan administrasi resmi sekolah yang terdaftar di Kementerian Agama.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Featured Bento Card 1: NPSN (Amber Gold theme) */}
                    <motion.div
                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-6 rounded-3xl bg-amber-gold-surface border border-amber-gold/30 shadow-sm flex flex-col justify-between"
                    >
                        <Hash className="w-8 h-8 text-amber-gold mb-4" />
                        <div>
                            <p className="text-xs font-bold text-amber-800 dark:text-amber-200 uppercase tracking-wider">NPSN</p>
                            <p className="text-2xl font-black text-foreground mt-1">60711720</p>
                        </div>
                    </motion.div>

                    {/* Featured Bento Card 2: NSM (Sky Blue theme) */}
                    <motion.div
                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 }}
                        className="p-6 rounded-3xl bg-sky-500/5 border border-sky-500/20 shadow-sm flex flex-col justify-between"
                    >
                        <Hash className="w-8 h-8 text-sky-500 mb-4" />
                        <div>
                            <p className="text-xs font-bold text-sky-800 dark:text-sky-200 uppercase tracking-wider">NSM</p>
                            <p className="text-2xl font-black text-foreground mt-1">111233110050</p>
                        </div>
                    </motion.div>

                    {/* Supporting Info Grid within Bento */}
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {identityData.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    viewport={{ once: true }}
                                    className="flex items-start space-x-3.5 p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/30 transition-all hover:shadow-xs"
                                >
                                    <div className="bg-primary/10 text-primary p-2 rounded-xl shrink-0 mt-0.5">
                                        <IconComponent className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-muted-foreground font-semibold">{item.label}</p>
                                        <p className="font-bold text-foreground text-sm mt-0.5">{item.value}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
```

- [ ] **Step 2: Run Vitest test suites to verify passing status**

Run: `npm test -- components/tentang-kami/__tests__/tentang-kami-sections.test.tsx`
Expected: PASS

- [ ] **Step 3: Commit Task 2 changes**

```bash
git add components/tentang-kami/SchoolIdentity.tsx
git commit -m "feat(tentang-kami): upgrade SchoolIdentity to bento grid with highlighted NPSN and NSM"
```

---

### Task 3: Implement Dynamic Skeleton Loader in `Achievements.tsx`

**Files:**
- Modify: `components/tentang-kami/Achievements.tsx`
- Test: `components/tentang-kami/__tests__/tentang-kami-sections.test.tsx`

- [ ] **Step 1: Rewrite `Achievements.tsx` to handle loading states with skeleton layout**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import { Award, Trophy, Medal, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type Prestasi = {
    nama_prestasi: string;
    tingkat: string;
    tahun: number;
    deskripsi: string;
};

export default function Achievements() {
    const [prestasi, setPrestasi] = useState<Prestasi[]>([]);
    const [loading, setLoading] = useState(true);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        const supabase = createClient();
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from('prestasi')
                    .select('*');

                if (error) {
                    console.error('Error fetching prestasi data:', error);
                    return;
                }

                if (data) {
                    setPrestasi(data);
                }
            } catch (err) {
                console.error('Network error fetching achievements:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const groupedPrestasi = prestasi.reduce<Record<number, Prestasi[]>>((acc, curr) => {
        if (!acc[curr.tahun]) {
            acc[curr.tahun] = [];
        }
        acc[curr.tahun].push(curr);
        return acc;
    }, {});

    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                        Prestasi Madrasah
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        Capaian dan kebanggaan siswa-siswi MIM PK Dimoro dalam berbagai kompetisi akademik dan non-akademik.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-10">
                    {loading ? (
                        /* Skeletal Bento Loading State */
                        <div className="space-y-4">
                            <div className="h-6 w-32 bg-muted rounded-md animate-pulse" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-start space-x-3.5 bg-card border border-border/40 rounded-2xl p-5 shadow-sm animate-pulse">
                                        <div className="bg-muted p-5 rounded-xl shrink-0" />
                                        <div className="space-y-2 w-full">
                                            <div className="h-4 bg-muted rounded w-3/4" />
                                            <div className="h-3 bg-muted rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : Object.keys(groupedPrestasi).length === 0 ? (
                        <div className="text-center py-10 bg-card border border-border/50 rounded-3xl p-6 text-muted-foreground text-sm">
                            Belum ada data prestasi yang ditampilkan.
                        </div>
                    ) : (
                        Object.entries(groupedPrestasi).map(([tahun, prestasiList]) => (
                            <div key={tahun} className="space-y-4">
                                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-primary" />
                                    <span>Tahun {tahun}</span>
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {prestasiList.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                            viewport={{ once: true }}
                                            className="flex items-start space-x-3.5 bg-card border border-border/60 rounded-2xl p-5 shadow-sm hover:border-primary/40 transition-colors"
                                        >
                                            <div className="bg-primary/10 text-primary p-2.5 rounded-xl shrink-0 mt-0.5">
                                                {index % 4 === 0 && <Award className="w-5 h-5" />}
                                                {index % 4 === 1 && <Trophy className="w-5 h-5" />}
                                                {index % 4 === 2 && <Medal className="w-5 h-5" />}
                                                {index % 4 === 3 && <Star className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h4 className="text-base font-bold text-foreground mb-1 leading-snug">
                                                    {item.nama_prestasi}
                                                </h4>
                                                <span className="inline-block text-xs font-semibold text-amber-gold bg-amber-gold-surface border border-amber-gold/30 px-2 py-0.5 rounded-full">
                                                    Tingkat {item.tingkat}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
```

- [ ] **Step 2: Verify Vitest suite passes**

Run: `npm test -- components/tentang-kami/__tests__/tentang-kami-sections.test.tsx`
Expected: PASS

- [ ] **Step 3: Commit Task 3 changes**

```bash
git add components/tentang-kami/Achievements.tsx
git commit -m "feat(tentang-kami): add skeletal loading bento layout in Achievements component"
```

---

### Task 4: Full Suite Verification & Remote Push

- [ ] **Step 1: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 2: Run all unit tests**

Run: `npm test`
Expected: 16 test files passed (87 tests)

- [ ] **Step 3: Push changes to GitHub**

```bash
git push origin feat/redesign-home-tasteskill-v2
```
