"use client";

import Image from "next/image";
import Link from "next/link";
import { Award, Heart, Users, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { SCHOOL_NAME, SCHOOL_ABOUT_DESCRIPTION } from "@/lib/school-config";

export default function AboutSection() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="py-20 bg-background overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left: Text Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-6"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-6 leading-tight">
                            Selamat Datang di {SCHOOL_NAME}
                        </h2>
                        
                        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
                            {SCHOOL_ABOUT_DESCRIPTION}
                        </p>

                        <div className="space-y-6 mb-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0 mt-1">
                                    <Award className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base text-foreground mb-1">
                                        Pendidikan Berkualitas
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Kurikulum terintegrasi antara pendidikan nasional dan ilmu keislaman secara seimbang.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1">
                                    <Heart className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base text-foreground mb-1">
                                        Pembentukan Karakter
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Menanamkan kebiasaan ibadah harian dan akhlakul karimah sejak dini.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0 mt-1">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base text-foreground mb-1">
                                        Pendidik Berdedikasi
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Guru yang berpengalaman dalam membimbing dan mengayomi potensi setiap siswa.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Link href="/tentang-kami" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 group transition-colors">
                                <span>Pelajari Selengkapnya Tentang Kami</span>
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
                        </div>

                        {/* Secondary Overlaid Accent Card */}
                        <div className="hidden sm:block absolute -bottom-6 -right-6 p-5 bg-card border border-border/80 rounded-2xl shadow-xl max-w-xs">
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
