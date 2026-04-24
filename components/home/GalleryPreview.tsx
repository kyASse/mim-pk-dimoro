"use client"

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// data masih statis, perlu diganti dengan data dinamis dari Supabase
const galleryImages = [
    {
        id: 1,
        src: "https://images.pexels.com/photos/8535214/pexels-photo-8535214.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        alt: "Anak-anak belajar di kelas",
        category: "Kegiatan Belajar"
    }, 
    {
        id: 2,
        src: "https://images.pexels.com/photos/8535186/pexels-photo-8535186.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        alt: "Bermain di luar ruangan",
        category: "Bermain"
    },
    {
        id: 3,
        src: "https://images.pexels.com/photos/8535227/pexels-photo-8535227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        alt: "Kegiatan kesenian",
        category: "Seni & Kreativitas"
    },
    {
        id: 4,
        src: "https://images.pexels.com/photos/8422152/pexels-photo-8422152.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        alt: "Kegiatan beribadah",
        category: "Ibadah Bersama"
    },
    {
        id: 5,
        src: "https://images.pexels.com/photos/8535188/pexels-photo-8535188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        alt: "Membaca buku bersama",
        category: "Literasi"
    },
    {
        id: 6,
        src: "https://images.pexels.com/photos/8613066/pexels-photo-8613066.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        alt: "Mencuci tangan",
        category: "Kemandirian"
    }
]

export default function GalleryPreview(){
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Galeri Kegiatan</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Lihat keseruan anak-anak belajar dan bermain di TK ABA Mertosanan.
                    </p>
                </div>

                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {galleryImages.map((image, index) => (
                            <motion.div
                                key={image.id}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="relative cursor-pointer overflow-hidden rounded-xl shadow-lg h-64 bg-accent/10 hover:bg-accent/20 transition-colors duration-300 ease-in-out"
                                onClick={() => setSelectedImage(index)}
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    // width={400}
                                    // height={300}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent bg-opacity-30 flex items-center justify-center">
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <span className="px-2 py-1 bg-primary/80 rounded-full text-xs mb-2 inline-block">
                                        {image.category}
                                        </span>
                                        <h3 className="text-lg font-semibold">{image.alt}</h3>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <Link href={"/gallery"}>
                                <Button className="rounded-full max-w-md mx-auto bg-highlight hover:bg-highlight/80 text-highlight-foreground">
                                    Lihat Semua Foto <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>

                <AnimatePresence>
                    {selectedImage !== null && (
                        <motion.div
                            initial={{ opacity: 0, }}
                            animate={{ opacity: 1, }}
                            exit={{ opacity: 0, }}
                            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                            onClick={() => setSelectedImage(null)}
                        >
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="relative max-w-6xl w-full h-full mt-40"
                                onClick={(e) => e.stopPropagation}
                            >
                                <button
                                    className="absolute -top-14 right-0 text-white rounded-full p-2"
                                    onClick={() => setSelectedImage(null)}
                                >
                                    <X className="w-8 h-8" />
                                </button>
                                <div className="relative w-full h-[70vh] ">
                                    <Image
                                        src={galleryImages[selectedImage].src}
                                        alt={galleryImages[selectedImage].alt}
                                        fill
                                        className="object-cover rounded-t-xl"
                                    />
                                </div>
                                <div className="bg-white p-4 rounded-b-xl">
                                    <h3 className="text-xl font-bold">
                                        {galleryImages[selectedImage].alt}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Kategori: {galleryImages[selectedImage].category}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    )
}