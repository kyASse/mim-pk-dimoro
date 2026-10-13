"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play, Sparkles } from "lucide-react";
import type { IKWMContent } from "@/lib/types/content";
import { extractYouTubeVideoId } from "@/lib/utils/content-parsers";

export interface IKWMVideoSectionProps {
  video: IKWMContent["video"];
  className?: string;
}

/**
 * IKWMVideoSection Component
 * Menampilkan video interaktif YouTube dengan autoplay on-scroll (Intersection Observer + muted policy),
 * Agency Teaser Card saat mode 'placeholder', atau null saat mode 'hidden'.
 */
export default function IKWMVideoSection({ video, className = "" }: IKWMVideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!("IntersectionObserver" in window)) {
      setIsPlaying(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsPlaying(true);
        }
      },
      { threshold: 0.4 }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, []);

  // 1. Mode 'hidden': Zero DOM footprint
  if (video.display_mode === "hidden") {
    return null;
  }

  const videoId = extractYouTubeVideoId(video.youtube_url);
  const isPlaceholderMode = video.display_mode === "placeholder" || !videoId;

  return (
    <section
      className={`relative w-full py-12 sm:py-16 ${className}`}
      aria-label={video.judul || "Video Liputan Kegiatan"}
    >
      {/* Section Header */}
      {(video.judul || video.deskripsi) && (
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-primary/10 border border-primary/20 text-primary mb-3">
            <span>Dokumentasi Video</span>
          </div>
          {video.judul && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              {video.judul}
            </h2>
          )}
          {video.deskripsi && (
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {video.deskripsi}
            </p>
          )}
        </div>
      )}

      {/* Main Double-Bezel Card Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div
          ref={containerRef}
          className="ring-1 ring-border/50 bg-muted/20 p-2 sm:p-3 rounded-[2rem] shadow-sm"
        >
          {isPlaceholderMode ? (
            /* 2. Mode 'placeholder' (atau fallback saat URL tidak valid): Agency Teaser Card */
            <div className="relative w-full aspect-video rounded-[calc(2rem-0.75rem)] bg-gradient-to-br from-gray-900 to-gray-950 text-white p-8 sm:p-12 overflow-hidden flex flex-col items-center justify-center text-center shadow-2xl border border-white/5">
              {/* Subtle Glowing Background Orbs */}
              <div
                aria-hidden="true"
                className="absolute -top-24 -left-24 size-72 sm:size-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-24 -right-24 size-72 sm:size-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none"
              />

              {/* Pulsing Play Badge Icon */}
              <div className="relative mb-5 sm:mb-6 flex items-center justify-center">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-emerald-500/25 animate-ping opacity-60"
                />
                <div className="relative rounded-full size-16 sm:size-20 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-inner backdrop-blur-sm">
                  <Play className="size-7 sm:size-9 fill-emerald-400 ml-1 text-emerald-400" />
                </div>
              </div>

              {/* Eyebrow Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3 sm:mb-4">
                <Sparkles className="size-3.5" />
                <span>Segera Hadir</span>
                <span className="opacity-60">• Dokumentasi Resmi</span>
              </div>

              {/* Placeholder Titles */}
              <h3 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-white max-w-xl mx-auto">
                {video.placeholder_title || "Dokumentasi Profil Sedang Diproduksi"}
              </h3>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-gray-300 max-w-lg mx-auto leading-relaxed">
                {video.placeholder_desc ||
                  "Nantikan liputan kegiatan kami segera. Video dokumentasi kegiatan dan profil paguyuban IKWM MIM PK Dimoro sedang dipersiapkan."}
              </p>
            </div>
          ) : (
            /* 3. Mode 'active': YouTube Iframe Player with Autoplay & Unmute Controls */
            <div className="relative w-full aspect-video rounded-[calc(2rem-0.75rem)] overflow-hidden bg-black shadow-2xl border border-border/40">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&enablejsapi=1&rel=0`}
                title={video.judul || "Video Liputan Kegiatan"}
                className="w-full h-full border-0 absolute inset-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />

              {/* Floating Pill Audio Controller */}
              <button
                type="button"
                onClick={() => setIsMuted((prev) => !prev)}
                aria-label={isMuted ? "Buka Suara" : "Bisukan"}
                className="absolute bottom-4 right-4 z-10 rounded-full px-3.5 py-2 sm:px-3 sm:py-1.5 min-h-[44px] sm:min-h-0 text-xs font-medium bg-black/75 hover:bg-black/90 backdrop-blur-md text-white transition-all flex items-center gap-2 shadow-lg border border-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="size-4 text-emerald-400 shrink-0" />
                    <span>Buka Suara</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="size-4 text-emerald-400 shrink-0" />
                    <span>Bisukan</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
