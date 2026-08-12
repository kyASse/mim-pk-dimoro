"use client";

import { motion, useReducedMotion } from "motion/react";
import {
    Building2,
    Calendar,
    Award,
    School2,
    MapPin,
    Hash
} from "lucide-react";
import { SCHOOL_NAME } from "@/lib/school-config";

const identityData = [
    { label: "Tanggal Berdiri", value: "1 September 1967", icon: Calendar },
    { label: "Status Sekolah", value: "Swasta", icon: School2 },
    { label: "Akreditasi", value: "A", icon: Award },
    { label: "Bentuk Pendidikan", value: "Madrasah Ibtidaiyah", icon: Building2 },
    { label: "Alamat", value: "Sudimoro, RT.003/RW.X", icon: MapPin },
    { label: "Desa/Kelurahan", value: "Parangjoro", icon: MapPin },
    { label: "Kecamatan", value: "Grogol", icon: MapPin },
    { label: "Kabupaten", value: "Sukoharjo", icon: MapPin },
    { label: "Provinsi", value: "Jawa Tengah", icon: MapPin },
];

export default function SchoolIdentity() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="py-16 md:py-24 bg-muted/20 border-y border-border/40 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                        Identitas Resmi {SCHOOL_NAME}
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        Data legalitas dan administrasi resmi sekolah yang terdaftar di Kementerian Agama.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Featured Bento Card 1: NPSN (Amber Gold theme) */}
                    <motion.div
                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-6 rounded-3xl bg-amber-gold-surface border border-amber-gold/30 shadow-sm flex flex-col justify-between"
                    >
                        <Hash className="w-8 h-8 text-amber-gold mb-4" />
                        <div>
                            <p className="text-xs font-bold text-amber-800 dark:text-amber-200 uppercase tracking-wider">NPSN</p>
                            <p className="text-2xl font-black text-foreground mt-1">60711720</p>
                        </div>
                    </motion.div>

                    {/* Featured Bento Card 2: NSM (Sky Blue theme) */}
                    <motion.div
                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 }}
                        className="p-6 rounded-3xl bg-sky-500/5 border border-sky-500/20 shadow-sm flex flex-col justify-between md:col-span-2"
                    >
                        <Hash className="w-8 h-8 text-sky-500 mb-4" />
                        <div>
                            <p className="text-xs font-bold text-sky-800 dark:text-sky-200 uppercase tracking-wider">NSM</p>
                            <p className="text-2xl font-black text-foreground mt-1">111233110050</p>
                        </div>
                    </motion.div>

                    {/* Supporting Info Grid within Bento */}
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {identityData.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    viewport={{ once: true }}
                                    className="flex items-start space-x-3.5 p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/30 transition-all hover:shadow-xs"
                                >
                                    <div className="bg-primary/10 text-primary p-2 rounded-xl shrink-0 mt-0.5">
                                        <IconComponent className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-muted-foreground font-semibold">{item.label}</p>
                                        <p className="font-bold text-foreground text-sm mt-0.5">{item.value}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
