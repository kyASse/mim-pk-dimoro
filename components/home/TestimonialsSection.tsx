import { createClient } from "@/lib/supabase/server";
import TestimonialCard from "./TestimonialCard";
import { SCHOOL_NAME } from "@/lib/school-config";

type TestimonialItem = {
    id: string;
    nama_orang_tua: string;
    status_orang_tua: string;
    isi_testimoni: string;
    avatar_url?: string;
    created_at: string;
};

async function fetchData(): Promise<TestimonialItem[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('testimoni')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching testimonial data:', error);
        return [];
    }

    return data || [];
}

export default async function TestimonialsSection() {
    const testimonials = await fetchData();

    return (
        <section className="py-20 bg-muted/30 border-y border-border/40">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                        Testimoni Orang Tua Siswa
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                        Kepercayaan dan pengalaman apresiasi para orang tua murid terhadap perkembangan bimbingan pendidikan di {SCHOOL_NAME}.
                    </p>
                </div>

                {testimonials.length === 0 ? (
                    <div className="text-center py-16 bg-card rounded-3xl border border-dashed border-border/60">
                        <p className="text-muted-foreground text-sm">Belum ada testimoni yang ditampilkan saat ini.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((t, index) => (
                            <TestimonialCard 
                                key={t.id}
                                name={t.nama_orang_tua}
                                role={t.status_orang_tua}
                                testimonial={t.isi_testimoni}
                                avatarUrl={t.avatar_url}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}