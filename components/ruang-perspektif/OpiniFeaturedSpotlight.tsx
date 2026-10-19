import Link from "next/link";
import { OpiniPublicItem } from "@/lib/types/ruang-perspektif";
import { ArrowRight, Clock } from "lucide-react";

export default function OpiniFeaturedSpotlight({ item }: { item: OpiniPublicItem }) {
  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card via-muted/20 to-card p-6 sm:p-10 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-0.5 text-xs font-medium text-white">
                Sorotan Redaksi
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs font-medium text-primary">{item.kategori}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                <Clock className="size-3" /> {item.waktu_baca_menit} mnt baca
              </span>
            </div>

            <Link href={`/ruang-perspektif/${item.slug}`} className="block group">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground transition-colors group-hover:text-primary leading-tight">
                {item.judul}
              </h2>
            </Link>

            <blockquote className="relative pl-4 border-l-2 border-primary/40 italic text-muted-foreground text-base sm:text-lg leading-relaxed">
              &ldquo;{item.ringkasan}&rdquo;
            </blockquote>

            <div className="pt-2 flex items-center gap-3">
              {item.foto_penulis_url ? (
                <img
                  src={item.foto_penulis_url}
                  alt={item.nama_penulis}
                  className="size-11 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="size-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {item.nama_penulis.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-foreground">{item.nama_penulis}</p>
                <p className="text-xs text-muted-foreground">{item.keterangan_peran}</p>
              </div>
            </div>
          </div>

          <div className="shrink-0 self-end lg:self-center">
            <Link
              href={`/ruang-perspektif/${item.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold transition hover:opacity-90 shadow-sm"
            >
              Baca Artikel Lengkap <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
