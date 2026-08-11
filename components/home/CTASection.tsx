"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { UserPlus, Phone } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { SCHOOL_NAME } from "@/lib/school-config";

export default function CTASection() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="py-20 bg-background overflow-hidden">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="relative rounded-3xl bg-gradient-to-br from-primary via-emerald-700 to-emerald-900 text-primary-foreground p-8 sm:p-12 lg:p-16 text-center shadow-2xl overflow-hidden"
                >
                    {/* Background Light Pattern */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/20 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-4 inline-block tracking-wide">
                            Penerimaan Peserta Didik Baru (PPDB)
                        </span>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
                            Mari Bergabung Bersama {SCHOOL_NAME}
                        </h2>

                        <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-8 max-w-2xl mx-auto font-normal">
                            Daftarkan putra-putri Anda untuk mendapatkan pendidikan dasar terpadu yang memadukan ilmu umum dan nilai keislaman berakhlak mulia.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link href="/pendaftaran" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto bg-white text-emerald-900 hover:bg-white/90 font-bold rounded-full h-12 px-8 shadow-lg">
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Daftar PPDB Sekarang
                                </Button>
                            </Link>
                            
                            <Link href="/kontak" className="w-full sm:w-auto">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 font-semibold rounded-full h-12 px-8">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Hubungi Kami
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}