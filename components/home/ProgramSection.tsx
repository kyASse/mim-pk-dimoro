"use client";

import { motion, useReducedMotion } from "motion/react";
import ProgramCard from "./ProgramCard";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { EXCELLENT_PROGRAMS } from "@/lib/school-data";

const programs = [
    {
        title: EXCELLENT_PROGRAMS.tahfidz.title,
        description: EXCELLENT_PROGRAMS.tahfidz.target,
        image: "/images/mim_tahfidz_learning.jpg",
        href: "/program/tahfidz"
    },
    {
        title: EXCELLENT_PROGRAMS.klinikBelajar.title,
        description: EXCELLENT_PROGRAMS.klinikBelajar.description,
        image: "/images/mim_hero_main.jpg",
        href: "/program/klinik-belajar"
    },
    {
        title: "Ekstrakurikuler",
        description: "Berbagai pilihan kegiatan mulai dari seni bela diri Tapak Suci, kepanduan Hizbul Wathan (HW), hingga Robotika.",
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
                    {programs.map((program, index) => (
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
                    <Button asChild className="rounded-full border-border hover:bg-muted font-semibold px-6" variant="outline">
                        <Link href="/program">
                            <span>Lihat Semua Program Unggulan</span>
                            <ChevronRight className="ml-1.5 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

            </div>
        </section>
    );
}
