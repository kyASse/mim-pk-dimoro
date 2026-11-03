'use client';

import React from 'react';
import Image from 'next/image';
import { ExternalLink, X, Calendar, Tag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GaleriItem } from './GaleriCard';

interface GaleriPreviewDialogProps {
  item: GaleriItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GaleriPreviewDialog({
  item,
  open,
  onOpenChange,
}: GaleriPreviewDialogProps) {
  if (!item) return null;

  const formattedDate = item.created_at
    ? new Date(item.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-card border-border text-foreground shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{item.keterangan || 'Preview Foto Galeri'}</DialogTitle>
          <DialogDescription>Preview resolusi penuh dokumentasi foto madrasah</DialogDescription>
        </DialogHeader>

        {/* Image Preview Box */}
        <div className="relative aspect-video sm:aspect-[16/10] w-full bg-black/90 flex items-center justify-center overflow-hidden">
          <Image
            src={item.image_url}
            alt={item.keterangan || 'Foto Galeri'}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
        </div>

        {/* Footer Metadata & Actions */}
        <div className="p-4 sm:p-6 space-y-4 bg-card">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {item.kategori && (
                <Badge
                  variant="outline"
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border-primary/30"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {item.kategori}
                </Badge>
              )}
              {formattedDate && (
                <span className="flex items-center text-xs text-muted-foreground gap-1">
                  <Calendar className="w-3 h-3" />
                  {formattedDate}
                </span>
              )}
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5 border-border"
            >
              <a href={item.image_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3.5 h-3.5" />
                Buka Resolusi Asli
              </a>
            </Button>
          </div>

          <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
            {item.keterangan || 'Tanpa keterangan'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
