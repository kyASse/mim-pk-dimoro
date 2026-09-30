import React from "react";
import Image from "next/image";
import { Users, ShieldCheck, UserCheck, Layers, Crown } from "lucide-react";
import type { IKWMContent } from "@/lib/types/content";

export interface StrukturalSectionProps {
  struktural: IKWMContent["struktural"];
  className?: string;
}

/**
 * StrukturalSection Component
 * Menampilkan bagan struktur kepengurusan IKWM dengan Executive Card Hierarchy:
 * 1. Dewan Penasihat & Pembina
 * 2. Spotlight Ketua Umum (Double-Bezel executive card)
 * 3. Grid 3-Kolom Pengurus Harian
 * 4. Bento Grid Divisi & Bidang Kerja (Data Property Invariance: tanpa icon pada list anggota)
 */
export default function StrukturalSection({
  struktural,
  className = "",
}: StrukturalSectionProps) {
  const { pembina = [], pengurus_inti = [], bidang = [] } = struktural;

  // Spotlight Ketua Umum vs Pengurus Harian
  const ketua =
    pengurus_inti.find(
      (p) =>
        p.jabatan.toLowerCase().includes("ketua umum") ||
        p.jabatan.toLowerCase() === "ketua"
    ) || pengurus_inti[0];

  const pengurusHarian = pengurus_inti.filter((p) => p !== ketua);

  return (
    <section
      className={`relative w-full py-12 sm:py-16 ${className}`}
      aria-label="Struktur Organisasi IKWM"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 border border-primary/20 text-primary mb-3">
            <Users className="size-3.5" />
            <span>Struktur Organisasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Struktur Kepengurusan IKWM
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Sinergi dewan pembina, pimpinan harian, dan koordinator bidang dalam
            mewujudkan kemitraan strategis madrasah dan wali murid.
          </p>
        </div>

        {/* 1. Dewan Penasihat & Pembina Top Grid */}
        {pembina.length > 0 && (
          <div className="mb-10 sm:mb-12">
            <div className="flex items-center justify-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" />
              <span>Dewan Penasihat & Pembina</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {pembina.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-card/70 border border-border/60 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-sm hover:border-primary/40 transition-colors"
                >
                  <div className="relative size-12 sm:size-14 rounded-full overflow-hidden shrink-0 border border-border/70 bg-muted/40">
                    <Image
                      src={p.foto_url || "/avatar-man-placeholder.png"}
                      alt={`Foto ${p.nama}`}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider line-clamp-1">
                      {p.jabatan}
                    </p>
                    <h3 className="font-bold text-sm sm:text-base text-foreground truncate mt-0.5">
                      {p.nama}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Spotlight Top: Ketua Umum Executive Card */}
        {ketua && (
          <div className="mb-10 sm:mb-12 max-w-3xl mx-auto">
            <div className="ring-1 ring-border/50 bg-muted/20 p-2 sm:p-2.5 rounded-3xl shadow-sm">
              <div className="bg-card rounded-[calc(1.5rem-0.375rem)] p-6 sm:p-8 border border-border/40 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 shadow-sm">
                
                {/* Avatar with Halo accent */}
                <div className="relative size-24 sm:size-28 rounded-2xl overflow-hidden shrink-0 ring-2 ring-primary/30 shadow-md bg-muted/40">
                  <Image
                    src={ketua.foto_url || "/avatar-women-placeholder.png"}
                    alt={`Foto ${ketua.nama}`}
                    fill
                    className="object-cover object-top"
                    sizes="112px"
                  />
                </div>

                {/* Identity Info */}
                <div className="text-center sm:text-left flex-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-primary/10 border border-primary/20 text-primary mb-2">
                    <Crown className="size-3" />
                    <span>Pimpinan Utama</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-foreground truncate">
                    {ketua.nama}
                  </h3>
                  <p className="text-sm font-semibold text-primary mt-1">
                    {ketua.jabatan}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {ketua.divisi}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Mid Grid: Pengurus Harian (3 Kolom) */}
        {pengurusHarian.length > 0 && (
          <div className="mb-12 sm:mb-16">
            <div className="flex items-center justify-center gap-2 mb-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <UserCheck className="size-4 text-primary" />
              <span>Pengurus Harian</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pengurusHarian.map((pengurus) => (
                <div
                  key={pengurus.id}
                  className="bg-card border border-border/50 rounded-2xl p-6 text-center shadow-sm hover:border-primary/40 transition-colors flex flex-col items-center"
                >
                  <div className="relative size-16 rounded-full overflow-hidden shrink-0 border border-border/60 bg-muted/40 shadow-sm mb-4">
                    <Image
                      src={
                        pengurus.foto_url ||
                        (pengurus.jabatan.toLowerCase().includes("wakil")
                          ? "/avatar-man-placeholder.png"
                          : "/avatar-women-placeholder.png")
                      }
                      alt={`Foto ${pengurus.nama}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  <span className="text-[11px] font-semibold text-primary bg-primary/10 px-3 py-0.5 rounded-full border border-primary/20 mb-2">
                    {pengurus.jabatan}
                  </span>

                  <h3 className="font-bold text-base text-foreground line-clamp-1">
                    {pengurus.nama}
                  </h3>

                  <p className="text-xs text-muted-foreground mt-1">
                    {pengurus.divisi}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Bottom Grid: Bento Cards per Bidang */}
        {bidang.length > 0 && (
          <div>
            <div className="flex items-center justify-center gap-2 mb-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Layers className="size-4 text-primary" />
              <span>Bidang & Divisi Kerja</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bidang.map((b) => (
                <div
                  key={b.id}
                  className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-primary/40 transition-colors"
                >
                  <div>
                    {/* Header with Icon (Data Property Invariance: Icon on header only) */}
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/40">
                      <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                        <Layers className="size-4" />
                      </div>
                      <h3 className="font-bold text-base text-foreground leading-snug">
                        {b.nama_bidang}
                      </h3>
                    </div>

                    {/* Koordinator Highlight */}
                    <div className="rounded-xl bg-muted/30 border border-border/40 p-3 mb-4">
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Koordinator
                      </p>
                      <p className="font-bold text-sm text-foreground mt-0.5">
                        {b.koordinator}
                      </p>
                    </div>

                    {/* Anggota List (Data Property Invariance: Clean unordered list without individual row icons) */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Anggota Bidang
                      </p>
                      <ul className="space-y-1.5 text-sm text-foreground/85 list-disc list-inside">
                        {b.anggota.map((anggota, idx) => (
                          <li key={idx} className="pl-1">
                            {anggota}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
