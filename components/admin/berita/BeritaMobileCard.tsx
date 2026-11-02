'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Edit, Calendar, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DeleteButton from '@/app/admin/berita/DeleteButton';
import { cn } from '@/lib/utils';

export type BeritaItem = {
  id: number;
  judul: string;
  tanggal_terbit: string;
  image_url: string;
  status: string;
  ringkasan?: string | null;
};

interface BeritaMobileCardProps {
  item: BeritaItem;
  index: number;
}

export default function BeritaMobileCard({ item, index }: BeritaMobileCardProps) {
  const isPublished = item.status === 'published' || item.status === 'terbit';

  const formattedDate = new Date(item.tanggal_terbit).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-card text-card-foreground border border-border/80 rounded-xl p-4 shadow-xs space-y-3 transition-colors hover:border-primary/40">
      <div className="flex items-start gap-3">
        {/* Thumbnail */}
        <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-border/60 bg-muted/40 flex items-center justify-center">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.judul}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <FileText className="w-6 h-6 text-muted-foreground" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono text-muted-foreground">
              #{index + 1}
            </span>
            <Badge
              variant={isPublished ? 'default' : 'secondary'}
              className={cn(
                'text-[10px] font-medium px-2 py-0.5 rounded-full border',
                isPublished
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-muted text-muted-foreground border-border'
              )}
            >
              {isPublished ? 'Diterbitkan' : 'Draft'}
            </Badge>
          </div>

          <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
            {item.judul}
          </h3>

          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {item.ringkasan && (
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed border-t border-border/40 pt-2">
          {item.ringkasan}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/40">
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 text-xs gap-1.5 hover:bg-muted/80"
          asChild
        >
          <Link href={`/berita/${item.id}`}>
            <Eye className="w-3.5 h-3.5 text-primary" />
            <span>Lihat</span>
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 text-xs gap-1.5 hover:bg-muted/80"
          asChild
        >
          <Link href={`/admin/berita/edit/${item.id}`}>
            <Edit className="w-3.5 h-3.5 text-amber-500" />
            <span>Edit</span>
          </Link>
        </Button>
        <DeleteButton beritaId={item.id} imageUrl={item.image_url} />
      </div>
    </div>
  );
}
