"use client";

import { motion, useReducedMotion } from "motion/react";
import {
    Building2,
    Calendar,
    Award,
    School2,
    MapPin,
    Hash,
    ShieldCheck
} from "lucide-react";

import { SCHOOL_NAME } from "@/lib/school-config";

const identityData = [
    { label: "NPSN", value: "60711720" },
    { label: "NSM", value: "111233110050" },
    { label: "Tanggal Berdiri", value: "1 September 1967" },
    { label: "Status Sekolah", value: "Swasta" },
    { label: "Akreditasi", value: "A" },
    { label: "Bentuk Pendidikan", value: "Madrasah Ibtidaiyah" },
    { label: "Alamat", value: "Sudimoro, RT.003/RW.X" },
    { label: "Desa/Kelurahan", value: "Parangjoro" },
    { label: "Kecamatan", value: "Grogol" },
    { label: "Kabupaten", value: "Sukoharjo" },
    { label: "Provinsi", value: "Jawa Tengah" },
];

export default function SchoolIdentity() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="py-16 md:py-24 bg-muted/20 border-y border-border/40 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                        <span className="sr-only">Dokumen Legalisasi</span>
                        Identitas Resmi {SCHOOL_NAME}
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        Data legalitas dan administrasi resmi sekolah yang terdaftar di Kementerian Agama.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto bg-card border border-border/60 rounded-3xl shadow-sm p-6 sm:p-8 md:p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {identityData.map((item, index) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                viewport={{ once: true }}
                                className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-muted/20 border border-border/40 hover:border-primary/30 transition-colors"
                            >
                                <div className="bg-primary/10 text-primary p-2.5 rounded-xl shrink-0">
                                    {item.label === "NPSN" && <Hash className="w-5 h-5"/>}
                                    {item.label === "NSM" && <Hash className="w-5 h-5"/>}
                                    {item.label === "Tanggal Berdiri" && <Calendar className="w-5 h-5"/>}
                                    {item.label === "Status Sekolah" && <School2 className="w-5 h-5"/>}
                                    {item.label === "Akreditasi" && <Award className="w-5 h-5"/>}
                                    {item.label === "Bentuk Pendidikan" && <Building2 className="w-5 h-5"/>}
                                    {["Alamat", "Desa/Kelurahan", "Kecamatan", "Kabupaten", "Provinsi"].includes(item.label) && <MapPin className="w-5 h-5"/>}
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
                                    <p className="font-bold text-foreground text-sm sm:text-base">{item.value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
