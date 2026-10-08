import React from "react";
import Image from "next/image";
import { Quote } from "lucide-react";
import type { IKWMContent } from "@/lib/types/content";

export interface KataPengantarSectionProps {
  kataPengantar: IKWMContent["kata_pengantar"];
  className?: string;
}

/**
 * KataPengantarSection Component
 * Menampilkan sambutan Ketua IKWM dengan Double-Bezel Architecture,
 * container potret ber-squircle border, floating quote card,
 * dan Data Property Invariance (tanpa icon di paragraf teks).
 */
export default function KataPengantarSection({
  kataPengantar,
  className = "",
}: KataPengantarSectionProps) {
  const photoUrl = kataPengantar.foto_url || "/avatar-women-placeholder.png";

  return (
    <section
      className={`relative w-full py-12 sm:py-16 ${className}`}
      aria-label={kataPengantar.judul || "Sambutan Ketua IKWM"}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Double-Bezel Architecture: Outer Shell */}
        <div className="ring-1 ring-border/50 bg-muted/20 p-2 sm:p-3 rounded-[2rem] shadow-sm">
          {/* Inner Core */}
          <div className="bg-card rounded-[calc(2rem-0.75rem)] p-6 sm:p-10 md:p-12 shadow-sm border border-border/40">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Portrait Card & Stacked Quote Card */}
              <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5">
                <div className="mx-auto w-full max-w-sm lg:max-w-none">
                  {/* Portrait Card with Squircle Border */}
                  <div className="rounded-3xl overflow-hidden shadow-md border border-border/60 bg-muted/30">
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted/40">
                      <Image
                        src={photoUrl}
                        alt={`Foto ${kataPengantar.nama_ketua}`}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, 420px"
                      />
                    </div>

                    {/* Identity Tag Below Portrait */}
                    <div className="p-4 sm:p-5 bg-card text-card-foreground border-t border-border/40 flex flex-col gap-1.5">
                      <h3 className="font-bold text-base sm:text-lg text-foreground leading-snug">
                        {kataPengantar.nama_ketua}
                      </h3>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {kataPengantar.jabatan}
                        </span>
                        <span className="shrink-0 text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                          Ketua IKWM
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stacked Quote Card Below Portrait (High-End Aesthetic) */}
                  {kataPengantar.kutipan_kunci && (
                    <div className="mt-4 sm:mt-5 p-4 sm:p-5 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl shadow-sm relative overflow-hidden">
                      {/* Decorative quote watermark in background */}
                      <Quote
                        aria-hidden="true"
                        className="absolute -bottom-2 -right-2 size-14 text-primary/10 pointer-events-none"
                      />

                      <div className="flex items-center gap-2 text-primary mb-2">
                        <Quote className="size-4 shrink-0" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">
                          Kutipan Kunci
                        </span>
                      </div>
                      <blockquote className="text-xs sm:text-sm font-medium text-foreground italic leading-relaxed relative z-10">
                        &ldquo;{kataPengantar.kutipan_kunci}&rdquo;
                      </blockquote>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Title, Paragraphs, Affirmation Signature */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 border border-primary/20 text-primary self-start mb-3">
                  <span>Sambutan Pimpinan</span>
                </div>

                {/* Section Title */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                  {kataPengantar.judul}
                </h2>

                {/* Paragraphs (Data Property Invariance: Clean typography without stray icons) */}
                <div className="mt-6 space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {kataPengantar.sambutan && kataPengantar.sambutan.length > 0 ? (
                    kataPengantar.sambutan.map((paragraph, index) => (
                      <p key={index} className="text-pretty">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className="italic text-muted-foreground">Belum ada sambutan yang ditambahkan.</p>
                  )}
                </div>

                {/* Affirmation Signature / Closing Block */}
                <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Salam Hangat & Sinergi
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Keluarga Besar Paguyuban Wali Murid
                    </p>
                  </div>
                  <div className="text-xs text-primary font-medium bg-primary/5 px-3.5 py-2 rounded-xl border border-primary/15 self-start sm:self-auto">
                    Mewakili Seluruh Pengurus IKWM
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
