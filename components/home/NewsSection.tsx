import { createClient } from '@/lib/supabase/server';
import NewsCard from './NewsCard';

// Tipe untuk data berita
type NewsItem = {
    id: string;
    judul: string;
    ringkasan: string | null;
    image_url: string | null;
    tanggal_terbit: string;
    penulis_id: string;
    created_at: string;
};

async function fetchNewsData(): Promise<NewsItem[]> {
    const supabase = await createClient();
    const MAX_NEWS_ITEMS = 3;
    const { data, error } = await supabase
        .from('berita')
        .select('id, judul, ringkasan, image_url, tanggal_terbit, penulis_id, created_at')
        .eq('status', 'published')
        .order('tanggal_terbit', { ascending: false })
        .limit(MAX_NEWS_ITEMS);

    if (error) {
        console.error('Error fetching news data:', error);
        return [];
    }

    return data || [];
}


export default async function NewsSection() {
    const newsData = await fetchNewsData();
    
    // Fallback jika tidak ada data
    if (!newsData || newsData.length === 0) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Berita Terkini</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Informasi terbaru seputar kegiatan dan prestasi TK ABA Mertosanan
                        </p>
                    </div>
                    
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Belum ada berita yang dipublikasikan.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Berita Terkini</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Informasi terbaru seputar kegiatan dan prestasi TK ABA Mertosanan
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {newsData.map((item, index) => (
                        <NewsCard key={item.id} item={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}