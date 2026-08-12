"use client";

import { motion, useReducedMotion } from "motion/react";
import { Award, Trophy, Medal, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type Prestasi = {
    nama_prestasi: string;
    tingkat: string;
    tahun: number;
    deskripsi: string;
};

export default function Achievements() {
    const [prestasi, setPrestasi] = useState<Prestasi[]>([]);
    const [loading, setLoading] = useState(true);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        const supabase = createClient();
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('prestasi')
                .select('*');

            if (error) {
                console.error('Error fetching prestasi data:', error);
                setLoading(false);
                return;
            }

            if (data) {
                setPrestasi(data);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const groupedPrestasi = prestasi.reduce<Record<number, Prestasi[]>>((acc, curr) => {
        if (!acc[curr.tahun]) {
            acc[curr.tahun] = [];
        }
        acc[curr.tahun].push(curr);
        return acc;
    }, {});

    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                        <span className="sr-only">Rekam Jejak Prestasi</span>
                        Prestasi Madrasah
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        Capaian dan kebanggaan siswa-siswi MIM PK Dimoro dalam berbagai kompetisi akademik dan non-akademik.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-10">
                    {loading ? (
                        <div className="space-y-4 animate-pulse" data-testid="achievements-skeleton">
                            <div className="h-7 w-32 bg-muted rounded-md" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(3)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-3.5 bg-card border border-border/60 rounded-2xl p-5 shadow-sm"
                                    >
                                        <div className="bg-muted w-10 h-10 rounded-xl shrink-0 mt-0.5" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-muted rounded w-3/4" />
                                            <div className="h-3 bg-muted rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : Object.keys(groupedPrestasi).length === 0 ? (
                        <div className="text-center py-10 bg-card border border-border/50 rounded-3xl p-6 text-muted-foreground text-sm">
                            Belum ada data prestasi yang ditampilkan.
                        </div>
                    ) : (
                        Object.entries(groupedPrestasi).map(([tahun, prestasiList]) => (
                            <div key={tahun} className="space-y-4">
                                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-primary" />
                                    <span>Tahun {tahun}</span>
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {prestasiList.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                            viewport={{ once: true }}
                                            className="flex items-start space-x-3.5 bg-card border border-border/60 rounded-2xl p-5 shadow-sm hover:border-primary/40 transition-colors"
                                        >
                                            <div className="bg-primary/10 text-primary p-2.5 rounded-xl shrink-0 mt-0.5">
                                                {index % 4 === 0 && <Award className="w-5 h-5" />}
                                                {index % 4 === 1 && <Trophy className="w-5 h-5" />}
                                                {index % 4 === 2 && <Medal className="w-5 h-5" />}
                                                {index % 4 === 3 && <Star className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h4 className="text-base font-bold text-foreground mb-1 leading-snug">
                                                    {item.nama_prestasi}
                                                </h4>
                                                <span className="inline-block text-xs font-semibold text-amber-gold bg-amber-gold-surface border border-amber-gold/30 px-2.5 py-0.5 rounded-full">
                                                    Tingkat {item.tingkat}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}