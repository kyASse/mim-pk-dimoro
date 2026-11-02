'use client';

import React from 'react';
import Link from 'next/link';
import { Edit, Info } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import TestimonialCard from '@/components/home/TestimonialCard';
import { cn } from '@/lib/utils';
import type { TestimoniItem } from './TestimoniCard';

export interface TestimoniPreviewDialogProps {
    item: TestimoniItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onToggleFeatured?: (id: number, current: boolean) => Promise<void>;
    isToggling?: boolean;
}

export default function TestimoniPreviewDialog({
    item,
    open,
    onOpenChange,
    onToggleFeatured,
    isToggling = false,
}: TestimoniPreviewDialogProps) {
    const formattedDate = React.useMemo(() => {
        if (!item?.created_at) return '-';
        try {
            const date = new Date(item.created_at);
            if (isNaN(date.getTime())) return '-';
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        } catch {
            return '-';
        }
    }, [item?.created_at]);

    if (!item) return null;

    const isFeatured = Boolean(item.is_featured);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg bg-card border-border text-foreground p-6 gap-6 sm:rounded-2xl">
                <DialogHeader className="space-y-1.5 text-left">
                    <DialogTitle className="text-lg font-bold text-foreground">
                        Pratinjau Testimoni Publik
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                        Tampilan kartu testimoni ini sesuai dengan yang dilihat pengunjung di halaman beranda website.
                    </DialogDescription>
                </DialogHeader>

                {/* Public Website Preview Card */}
                <div className="space-y-2">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
                        Tampilan Beranda
                    </span>
                    <div className="rounded-2xl border border-border/80 bg-background/50 p-2 sm:p-3">
                        <TestimonialCard
                            name={item.nama_orang_tua || 'Anonim'}
                            role={item.status_orang_tua || 'Wali Murid'}
                            testimonial={item.isi_testimoni || ''}
                        />
                    </div>
                </div>

                {/* Metadata Card (Administrative Record Dossier) */}
                <div className="bg-muted/40 rounded-xl p-3.5 border border-border/80 space-y-3">
                    {/* Header with icon */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>Detail Rekaman</span>
                    </div>

                    {/* Key-Value Data Rows (Data Property Invariance: No icons on individual rows) */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <span className="text-muted-foreground block text-[11px]">ID Rekaman</span>
                            <span className="font-semibold text-foreground">#{item.id}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block text-[11px]">Tanggal Dibuat</span>
                            <span className="font-medium text-foreground">{formattedDate}</span>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                        <div>
                            <span className="text-muted-foreground block text-[11px] mb-0.5">Status Publikasi</span>
                            <Badge
                                variant="outline"
                                className={cn(
                                    "font-normal text-xs",
                                    isFeatured
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : "bg-muted text-muted-foreground border-border"
                                )}
                            >
                                {isFeatured ? 'Tampil di Beranda' : 'Disembunyikan'}
                            </Badge>
                        </div>

                        {onToggleFeatured && (
                            <div className="flex items-center gap-2">
                                <Switch
                                    id={`preview-toggle-${item.id}`}
                                    checked={isFeatured}
                                    disabled={isToggling}
                                    onCheckedChange={() => onToggleFeatured(item.id, isFeatured)}
                                    aria-label="Toggle status featured"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Action Buttons */}
                <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2 border-t border-border/40">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-10 text-sm sm:h-8 sm:text-xs border-border/80 text-foreground hover:bg-muted"
                    >
                        Tutup
                    </Button>
                    <Button
                        asChild
                        className="h-10 text-sm sm:h-8 sm:text-xs"
                    >
                        <Link
                            href={`/admin/testimoni/edit/${item.id}`}
                            aria-label="Edit Testimoni"
                        >
                            <Edit className="w-3.5 h-3.5 mr-1.5" />
                            Edit Testimoni
                        </Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
