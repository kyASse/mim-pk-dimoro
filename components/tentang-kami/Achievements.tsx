"use client";

import { motion, useReducedMotion } from "motion/react";
import { Award, Trophy, Medal, Star, Sparkles, Crown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type Prestasi = {
    nama_prestasi: string;
    tingkat: string;
    tahun: number;
    deskripsi?: string;
};

function getTingkatStyle(tingkat: string, index: number) {
    const t = (tingkat || "").toLowerCase();
    if (t.includes("nasional") || t.includes("internasional")) {
        return {
            badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
            iconClass: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/25",
            icon: Trophy,
            cardBorder: "border-amber-500/25 hover:border-amber-500/50",
            glow: "from-amber-500/10 via-amber-500/5 to-transparent",
        };
    }
    if (t.includes("provinsi")) {
        return {
            badgeClass: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30",
            iconClass: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/25",
            icon: Medal,
            cardBorder: "border-sky-500/25 hover:border-sky-500/50",
            glow: "from-sky-500/10 via-sky-500/5 to-transparent",
        };
    }
    if (t.includes("kabupaten") || t.includes("kota")) {
        return {
            badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
            iconClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
            icon: Award,
            cardBorder: "border-emerald-500/25 hover:border-emerald-500/50",
            glow: "from-emerald-500/10 via-emerald-500/5 to-transparent",
        };
    }

    // Fallback rotation based on index
    const fallbackIcons = [Award, Trophy, Medal, Star];
    const FallbackIcon = fallbackIcons[index % fallbackIcons.length];

    return {
        badgeClass: "bg-primary/10 text-primary border-primary/25",
        iconClass: "text-primary bg-primary/10 border-primary/20",
        icon: FallbackIcon,
        cardBorder: "border-border/60 hover:border-primary/40",
        glow: "from-primary/10 via-primary/5 to-transparent",
    };
}

export default function Achievements() {
    const [prestasi, setPrestasi] = useState<Prestasi[]>([]);
    const [loading, setLoading] = useState(true);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        const supabase = createClient();
        const fetchData = async () => {
            const { data, error } = await supabase
                .from("prestasi")
                .select("*");

            if (error) {
                console.error("Error fetching prestasi data:", error);
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

    const sortedYears = Object.keys(groupedPrestasi)
        .map(Number)
        .sort((a, b) => b - a);

    return (
        <section className="py-16 md:py-24 bg-background relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-semibold border border-amber-500/20">
                        <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>Hall of Fame & Prestasi</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                        <span className="sr-only">Rekam Jejak Prestasi</span>
                        Prestasi Madrasah
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        Capaian dan kebanggaan siswa-siswi MIM PK Dimoro dalam berbagai kompetisi akademik dan non-akademik.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto space-y-12">
                    {loading ? (
                        <div className="space-y-6 animate-pulse" data-testid="achievements-skeleton">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-muted rounded-xl" />
                                <div className="h-7 w-36 bg-muted rounded-lg" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {[...Array(3)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-4 bg-card border border-border/60 rounded-3xl p-6 shadow-xs"
                                    >
                                        <div className="bg-muted w-12 h-12 rounded-2xl shrink-0 mt-0.5" />
                                        <div className="flex-1 space-y-2.5">
                                            <div className="h-5 bg-muted rounded-md w-3/4" />
                                            <div className="h-4 bg-muted rounded-md w-1/2" />
                                            <div className="h-3 bg-muted rounded-md w-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : sortedYears.length === 0 ? (
                        <div className="text-center py-14 bg-card/60 border border-border/60 rounded-3xl p-8 max-w-xl mx-auto shadow-xs">
                            <div className="w-14 h-14 mx-auto rounded-2xl bg-muted/60 flex items-center justify-center mb-4 text-muted-foreground">
                                <Trophy className="w-7 h-7" />
                            </div>
                            <p className="text-base font-semibold text-foreground mb-1">
                                Belum ada data prestasi yang ditampilkan.
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Data prestasi madrasah akan diperbarui secara berkala.
                            </p>
                        </div>
                    ) : (
                        sortedYears.map((tahun) => {
                            const prestasiList = groupedPrestasi[tahun];
                            return (
                                <div key={tahun} className="space-y-5">
                                    {/* Year Timeline Shelf Header */}
                                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                                        <h3 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2.5 tracking-tight">
                                            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                                <Crown className="w-5 h-5" />
                                            </div>
                                            <span>Tahun {tahun}</span>
                                        </h3>
                                        <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                            {prestasiList.length} Prestasi
                                        </span>
                                    </div>

                                    {/* Trophy Cards Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {prestasiList.map((item, index) => {
                                            const style = getTingkatStyle(item.tingkat, index);
                                            const IconComponent = style.icon;

                                            return (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                                    viewport={{ once: true }}
                                                    className={`group relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-card border shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between ${style.cardBorder}`}
                                                >
                                                    {/* Top Ambient Glow */}
                                                    <div
                                                        className={`absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-bl ${style.glow} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                                                    />

                                                    <div className="relative z-10 flex items-start gap-4">
                                                        <div
                                                            className={`p-3 rounded-2xl shrink-0 mt-0.5 border shadow-2xs transition-transform duration-300 group-hover:scale-110 ${style.iconClass}`}
                                                        >
                                                            <IconComponent className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="mb-2">
                                                                <span
                                                                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${style.badgeClass}`}
                                                                >
                                                                    <Sparkles className="w-3 h-3" />
                                                                    Tingkat {item.tingkat}
                                                                </span>
                                                            </div>
                                                            <h4 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                                                                {item.nama_prestasi}
                                                            </h4>
                                                            {item.deskripsi && (
                                                                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                                                                    {item.deskripsi}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
}