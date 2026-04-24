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
        .eq('status', 'published')
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
                description="Informasi terkini dari TK ABA Mertosanan"
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
                    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] mb-8 rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src={berita.image_url || '/placeholder-news.jpg'}
                            alt={berita.judul}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    {/* Content Wrapper */}
                    <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                        {/* Article Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                            {berita.judul}
                        </h1>

                        {/* Article Subtitle/Summary */}
                        {berita.ringkasan && (
                            <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed mb-8 border-l-4 border-primary pl-6">
                                {berita.ringkasan}
                            </p>
                        )}

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                            <div className="flex items-center text-gray-600">
                                <UserIcon className="h-5 w-5 mr-2 text-primary" />
                                <span className="font-medium">
                                    {penulis?.role === 'admin'
                                        ? 'Tim Redaksi'
                                        : berita.penulis_id
                                    }
                                </span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                                <span>{formatTanggal(berita.tanggal_terbit)}</span>
                            </div>
                        </div>

                        {/* Article Content */}
                        <div className="prose prose-lg max-w-none">
                            <div 
                                className="text-gray-800 leading-relaxed space-y-6"
                                style={{
                                    fontSize: '18px',
                                    lineHeight: '1.7',
                                }}
                            >
                                {/* Split content by paragraphs and render */}
                                {berita.isi_lengkap.split('\n').map((paragraph: string, index: number) => {
                                    if (paragraph.trim() === '') return null;
                                    return (
                                        <p key={index} className="mb-6">
                                            {paragraph.trim()}
                                        </p>
                                    );
                                })}
                            </div>
                        </div>

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
        .eq('status', 'published')
        .single();

    if (!berita) {
        return {
            title: 'Berita Tidak Ditemukan - TK ABA Mertosanan',
        };
    }

    return {
        title: `${berita.judul} - TK ABA Mertosanan`,
        description: berita.ringkasan || `Baca berita terbaru: ${berita.judul}`,
        openGraph: {
            title: berita.judul,
            description: berita.ringkasan || `Baca berita terbaru: ${berita.judul}`,
            images: berita.image_url ? [berita.image_url] : undefined,
        },
    };
}
