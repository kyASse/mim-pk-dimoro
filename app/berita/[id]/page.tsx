import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { 
    CalendarIcon, 
    UserIcon, 
    ArrowLeft
} from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";
import ShareSection from "@/components/berita/ShareSection";
import { SCHOOL_NAME } from "@/lib/school-config";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function BeritaDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Ambil data berita berdasarkan ID
    const { data: berita, error } = await supabase
        .from('berita')
        .select('*')
        .eq('id', id)
        .eq('status', 'terbit')
        .single();

    // Jika berita tidak ditemukan atau error
    if (error || !berita) {
        notFound();
    }

    const { data: penulis } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', berita.penulis_id)
        .single();

    // Format tanggal ke bahasa Indonesia
    const formatTanggal = (tanggal: string) => {
        const date = new Date(tanggal);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <PageHeader
                title="Detail Berita"
                description={`Informasi terkini dari ${SCHOOL_NAME}`}
                background="bg-primary/10"
            />

            {/* Back Button */}
            <div className="container mx-auto px-4 py-6">
                <Link 
                    href="/" 
                    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Beranda
                </Link>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 pb-16">
                <div className="max-w-4xl mx-auto">
                    {/* Hero Image */}
                    <div className="relative w-full h-[240px] sm:h-[380px] md:h-[480px] lg:h-[560px] mb-6 sm:mb-8 rounded-xl sm:rounded-2xl overflow-hidden shadow-md">
                        <Image
                            src={berita.image_url || '/placeholder-news.jpg'}
                            alt={berita.judul}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </div>

                    {/* Content Wrapper */}
                    <div className="bg-white dark:bg-card rounded-xl sm:rounded-2xl shadow-xs border border-border/60 p-5 sm:p-8 md:p-12">
                        {/* Article Title */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-tight mb-4 sm:mb-6">
                            {berita.judul}
                        </h1>

                        {/* Article Subtitle/Summary */}
                        {berita.ringkasan && (
                            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 font-medium leading-relaxed mb-6 sm:mb-8 border-l-4 border-primary pl-4 sm:pl-6 bg-muted/20 py-2 rounded-r-lg">
                                {berita.ringkasan}
                            </p>
                        )}

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-border/80 text-xs sm:text-sm">
                            <div className="flex items-center text-muted-foreground">
                                <UserIcon className="h-4 w-4 mr-1.5 text-primary" />
                                <span className="font-semibold text-foreground">
                                    {penulis?.role === 'admin'
                                        ? 'Tim Redaksi'
                                        : (penulis?.role ? `Penulis (${penulis.role})` : 'Tim Redaksi')
                                    }
                                </span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <CalendarIcon className="h-4 w-4 mr-1.5 text-primary" />
                                <span>{formatTanggal(berita.tanggal_terbit)}</span>
                            </div>
                        </div>

                        {/* Article Content */}
                        {/<[a-z][\s\S]*>/i.test(berita.isi_lengkap || '') ? (
                            <div 
                                className="prose prose-base sm:prose-lg prose-emerald dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed overflow-hidden"
                                dangerouslySetInnerHTML={{ __html: berita.isi_lengkap }}
                            />
                        ) : (
                            <div className="prose prose-base sm:prose-lg max-w-none">
                                <div 
                                    className="text-gray-800 dark:text-gray-200 leading-relaxed space-y-4 sm:space-y-6"
                                    style={{
                                        fontSize: '17px',
                                        lineHeight: '1.75',
                                    }}
                                >
                                    {/* Split content by paragraphs and render */}
                                    {berita.isi_lengkap.split('\n').map((paragraph: string, index: number) => {
                                        if (paragraph.trim() === '') return null;
                                        return (
                                            <p key={index} className="mb-4 sm:mb-6">
                                                {paragraph.trim()}
                                            </p>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Share Section */}
                        <ShareSection title={berita.judul} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: berita } = await supabase
        .from('berita')
        .select('judul, ringkasan, image_url')
        .eq('id', id)
        .eq('status', 'terbit')
        .single();

    if (!berita) {
        return {
            title: `Berita Tidak Ditemukan - ${SCHOOL_NAME}`,
        };
    }

    return {
        title: `${berita.judul} - ${SCHOOL_NAME}`,
        description: berita.ringkasan || `Baca berita terbaru: ${berita.judul}`,
        openGraph: {
            title: berita.judul,
            description: berita.ringkasan || `Baca berita terbaru: ${berita.judul}`,
            images: berita.image_url ? [berita.image_url] : undefined,
        },
    };
}
