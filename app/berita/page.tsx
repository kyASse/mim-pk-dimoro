import type { Metadata } from "next";
import Link from "next/link";
import { Search, Newspaper } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/shared/PageHeader";
import NewsCard from "@/components/home/NewsCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SCHOOL_NAME } from "@/lib/school-config";

export const metadata: Metadata = {
  title: `Berita & Kegiatan - ${SCHOOL_NAME}`,
  description: `Kumpulan berita, artikel, dan dokumentasi kegiatan terkini di ${SCHOOL_NAME}.`,
  openGraph: {
    title: `Berita & Kegiatan - ${SCHOOL_NAME}`,
    description: `Kumpulan berita, artikel, dan dokumentasi kegiatan terkini di ${SCHOOL_NAME}.`,
    url: "/berita",
    siteName: SCHOOL_NAME,
    locale: "id_ID",
    type: "website",
  },
};

interface BeritaPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function BeritaPage({ searchParams }: BeritaPageProps) {
  const params = await searchParams;
  const query = typeof params?.q === "string" ? params.q.trim() : "";

  const supabase = await createClient();

  let queryBuilder = supabase
    .from("berita")
    .select("id, judul, ringkasan, image_url, tanggal_terbit, penulis_id, created_at")
    .eq("status", "terbit")
    .order("tanggal_terbit", { ascending: false });

  if (query) {
    queryBuilder = queryBuilder.ilike("judul", `%${query}%`);
  }

  const { data: newsData, error } = await queryBuilder;

  if (error) {
    console.error("Error fetching news:", error);
  }

  const newsList = newsData || [];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Berita & Kegiatan"
        description={`Kumpulan informasi terkini dan seputar kegiatan di ${SCHOOL_NAME}`}
        background="bg-primary/10"
      />

      <div className="container mx-auto px-4 pb-16">
        {/* Search Section */}
        <div className="max-w-xl mx-auto mb-12">
          <form method="GET" action="/berita" className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Cari berita atau kegiatan..."
                className="pl-10 h-11 rounded-full border-border/80 bg-card focus-visible:ring-primary shadow-xs"
              />
            </div>
            <Button type="submit" className="rounded-full px-6 h-11 font-semibold shadow-xs">
              Cari
            </Button>
          </form>
        </div>

        {/* News Grid or Empty State */}
        {newsList.length === 0 ? (
          <div className="text-center py-16 px-4 bg-muted/30 rounded-3xl border border-dashed border-border/60 max-w-2xl mx-auto">
            <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <Newspaper className="size-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {query ? "Berita Tidak Ditemukan" : "Belum Ada Berita"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
              {query
                ? `Tidak ditemukan berita dengan kata kunci "${query}". Coba gunakan kata kunci lain atau bersihkan pencarian.`
                : "Belum ada artikel atau berita yang dipublikasikan saat ini. Silakan kunjungi kembali nanti."}
            </p>
            {query && (
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/berita">Lihat Semua Berita</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsList.map((item, index) => (
              <NewsCard
                key={item.id}
                item={{
                  ...item,
                  id: String(item.id),
                }}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
