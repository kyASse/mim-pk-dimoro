"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ChevronRight, Calendar } from "lucide-react";

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
    const shouldReduceMotion = useReducedMotion();

    const formatTanggal = (tanggal: string) => {
        try {
            const date = new Date(tanggal);
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return tanggal;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-card rounded-3xl border border-border/60 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-primary/40 transition-all group"
        >
            <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                    <Image
                        src={item.image_url || '/images/mim_tahfidz_learning.jpg'}
                        alt={item.judul}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                
                <div className="p-6">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-3">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>{formatTanggal(item.tanggal_terbit)}</span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                        {item.judul}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                        {item.ringkasan || 'Baca berita selengkapnya mengenai kegiatan dan prestasi di sekolah.'}
                    </p>
                </div>
            </div>

            <div className="px-6 pb-6 pt-0">
                <Link 
                    href={`/berita/${item.id}`} 
                    className="inline-flex items-center text-xs font-semibold text-primary hover:underline gap-1"
                >
                    <span>Baca Selengkapnya</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </motion.div>
    );
}
