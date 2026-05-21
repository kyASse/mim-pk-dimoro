"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button"; 
import { ChevronRight, UserPlus, } from "lucide-react";
import { motion } from "motion/react";
import { SCHOOL_NAME, SCHOOL_TAGLINE } from "@/lib/school-config";

const slides = [
    {
        id: 1,
        image: "https://placehold.co/1920x1080/059669/ffffff.png?text=MI+Muhammadiyah+Dimoro",
        alt: `Kegiatan belajar di ${SCHOOL_NAME}`
    },
    {
        id: 2,
        image: "https://placehold.co/1920x1080/10b981/ffffff.png?text=Lingkungan+Islami",
        alt: `Lingkungan Islami di ${SCHOOL_NAME}`
    },
    {
        id: 3,
        image: "https://placehold.co/1920x1080/34d399/ffffff.png?text=Generasi+Berprestasi",
        alt: `Siswa berprestasi di ${SCHOOL_NAME}`
    }
]

export default function HomeHero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return(
        <section className="relative h-[600px] md:h-[700px] overflow-hidden">
            {/* Background Slideshow */}
            <div className="absolute inset-0 z-0">
                {slides.map((slide, index) => (
                    <div 
                        key={slide.id}
                        className=" absolute inset-0 transition-opacity duration-1000 ease-in-out"
                        style={{ opacity: currentSlide === index ? 1 : 0 }}
                    >
                        <Image
                            src={slide.image}
                            alt={slide.alt}
                            fill
                            priority={index === 0}
                            className=" object-cover "
                        />
                        <div className=" absolute inset-0 bg-gradient-to-r from-black/60 to to-black/30" />
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className=" relative z-10 container mx-auto px-4 h-full flex items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className=" max-w-3xl text-white "
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className=" text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                    >
                        {SCHOOL_NAME}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className=" text-xl md:text-2xl font-medium mb-2"
                    >
                        Madrasah Ibtidaiyah Program Khusus
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className=" text-lg md:text-xl font-medium mb-8 text-white/90"
                    >
                        {SCHOOL_TAGLINE}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className=" flex flex-col sm:flex-row gap-4"
                    >
                        <Link href="/pendaftaran" className=" w-full sm:w-auto">
                            <Button size="lg" className=" w-full sm:w-auto bg-primary hover:bg-primary/80 text-primary-foreground font-semibold">
                                <UserPlus className=" mr-2" />
                                Daftar Sekarang
                            </Button>
                        </Link>
                        <Link href="/program" className=" w-full sm:w-auto">
                            <Button size="lg" variant="outline" className=" w-full sm:w-auto bg-white hover:bg-primary/80 border-white text-primary-foreground hover:text-primary-foreground font-semibold">
                                <ChevronRight className=" mr-2" />
                                Program Kami
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Slide Indicators */}
            <div className=" absolute bottom-6 left-0 right-0 z-10 flex justify-center space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                            currentSlide === index ? 'bg-white scale-125' : 'bg-white/50'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    )
}
