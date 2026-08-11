"use client";

import { motion, useReducedMotion } from "motion/react";
import { BookOpen, BookMarked, Brain, Activity, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function FeaturesSection() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                
                {/* Section Header */}
                <div className="max-w-3xl mx-auto text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                        Keunggulan Pendidikan MIM Dimoro
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                        Pendekatan holistik yang mengintegrasikan kecerdasan intelektual, emosional, dan spiritual anak.
                    </p>
                </div>

                {/* Asymmetric Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
                    
                    {/* Cell 1: Large Featured Hero Tile (col-span-12 lg:col-span-7) */}
                    <motion.div
                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-7 p-8 rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-background border border-primary/20 shadow-sm flex flex-col justify-between relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/20 transition-colors" />
                        
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-6 shadow-md shadow-primary/20">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 inline-block">
                                Fondasi Utama
                            </span>
                            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                                Kurikulum Terpadu Islami
                            </h3>
                            <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
                                Menggabungkan secara harmonis Kurikulum Merdeka Nasional dengan Kurikulum Al-Islam dan Kemuhammadiyahan untuk membentuk pemikiran kritis berwawasan Islami.
                            </p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">Standardized Excellence</span>
                            <Link href="/program" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                                <span>Lihat Kurikulum</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Cell 2: Program Tahfidz (col-span-12 md:col-span-6 lg:col-span-5) */}
                    <motion.div
                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-5 p-8 rounded-3xl bg-card border border-border/60 shadow-sm flex flex-col justify-between hover:border-primary/40 transition-colors"
                    >
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                                <BookMarked className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">
                                Program Tahfidz Al-Qur'an
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Pembiasaan bimbingan hafalan Juz Amma dan surah pilihan dengan metode talaqqi yang ramah anak.
                            </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                            <span>Target Bimbingan Harian</span>
                            <span className="font-semibold text-foreground">Juz 30 & Surah Pilihan</span>
                        </div>
                    </motion.div>

                    {/* Cell 3: Pembinaan Karakter (col-span-12 md:col-span-6 lg:col-span-5) */}
                    <motion.div
                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-5 p-8 rounded-3xl bg-card border border-border/60 shadow-sm flex flex-col justify-between hover:border-primary/40 transition-colors"
                    >
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-6">
                                <Brain className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">
                                Pembinaan Pembentukan Karakter
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Pembiasaan shalat dhuha, dzikir harian, dan pembentukan karakter disiplin, jujur, serta mandiri.
                            </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                            <span>Pembiasaan Harian</span>
                            <span className="font-semibold text-foreground">Akhlakul Karimah</span>
                        </div>
                    </motion.div>

                    {/* Cell 4: Ekstrakurikuler Variatif (col-span-12 lg:col-span-7) */}
                    <motion.div
                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="lg:col-span-7 p-8 rounded-3xl bg-card border border-border/60 shadow-sm flex flex-col justify-between hover:border-primary/40 transition-colors"
                    >
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
                                <Activity className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">
                                Ekstrakurikuler Variatif
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Pengembangan minat bakat melalui kegiatan Tapak Suci, Hizbul Wathan (HW), Seni Al-Qur'an, Pramuka, Olahraga, dan Seni Kaligrafi.
                            </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                            <span>Pilihan Ekskul</span>
                            <span className="font-semibold text-foreground">10+ Kegiatan Talent</span>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}