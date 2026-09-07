# Admin & Public Pages Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menghilangkan semua broken links/404, membuat halaman publik arsip berita (`/berita`), menyinkronkan data galeri & testimoni beranda, memperbarui navigasi kalender, dan mengintegrasikan pengelolaan media sosial dari admin ke footer.

**Architecture:** Server-First Architecture pada Next.js 15 App Router. Halaman `/berita` dan data beranda menggunakan Server Component data fetching dengan filter Supabase. Navigasi dan footer diperbarui untuk konsistensi link dan identitas sekolah.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Shadcn/UI, Supabase Client/Server, Vitest.

---

### Task 1: Fix Broken Links Footer & Identitas Kalender Publik

**Files:**
- Modify: `components/layout/Footer.tsx`
- Modify: `app/kalender-akademik/page.tsx`
- Test: `components/layout/__tests__/Footer.test.tsx`

- [ ] **Step 1: Write the failing test for Footer and Kalender links/identities**

```tsx
// components/layout/__tests__/Footer.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Footer from '@/components/layout/Footer';
import { SCHOOL_FULL_NAME } from '@/lib/school-config';

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
  }),
}));

describe('Footer Component', () => {
  it('renders correct link to /tentang-kami and not /tentang', () => {
    render(<Footer />);
    const tentangLink = screen.getByRole('link', { name: /tentang kami/i });
    expect(tentangLink.getAttribute('href')).toBe('/tentang-kami');
  });

  it('renders school brand name', () => {
    render(<Footer />);
    expect(screen.getAllByText(new RegExp(SCHOOL_FULL_NAME, 'i')).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test components/layout/__tests__/Footer.test.tsx`
Expected: FAIL on `expect(tentangLink.getAttribute('href')).toBe('/tentang-kami')` (returns `/tentang`).

- [ ] **Step 3: Update Footer.tsx & kalender-akademik/page.tsx**

In `components/layout/Footer.tsx`:
```tsx
// Replace:
// <Link href="/tentang" className="hover:text-primary transition-colors">
// with:
<Link href="/tentang-kami" className="hover:text-primary transition-colors">
  Tentang Kami
</Link>
```

In `app/kalender-akademik/page.tsx`:
```tsx
import KalenderAkademik from '@/components/kalender/KalenderAkademik';
import { SCHOOL_NAME } from '@/lib/school-config';

export default function KalenderAkademikPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Kalender Akademik</h1>
        <p className="text-gray-600">{SCHOOL_NAME} - Jadwal & Agenda Akademik</p>
      </div>

      <KalenderAkademik />
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test components/layout/__tests__/Footer.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/layout/Footer.tsx app/kalender-akademik/page.tsx components/layout/__tests__/Footer.test.tsx
git commit -m "fix(layout): update footer about link to /tentang-kami and school name on calendar page"
```

---

### Task 2: Navigasi Kalender Akademik di Navbar & Footer

**Files:**
- Modify: `components/layout/Navbar.tsx`
- Modify: `components/layout/Footer.tsx`

- [ ] **Step 1: Write test for Navbar and Footer calendar link presence**

```tsx
// components/layout/__tests__/Navbar.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Navbar from '@/components/layout/Navbar';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

vi.mock('@/components/theme-switcher', () => ({
  ThemeSwitcher: () => <div data-testid="theme-switcher" />,
}));

describe('Navbar Component', () => {
  it('renders link to /kalender-akademik in navLinks', () => {
    render(<Navbar />);
    const calLinks = screen.getAllByRole('link', { name: /kalender/i });
    expect(calLinks.some(l => l.getAttribute('href') === '/kalender-akademik')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test components/layout/__tests__/Navbar.test.tsx`
Expected: FAIL because Kalender link does not exist in `Navbar.tsx`.

- [ ] **Step 3: Add Kalender to Navbar & Footer**

In `components/layout/Navbar.tsx`, import `Calendar` from `'lucide-react'` and update `navLinks`:
```tsx
const navLinks = [
    { name: 'Beranda', href: '/', icon: <School className="w-5 h-5" /> },
    { name: 'Tentang Kami', href: '/tentang-kami', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Program & Kurikulum', href: '/program', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Galeri', href: '/galeri', icon: <ImageIcon className="w-5 h-5" /> },
    { name: 'Kalender', href: '/kalender-akademik', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Pendaftaran', href: '/pendaftaran', icon: <UserPlus className="w-5 h-5" /> },
    { name: 'Kontak', href: '/kontak', icon: <Phone className="w-5 h-5" /> },
];
```

In `components/layout/Footer.tsx`, add under Quick Links:
```tsx
<li>
    <Link href="/kalender-akademik" className="hover:text-primary transition-colors">
        Kalender Akademik
    </Link>
</li>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test components/layout/__tests__/Navbar.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/layout/Navbar.tsx components/layout/Footer.tsx components/layout/__tests__/Navbar.test.tsx
git commit -m "feat(navigation): add kalender akademik route to navbar and footer"
```

---

### Task 3: Halaman Arsip Berita Publik (`app/berita/page.tsx`)

**Files:**
- Create: `app/berita/page.tsx`
- Create: `app/berita/__tests__/page.test.tsx`

- [ ] **Step 1: Write test for public news archive page**

```tsx
// app/berita/__tests__/page.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import BeritaPage from '@/app/berita/page';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({
            data: [
              {
                id: 1,
                judul: 'Prestasi Juara 1 Tahfidz',
                ringkasan: 'Siswa MIM PK Dimoro meraih juara 1',
                image_url: 'https://example.com/test.jpg',
                tanggal_terbit: '2026-08-01',
                penulis_id: 'admin-1',
                status: 'terbit',
              }
            ],
            error: null,
          }),
        }),
      }),
    }),
  }),
}));

describe('Public Berita Archive Page', () => {
  it('renders page header and list of published news', async () => {
    const Component = await BeritaPage({ searchParams: Promise.resolve({}) });
    render(Component);

    expect(screen.getByText(/Berita & Kegiatan/i)).toBeDefined();
    expect(screen.getByText('Prestasi Juara 1 Tahfidz')).toBeDefined();
    expect(screen.getByText(/Siswa MIM PK Dimoro meraih juara 1/i)).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test app/berita/__tests__/page.test.tsx`
Expected: FAIL because `app/berita/page.tsx` does not exist yet.

- [ ] **Step 3: Implement `app/berita/page.tsx`**

Create `app/berita/page.tsx`:
```tsx
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/shared/PageHeader";
import NewsCard from "@/components/home/NewsCard";
import { SCHOOL_NAME } from "@/lib/school-config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Berita & Kegiatan - ${SCHOOL_NAME}`,
  description: `Informasi dan kabar terbaru seputar kegiatan, prestasi, dan aktivitas madrasah di ${SCHOOL_NAME}.`,
};

type NewsItem = {
  id: string;
  judul: string;
  ringkasan: string | null;
  image_url: string | null;
  tanggal_terbit: string;
  penulis_id: string;
  created_at: string;
};

interface BeritaPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function BeritaPage({ searchParams }: BeritaPageProps) {
  const params = await searchParams;
  const searchQuery = params?.q?.trim() || "";

  const supabase = await createClient();
  const { data: rawNews, error } = await supabase
    .from("berita")
    .select("id, judul, ringkasan, image_url, tanggal_terbit, penulis_id, created_at")
    .eq("status", "terbit")
    .order("tanggal_terbit", { ascending: false });

  if (error) {
    console.error("Error fetching news list:", error);
  }

  const newsList: NewsItem[] = (rawNews || []).filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.judul.toLowerCase().includes(query) ||
      (item.ringkasan && item.ringkasan.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <PageHeader
        title="Berita & Kegiatan"
        description={`Kabar terkini dan ragam aktivitas madrasah di ${SCHOOL_NAME}`}
        background="bg-primary/10"
      />

      <div className="container mx-auto px-4 pt-10">
        {/* Search & Filter Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <form method="GET" action="/berita" className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={searchQuery}
              placeholder="Cari berita atau kegiatan..."
              className="pl-9 pr-24 h-11 rounded-full border-border/80 bg-card shadow-sm text-sm"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1.5 h-8 rounded-full px-4 text-xs font-semibold"
            >
              Cari
            </Button>
          </form>
          {searchQuery && (
            <div className="flex items-center justify-between mt-3 px-2 text-xs text-muted-foreground">
              <span>Hasil pencarian untuk &ldquo;{searchQuery}&rdquo; ({newsList.length} artikel)</span>
              <Link href="/berita" className="text-primary hover:underline font-medium">
                Reset Filter
              </Link>
            </div>
          )}
        </div>

        {/* News Grid */}
        {newsList.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16 px-6 border border-dashed rounded-3xl border-border bg-card/60">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4 text-muted-foreground">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">
              {searchQuery ? "Berita Tidak Ditemukan" : "Belum Ada Berita"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {searchQuery
                ? "Tidak ada artikel berita yang cocok dengan kata kunci tersebut."
                : "Saat ini belum ada artikel berita yang diterbitkan."}
            </p>
            {searchQuery && (
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link href="/berita">Lihat Semua Berita</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsList.map((item, index) => (
              <NewsCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test app/berita/__tests__/page.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/berita/page.tsx app/berita/__tests__/page.test.tsx
git commit -m "feat(berita): add public news archive page with search functionality"
```

---

### Task 4: Sinkronisasi Gallery Preview & Testimoni Beranda

**Files:**
- Modify: `components/home/GalleryPreview.tsx`
- Modify: `components/home/TestimonialsSection.tsx`
- Test: `components/home/__tests__/home-sections.test.tsx`

- [ ] **Step 1: Write test for dynamic gallery & featured testimonials**

Update `components/home/__tests__/home-sections.test.tsx` to assert GalleryPreview and TestimonialsSection rendering.

- [ ] **Step 2: Update `components/home/GalleryPreview.tsx` to fetch dynamic photos**

Update `components/home/GalleryPreview.tsx`:
```tsx
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SCHOOL_NAME } from "@/lib/school-config";
import { createClient } from "@/lib/supabase/client";

interface GalleryImageItem {
    id: number;
    src: string;
    alt: string;
    category: string;
}

const defaultFallbackImages: GalleryImageItem[] = [
    {
        id: 1,
        src: "/images/mim_hero_main.jpg",
        alt: "Siswa beraktivitas di lingkungan sekolah",
        category: "Kegiatan Belajar"
    },
    {
        id: 2,
        src: "/images/mim_tahfidz_learning.jpg",
        alt: "Pembiasaan membaca dan menghafal Al-Qur'an",
        category: "Tahfidz"
    }
];

export default function GalleryPreview() {
    const [images, setImages] = useState<GalleryImageItem[]>(defaultFallbackImages);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        const supabase = createClient();
        async function fetchGallery() {
            const { data, error } = await supabase
                .from('galeri')
                .select('id, image_url, keterangan, kategori')
                .order('created_at', { ascending: false })
                .limit(6);

            if (!error && data && data.length > 0) {
                const transformed: GalleryImageItem[] = data.map((item) => ({
                    id: item.id,
                    src: item.image_url || "/images/mim_hero_main.jpg",
                    alt: item.keterangan || `Dokumentasi ${SCHOOL_NAME}`,
                    category: item.kategori || "Umum"
                }));
                setImages(transformed);
            }
        }
        fetchGallery();
    }, []);

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
                            Galeri Kegiatan Madrasah
                        </h2>
                        <p className="text-base text-muted-foreground max-w-2xl">
                            Dokumentasi momen berharga dan aktivitas keseharian para siswa di {SCHOOL_NAME}.
                        </p>
                    </div>
                    <div>
                        <Link href="/galeri">
                            <Button variant="outline" className="rounded-full border-border hover:bg-muted font-semibold">
                                <span>Lihat Semua Foto</span>
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {images.map((image, index) => (
                        <motion.div
                            key={image.id}
                            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            className="relative cursor-pointer overflow-hidden rounded-3xl border border-border/60 shadow-sm aspect-[4/3] bg-muted group"
                            onClick={() => setSelectedImage(index)}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity flex flex-col justify-end p-5">
                                <span className="px-2.5 py-1 bg-primary/90 text-primary-foreground text-xs font-semibold rounded-full w-max mb-2">
                                    {image.category}
                                </span>
                                <h3 className="text-base font-semibold text-white leading-snug">
                                    {image.alt}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Lightbox Modal */}
                <AnimatePresence>
                    {selectedImage !== null && images[selectedImage] && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6"
                            onClick={() => setSelectedImage(null)}
                        >
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="relative max-w-4xl w-full bg-card rounded-3xl overflow-hidden border border-border/40 shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white hover:bg-black/70 rounded-full transition-colors"
                                    onClick={() => setSelectedImage(null)}
                                    aria-label="Tutup pratinjau"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="relative aspect-[16/10] w-full bg-black">
                                    <Image
                                        src={images[selectedImage].src}
                                        alt={images[selectedImage].alt}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                
                                <div className="p-6 bg-card border-t border-border/40">
                                    <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-2 inline-block">
                                        Kategori: {images[selectedImage].category}
                                    </span>
                                    <h3 className="text-lg font-bold text-foreground">
                                        {images[selectedImage].alt}
                                    </h3>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
```

- [ ] **Step 3: Update `components/home/TestimonialsSection.tsx` query**

In `components/home/TestimonialsSection.tsx`:
```tsx
async function fetchData(): Promise<TestimonialItem[]> {
    const supabase = await createClient();
    // Prioritaskan testimoni yang ditandai is_featured = true
    const { data, error } = await supabase
        .from('testimoni')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);

    if (error) {
        console.error('Error fetching testimonial data:', error);
        return [];
    }

    if (data && data.length > 0) {
        return data;
    }

    // Fallback: Jika belum ada is_featured = true, ambil 3 testimoni terbaru
    const { data: fallbackData } = await supabase
        .from('testimoni')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

    return fallbackData || [];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/home/GalleryPreview.tsx components/home/TestimonialsSection.tsx
git commit -m "feat(home): sync gallery preview with supabase database and filter featured testimonials"
```

---

### Task 5: Pengelolaan Media Sosial di Admin & Tautan Dinamis di Footer

**Files:**
- Modify: `app/admin/konten/EditContactPage.tsx`
- Modify: `components/layout/Footer.tsx`
- Test: `npm test`

- [ ] **Step 1: Update `EditContactPage.tsx` to handle social media URLs**

Add `facebook_url`, `instagram_url`, `youtube_url` to `formData`, form inputs, and state update handlers in `app/admin/konten/EditContactPage.tsx`.

- [ ] **Step 2: Update `components/layout/Footer.tsx` to dynamically render social media links**

In `components/layout/Footer.tsx`:
Fetch `facebook_url`, `instagram_url`, `youtube_url` from `kontak_sekolah`.
Bind social icon buttons to dynamic URLs:
- Facebook: `href={kontak?.facebook_url || "https://facebook.com"}`
- Instagram: `href={kontak?.instagram_url || "https://instagram.com"}`
- YouTube: `href={kontak?.youtube_url || "https://youtube.com"}`

- [ ] **Step 3: Run tests & verify**

Run: `npm test`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add app/admin/konten/EditContactPage.tsx components/layout/Footer.tsx
git commit -m "feat(social): add social media management in admin and connect to footer icons"
```

---

### Task 6: Full Validation (Linting, Types & Unit Tests)

**Files:**
- All touched files

- [ ] **Step 1: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 2: Run all unit tests**

Run: `npm test`
Expected: All tests pass.

- [ ] **Step 3: Run production build check**

Run: `npm run build`
Expected: Build succeeds with all static & dynamic routes compiled.
