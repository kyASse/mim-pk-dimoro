'use client';

import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const router = useRouter();

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : galeriData.length - 1);
        }
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex(selectedImageIndex < galeriData.length - 1 ? selectedImageIndex + 1 : 0);
        }
    };

    const handleCategoryChange = (value: string) => {
        if (!value || value === "all") {
            router.push("/galeri");
        } else {
            router.push(`/galeri?kategori=${encodeURIComponent(value)}`);
        }
    };

    if (!galeriData || galeriData.length === 0) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 py-20 border-2 border-dashed rounded-3xl border-muted">
                        <ImageIcon className="size-16 text-muted-foreground" />
                        <p className="text-muted-foreground text-lg">
                            Belum ada foto yang tersedia saat ini.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    const selectedImage = selectedImageIndex !== null ? galeriData[selectedImageIndex] : null;

    return (
    <>
        <section className="py-12">
            <div className="container mx-auto px-4">
                {/* Filter Buttons */}
                <div className="flex justify-center mb-12">
                    <ToggleGroup 
                        type="single" 
                        value={currentKategori || "all"} 
                        onValueChange={handleCategoryChange}
                        className="flex flex-wrap gap-2"
                    >
                        <ToggleGroupItem 
                            value="all" 
                            className="rounded-full px-6 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                        >
                            Semua Foto
                        </ToggleGroupItem>
                        {kategoriList.map(kategori => (
                            <ToggleGroupItem 
                                key={kategori}
                                value={kategori} 
                                className="rounded-full px-6 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                            >
                                {kategori.charAt(0).toUpperCase() + kategori.slice(1)}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {galeriData.map((item, index) => (
                        <Card 
                            key={item.id}
                            className="overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group rounded-2xl"
                            onClick={() => setSelectedImageIndex(index)}
                        >
                            <CardContent className="p-0 relative">
                                <AspectRatio ratio={4 / 3}>
                                    <Image
                                        src={item.src}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                </AspectRatio>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <Badge variant="secondary" className="w-fit mb-2 bg-white/20 text-white backdrop-blur-md border-none">
                                        {item.category}
                                    </Badge>
                                    <h3 className="text-white font-medium line-clamp-2 text-lg leading-tight">
                                        {item.title}
                                    </h3>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* Lightbox Modal using Dialog */}
        <Dialog open={selectedImageIndex !== null} onOpenChange={(open) => !open && setSelectedImageIndex(null)}>
            <DialogContent className="max-w-5xl p-0 overflow-hidden border-none bg-black/95 sm:rounded-3xl gap-0">
                <DialogTitle className="sr-only">Detail Foto: {selectedImage?.title}</DialogTitle>
                <div className="relative flex flex-col md:flex-row h-full max-h-[90vh] md:max-h-[80vh]">
                    {/* Image Area */}
                    <div className="relative flex-1 bg-black flex items-center justify-center group/nav">
                        {selectedImage && (
                            <div className="relative w-full h-full min-h-[300px] md:min-h-[500px]">
                                <Image
                                    src={selectedImage.src}
                                    alt={selectedImage.title}
                                    fill
                                    className="object-contain"
                                    sizes="100vw"
                                    priority
                                />
                            </div>
                        )}
                        
                        {/* Navigation Buttons */}
                        {galeriData.length > 1 && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 text-white opacity-0 group-hover/nav:opacity-100 transition-opacity"
                                    onClick={handlePrevImage}
                                >
                                    <ChevronLeft className="size-6" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 text-white opacity-0 group-hover/nav:opacity-100 transition-opacity"
                                    onClick={handleNextImage}
                                >
                                    <ChevronRight className="size-6" />
                                </Button>
                            </>
                        )}

                        {/* Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 text-white/80 px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                            {selectedImageIndex !== null && selectedImageIndex + 1} / {galeriData.length}
                        </div>
                    </div>

                    {/* Info Area */}
                    <div className="w-full md:w-80 bg-background p-8 flex flex-col gap-4">
                        <DialogHeader>
                            <Badge className="w-fit mb-2">{selectedImage?.category}</Badge>
                            <DialogTitle className="text-2xl font-bold leading-tight">
                                {selectedImage?.title}
                            </DialogTitle>
                            <DialogDescription className="text-base leading-relaxed mt-4">
                                {selectedImage?.description || "Tidak ada deskripsi tambahan."}
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="mt-auto pt-6 border-t">
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                                Tanggal Unggah
                            </p>
                            <p className="text-sm font-medium mt-1">
                                {selectedImage && new Date(selectedImage.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </>
    );
}
