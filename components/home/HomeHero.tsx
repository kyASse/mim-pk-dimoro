"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button"; 
import { ChevronRight, UserPlus, Sparkles, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { SCHOOL_NAME, SCHOOL_TAGLINE } from "@/lib/school-config";

export default function HomeHero() {
    const shouldReduceMotion = useReducedMotion();

    const fadeInVariants = {
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
        visible: (custom: number) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, delay: custom * 0.15, ease: [0.16, 1, 0.3, 1] as const }
        })
    };

    return (
        <section className="relative min-h-[100dvh] pt-20 md:pt-24 pb-16 flex items-center overflow-hidden bg-background">
            {/* Ambient Background Accents */}
            <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 left-0 -z-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Column: Value Prop & CTAs */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        
                        {/* 1. Eyebrow Badge */}
                        <motion.div
                            custom={0}
                            initial="hidden"
                            animate="visible"
                            variants={fadeInVariants}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide w-max mb-6 border border-primary/20"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Madrasah Ibtidaiyah Program Khusus</span>
                        </motion.div>

                        {/* 2. Headline */}
                        <motion.h1
                            custom={1}
                            initial="hidden"
                            animate="visible"
                            variants={fadeInVariants}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]"
                        >
                            {SCHOOL_NAME}
                        </motion.h1>

                        {/* 3. Subtext (Max 20 words) */}
                        <motion.p
                            custom={2}
                            initial="hidden"
                            animate="visible"
                            variants={fadeInVariants}
                            className="text-lg md:text-xl text-muted-foreground font-medium mb-8 max-w-[50ch] leading-relaxed"
                        >
                            {SCHOOL_TAGLINE}
                        </motion.p>

                        {/* 4. Action CTAs */}
                        <motion.div
                            custom={3}
                            initial="hidden"
                            animate="visible"
                            variants={fadeInVariants}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link href="/pendaftaran" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full shadow-lg shadow-primary/25 h-12 px-7">
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Daftar PPDB
                                </Button>
                            </Link>
                            <Link href="/program" className="w-full sm:w-auto">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto border-border hover:bg-muted font-semibold rounded-full h-12 px-7">
                                    <ChevronRight className="w-4 h-4 mr-2" />
                                    Program Unggulan
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Trust Highlights */}
                        <motion.div
                            custom={4}
                            initial="hidden"
                            animate="visible"
                            variants={fadeInVariants}
                            className="mt-10 pt-6 border-t border-border/60 flex items-center gap-6 text-xs text-muted-foreground font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                <span>Akreditasi Unggul</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <span>Kurikulum Terpadu Islami</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Hero Visual Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
                        className="lg:col-span-5 relative"
                    >
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50 bg-card">
                            <div className="relative aspect-[4/3] w-full overflow-hidden">
                                <Image
                                    src="/images/mim_hero_main.jpg"
                                    alt={`Gedung dan kegiatan di ${SCHOOL_NAME}`}
                                    fill
                                    priority
                                    className="object-cover transition-transform duration-700 hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            </div>
                            <div className="absolute bottom-0 inset-x-0 p-6 text-white bg-gradient-to-t from-black/80 to-transparent">
                                <span className="px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-semibold rounded-full mb-2 inline-block">
                                    Pendidikan Islam Modern
                                </span>
                                <h2 className="text-xl font-bold">MI Muhammadiyah Dimoro</h2>
                                <p className="text-sm text-white/80 mt-1">Membentuk karakter Islami dan prestasi unggul.</p>
                            </div>
                        </div>

                        {/* Floating Decorative Card */}
                        <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-card border border-border/80 p-4 rounded-2xl shadow-xl items-center gap-3 max-w-xs z-10">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                                59
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">Pengalaman</p>
                                <p className="text-sm font-bold text-foreground">Berdiri Sejak 1967</p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
