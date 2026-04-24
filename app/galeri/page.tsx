// app/galeri/page.tsx
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/shared/PageHeader";
import GalleryClient from "@/components/galeri/GalleryClient"

export default async function GaleriPublikPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
    const supabase = await createClient();

    // Await searchParams sebelum mengakses
    const params = await searchParams;
    const filterKategori = params.kategori as string | undefined;

    try {
    // Buat query dasar untuk mengambil data galeri
    let query = supabase
        .from('galeri')
        .select('*')
        .order('created_at', { ascending: false });

    // Jika ada filter kategori di URL, tambahkan ke query
    if (filterKategori) {
        query = query.eq('kategori', filterKategori);
    }

    // Eksekusi query untuk data galeri
    const { data: galeri, error: galeriError } = await query;

    if (galeriError) {
        console.error("Error mengambil data galeri:", galeriError);
        return (
            <div className="min-h-screen">
                <PageHeader
                    title="Galeri"
                    description="Melihat keseruan anak-anak belajar dan bermain di TK ABA Mertosanan"
                    background="bg-highlight/20"
                />
                <div className="container mx-auto px-4 py-16">
                    <p className="text-center text-red-500">
                        Gagal memuat galeri. Silakan coba lagi nanti.
                    </p>
                </div>
            </div>
        );
    }

    // Ambil semua kategori unik untuk filter
    const { data: kategoriData, error: kategoriError } = await supabase
        .from('galeri')
        .select('kategori')
        .not('kategori', 'is', null);

    if (kategoriError) {
        console.error("Error mengambil kategori:", kategoriError);
        return (
            <div className="min-h-screen">
                <PageHeader
                    title="Galeri"
                    description="Melihat keseruan anak-anak belajar dan bermain di TK ABA Mertosanan"
                    background="bg-highlight/20"
                />
                <div className="container mx-auto px-4 py-16">
                    <p className="text-center text-destructive">
                        Gagal memuat kategori galeri. Silakan coba lagi nanti.
                    </p>
                </div>
            </div>
        );
    }

    // Ekstrak kategori unik
    const uniqueKategori: string[] = [...new Set(
        kategoriData?.map(item => item.kategori).filter(Boolean) || []
    )];

    // Transform data galeri untuk komponen client
    const transformedGaleri = galeri?.map(item => ({
        id: item.id,
        src: item.image_url,
        title: item.keterangan || 'Tanpa Judul',
        description: item.keterangan || '',
        category: item.kategori || 'lainnya',
        created_at: item.created_at
    })) || [];

    return (
        <div className="min-h-screen">
            <PageHeader
                title="Galeri"
                description="Melihat keseruan anak-anak belajar dan bermain di TK ABA Mertosanan"
                background="bg-highlight/20"
            />

            <GalleryClient 
                galeriData={transformedGaleri}
                kategoriList={uniqueKategori}
                currentKategori={filterKategori}
            />
        </div>
    );
    } catch (error) {
    console.error("Error unexpected:", error);
    return (
        <div className="min-h-screen">
            <PageHeader
                title="Galeri"
                description="Melihat keseruan anak-anak belajar dan bermain di TK ABA Mertosanan"
                background="bg-highlight/20"
            />
            <div className="container mx-auto px-4 py-16">
                <p className="text-center text-red-500">
                    Terjadi kesalahan. Silakan coba lagi nanti.
                </p>
            </div>
        </div>
    );
    }
}
