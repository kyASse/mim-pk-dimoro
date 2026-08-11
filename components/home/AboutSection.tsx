"use client";

import Image from "next/image";
import Link from "next/link";
import { Award, Heart, Users, ChevronRight, Quote } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { SCHOOL_NAME } from "@/lib/school-config";
import { HEADMASTER_WELCOME } from "@/lib/school-data";

export default function AboutSection() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="py-20 bg-background overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left: Text Content & Welcome */}
                    <motion.div 
                        initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-6"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20">
                            <Quote className="h-3.5 w-3.5" />
                            <span>Sambutan Kepala Madrasah</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4 leading-tight">
                            Selamat Datang di {SCHOOL_NAME}
                        </h2>
                        
                        <p className="text-base text-muted-foreground leading-relaxed mb-6 font-medium italic border-l-4 border-primary pl-4 py-1">
                            {HEADMASTER_WELCOME.summary}
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shrink-0 mt-1">
                                    <Award className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base text-foreground mb-1">
                                        Pendidikan Berkualitas
                                    </h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                        Kurikulum terintegrasi antara pendidikan nasional dan ilmu keislaman secara seimbang.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1">
                                    <Heart className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base text-foreground mb-1">
                                        Pembentukan Karakter
                                    </h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                        Menanamkan kebiasaan ibadah harian dan akhlakul karimah sejak dini.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0 mt-1">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base text-foreground mb-1">
                                        Pendidik Berdedikasi
                                    </h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                        Guru yang berpengalaman dalam membimbing dan mengayomi potensi setiap siswa.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Link 
                                href="/tentang-kami" 
                                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 group transition-colors"
                            >
                                <span>Baca Sambutan Selengkapnya</span>
                                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right: Visual Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-6 relative"
                    >
                        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-border/50 bg-card">
                            <div className="relative aspect-[4/3] w-full overflow-hidden">
                                <Image
                                    src="/images/mim_tahfidz_learning.jpg"
                                    alt={`Kegiatan pembelajaran siswa di ${SCHOOL_NAME}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                            <div className="p-4 bg-card text-card-foreground border-t border-border/40 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-sm text-foreground">{HEADMASTER_WELCOME.name}</h3>
                                    <p className="text-xs text-muted-foreground">{HEADMASTER_WELCOME.title}</p>
                                </div>
                                <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                                    Kepala Madrasah
                                </span>
                            </div>
                        </div>

                        {/* Secondary Overlaid Accent Card */}
                        <div className="hidden sm:block absolute -bottom-6 -right-6 p-5 bg-card border border-border/80 rounded-2xl shadow-xl max-w-xs z-10">
                            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Lingkungan Kondusif</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Ruang kelas ramah anak dengan suasana belajar yang aman, nyaman, dan menyenangkan.
                            </p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
