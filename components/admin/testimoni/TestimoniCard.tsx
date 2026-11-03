'use client';

import React from 'react';
import Link from 'next/link';
import { Quote, Star, Eye, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import DeleteTestimoniButton from '@/app/admin/testimoni/DeleteTestimoniButton';

export type TestimoniItem = {
    id: number;
    nama_orang_tua: string | null;
    status_orang_tua: string | null;
    is_featured: boolean | null;
    isi_testimoni: string | null;
    created_at: string;
    created_by?: string | null;
};

export interface TestimoniCardProps {
    item: TestimoniItem;
    onPreview: (item: TestimoniItem) => void;
    onToggleFeatured?: (id: number, current: boolean) => Promise<void>;
    isToggling?: boolean;
}

export default function TestimoniCard({
    item,
    onPreview,
    onToggleFeatured,
    isToggling = false,
}: TestimoniCardProps) {
    const formattedDate = React.useMemo(() => {
        try {
            const date = new Date(item.created_at);
            if (isNaN(date.getTime())) return '';
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return '';
        }
    }, [item.created_at]);

    const isFeatured = Boolean(item.is_featured);

    return (
        <div className="bg-card rounded-2xl p-5 border border-border/80 shadow-sm flex flex-col justify-between hover:border-primary/40 transition-all gap-4">
            <div className="space-y-3">
                {/* Header: 5 Amber Stars and Decorative Quote Icon */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500" aria-label="Rating 5 bintang">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
                        ))}
                    </div>
                    <Quote className="w-5 h-5 text-muted-foreground/30 shrink-0" />
                </div>

                {/* Truncated Quote Content */}
                <p className="line-clamp-4 italic text-foreground/90 text-sm leading-relaxed">
                    &ldquo;{item.isi_testimoni || ''}&rdquo;
                </p>
            </div>

            {/* Author Meta Information */}
            <div className="space-y-1 pt-2">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-sm text-foreground leading-snug truncate">
                        {item.nama_orang_tua || 'Anonim'}
                    </h3>
                    {formattedDate && (
                        <span className="text-[11px] text-muted-foreground shrink-0">
                            {formattedDate}
                        </span>
                    )}
                </div>
                <div>
                    <Badge
                        variant="outline"
                        className="bg-muted/60 text-muted-foreground border-border/60 font-normal text-xs"
                    >
                        {item.status_orang_tua || 'Wali Murid'}
                    </Badge>
                </div>
            </div>

            {/* Footer: Quick Status Switch and Action Buttons */}
            <div className="border-t border-border/60 pt-4 flex flex-wrap items-center justify-between gap-3">
                {/* Quick Toggle Status */}
                <div className="flex items-center gap-2">
                    <Switch
                        id={`featured-toggle-${item.id}`}
                        checked={isFeatured}
                        disabled={isToggling}
                        onCheckedChange={() => onToggleFeatured?.(item.id, isFeatured)}
                        aria-label="Toggle status featured"
                    />
                    <label
                        htmlFor={`featured-toggle-${item.id}`}
                        className={cn(
                            "text-xs font-medium cursor-pointer select-none transition-colors",
                            isFeatured ? "text-primary font-semibold" : "text-muted-foreground"
                        )}
                    >
                        {isFeatured ? 'Tampil di Beranda' : 'Disembunyikan'}
                    </label>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPreview(item)}
                        className="h-10 w-10 sm:h-8 sm:w-8 border-border/80 text-foreground hover:bg-muted"
                        aria-label="Preview Testimoni"
                    >
                        <Eye className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        asChild
                        className="h-10 w-10 sm:h-8 sm:w-8 border-border/80 text-foreground hover:bg-muted"
                    >
                        <Link
                            href={`/admin/testimoni/edit/${item.id}`}
                            aria-label="Edit Testimoni"
                        >
                            <Edit className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </Link>
                    </Button>

                    <DeleteTestimoniButton testimoniId={item.id} />
                </div>
            </div>
        </div>
    );
}
