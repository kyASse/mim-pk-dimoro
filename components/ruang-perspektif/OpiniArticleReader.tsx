import Link from "next/link";
import { OpiniPublicDetail } from "@/lib/types/ruang-perspektif";
import { ArrowLeft, Clock, Share2, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SCHOOL_DOMAIN } from "@/lib/school-config";

export default function OpiniArticleReader({ item }: { item: OpiniPublicDetail }) {
  const articleUrl = `${SCHOOL_DOMAIN}/ruang-perspektif/${item.slug}`;
  const shareWaUrl = `https://wa.me/?text=${encodeURIComponent(
    `"${item.judul}" oleh ${item.nama_penulis}\nBaca selengkapnya di Ruang Perspektif MIM PK Dimoro:\n${articleUrl}`
  )}`;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link
        href="/ruang-perspektif"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="size-4" /> Kembali ke Ruang Perspektif
      </Link>

      <header className="mb-8 space-y-4">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {item.kategori}
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
          {item.judul}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/40">
          <div className="flex items-center gap-3">
            {item.foto_penulis_url ? (
              <img
                src={item.foto_penulis_url}
                alt={item.nama_penulis}
                className="size-11 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="size-11 rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border/40">
                <User className="size-5" />
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-foreground">{item.nama_penulis}</p>
              <p className="text-xs text-muted-foreground">{item.keterangan_peran}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" /> {item.waktu_baca_menit} mnt baca
            </span>
            <Button asChild variant="outline" size="sm" className="rounded-full h-8 text-xs gap-1.5">
              <a href={shareWaUrl} target="_blank" rel="noopener noreferrer">
                <Share2 className="size-3.5" /> Bagikan
              </a>
            </Button>
          </div>
        </div>
      </header>

      {item.gambar_sampul_url && (
        <div className="mb-8 overflow-hidden rounded-2xl border border-border/50">
          <img
            src={item.gambar_sampul_url}
            alt={item.judul}
            className="w-full max-h-[460px] object-cover"
          />
        </div>
      )}

      {/* Reading container - max 65ch per design-taste-frontend */}
      <div className="max-w-[65ch] mx-auto text-base sm:text-lg leading-relaxed text-foreground/90 font-normal space-y-6">
        <p className="font-medium text-lg sm:text-xl text-foreground leading-relaxed border-l-2 border-primary/50 pl-4 py-1 italic text-muted-foreground">
          {item.ringkasan}
        </p>

        {/<[a-z][\s\S]*>/i.test(item.isi_lengkap || "") ? (
          <div
            className="prose prose-base sm:prose-lg prose-emerald dark:prose-invert max-w-none text-foreground/90 leading-relaxed font-normal [&_[style*='text-align:center']]:text-center [&_[style*='text-align:right']]:text-right [&_[style*='text-align:justify']]:text-justify [&_[style*='text-align:left']]:text-left [&_p]:mb-4"
            dangerouslySetInnerHTML={{ __html: item.isi_lengkap }}
          />
        ) : (
          <div className="whitespace-pre-line space-y-4">
            {item.isi_lengkap}
          </div>
        )}
      </div>

      <footer className="max-w-[65ch] mx-auto mt-12 pt-8 border-t border-border/40 space-y-6">
        <div className="rounded-2xl border border-border/50 bg-muted/20 p-4 sm:p-5 flex items-start gap-3">
          <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <strong>Catatan Redaksi:</strong> Tulisan ini merupakan pandangan pribadi penulis yang ditujukan untuk memperkaya dialog dan wawasan pendidikan di lingkungan MIM PK Dimoro.
          </p>
        </div>
      </footer>
    </article>
  );
}
