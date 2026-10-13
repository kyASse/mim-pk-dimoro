import React from "react";
import Image from "next/image";
import { Calendar, Sparkles, Compass } from "lucide-react";
import type { IKWMContent, IKWMKegiatanItem } from "@/lib/types/content";

export interface KegiatanBentoSectionProps {
  kegiatan: IKWMContent["kegiatan"];
  className?: string;
}

/**
 * Helper warna pill badge per kategori
 */
function getCategoryColor(category: string): string {
  switch (category.toLowerCase()) {
    case "parenting":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
    case "sosial":
      return "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20";
    case "sarpras":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20";
    case "kemitraan":
      return "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20";
    default:
      return "bg-primary/10 text-primary border-primary/20";
  }
}

/**
 * KegiatanBentoSection Component
 * Asymmetrical Bento Grid untuk program dan kegiatan IKWM:
 * - Card 0: Featured primary card (col-span-12 lg:col-span-7)
 * - Card 1: Side card (col-span-12 lg:col-span-5)
 * - Card 2: Side card (col-span-12 lg:col-span-5)
 * - Card 3: Wide card (col-span-12 lg:col-span-7)
 * - Card 4+: Standard 3-column cards
 * - Graceful mobile collapse below 768px (single column)
 * - Data Property Invariance: Icon strictly on header/schedule pill
 */
export default function KegiatanBentoSection({
  kegiatan = [],
  className = "",
}: KegiatanBentoSectionProps) {
  return (
    <section
      className={`relative w-full py-12 sm:py-16 ${className}`}
      aria-label="Agenda Kegiatan IKWM"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 border border-primary/20 text-primary mb-3">
            <Compass className="size-3.5" />
            <span>Program & Kegiatan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Agenda Kegiatan Paguyuban
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Rangkaian program kolaboratif untuk mempererat silaturahmi, memperluas wawasan parenting,
            dan mendukung lingkungan belajar anak yang berkarakter.
          </p>
        </div>

        {/* Empty State */}
        {kegiatan.length === 0 ? (
          <div className="max-w-md mx-auto p-8 rounded-3xl bg-card border border-border/60 text-center shadow-sm">
            <div className="size-12 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto mb-3">
              <Calendar className="size-6" />
            </div>
            <h3 className="font-bold text-base text-foreground">
              Belum Ada Agenda Kegiatan
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Agenda kegiatan Ikatan Wali Murid akan segera diperbarui. Pantau terus laman ini untuk pengumuman kegiatan terbaru.
            </p>
          </div>
        ) : (
          /* Asymmetrical Bento Grid */
          <div className="grid grid-cols-12 gap-6">
            {kegiatan.map((item: IKWMKegiatanItem, index: number) => {
              // Menghitung span grid asimetris untuk bento layout
              let colSpanClass = "col-span-12 md:col-span-6 lg:col-span-4";
              if (index === 0) {
                colSpanClass = "col-span-12 lg:col-span-7";
              } else if (index === 1) {
                colSpanClass = "col-span-12 lg:col-span-5";
              } else if (index === 2) {
                colSpanClass = "col-span-12 lg:col-span-5";
              } else if (index === 3) {
                colSpanClass = "col-span-12 lg:col-span-7";
              }

              const isPrimaryFeatured = index === 0;

              return (
                <article
                  key={item.id || index}
                  className={`${colSpanClass} group bg-card rounded-3xl border border-border/50 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col overflow-hidden`}
                >
                  {/* Image Container */}
                  <div
                    className={`relative w-full overflow-hidden bg-muted/30 ${
                      isPrimaryFeatured
                        ? "aspect-[16/9] sm:aspect-[21/9] lg:aspect-[16/9]"
                        : "aspect-[16/9]"
                    }`}
                  >
                    <Image
                      src={item.foto_url || "/images/mim_hero_main.jpg"}
                      alt={`Dokumentasi kegiatan ${item.judul}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Gradient Overlay for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

                    {/* Floating Badges on Image Header */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border shadow-sm ${getCategoryColor(
                          item.kategori
                        )}`}
                      >
                        {item.badge_label || item.kategori}
                      </span>

                      {item.highlight_tag && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/65 text-amber-300 border border-amber-300/30 backdrop-blur-md shadow-sm">
                          <Sparkles className="size-3" />
                          <span>{item.highlight_tag}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
                    <div>
                      <h3
                        className={`font-bold text-foreground leading-snug group-hover:text-primary transition-colors ${
                          isPrimaryFeatured
                            ? "text-xl sm:text-2xl"
                            : "text-lg sm:text-xl"
                        }`}
                      >
                        {item.judul}
                      </h3>

                      <p
                        className={`mt-2.5 text-muted-foreground leading-relaxed ${
                          isPrimaryFeatured
                            ? "text-sm sm:text-base line-clamp-3"
                            : "text-xs sm:text-sm line-clamp-3"
                        }`}
                      >
                        {item.deskripsi}
                      </p>
                    </div>

                    {/* Schedule Badge (Data Property Invariance: Icon strictly on schedule badge) */}
                    <div className="mt-5 pt-4 border-t border-border/40 flex items-center">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-muted/60 border border-border/60 text-foreground/85">
                        <Calendar className="size-3.5 text-primary shrink-0" />
                        <span>{item.jadwal}</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
