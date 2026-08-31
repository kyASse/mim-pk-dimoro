"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X, Calendar, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface NewsSpotlightItem {
  id: string | number;
  judul: string;
  ringkasan?: string | null;
  isi?: string | null;
  isi_lengkap?: string | null;
  image_url?: string | null;
  tanggal_terbit?: string | null;
  penulis_id?: string | null;
  created_at?: string;
  [key: string]: any;
}

export interface NewsSpotlightModalProps {
  news?: NewsSpotlightItem[] | NewsSpotlightItem | null;
}

const STORAGE_LAST_SEEN_KEY = "mim_last_seen_news_id";
const STORAGE_DISMISSED_UNTIL_KEY = "mim_dismissed_until";

function formatTanggal(tanggal?: string | null): string {
  if (!tanggal) return "Baru Saja";
  try {
    const date = new Date(tanggal);
    if (isNaN(date.getTime())) return tanggal;
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return tanggal;
  }
}

export default function NewsSpotlightModal({ news }: NewsSpotlightModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [dontShowToday, setDontShowToday] = useState<boolean>(false);
  const shouldReduceMotion = useReducedMotion();

  // Normalize news prop to a clean array of up to 5 valid items
  const items = useMemo<NewsSpotlightItem[]>(() => {
    if (!news) return [];
    const list = Array.isArray(news) ? news : [news];
    return list
      .filter(
        (item): item is NewsSpotlightItem =>
          Boolean(
            item &&
              item.id != null &&
              String(item.id).trim() !== "" &&
              item.judul &&
              item.judul.trim() !== ""
          )
      )
      .slice(0, 5);
  }, [news]);

  // Reset currentIndex when items change
  useEffect(() => {
    setCurrentIndex(0);
  }, [items]);

  // Initial check and delayed opening
  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    try {
      // 1. Check if top news was already seen in this session
      const lastSeenId = localStorage.getItem(STORAGE_LAST_SEEN_KEY);
      if (lastSeenId === String(items[0].id)) {
        return;
      }

      // 2. Check if 24h dismissal is active
      const dismissedUntil = localStorage.getItem(STORAGE_DISMISSED_UNTIL_KEY);
      if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
        return;
      }
    } catch {
      // Ignore localStorage errors
    }

    // 3. Open modal after 700ms delay
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 700);

    return () => clearTimeout(timer);
  }, [items]);

  // Auto-advance carousel timer (5000ms)
  useEffect(() => {
    if (!isOpen || items.length <= 1 || isPaused) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen, items.length, isPaused]);

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setCurrentIndex((prev) => (prev + 1) % items.length);
    },
    [items.length]
  );

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    },
    [items.length]
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (items.length === 0) return;

    try {
      localStorage.setItem(STORAGE_LAST_SEEN_KEY, String(items[0].id));
      if (dontShowToday) {
        const next24Hours = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem(STORAGE_DISMISSED_UNTIL_KEY, String(next24Hours));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [items, dontShowToday]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex] || items[0];

  const rawSummary =
    currentItem.ringkasan ||
    (currentItem.isi
      ? currentItem.isi.replace(/<[^>]*>?/gm, "").slice(0, 160) + "..."
      : currentItem.isi_lengkap
      ? currentItem.isi_lengkap.replace(/<[^>]*>?/gm, "").slice(0, 160) + "..."
      : null);
  const summarySnippet = rawSummary || "Baca warta dan kabar terkini selengkapnya dari MIM PK Dimoro.";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.2 }}
          onClick={handleClose}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="spotlight-news-title"
        >
          {/* Double-Bezel Architecture */}
          <motion.div
            initial={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.92,
              y: shouldReduceMotion ? 0 : 16,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.95,
              y: shouldReduceMotion ? 0 : 8,
            }}
            transition={
              shouldReduceMotion
                ? { duration: 0.1 }
                : { type: "spring", damping: 26, stiffness: 320 }
            }
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-background/80 dark:bg-card/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2rem] p-2.5 shadow-2xl ring-1 ring-black/5"
          >
            {/* Inner Core */}
            <div className="bg-card text-card-foreground rounded-[calc(2rem-0.625rem)] overflow-hidden border border-border/40 flex flex-col">
              {/* 16:9 Thumbnail Header */}
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <Image
                  key={String(currentItem.id)}
                  src={currentItem.image_url || "/images/mim_tahfidz_learning.jpg"}
                  alt={currentItem.judul}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 512px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                {/* Badge "Kabar Terkini" / Slide Counter */}
                <div className="absolute top-3 left-3 z-10">
                  <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-1 text-xs shadow-md border-0">
                    {items.length > 1
                      ? `Kabar Terkini • ${currentIndex + 1}/${items.length}`
                      : "Kabar Terkini"}
                  </Badge>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Tutup warta spotlight"
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Navigation Arrows for Multi-News */}
                {items.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Berita sebelumnya"
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shadow-md"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Berita selanjutnya"
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shadow-md"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Pagination Pill Indicators */}
              {items.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 pt-3 px-5 sm:px-6">
                  {items.map((item, idx) => (
                    <button
                      key={String(item.id)}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Lihat slide ${idx + 1}`}
                      aria-current={idx === currentIndex ? "true" : "false"}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
                        idx === currentIndex
                          ? "w-6 bg-primary"
                          : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                      )}
                    />
                  ))}
                </div>
              )}

              {/* Body Content */}
              <div className="p-5 sm:p-6 space-y-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={String(currentItem.id)}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -6 }}
                    transition={{ duration: shouldReduceMotion ? 0.05 : 0.2 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{formatTanggal(currentItem.tanggal_terbit || currentItem.created_at)}</span>
                    </div>

                    <h3
                      id="spotlight-news-title"
                      className="text-lg sm:text-xl font-bold text-foreground line-clamp-2 leading-snug tracking-tight"
                    >
                      {currentItem.judul}
                    </h3>

                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {summarySnippet}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Checkbox Section */}
                <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="dont-show-today"
                      checked={dontShowToday}
                      onCheckedChange={(checked) => setDontShowToday(checked === true)}
                    />
                    <Label
                      htmlFor="dont-show-today"
                      className="text-xs text-muted-foreground font-normal cursor-pointer select-none"
                    >
                      Jangan tampilkan lagi hari ini
                    </Label>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="flex items-center justify-end gap-2.5 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="text-xs text-muted-foreground hover:text-foreground h-9 px-3"
                  >
                    Nanti Saja
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    className="text-xs font-semibold gap-1.5 shadow-sm h-9 px-4 group"
                  >
                    <Link href={`/berita/${currentItem.id}`} onClick={handleClose}>
                      <span>Baca Selengkapnya</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
