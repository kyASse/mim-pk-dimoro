'use client';

import React from 'react';
import Image from 'next/image';
import { Maximize2, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EditImageButton from '@/app/admin/galeri/EditImageButton';
import DeleteImageButton from '@/app/admin/galeri/DeleteImageButton';
import { cn } from '@/lib/utils';

export interface GaleriItem {
  id: number;
  image_url: string;
  keterangan: string | null;
  kategori: string | null;
  created_at?: string;
}

interface GaleriCardProps {
  item: GaleriItem;
  onPreview: (item: GaleriItem) => void;
  onUpdated?: () => void;
}

export function getCategoryBadgeClass(kategori: string | null) {
  switch (kategori) {
    case 'Kegiatan Belajar':
      return 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30';
    case 'Ibadah':
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
    case 'Acara Khusus':
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30';
    case 'Seni & Kreativitas':
      return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30';
    case 'Bermain':
      return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30';
    default:
      return 'bg-primary/10 text-primary border-primary/30';
  }
}

export default function GaleriCard({ item, onPreview, onUpdated }: GaleriCardProps) {
  const badgeClass = getCategoryBadgeClass(item.kategori);

  return (
    <Card className="group overflow-hidden border border-border/80 bg-card shadow-xs hover:shadow-md hover:border-primary/40 transition-all flex flex-col">
      {/* Thumbnail Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted/40">
        <Image
          src={item.image_url}
          alt={item.keterangan || 'Gambar Galeri'}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Category Pill Tag Overlay */}
        {item.kategori && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <Badge
              variant="outline"
              className={cn(
                'backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-semibold border shadow-xs',
                badgeClass
              )}
            >
              {item.kategori}
            </Badge>
          </div>
        )}

        {/* Quick Preview Hover Trigger */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none sm:pointer-events-auto">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            data-testid={`preview-btn-${item.id}`}
            onClick={() => onPreview(item)}
            className="h-8 px-3 rounded-full text-xs font-medium gap-1.5 shadow-md bg-background/90 text-foreground hover:bg-background"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Perbesar</span>
          </Button>
        </div>
      </div>

      {/* Card Content & Action Bar */}
      <CardContent className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <h3
            className="font-semibold text-xs sm:text-sm text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors"
            title={item.keterangan || undefined}
          >
            {item.keterangan || 'Tanpa Keterangan'}
          </h3>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onPreview(item)}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground sm:hidden"
          >
            <Maximize2 className="w-3.5 h-3.5 mr-1" />
            Lihat
          </Button>

          <div className="flex items-center gap-1.5 ml-auto">
            <EditImageButton
              galeriId={item.id}
              imageUrl={item.image_url}
              keterangan={item.keterangan}
              kategori={item.kategori}
              onUpdated={onUpdated}
            />
            <DeleteImageButton galeriId={item.id} imageUrl={item.image_url} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
