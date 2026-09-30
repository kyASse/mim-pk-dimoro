import React from "react";
import type { IKWMContent } from "@/lib/types/content";

export interface IKWMHeroProps {
  hero: IKWMContent["hero"];
  className?: string;
}

/**
 * IKWMHero Component
 * Section Hero dengan Eyebrow Badge, Massive Heading, Subtitle kontras tinggi,
 * dan Pill Badge Masa Bakti dengan emerald pulse indicator.
 */
export default function IKWMHero({ hero, className = "" }: IKWMHeroProps) {
  return (
    <header
      className={`relative w-full pt-10 pb-12 sm:pt-14 sm:pb-16 text-center overflow-hidden ${className}`}
      aria-label="Hero Ikatan Wali Murid"
    >
      {/* Subtle ambient lighting effect */}
      <div
        aria-hidden="true"
        className="absolute -top-28 left-1/2 -translate-x-1/2 size-80 sm:size-[480px] bg-primary/10 dark:bg-primary/15 rounded-full blur-3xl pointer-events-none -z-10"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Eyebrow Pill Tag */}
        {hero.badge && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 border border-primary/20 text-primary mb-4 sm:mb-5">
            <span>{hero.badge}</span>
          </div>
        )}

        {/* Massive Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15] text-balance">
          {hero.judul}
        </h1>

        {/* Subtitle */}
        {hero.subjudul && (
          <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
            {hero.subjudul}
          </p>
        )}

        {/* Pill Badge Masa Bakti with Emerald Pulse Indicator */}
        {hero.periode && (
          <div className="mt-6 sm:mt-8 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 shadow-sm backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-semibold">{hero.periode}</span>
          </div>
        )}
      </div>
    </header>
  );
}
