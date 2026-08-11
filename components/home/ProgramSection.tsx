"use client";

import { motion, useReducedMotion } from "motion/react";
import ProgramCard from "./ProgramCard";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { EXCELLENT_PROGRAMS } from "@/lib/school-data";

const fallbackPrograms = [
    {
        title: EXCELLENT_PROGRAMS?.tahfidz?.title || "Tahfidz Al-Qur'an",
        description: EXCELLENT_PROGRAMS?.tahfidz?.target || "Program hafalan Al-Qur'an dengan target capaian terukur, dibimbing dengan metode talaqqi menyenangkan.",
        image: "/images/mim_tahfidz_learning.jpg",
        href: "/program/tahfidz"
    },
    {
        title: EXCELLENT_PROGRAMS?.klinikBelajar?.title || "Sains & Teknologi",
        description: EXCELLENT_PROGRAMS?.klinikBelajar?.description || "Pengembangan kemampuan berpikir kritis melalui praktikum sains dasar dan literasi teknologi digital.",
        image: "/images/mim_hero_main.jpg",
        href: "/program/sains-teknologi"
    },
    {
        title: "Ekstrakurikuler",
        description: "Wadah pembinaan minat bakat melalui Hizbul Wathan, Tapak Suci, seni Al-Qur'an, dan olahraga prestasi.",
        image: "/images/mim_tahfidz_learning.jpg",
        href: "/program/ekstrakurikuler"
    }
];

export default function ProgramSection() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="py-20 bg-muted/40 border-y border-border/40">
            <div className="container mx-auto px-4">
                
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                        Program Unggulan Madrasah
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                        Kami menyediakan program akademik dan keislaman terpadu untuk mengembangkan seluruh minat, bakat, dan potensi setiap siswa secara optimal.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {fallbackPrograms.map((program, index) => (
                        <motion.div
                            key={program.title}
                            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <ProgramCard
                                title={program.title}
                                description={program.description}
                                image={program.image}
                                href={program.href}
                            />
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/program">
                        <Button className="rounded-full border-border hover:bg-muted font-semibold px-6" variant="outline">
                            <span>Lihat Semua Program Unggulan</span>
                            <ChevronRight className="ml-1.5 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

            </div>
        </section>
    );
}
