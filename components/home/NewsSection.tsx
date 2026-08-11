import { createClient } from '@/lib/supabase/server';
import NewsCard from './NewsCard';
import { SCHOOL_NAME } from '@/lib/school-config';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        .eq('status', 'terbit')
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
    
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
                            Berita & Kegiatan Terkini
                        </h2>
                        <p className="text-base text-muted-foreground max-w-2xl">
                            Informasi terbaru seputar ragam aktivitas, prestasi, dan kabar madrasah di {SCHOOL_NAME}.
                        </p>
                    </div>
                    <div>
                        <Link href="/berita">
                            <Button variant="outline" className="rounded-full border-border hover:bg-muted font-semibold">
                                <span>Lihat Semua Berita</span>
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {newsData.length === 0 ? (
                    <div className="text-center py-16 bg-muted/30 rounded-3xl border border-dashed border-border/60">
                        <p className="text-muted-foreground text-sm">Belum ada berita yang dipublikasikan saat ini.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {newsData.map((item, index) => (
                            <NewsCard key={item.id} item={item} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}