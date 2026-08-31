# News Spotlight Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menampilkan berita/pengumuman terbaru dalam modal mengambang bergaya *High-End Frosted Glass (Double-Bezel)* saat pertama kali beranda web MIM PK Dimoro dibuka, lengkap dengan delay mulus, pencegah spam (*localStorage cooldown*), dan kontrol aksesibilitas lengkap.

**Architecture:** Server component di `app/page.tsx` memuat berita terbit terbaru dari Supabase dan memberikannya ke client component `NewsSpotlightModal.tsx`. Komponen client mengontrol delay 700ms, memeriksa `localStorage` untuk frequency capping, dan menampilkan dialog *double-bezel* dengan animasi pegas (*spring physics* via `motion/react`).

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS, `motion/react`, Lucide/Phosphor Icons, Vitest + React Testing Library.

---

### Task 1: NewsSpotlightModal Component & Unit Tests (TDD)

**Files:**
- Create: `components/home/NewsSpotlightModal.tsx`
- Create: `components/home/__tests__/NewsSpotlightModal.test.tsx`

- [ ] **Step 1: Write the failing unit tests for NewsSpotlightModal**

```tsx
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import NewsSpotlightModal, { NewsSpotlightItem } from '../NewsSpotlightModal';

const mockNews: NewsSpotlightItem = {
    id: 'news-1',
    judul: 'Prestasi Juara 1 Tahfidz Tingkat Kabupaten',
    ringkasan: 'Siswa MIM PK Dimoro kembali mengukir prestasi gemilang dalam ajang tahfidz quran.',
    image_url: '/images/mim_tahfidz_learning.jpg',
    tanggal_terbit: '2026-08-30',
};

describe('NewsSpotlightModal Component', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        localStorage.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('does not render if news is null', () => {
        const { container } = render(<NewsSpotlightModal news={null} />);
        act(() => {
            vi.advanceTimersByTime(1000);
        });
        expect(container.firstChild).toBeNull();
    });

    it('renders after delay if news is provided and not dismissed', () => {
        render(<NewsSpotlightModal news={mockNews} />);
        
        // Before timer ends, should not be visible
        expect(screen.queryByText(mockNews.judul)).toBeNull();

        // Advance 700ms
        act(() => {
            vi.advanceTimersByTime(800);
        });

        expect(screen.getByText(mockNews.judul)).toBeInTheDocument();
        expect(screen.getByText(/Kabar Terkini/i)).toBeInTheDocument();
        expect(screen.getByText(/Baca Selengkapnya/i)).toBeInTheDocument();
    });

    it('does not render if user already dismissed this specific news item in current session', () => {
        localStorage.setItem(`mim_last_seen_news_id`, 'news-1');
        render(<NewsSpotlightModal news={mockNews} />);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(screen.queryByText(mockNews.judul)).toBeNull();
    });

    it('does not render if dismissed until timestamp is in the future', () => {
        const futureTime = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem('mim_dismissed_until', futureTime.toString());
        render(<NewsSpotlightModal news={mockNews} />);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(screen.queryByText(mockNews.judul)).toBeNull();
    });

    it('closes modal when close button is clicked', () => {
        render(<NewsSpotlightModal news={mockNews} />);
        act(() => {
            vi.advanceTimersByTime(800);
        });

        const closeBtn = screen.getByLabelText(/Tutup pengumuman/i);
        fireEvent.click(closeBtn);

        expect(screen.queryByText(mockNews.judul)).toBeNull();
        expect(localStorage.getItem('mim_last_seen_news_id')).toBe('news-1');
    });

    it('saves 24h dismissal when checkbox "Jangan tampilkan lagi hari ini" is checked and closed', () => {
        render(<NewsSpotlightModal news={mockNews} />);
        act(() => {
            vi.advanceTimersByTime(800);
        });

        const checkbox = screen.getByLabelText(/Jangan tampilkan lagi hari ini/i);
        fireEvent.click(checkbox);

        const dismissBtn = screen.getByText(/Nanti Saja/i);
        fireEvent.click(dismissBtn);

        expect(localStorage.getItem('mim_dismissed_until')).not.toBeNull();
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/home/__tests__/NewsSpotlightModal.test.tsx`
Expected: FAIL because `NewsSpotlightModal.tsx` does not exist yet.

- [ ] **Step 3: Implement NewsSpotlightModal.tsx**

```tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X, Calendar, ArrowUpRight, Sparkles } from "lucide-react";

export interface NewsSpotlightItem {
    id: string | number;
    judul: string;
    ringkasan: string | null;
    image_url: string | null;
    tanggal_terbit: string;
}

interface NewsSpotlightModalProps {
    news: NewsSpotlightItem | null;
}

export default function NewsSpotlightModal({ news }: NewsSpotlightModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [dontShowToday, setDontShowToday] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    const handleDismiss = useCallback(() => {
        setIsOpen(false);
        if (!news) return;

        try {
            localStorage.setItem("mim_last_seen_news_id", String(news.id));
            if (dontShowToday) {
                const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
                localStorage.setItem("mim_dismissed_until", expiresAt.toString());
            }
        } catch {
            // Ignore storage errors in private browsing
        }
    }, [news, dontShowToday]);

    useEffect(() => {
        if (!news) return;

        try {
            const dismissedUntil = localStorage.getItem("mim_dismissed_until");
            if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
                return;
            }

            const lastSeenId = localStorage.getItem("mim_last_seen_news_id");
            if (lastSeenId === String(news.id)) {
                return;
            }
        } catch {
            // Fail open
        }

        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 700);

        return () => clearTimeout(timer);
    }, [news]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                handleDismiss();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, handleDismiss]);

    if (!news) return null;

    const formatTanggal = (tanggal: string) => {
        try {
            const date = new Date(tanggal);
            return date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
        } catch {
            return tanggal;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Sorotan Berita Terbaru"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={handleDismiss}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Outer Shell (Double-Bezel Architecture) */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: shouldReduceMotion ? 1 : 0.94,
                            y: shouldReduceMotion ? 0 : 20,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: shouldReduceMotion ? 1 : 0.96,
                            y: shouldReduceMotion ? 0 : 10,
                        }}
                        transition={{
                            duration: 0.5,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="relative w-full max-w-lg bg-background/80 dark:bg-card/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2rem] p-2.5 shadow-2xl ring-1 ring-black/5 z-10 my-auto"
                    >
                        {/* Inner Core */}
                        <div className="bg-card rounded-[calc(2rem-0.625rem)] overflow-hidden border border-border/40 flex flex-col">
                            {/* Visual Thumbnail */}
                            <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                                <Image
                                    src={news.image_url || "/images/mim_hero_main.jpg"}
                                    alt={news.judul}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 100vw, 512px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold backdrop-blur-md shadow-sm">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>Kabar Terkini</span>
                                    </span>
                                </div>

                                {/* Close Button */}
                                <button
                                    onClick={handleDismiss}
                                    aria-label="Tutup pengumuman"
                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Content Body */}
                            <div className="p-5 sm:p-6 flex flex-col">
                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2.5">
                                    <Calendar className="w-3.5 h-3.5 text-primary" />
                                    <span>{formatTanggal(news.tanggal_terbit)}</span>
                                </div>

                                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground line-clamp-2 mb-2.5 leading-snug">
                                    {news.judul}
                                </h3>

                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-6">
                                    {news.ringkasan || "Simak informasi dan kabar terbaru selengkapnya dari madrasah kami."}
                                </p>

                                {/* Action Buttons (Button-in-Button pattern) */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-border/50">
                                    <label className="inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={dontShowToday}
                                            onChange={(e) => setDontShowToday(e.target.checked)}
                                            className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                                        />
                                        <span>Jangan tampilkan lagi hari ini</span>
                                    </label>

                                    <div className="flex items-center gap-2 justify-end">
                                        <button
                                            type="button"
                                            onClick={handleDismiss}
                                            className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-full"
                                        >
                                            Nanti Saja
                                        </button>
                                        <Link
                                            href={`/berita/${news.id}`}
                                            onClick={handleDismiss}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-full shadow-md shadow-primary/20 transition-all group"
                                        >
                                            <span>Baca Selengkapnya</span>
                                            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                                                <ArrowUpRight className="w-3 h-3" />
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/home/__tests__/NewsSpotlightModal.test.tsx`
Expected: PASS with all 6 tests passing.

- [ ] **Step 5: Commit**

```bash
git add components/home/NewsSpotlightModal.tsx components/home/__tests__/NewsSpotlightModal.test.tsx
git commit -m "feat(home): create news spotlight modal component with tests"
```

---

### Task 2: Integrate NewsSpotlightModal in Homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update app/page.tsx to fetch latest news and render modal**

In `app/page.tsx`:
```tsx
import HomeHero from "@/components/home/HomeHero";
import StatsSection from "@/components/home/StatsSection";
import AboutSection from "@/components/home/AboutSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import NewsSection from "@/components/home/NewsSection";
import ProgramSection from "@/components/home/ProgramSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import NewsSpotlightModal, { NewsSpotlightItem } from "@/components/home/NewsSpotlightModal";
import { createClient } from "@/lib/supabase/server";

async function fetchSpotlightNews(): Promise<NewsSpotlightItem | null> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("berita")
            .select("id, judul, ringkasan, image_url, tanggal_terbit")
            .eq("status", "terbit")
            .order("tanggal_terbit", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error || !data) {
            return null;
        }

        return data as NewsSpotlightItem;
    } catch {
        return null;
    }
}

export default async function Home() {
    const spotlightNews = await fetchSpotlightNews();

    return (
        <main className="min-h-screen">
            {/* News Spotlight Popup */}
            <NewsSpotlightModal news={spotlightNews} />

            {/* Hero Section */}
            <HomeHero />

            {/* Stats Section */}
            <StatsSection />

            {/* About Section */}
            <AboutSection />

            {/* Features Section */}
            <FeaturesSection />

            {/* News Section */}
            <NewsSection />

            {/* Program Section */}
            <ProgramSection />

            <GalleryPreview />

            <TestimonialsSection />

            <CTASection />
        </main>
    );
}
```

- [ ] **Step 2: Run build & test to verify integration**

Run: `npm test` & `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat(home): integrate spotlight news popup on home page"
```

---

### Task 3: Full System Verification

- [ ] **Step 1: Run comprehensive test suite**

Run: `npm test`
Expected: All tests pass.

- [ ] **Step 2: Run lint check**

Run: `npm run lint`
Expected: 0 errors.
