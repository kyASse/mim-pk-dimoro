'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { OpiniPerspektif } from '@/lib/types/ruang-perspektif';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OpiniMobileCardProps {
  item: OpiniPerspektif;
  onToggleFeatured: (id: string, current: boolean) => Promise<void>;
}

export default function OpiniMobileCard({ item, onToggleFeatured }: OpiniMobileCardProps) {
  const statusBadge = (status: string) => {
    switch (status) {
      case 'menunggu_kurasi':
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
          >
            Menunggu Kurasi
          </Badge>
        );
      case 'terbit':
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
          >
            Terbit
          </Badge>
        );
      case 'ditolak':
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30"
          >
            Ditolak
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border-border"
          >
            Arsip
          </Badge>
        );
    }
  };

  const formattedDate = new Date(item.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const displayRole =
    item.keterangan_peran || item.peran_penulis.replace('_', ' ');

  const imageSrc = item.gambar_sampul_url || item.foto_penulis_url;

  return (
    <div className="bg-card text-card-foreground border border-border/80 rounded-xl p-4 shadow-xs space-y-3 transition-colors hover:border-primary/40">
      {/* Header: Category & Status */}
      <div className="flex items-center justify-between gap-2">
        <Badge
          variant="secondary"
          className="text-[11px] font-medium bg-primary/10 text-primary border-primary/20 max-w-[180px] truncate"
        >
          {item.kategori}
        </Badge>
        {statusBadge(item.status)}
      </div>

      {/* Main info with thumbnail */}
      <div className="flex items-start gap-3">
        <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-border/60 bg-muted/40 flex items-center justify-center">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={item.judul}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <BookOpen className="w-5 h-5 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <Link href={`/admin/ruang-perspektif/${item.id}`} className="block group">
            <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {item.judul}
            </h4>
          </Link>
          <div className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{item.nama_penulis}</span>
            <span className="text-[11px] text-muted-foreground/80 capitalize">
              {' '}
              &bull; {displayRole}
            </span>
          </div>
        </div>
      </div>

      {item.ringkasan && (
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed border-t border-border/40 pt-2">
          {item.ringkasan}
        </p>
      )}

      {/* Footer: Date, Star toggle, & Review CTA */}
      <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Star Toggle Button */}
          <button
            type="button"
            onClick={() => onToggleFeatured(item.id, item.is_featured)}
            aria-label={item.is_featured ? 'Hapus sorotan' : 'Jadikan sorotan'}
            className={cn(
              'p-2 rounded-lg border border-border/80 transition-colors',
              item.is_featured
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                : 'hover:bg-muted text-muted-foreground hover:text-amber-500'
            )}
            title={item.is_featured ? 'Naskah Sorotan' : 'Jadikan Naskah Sorotan'}
          >
            <Star
              className={cn(
                'w-4 h-4',
                item.is_featured && 'fill-amber-500 text-amber-500'
              )}
            />
          </button>

          {/* Action Link */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 px-3 text-xs gap-1.5 hover:bg-muted"
          >
            <Link href={`/admin/ruang-perspektif/${item.id}`}>
              <span>Tinjau Naskah</span>
              <ArrowRight className="w-3.5 h-3.5 text-primary" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
