'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  Maximize2,
  Sparkles,
  SearchX,
  ImageIcon,
  Calendar,
  Layers,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

// Type definition for transformed gallery items
export interface GalleryItem {
  id: number;
  src: string;
  title: string;
  description: string;
  category: string;
  created_at: string;
}

export interface GalleryClientProps {
  galeriData: GalleryItem[];
  kategoriList: string[];
  currentKategori?: string;
}

// Category Badge Color helper for Modern Islamic Oasis theme
export const getCategoryBadgeStyle = (category: string) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('tahfidz') || cat.includes('prestasi') || cat.includes('unggulan')) {
    return {
      badgeClass:
        'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/25',
      glowClass: 'from-amber-500/20 to-transparent',
      pillClass: 'bg-amber-500 text-white',
      accentBorder: 'border-amber-500/40',
    };
  }
  if (
    cat.includes('kegiatan') ||
    cat.includes('belajar') ||
    cat.includes('akademik') ||
    cat.includes('ekskul')
  ) {
    return {
      badgeClass:
        'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25',
      glowClass: 'from-emerald-500/20 to-transparent',
      pillClass: 'bg-emerald-600 text-white',
      accentBorder: 'border-emerald-500/40',
    };
  }
  return {
    badgeClass:
      'bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/30 hover:bg-sky-500/25',
    glowClass: 'from-sky-500/20 to-transparent',
    pillClass: 'bg-sky-600 text-white',
    accentBorder: 'border-sky-500/40',
  };
};

// Indonesian Date Formatter
export const formatDateIndo = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export default function GalleryClient({
  galeriData = [],
  kategoriList = [],
  currentKategori,
}: GalleryClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Search and Category State
  const initialCategory = currentKategori || searchParams.get('kategori') || 'all';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Lightbox Modal State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Sync category state with prop changes
  useEffect(() => {
    if (currentKategori) {
      setSelectedCategory(currentKategori);
    }
  }, [currentKategori]);

  // Sync URL shallowly when filter changes
  const updateUrlParam = useCallback(
    (newCategory: string) => {
      try {
        const url = new URL(window.location.href);
        if (newCategory === 'all' || !newCategory) {
          url.searchParams.delete('kategori');
        } else {
          url.searchParams.set('kategori', newCategory);
        }
        window.history.replaceState({}, '', url.toString());
      } catch {
        // Fallback to router if window.history fails
        if (newCategory === 'all' || !newCategory) {
          router.replace(pathname || '/galeri', { scroll: false });
        } else {
          router.replace(`${pathname || '/galeri'}?kategori=${encodeURIComponent(newCategory)}`, {
            scroll: false,
          });
        }
      }
    },
    [pathname, router]
  );

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    updateUrlParam(category);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    updateUrlParam('all');
  };

  // Filtered gallery items
  const filteredGaleri = useMemo(() => {
    return galeriData.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        !selectedCategory ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [galeriData, selectedCategory, searchQuery]);

  // Category counts calculation for chips
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: galeriData.length,
    };
    galeriData.forEach((item) => {
      if (item.category) {
        const key = item.category.toLowerCase();
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    return counts;
  }, [galeriData]);

  // Lightbox navigation
  const handlePrevImage = useCallback(() => {
    if (lightboxIndex !== null && filteredGaleri.length > 0) {
      setLightboxIndex((prev) =>
        prev !== null && prev > 0 ? prev - 1 : filteredGaleri.length - 1
      );
    }
  }, [lightboxIndex, filteredGaleri.length]);

  const handleNextImage = useCallback(() => {
    if (lightboxIndex !== null && filteredGaleri.length > 0) {
      setLightboxIndex((prev) =>
        prev !== null && prev < filteredGaleri.length - 1 ? prev + 1 : 0
      );
    }
  }, [lightboxIndex, filteredGaleri.length]);

  const handleCloseLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextImage();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCloseLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handlePrevImage, handleNextImage, handleCloseLightbox]);

  // Share action
  const handleSharePhoto = async () => {
    if (lightboxIndex === null || !filteredGaleri[lightboxIndex]) return;
    const currentItem = filteredGaleri[lightboxIndex];
    const shareUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}${currentItem.src}`
        : currentItem.src;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        toast.success('Tautan foto berhasil disalin ke clipboard!');
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch {
      toast.error('Gagal menyalin tautan foto');
    }
  };

  // If no data initially available in database
  if (!galeriData || galeriData.length === 0) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center justify-center gap-4 py-24 border-2 border-dashed rounded-3xl border-border/80 bg-card/40 backdrop-blur-sm max-w-2xl mx-auto">
            <div className="size-16 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground shadow-inner">
              <ImageIcon className="size-8" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Belum ada foto yang tersedia saat ini
            </h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Galeri dokumentasi kegiatan dan prestasi MIM PK Dimoro akan segera diperbarui.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const spotlightItem = filteredGaleri.length > 0 ? filteredGaleri[0] : null;
  const spotlightBadgeStyle = spotlightItem ? getCategoryBadgeStyle(spotlightItem.category) : null;
  const selectedImage = lightboxIndex !== null ? filteredGaleri[lightboxIndex] : null;
  const selectedImageBadgeStyle = selectedImage
    ? getCategoryBadgeStyle(selectedImage.category)
    : null;

  return (
    <div className="space-y-12 pb-24">
      {/* Control Bar: Search & Category Chips */}
      <section className="container mx-auto px-4 pt-6">
        <div className="bg-card/70 backdrop-blur-md border border-border/60 rounded-3xl p-6 shadow-sm space-y-6">
          {/* Live Search Input */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
              <Search className="size-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari foto, tema, atau kegiatan..."
              className="w-full pl-11 pr-10 py-3 rounded-full bg-background/90 border border-border/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm sm:text-base shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Hapus pencarian"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-5" />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              aria-label={`Semua Foto (${galeriData.length})`}
              onClick={() => handleCategorySelect('all')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border ${
                selectedCategory === 'all' || !selectedCategory
                  ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                  : 'bg-background/80 hover:bg-muted/80 text-muted-foreground hover:text-foreground border-border/60'
              }`}
            >
              Semua Foto ({categoryCounts.all || 0})
            </button>

            {kategoriList.map((kategori) => {
              const count = categoryCounts[kategori.toLowerCase()] || 0;
              const isSelected = selectedCategory.toLowerCase() === kategori.toLowerCase();
              return (
                <button
                  key={kategori}
                  type="button"
                  aria-label={`${kategori} (${count})`}
                  onClick={() => handleCategorySelect(kategori)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border capitalize ${
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                      : 'bg-background/80 hover:bg-muted/80 text-muted-foreground hover:text-foreground border-border/60'
                  }`}
                >
                  {kategori} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area: Spotlight + Masonry OR Empty State */}
      {filteredGaleri.length === 0 ? (
        /* Friendly Empty State */
        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center gap-5 py-20 px-6 border border-dashed rounded-3xl border-border/80 bg-card/40 backdrop-blur-sm max-w-xl mx-auto text-center">
            <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-inner">
              <SearchX className="size-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">Tidak Ada Foto Ditemukan</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                Tidak ditemukan dokumentasi untuk kata kunci{' '}
                <span className="font-semibold text-foreground">&quot;{searchQuery}&quot;</span>{' '}
                atau filter kategori saat ini.
              </p>
            </div>
            <Button
              variant="default"
              onClick={handleResetFilters}
              aria-label="Reset Filter & Pencarian"
              className="rounded-full px-6 gap-2 shadow-md hover:shadow-lg transition-all"
            >
              Reset Filter & Pencarian
            </Button>
          </div>
        </section>
      ) : (
        <>
          {/* Hero Spotlight Card (Sorotan Momen) */}
          {spotlightItem && (
            <section className="container mx-auto px-4">
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xl group">
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px] lg:min-h-[460px]">
                  {/* Spotlight Image with responsive framing */}
                  <div className="relative lg:col-span-7 h-64 sm:h-80 lg:h-full min-h-[280px] overflow-hidden bg-black/90">
                    <Image
                      src={spotlightItem.src}
                      alt={spotlightItem.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 lg:hidden" />
                  </div>

                  {/* Spotlight Content Panel */}
                  <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-gradient-to-br from-card via-card/95 to-card/90">
                    <div className="space-y-4">
                      {/* Section Badge & Category */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                          <Sparkles className="size-3.5" />
                          <span>Sorotan Momen</span>
                        </div>
                        {spotlightBadgeStyle && (
                          <Badge
                            variant="outline"
                            className={`rounded-full px-3 py-0.5 text-xs font-medium ${spotlightBadgeStyle.badgeClass}`}
                          >
                            {spotlightItem.category}
                          </Badge>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                        {spotlightItem.title}
                      </h2>

                      {/* Description */}
                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-4">
                        {spotlightItem.description || 'Dokumentasi kegiatan resmi MIM PK Dimoro.'}
                      </p>
                    </div>

                    {/* Metadata & Quick View Action */}
                    <div className="pt-6 mt-6 border-t border-border/50 flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Calendar className="size-4 text-primary" />
                        <span>{formatDateIndo(spotlightItem.created_at)}</span>
                      </div>

                      <Button
                        onClick={() => setLightboxIndex(0)}
                        aria-label="Lihat Foto Penuh"
                        className="rounded-full gap-2 px-5 shadow-sm hover:shadow transition-all"
                      >
                        <Maximize2 className="size-4" />
                        <span>Lihat Foto Penuh</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Dynamic Masonry Grid */}
          <section className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Layers className="size-5 text-primary" />
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  Semua Dokumentasi ({filteredGaleri.length})
                </h3>
              </div>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 [column-fill:_balance]">
              <AnimatePresence mode="popLayout">
                {filteredGaleri.map((item, index) => {
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
                      className="break-inside-avoid mb-6"
                    >
                      <Card
                        data-testid={`gallery-card-${item.id}`}
                        onClick={() => setLightboxIndex(index)}
                        className="overflow-hidden rounded-3xl border border-border/60 bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative shadow-sm"
                      >
                        <CardContent className="p-0 relative">
                          <div className="relative w-full aspect-[4/3] bg-muted/30 overflow-hidden">
                            <Image
                              src={item.src}
                              alt={item.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            />
                            {/* Top Badge */}
                            <div className="absolute top-3 left-3 z-10">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-black/40 text-white border border-white/20 shadow-sm`}
                              >
                                {item.category}
                              </span>
                            </div>

                            {/* Hover / Bottom Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                              <h4 className="font-semibold text-base sm:text-lg line-clamp-2 leading-snug text-white drop-shadow-sm">
                                {item.title}
                              </h4>
                              <p className="text-white/70 text-xs mt-1">
                                {formatDateIndo(item.created_at)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </section>
        </>
      )}

      {/* Cinematic Lightbox Modal */}
      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open) => {
          if (!open) handleCloseLightbox();
        }}
      >
        <DialogContent
          className="max-w-6xl p-0 overflow-hidden border-none bg-black/95 sm:rounded-3xl gap-0 shadow-2xl text-white outline-none"
        >
          <div className="relative flex flex-col lg:flex-row h-full max-h-[92vh] lg:max-h-[85vh]">
            {/* Image Stage Area */}
            <div className="relative flex-1 bg-black/80 flex items-center justify-center min-h-[320px] sm:min-h-[450px] lg:min-h-[580px] group/nav select-none">
              {selectedImage && (
                <div className="relative w-full h-full min-h-[320px] sm:min-h-[450px] lg:min-h-[580px] p-4 flex items-center justify-center">
                  <Image
                    src={selectedImage.src}
                    alt={selectedImage.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 75vw"
                    priority
                  />
                </div>
              )}

              {/* Navigation Controls */}
              {filteredGaleri.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Foto sebelumnya"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 size-11 sm:size-14 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                  >
                    <ChevronLeft className="size-6 sm:size-7" />
                  </button>

                  <button
                    type="button"
                    aria-label="Foto berikutnya"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 size-11 sm:size-14 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                  >
                    <ChevronRight className="size-6 sm:size-7" />
                  </button>
                </>
              )}

              {/* Index Indicator Pill */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white/90 px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border border-white/15 shadow-sm">
                {lightboxIndex !== null ? lightboxIndex + 1 : 1} / {filteredGaleri.length}
              </div>
            </div>

            {/* Structured Info Panel */}
            <div className="w-full lg:w-96 bg-card text-card-foreground p-6 sm:p-8 flex flex-col justify-between gap-6 border-t lg:border-t-0 lg:border-l border-border/40 overflow-y-auto">
              <DialogHeader className="space-y-3 text-left">
                {selectedImageBadgeStyle && (
                  <Badge
                    variant="outline"
                    className={`w-fit rounded-full px-3 py-0.5 text-xs font-semibold ${selectedImageBadgeStyle.badgeClass}`}
                  >
                    {selectedImage?.category}
                  </Badge>
                )}

                <DialogTitle className="text-xl sm:text-2xl font-bold leading-snug text-foreground">
                  {selectedImage?.title || 'Foto Galeri'}
                </DialogTitle>

                <DialogDescription className="text-sm sm:text-base leading-relaxed text-muted-foreground mt-2">
                  {selectedImage?.description || 'Dokumentasi resmi MIM PK Dimoro.'}
                </DialogDescription>
              </DialogHeader>

              {/* Footer Actions & Metadata */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-semibold uppercase tracking-wider">Tanggal Unggah</span>
                  <span className="font-medium text-foreground">
                    {selectedImage ? formatDateIndo(selectedImage.created_at) : '-'}
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSharePhoto}
                    aria-label="Bagikan foto"
                    className="w-full rounded-full gap-2 text-xs sm:text-sm font-medium border-border/80"
                  >
                    {isCopied ? (
                      <>
                        <Check className="size-4 text-emerald-600" />
                        <span>Tautan Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="size-4" />
                        <span>Salin Tautan</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
