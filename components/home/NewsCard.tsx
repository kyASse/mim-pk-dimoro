"use client"

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight, Calendar } from "lucide-react";

// Tipe untuk data berita
type NewsItem = {
    id: string;
    judul: string;
    ringkasan: string | null;
    image_url: string | null;
    tanggal_terbit: string;
    penulis_id: string;
    created_at: string;
};

interface NewsCardProps {
    item: NewsItem;
    index: number;
}

export default function NewsCard({ item, index }: NewsCardProps) {
    // Format tanggal ke bahasa Indonesia
    const formatTanggal = (tanggal: string) => {
        const date = new Date(tanggal);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out"
        >
            <div className="relative h-48">
                <Image
                    src={item.image_url || '/placeholder-news.jpg'}
                    alt={item.judul}
                    fill
                    className="object-cover"
                />  
            </div>
            <div className="p-6">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatTanggal(item.tanggal_terbit)}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{item.judul}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                    {item.ringkasan || 'Baca artikel lengkap untuk mengetahui informasi selengkapnya.'}
                </p>
                <Link 
                    href={`/berita/${item.id}`} 
                    className="text-accent-foreground hover:underline inline-flex items-center transition-colors"
                >
                    Baca Selengkapnya <ChevronRight className="ml-2 w-4 h-4" />
                </Link>
            </div>
        </motion.div>
    );
}
