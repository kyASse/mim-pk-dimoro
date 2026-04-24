"use client";

import { motion } from "motion/react";
import { Users, GraduationCap, Award, Palette } from "lucide-react";

// using data dumy for stats before data from API is available
const stats = [
    {
        title: "Siswa Aktif",
        value: "120+",
        icon: <Users className="h-6 w-6 text-primary" />,
        description: "Jumlah siswa yang aktif dan terdaftar.",
        color: "primary"
    },
    {
        title: "Guru & Staff",
        value: "15",
        icon: <GraduationCap className="h-6 w-6 text-secondary dark:text-white" />,
        description: "Tenaga pendidik profesional.",
        color: "secondary"
    },
    {
        title: "Prestasi",
        value: "50+",
        icon: <Award className="h-6 w-6 text-accent dark:text-white" />,
        description: "Penghargaan akademik & non-akademik.",
        color: "accent"
    },
    {
        title: "Ekstrakurikuler",
        value: "8",
        icon: <Palette className="h-6 w-6 text-info" />,
        description: "Kegiatan pengembangan bakat.",
        color: "destructive"
    }
]

export default function StatsSection() {
    return (
        <section className="py-16 bg-muted dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-lg flex flex-col items-center text-center`}
                        >
                            <div
                                className={`mb-4 p-3 rounded-full ${
                                    stat.color === "primary"
                                        ? "bg-primary/20"
                                        : stat.color === "secondary"
                                        ? "bg-secondary/20"
                                        : stat.color === "accent"
                                        ? "bg-accent/20"
                                        : stat.color === "destructive"
                                        ? "bg-destructive/20"
                                        : ""
                                } w-16 h-16 flex items-center justify-center`}
                            >
                                {stat.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{stat.title}</h3>
                            <p className="text-2xl font-bold text-primary mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}