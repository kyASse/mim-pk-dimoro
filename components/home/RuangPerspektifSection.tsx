import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { OpiniPublicItem } from "@/lib/types/ruang-perspektif";
import OpiniCard from "@/components/ruang-perspektif/OpiniCard";

export default function RuangPerspektifSection({ opinions }: { opinions: OpiniPublicItem[] }) {
  if (!opinions || opinions.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 border-t border-border/40 bg-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
              <Compass className="size-3.5" /> Suara Komunitas
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Ruang Perspektif
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Gagasan, refleksi, dan inspirasi pendidikan dari guru dan wali murid MIM PK Dimoro.
            </p>
          </div>
          <Link
            href="/ruang-perspektif"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline shrink-0"
          >
            Lihat Semua Opini <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opinions.slice(0, 3).map((op) => (
            <OpiniCard key={op.id} item={op} />
          ))}
        </div>
      </div>
    </section>
  );
}
