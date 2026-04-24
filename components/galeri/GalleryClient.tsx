'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Tipe untuk item galeri yang sudah ditransform
interface GalleryItem {
    id: number;
    src: string;
    title: string;
    description: string;
    category: string;
    created_at: string;
}

interface GalleryClientProps {
    galeriData: GalleryItem[];
    kategoriList: string[];
    currentKategori?: string;
}

export default function GalleryClient({ 
    galeriData, 
    kategoriList, 
    currentKategori 
}: GalleryClientProps) {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    const handlePrevImage = () => {
    if (selectedImage !== null) {
        setSelectedImage(selectedImage > 0 ? selectedImage - 1 : galeriData.length - 1);
    }
    };

    const handleNextImage = () => {
        if (selectedImage !== null) {
            setSelectedImage(selectedImage < galeriData.length - 1 ? selectedImage + 1 : 0);
        }
    };

    if (!galeriData || galeriData.length === 0) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-muted-foreground text-lg">
                        Belum ada foto yang tersedia saat ini.
                    </p>
                </div>
            </section>
        );
    }

    return (
    <>
        <section className="py-16">
            <div className="container mx-auto px-4">
                {/* Filter Buttons */}
                <div className="flex justify-center mb-8">
                    <div className="flex flex-wrap gap-2">
                        <Link href="/galeri">
                            <button 
                                className={`px-4 py-2 rounded-full transition-colors ${
                                    !currentKategori 
                                    ? 'bg-highlight text-highlight-foreground' 
                                    : 'bg-muted hover:bg-muted/80'
                                }`}
                                >
                                Semua Foto
                            </button>
                        </Link>
                        {kategoriList.map(kategori => (
                            <Link 
                                href={`/galeri?kategori=${encodeURIComponent(kategori)}`} 
                                key={kategori}
                            >
                                <button 
                                    className={`px-4 py-2 rounded-full transition-colors ${
                                    currentKategori === kategori 
                                        ? 'bg-highlight text-highlight-foreground' 
                                        : 'bg-muted hover:bg-muted/80'
                                    }`}
                                >
                                    {kategori.charAt(0).toUpperCase() + kategori.slice(1)}
                                </button>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {galeriData.map((item, index) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="relative cursor-pointer overflow-hidden rounded-xl shadow-md group h-64"
                            onClick={() => setSelectedImage(index)}
                        >
                            <Image
                                src={item.src}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-4 left-4 text-white">
                                    <span className="px-2 py-1 bg-primary/80 rounded-full text-xs mb-2 inline-block">
                                        {item.category}
                                    </span>
                                    <h3 className="text-lg font-semibold line-clamp-2">{item.title}</h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
            </div>
        </section>

        {/* Lightbox Modal */}
        <AnimatePresence>
            {selectedImage !== null && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative max-w-4xl mx-auto w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute -top-12 right-0 text-white hover:text-primary transition-colors z-10"
                            onClick={() => setSelectedImage(null)}
                            aria-label="Close lightbox"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Image */}
                        <div className="relative h-[70vh] w-full">
                            <Image
                                src={galeriData[selectedImage].src}
                                alt={galeriData[selectedImage].title}
                                fill
                                className="object-contain"
                                sizes="100vw"
                                priority
                            />
                        </div>

                        {/* Image Info */}
                        <div className="bg-white p-4 rounded-b-xl">
                            <h3 className="font-bold text-xl text-gray-900">
                                {galeriData[selectedImage].title}
                            </h3>
                            <p className="text-gray-600 mt-2">
                                {galeriData[selectedImage].description}
                            </p>
                            <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                {galeriData[selectedImage].category}
                            </span>
                        </div>
                        
                        {/* Navigation Buttons */}
                        {galeriData.length > 1 && (
                            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                                <button
                                    className="bg-white/20 hover:bg-white/40 w-12 h-12 rounded-full flex items-center justify-center transition-colors pointer-events-auto"
                                    onClick={handlePrevImage}
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-6 h-6 text-white" />
                                </button>
                                <button
                                    className="bg-white/20 hover:bg-white/40 w-12 h-12 rounded-full flex items-center justify-center transition-colors pointer-events-auto"
                                    onClick={handleNextImage}
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-6 h-6 text-white" />
                                </button>
                            </div>
                        )}

                        {/* Image Counter */}
                        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {selectedImage + 1} / {galeriData.length}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
}
