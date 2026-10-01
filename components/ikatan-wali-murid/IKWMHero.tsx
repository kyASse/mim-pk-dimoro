import React from "react";
import type { IKWMContent } from "@/lib/types/content";
import PageHeader from "@/components/shared/PageHeader";

export interface IKWMHeroProps {
  hero: IKWMContent["hero"];
  className?: string;
}

/**
 * IKWMHero Component
 * Menggunakan PageHeader terstandarisasi sekolah dengan Eyebrow Tag,
 * breadcrumb navigasi, dan Badge Periode Masa Bakti dengan pulse indicator.
 */
export default function IKWMHero({ hero, className = "" }: IKWMHeroProps) {
  return (
    <PageHeader
      title={hero.judul}
      description={hero.subjudul}
      badge={hero.badge}
      className={className}
      background="bg-primary/15 dark:bg-primary/20"
    >
      {hero.periode && (
        <div className="mt-4 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 shadow-2xs backdrop-blur-xs">
          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-semibold">{hero.periode}</span>
        </div>
      )}
    </PageHeader>
  );
}
