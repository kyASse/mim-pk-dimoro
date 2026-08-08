"use client"

import { motion } from "motion/react";
import ProgramCard from "./ProgramCard";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { EXCELLENT_PROGRAMS } from "@/lib/school-data";

export default function ProgramSection() {
    return (
        <section className="py-16 bg-accent/10">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Program Unggulan</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Kami menyediakan berbagai program unggulan untuk mengembangkan potensi akademik dan karakter siswa secara maksimal.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <ProgramCard
                        title={EXCELLENT_PROGRAMS.tahfidz.title}
                        description={EXCELLENT_PROGRAMS.tahfidz.target}
                        image="https://placehold.co/600x400/059669/ffffff.png?text=Tahfidz+Al-Qur'an"
                        href="/program/tahfidz"
                    />

                    <ProgramCard
                        title={EXCELLENT_PROGRAMS.klinikBelajar.title}
                        description={EXCELLENT_PROGRAMS.klinikBelajar.description}
                        image="https://placehold.co/600x400/10b981/ffffff.png?text=Klinik+Belajar"
                        href="/program/klinik-belajar"
                    />

                    <ProgramCard
                        title="Ekstrakurikuler"
                        description="Berbagai pilihan kegiatan mulai dari seni bela diri Tapak Suci, kepanduan Hizbul Wathan (HW), hingga Robotika."
                        image="https://placehold.co/600x400/34d399/ffffff.png?text=Ekstrakurikuler"
                        href="/program/ekstrakurikuler"
                    />
                </div>
                <div className="text-center mt-10">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <Button className="rounded-full max-w-md mx-auto bg-accent hover:bg-accent/80" variant="outline">
                            <Link href="/program" className="flex items-center">
                                Lihat Semua Program <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

