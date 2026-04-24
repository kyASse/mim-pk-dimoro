"use client"

import { motion } from "motion/react";
import ProgramCard from "./ProgramCard";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";

export default function ProgramSection() {
    return (
        <section className="py-16 bg-accent/10">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Program Pembelajaran</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Kami menyediakan berbagai program pembelajaran untuk mengembangkan potensi anak secara maksimal.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <ProgramCard
                        title="Program Kreativitas Anak"
                        description="Mengembangkan kreativitas anak melalui seni, musik, dan permainan edukatif."
                        image="https://images.pexels.com/photos/8535227/pexels-photo-8535227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        href="/program/kreativitas"
                    />

                    <ProgramCard
                        title="Program Bahasa Asing"
                        description="Mengenalkan bahasa Inggris dan bahasa asing lainnya sejak dini dengan metode yang menyenangkan."
                        image="https://images.pexels.com/photos/8535188/pexels-photo-8535188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        href="/program/bahasa-asing"
                    />

                    <ProgramCard
                        title="Program Kesehatan dan Kebugaran"
                        description="Mendorong gaya hidup sehat melalui olahraga, pola makan seimbang, dan kebersihan diri."
                        image="https://images.pexels.com/photos/8613317/pexels-photo-8613317.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        href="/program/kesehatan"
                    />
                </div>
                <div className="text-center mt-10">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <Button className="rounded-full max-w-md mx-auto bg-accent hover:bg-accent/80" variant="outline">
                            Lihat Semua Program <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}