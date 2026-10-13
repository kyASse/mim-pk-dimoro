"use client";

import React from "react";
import type { IKWMContent } from "@/lib/types/content";
import IKWMHero from "@/components/ikatan-wali-murid/IKWMHero";
import KataPengantarSection from "@/components/ikatan-wali-murid/KataPengantarSection";
import IKWMVideoSection from "@/components/ikatan-wali-murid/IKWMVideoSection";
import StrukturalSection from "@/components/ikatan-wali-murid/StrukturalSection";
import KegiatanBentoSection from "@/components/ikatan-wali-murid/KegiatanBentoSection";

export interface IKWMContentClientProps {
  content: IKWMContent;
}

/**
 * IKWMContentClient Component
 * Client-side layout orchestrator untuk halaman publik Ikatan Wali Murid (IKWM).
 * Mengatur susunan section: Hero, Sambutan Ketua, Profil Video, Bagan Struktur, dan Bento Grid Kegiatan.
 */
export default function IKWMContentClient({ content }: IKWMContentClientProps) {
  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      {/* Section 1: Standardized Page Header dengan Breadcrumb & Periode */}
      <IKWMHero hero={content.hero} />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-6 space-y-24">
        {/* Section 2: Sambutan Ketua IKWM */}
        <KataPengantarSection kataPengantar={content.kata_pengantar} />

        {/* Section 3: Profil Video Interaktif / Teaser Card */}
        <IKWMVideoSection video={content.video} />

        {/* Section 4: Bagan Struktur Organisasi & Pengurus */}
        <StrukturalSection struktural={content.struktural} />

        {/* Section 5: Bento Grid Program & Kegiatan */}
        <KegiatanBentoSection kegiatan={content.kegiatan} />
      </div>
    </main>
  );
}
