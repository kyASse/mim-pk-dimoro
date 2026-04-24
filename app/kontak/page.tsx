import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
    Phone,
    Mail,
    MapPin,
    Clock,
    MessageSquare
} from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import ContactForm from '@/components/kontak/ContactForm';
import { createClient } from "@/lib/supabase/server";

// Function to validate trusted domains for Google Maps embed
function isTrustedDomain(url: string | null | undefined): boolean {
    if (!url) return false;
    
    const trustedDomains = [
        'maps.google.com',
        'www.google.com',
        'google.com'
    ];
    
    try {
        const urlObj = new URL(url);
        return trustedDomains.some(domain => urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain));
    } catch {
        return false;
    }
}

export default async function ContactPage() {
    const supabase = await createClient();

    // Fetch kontak sekolah data from Supabase
    const { data: kontakData, error } = await supabase
        .from('kontak_sekolah')
        .select('alamat, whatsapp, email_utama, email_admin, jam_operasional, maps_embed_url')
        .single();

    // Gunakan data dari database atau fallback ke default
    const kontak = kontakData;

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error("Error fetching kontak sekolah:", error);
    }
    return (
        <div className="min-h-screen">
            <PageHeader
                title="Kontak Kami"
                description="Hubungi kami untuk informasi lebih lanjut"
                background="bg-primary/20"
            />

            {/* Contact Information & Form */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Contact Information */}
                        <div className="bg-white rounded-xl shadow-md p-6 h-full">
                            <h2 className="text-2xl font-bold mb-6">Informasi Kontak</h2>
                            
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="bg-primary/20 p-2 rounded-full mr-4 mt-1">
                                        <MapPin className="h-6 w-6 text-primary-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Alamat</h3>
                                        <p className="text-muted-foreground whitespace-pre-line">
                                            {kontak?.alamat || 'Alamat tidak tersedia'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="bg-highlight/20 p-2 rounded-full mr-4 mt-1">
                                        <Phone className="h-6 w-6 text-highlight-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Telepon</h3>
                                        <p className="text-muted-foreground">{kontak?.whatsapp || 'Nomor tidak tersedia'}</p>
                                        <p className="text-muted-foreground">{kontak?.whatsapp || 'Nomor tidak tersedia'} (WhatsApp)</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="bg-accent/20 p-2 rounded-full mr-4 mt-1">
                                        <Mail className="h-6 w-6 text-accent-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Email</h3>
                                        <p className="text-muted-foreground">{kontak?.email_utama || 'Email tidak tersedia'}</p>
                                        <p className="text-muted-foreground">{kontak?.email_admin || 'Email admin tidak tersedia'}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="bg-attention/20 p-2 rounded-full mr-4 mt-1">
                                        <Clock className="h-6 w-6 text-attention-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Jam Operasional</h3>
                                        <p className="text-muted-foreground whitespace-pre-line">
                                        {kontak?.jam_operasional || 'Jam operasional tidak tersedia'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Contact Form */}
                        <ContactForm />
                    </div>
                </div>
            </section>

            {/* Google Maps */}
            <section className="py-10">
                <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-6 text-center">Lokasi Kami</h2>
                <div className="bg-white rounded-xl shadow-md p-2 h-[400px]">
                    <iframe
                        src={isTrustedDomain(kontak?.maps_embed_url) ? kontak?.maps_embed_url : undefined}
                        width="100%"
                        height="100%"
                        style={{ border: 0, borderRadius: '0.75rem' }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Lokasi TK ABA Mertosanan"
                    />
                </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-accent/10">
                <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-6 text-center">Pertanyaan Umum</h2>
                
                <div className="max-w-3xl mx-auto space-y-4">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-2">Bagaimana cara mendaftarkan anak saya di TK ABA Mertosanan?</h3>
                    <p className="text-muted-foreground">
                        Anda dapat mendaftarkan anak melalui formulir online di website ini atau datang langsung ke sekolah 
                        dengan membawa dokumen yang diperlukan seperti fotokopi KK, akte kelahiran, dan pas foto.
                    </p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-2">Apa saja program yang ditawarkan di TK ABA Mertosanan?</h3>
                    <p className="text-muted-foreground">
                        Kami menawarkan program Kelompok Bermain (3-4 tahun), TK A (4-5 tahun), dan TK B (5-6 tahun) 
                        dengan kurikulum yang terintegrasi nilai-nilai islami dan fokus pada pengembangan motorik dan intelektual anak.
                    </p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-2">Berapa biaya pendidikan di TK ABA Mertosanan?</h3>
                    <p className="text-muted-foreground">
                        Biaya pendidikan bervariasi tergantung program yang dipilih. Silakan kunjungi halaman Pendaftaran 
                        untuk informasi biaya terbaru atau hubungi kami untuk konsultasi lebih lanjut.
                    </p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-2">Apakah ada ekstrakurikuler di TK ABA Mertosanan?</h3>
                    <p className="text-muted-foreground">
                        Ya, kami menyediakan berbagai kegiatan ekstrakurikuler seperti menari tradisional, melukis & kerajinan, 
                        olahraga mini, dan little chef untuk mengembangkan minat dan bakat anak.
                    </p>
                    </div>
                </div>
                
                <div className="text-center mt-8">
                    <Link href="/kontak">
                    <Button variant="outline" className="rounded-full border-accent text-accent-foreground hover:bg-accent/20">
                        <MessageSquare className="mr-2 h-5 w-5" /> Pertanyaan Lainnya? Hubungi Kami
                    </Button>
                    </Link>
                </div>
                </div>
            </section>
        </div>
    );
}