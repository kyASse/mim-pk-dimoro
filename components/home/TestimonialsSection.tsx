import { createClient } from "@/lib/supabase/server"
import TestimonialCard from "./TestimonialCard";

async function fetchData() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('testimoni')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching testimonial data:', error);
        return [];
    }

    return data;
}


export default async function TestimonialsSection() {
    const testimonials = await fetchData();
    return (
        <section className="py-16 bg-highlight/20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Apa Kata Orang Tua</h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Dengarkan pengalaman para orang tua yang telah mempercayakan pendidikan anak mereka pada TK ABA Mertosanan
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map(testimonial => (
                        <TestimonialCard 
                            key={testimonial.id}
                            name={testimonial.nama_orang_tua}
                            role={testimonial.status_orang_tua}
                            testimonial={testimonial.isi_testimoni}
                            avatarUrl={testimonial.avatar_url}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}