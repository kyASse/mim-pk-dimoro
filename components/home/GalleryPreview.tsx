"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SCHOOL_NAME } from "@/lib/school-config";
import { createClient } from "@/lib/supabase/client";

export interface GalleryPhoto {
    id: string | number;
    src: string;
    alt: string;
    category: string;
}

export const FALLBACK_GALLERY_IMAGES: GalleryPhoto[] = [
    {
        id: 1,
        src: "/images/mim_hero_main.jpg",
        alt: "Siswa beraktivitas di lingkungan sekolah",
        category: "Kegiatan Belajar"
    }, 
    {
        id: 2,
        src: "/images/mim_tahfidz_learning.jpg",
        alt: "Pembiasaan membaca dan menghafal Al-Qur'an",
        category: "Tahfidz"
    },
    {
        id: 3,
        src: "https://images.pexels.com/photos/8535227/pexels-photo-8535227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        alt: "Kreativitas seni dan budaya siswa",
        category: "Seni & Budaya"
    },
    {
        id: 4,
        src: "https://images.pexels.com/photos/8422152/pexels-photo-8422152.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        alt: "Pembiasaan ibadah dan shalat berjamaah",
        category: "Ibadah"
    },
    {
        id: 5,
        src: "https://images.pexels.com/photos/8535188/pexels-photo-8535188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        alt: "Kegiatan literasi di perpustakaan",
        category: "Literasi"
    },
    {
        id: 6,
        src: "https://images.pexels.com/photos/8613066/pexels-photo-8613066.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        alt: "Kegiatan ekstrakurikuler kepanduan HW",
        category: "Karakter"
    }
];

export default function GalleryPreview() {
    const [images, setImages] = useState<GalleryPhoto[]>(FALLBACK_GALLERY_IMAGES);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        let isMounted = true;

        async function fetchGallery() {
            try {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from("galeri")
                    .select("*")
                    .order("created_at", { ascending: false })
                    .limit(6);

                if (error) {
                    console.error("Error fetching gallery preview:", error);
                    return;
                }

                if (isMounted && data && data.length > 0) {
                    const mapped: GalleryPhoto[] = data.map((item) => ({
                        id: item.id,
                        src: item.image_url || "/images/placeholder.jpg",
                        alt: item.keterangan || "Dokumentasi Kegiatan",
                        category: item.kategori || "Kegiatan"
                    }));
                    setImages(mapped);
                }
            } catch (err) {
                console.error("Unexpected error fetching gallery preview:", err);
            }
        }

        fetchGallery();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
                            Galeri Kegiatan Madrasah
                        </h2>
                        <p className="text-base text-muted-foreground max-w-2xl">
                            Dokumentasi momen berharga dan aktivitas keseharian para siswa di {SCHOOL_NAME}.
                        </p>
                    </div>
                    <div>
                        <Link href="/galeri">
                            <Button variant="outline" className="rounded-full border-border hover:bg-muted font-semibold">
                                <span>Lihat Semua Foto</span>
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {images.map((image, index) => (
                        <motion.div
                            key={image.id}
                            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            className="relative cursor-pointer overflow-hidden rounded-3xl border border-border/60 shadow-sm aspect-[4/3] bg-muted group"
                            onClick={() => setSelectedImage(index)}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity flex flex-col justify-end p-5">
                                <span className="px-2.5 py-1 bg-primary/90 text-primary-foreground text-xs font-semibold rounded-full w-max mb-2">
                                    {image.category}
                                </span>
                                <h3 className="text-base font-semibold text-white leading-snug">
                                    {image.alt}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Lightbox Modal */}
                <AnimatePresence>
                    {selectedImage !== null && images[selectedImage] && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6"
                            onClick={() => setSelectedImage(null)}
                        >
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="relative max-w-4xl w-full bg-card rounded-3xl overflow-hidden border border-border/40 shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white hover:bg-black/70 rounded-full transition-colors"
                                    onClick={() => setSelectedImage(null)}
                                    aria-label="Tutup pratinjau"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="relative aspect-[16/10] w-full bg-black">
                                    <Image
                                        src={images[selectedImage].src}
                                        alt={images[selectedImage].alt}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                
                                <div className="p-6 bg-card border-t border-border/40">
                                    <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-2 inline-block">
                                        Kategori: {images[selectedImage].category}
                                    </span>
                                    <h3 className="text-lg font-bold text-foreground">
                                        {images[selectedImage].alt}
                                    </h3>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </section>
    );
}