import { Metadata } from "next";
import OpiniHero from "@/components/ruang-perspektif/OpiniHero";
import OpiniFeaturedSpotlight from "@/components/ruang-perspektif/OpiniFeaturedSpotlight";
import OpiniFilterTabs from "@/components/ruang-perspektif/OpiniFilterTabs";
import OpiniCard from "@/components/ruang-perspektif/OpiniCard";
import OpiniSubmissionCTA from "@/components/ruang-perspektif/OpiniSubmissionCTA";
import { getPublicOpinions, getFeaturedPublicOpinion } from "@/lib/services/ruang-perspektif";

export const metadata: Metadata = {
  title: "Ruang Perspektif | MIM PK Dimoro",
  description: "Kolom pemikiran, opini edukatif, dan suara komunitas guru serta orang tua siswa MIM PK Dimoro.",
};

export default async function RuangPerspektifPage({
  searchParams,
}: {
  searchParams: Promise<{ peran?: string; search?: string }>;
}) {
  const { peran, search } = await searchParams;
  const [opinions, featured] = await Promise.all([
    getPublicOpinions({ peran, search }),
    getFeaturedPublicOpinion(),
  ]);

  return (
    <main className="min-h-screen">
      <OpiniHero />

      {featured && <OpiniFeaturedSpotlight item={featured} />}

      <section id="koleksi-opini" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Arsip Opini Komunitas
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Menampilkan {opinions.length} gagasan terkurasi
            </p>
          </div>
          <OpiniFilterTabs />
        </div>

        {opinions.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-dashed border-border/80">
            <p className="text-sm text-muted-foreground mb-3">
              Belum ada artikel opini untuk kriteria filter ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opinions.map((item) => (
              <OpiniCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      <OpiniSubmissionCTA />
    </main>
  );
}
