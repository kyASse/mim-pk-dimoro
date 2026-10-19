import Link from "next/link";
import { PenTool, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OpiniHero() {
  return (
    <section className="relative pt-8 pb-10 sm:pt-12 sm:pb-14 border-b border-border/40 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-4">
          <Compass className="size-3.5" /> Ruang Perspektif Madrasah
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          Dialog Gagasan & Suara Komunitas
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
          Wadah aspirasi, refleksi pendidikan, dan pemikiran inspiratif dari guru, orang tua murid, dan pemerhati MIM PK Dimoro.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="h-10 text-sm rounded-full px-6 gap-2">
            <Link href="/ruang-perspektif/kirim">
              <PenTool className="size-4" />
              Kirim Tulisan Opini
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-10 text-sm rounded-full px-6">
            <a href="#koleksi-opini">Jelajahi Gagasan</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
