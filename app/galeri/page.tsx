import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/shared/PageHeader";
import GalleryClient, { GalleryItem } from "@/components/galeri/GalleryClient";
import { SCHOOL_NAME } from "@/lib/school-config";

export const metadata: Metadata = {
  title: `Galeri Kegiatan - ${SCHOOL_NAME}`,
  description: `Dokumentasi kegiatan belajar, prestasi, dan momen berharga siswa-siswi ${SCHOOL_NAME}.`,
  openGraph: {
    title: `Galeri Kegiatan - ${SCHOOL_NAME}`,
    description: `Dokumentasi kegiatan belajar, prestasi, dan momen berharga siswa-siswi ${SCHOOL_NAME}.`,
    url: "/galeri",
    siteName: SCHOOL_NAME,
    locale: "id_ID",
    type: "website",
  },
};

interface GaleriPublikPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function GaleriPublikPage({ searchParams }: GaleriPublikPageProps) {
  try {
    const supabase = await createClient();
    const params = await searchParams;
    const filterKategori = typeof params.kategori === "string" ? params.kategori : undefined;

    // Ambil seluruh data galeri terbaru
    const { data: galeri, error: galeriError } = await supabase
      .from("galeri")
      .select("*")
      .order("created_at", { ascending: false });

    if (galeriError) {
      console.error("Error mengambil data galeri:", galeriError);
      return (
        <div className="min-h-screen">
          <PageHeader
            title="Galeri Kegiatan"
            description={`Melihat keseruan anak-anak belajar dan berprestasi di ${SCHOOL_NAME}`}
            background="bg-primary/10"
          />
          <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col items-center justify-center gap-5 py-16 px-6 border border-dashed rounded-3xl border-destructive/30 bg-destructive/5 backdrop-blur-sm max-w-xl mx-auto text-center">
              <div className="size-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shadow-inner">
                <AlertCircle className="size-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Gagal Memuat Galeri</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  Terjadi kendala saat mengambil data dokumentasi kegiatan. Silakan muat ulang halaman atau coba lagi nanti.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Ekstrak kategori unik dari data galeri
    const uniqueKategori = Array.from(
      new Set(
        (galeri || [])
          .map((item) => item.kategori?.trim())
          .filter((k): k is string => Boolean(k))
      )
    );

    // Transform data galeri untuk komponen GalleryClient
    const transformedGaleri: GalleryItem[] = (galeri || []).map((item) => ({
      id: item.id,
      src: item.image_url || "/images/placeholder.jpg",
      title: item.keterangan || "Dokumentasi Kegiatan",
      description: item.keterangan || "",
      category: item.kategori || "Umum",
      created_at: item.created_at || new Date().toISOString(),
    }));

    return (
      <div className="min-h-screen">
        <PageHeader
          title="Galeri Kegiatan"
          description={`Melihat keseruan anak-anak belajar dan berprestasi di ${SCHOOL_NAME}`}
          background="bg-primary/10"
        />

        <GalleryClient
          galeriData={transformedGaleri}
          kategoriList={uniqueKategori}
          currentKategori={filterKategori}
        />
      </div>
    );
  } catch (error) {
    console.error("Error unexpected saat memuat galeri:", error);
    return (
      <div className="min-h-screen">
        <PageHeader
          title="Galeri Kegiatan"
          description={`Melihat keseruan anak-anak belajar dan berprestasi di ${SCHOOL_NAME}`}
          background="bg-primary/10"
        />
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center gap-5 py-16 px-6 border border-dashed rounded-3xl border-destructive/30 bg-destructive/5 backdrop-blur-sm max-w-xl mx-auto text-center">
            <div className="size-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shadow-inner">
              <AlertCircle className="size-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">Terjadi Kesalahan</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                Terjadi kesalahan sistem yang tidak terduga. Silakan coba lagi nanti.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
