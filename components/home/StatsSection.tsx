"use client";

import { motion, useReducedMotion } from "motion/react";
import { Users, GraduationCap, Award, Palette } from "lucide-react";

// Official stats from school records
const stats = [
    {
        title: "Siswa Aktif",
        value: "201",
        icon: <Users className="h-5 w-5 text-primary" />,
        description: "104 Laki-laki dan 97 Perempuan aktif.",
        badge: "Terverifikasi"
    },
    {
        title: "Guru & Staff",
        value: "18",
        icon: <GraduationCap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
        description: "Tenaga pendidik profesional dan berdedikasi.",
        badge: "Pengajar"
    },
    {
        title: "Pengalaman",
        value: "59 Tahun",
        icon: <Award className="h-5 w-5 text-sky-600 dark:text-sky-400" />,
        description: "Berdedikasi melayani sejak 1 September 1967.",
        badge: "Sejak 1967"
    },
    {
        title: "Ekstrakurikuler",
        value: "10+",
        icon: <Palette className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
        description: "Wadah pengembangan bakat dan minat.",
        badge: "Pengembangan"
    }
];

export default function StatsSection() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="py-16 bg-muted/40 border-y border-border/40">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-6 bg-card rounded-2xl border border-border/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 rounded-xl bg-primary/10 flex items-center justify-center">
                                        {stat.icon}
                                    </div>
                                    <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border/40">
                                        {stat.badge}
                                    </span>
                                </div>
                                <p className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-1">
                                    {stat.value}
                                </p>
                                <h3 className="text-base font-semibold text-foreground mb-2">
                                    {stat.title}
                                </h3>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-2 pt-2 border-t border-border/40">
                                {stat.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
