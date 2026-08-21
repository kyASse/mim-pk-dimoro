"use client";

import { motion, useReducedMotion } from "motion/react";
import {
    Building2,
    Calendar,
    Award,
    School,
    MapPin,
    Hash,
    ShieldCheck,
    CheckCircle2,
    Navigation,
    Compass,
    Map,
    Globe,
    FileCheck2
} from "lucide-react";
import { SCHOOL_NAME } from "@/lib/school-config";

const administrativeData = [
    {
        label: "Tanggal Berdiri",
        value: "1 September 1967",
        icon: Calendar,
        color: "emerald",
        badge: "Sejarah",
    },
    {
        label: "Status Sekolah",
        value: "Swasta",
        icon: School,
        color: "sky",
        badge: "Status",
    },
    {
        label: "Bentuk Pendidikan",
        value: "Madrasah Ibtidaiyah",
        icon: Building2,
        color: "amber",
        badge: "Jenjang",
    },
    {
        label: "Akreditasi",
        value: "A",
        icon: Award,
        color: "emerald",
        badge: "BAN-S/M",
    },
    {
        label: "Alamat",
        value: "Sudimoro, RT.003/RW.X",
        icon: MapPin,
        color: "rose",
        badge: "Lokasi",
    },
    {
        label: "Desa/Kelurahan",
        value: "Parangjoro",
        icon: Navigation,
        color: "sky",
        badge: "Wilayah",
    },
    {
        label: "Kecamatan",
        value: "Grogol",
        icon: Compass,
        color: "amber",
        badge: "Kecamatan",
    },
    {
        label: "Kabupaten",
        value: "Sukoharjo",
        icon: Map,
        color: "emerald",
        badge: "Kabupaten",
    },
    {
        label: "Provinsi",
        value: "Jawa Tengah",
        icon: Globe,
        color: "purple",
        badge: "Provinsi",
    },
];

const colorVariantStyles = {
    emerald: {
        iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    },
    sky: {
        iconBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
        badge: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20",
    },
    amber: {
        iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    },
    rose: {
        iconBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        badge: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
    },
    purple: {
        iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        badge: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
    },
};

export default function SchoolIdentity() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="py-16 md:py-24 bg-muted/20 border-y border-border/40 overflow-hidden relative">
            {/* Ambient background decoration */}
            <div className="absolute inset-0 bg-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold border border-primary/20">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Legalitas & Administrasi</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                        Identitas Resmi {SCHOOL_NAME}
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        Data legalitas dan administrasi resmi sekolah yang terdaftar di Kementerian Agama.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto space-y-6">
                    {/* Primary Legal Credential Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Bento Card 1: NPSN */}
                        <motion.div
                            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                            className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-amber-500/10 via-card to-card border border-amber-500/30 shadow-xs hover:shadow-md hover:border-amber-500/50 transition-all flex flex-col justify-between group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                                    <Hash className="w-6 h-6" />
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                    Kemendikbudristek
                                </span>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Nomor Pokok Sekolah Nasional
                                </p>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">NPSN:</span>
                                    <p className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-mono">
                                        60711720
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Bento Card 2: NSM */}
                        <motion.div
                            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.05 }}
                            className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-sky-500/10 via-card to-card border border-sky-500/30 shadow-xs hover:shadow-md hover:border-sky-500/50 transition-all flex flex-col justify-between group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 group-hover:scale-105 transition-transform">
                                    <FileCheck2 className="w-6 h-6" />
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                                    Kementerian Agama
                                </span>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Nomor Statistik Madrasah
                                </p>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400">NSM:</span>
                                    <p className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-mono">
                                        111233110050
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Bento Card 3: Akreditasi A */}
                        <motion.div
                            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-primary/10 via-card to-card border border-primary/30 shadow-xs hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                                    <Award className="w-6 h-6" />
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                    BAN-S/M
                                </span>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Peringkat Akreditasi
                                </p>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <p className="text-2xl sm:text-3xl font-black tracking-tight text-primary">
                                        Akreditasi A
                                    </p>
                                    <span className="text-xs font-semibold text-muted-foreground">(Unggul)</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Administrative & Location Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                        {administrativeData.map((item, index) => {
                            const IconComponent = item.icon;
                            const style = colorVariantStyles[item.color as keyof typeof colorVariantStyles] || colorVariantStyles.emerald;

                            return (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.03 }}
                                    viewport={{ once: true }}
                                    className="flex items-start justify-between p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-xs transition-all group"
                                >
                                    <div className="flex items-start space-x-3.5 min-w-0">
                                        <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 border transition-transform group-hover:scale-105 ${style.iconBg}`}>
                                            <IconComponent className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
                                            <p className="font-bold text-foreground text-sm mt-0.5 truncate">{item.value}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0 hidden sm:inline-block ${style.badge}`}>
                                        {item.badge}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
