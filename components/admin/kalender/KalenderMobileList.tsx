// components/admin/kalender/KalenderMobileList.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Edit, ExternalLink, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DeleteKegiatanButton from '@/app/admin/kalender/DeleteKegiatanButton';
import { getCategoryConfig, getCategoryBadgeClasses } from '@/lib/constants/calendar';
import type { KegiatanAkademik } from './KalenderManagement';

interface KalenderMobileListProps {
  kegiatan: KegiatanAkademik[];
}

export default function KalenderMobileList({ kegiatan }: KalenderMobileListProps) {
  const getDayAndMonth = (tanggalStr: string) => {
    const d = new Date(tanggalStr);
    const day = d.getDate();
    const month = d.toLocaleDateString('id-ID', { month: 'short' });
    const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });
    return { day, month, dayName };
  };

  const formatFullDate = (tanggalStr: string) => {
    const d = new Date(tanggalStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (kegiatan.length === 0) {
    return (
      <div className="md:hidden bg-card rounded-2xl border border-border/80 p-8 text-center text-muted-foreground shadow-xs">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground/60 mx-auto mb-3">
          <Calendar className="w-6 h-6" />
        </div>
        <p className="font-semibold text-foreground">Tidak Ada Kegiatan</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
          Tidak ada data kegiatan yang cocok dengan pencarian atau filter yang dipilih.
        </p>
      </div>
    );
  }

  return (
    <div className="md:hidden space-y-3.5">
      {kegiatan.map((item) => {
        const catConfig = getCategoryConfig(item.kategori);
        const { day, month, dayName } = getDayAndMonth(item.tanggal);
        const isMultiDay = item.tanggal_berakhir && item.tanggal_berakhir !== item.tanggal;

        return (
          <div
            key={item.id}
            className="bg-card rounded-2xl border border-border/80 p-4 shadow-xs transition-all hover:border-border"
          >
            <div className="flex items-start gap-3.5">
              {/* Date Box Indicator */}
              <div
                className="w-14 rounded-xl border border-border/70 p-2 text-center shrink-0 shadow-2xs flex flex-col justify-center"
                style={{
                  backgroundColor: `${catConfig.dotColor}12`,
                  borderColor: `${catConfig.dotColor}35`,
                }}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {dayName}
                </span>
                <span className="text-xl font-extrabold text-foreground leading-tight">
                  {day}
                </span>
                <span className="text-[11px] font-medium text-foreground/80">
                  {month}
                </span>
              </div>

              {/* Event Content Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                  <Badge
                    variant="outline"
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1.5 border ${getCategoryBadgeClasses(
                      item.kategori
                    )}`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: catConfig.dotColor }}
                    />
                    {item.kategori}
                  </Badge>
                </div>

                <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2">
                  {item.judul}
                </h3>

                {isMultiDay && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>Hingga {formatFullDate(item.tanggal_berakhir!)}</span>
                  </p>
                )}

                <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.waktu || 'Sepanjang hari'}</span>
                  </div>
                </div>

                {item.deskripsi && (
                  <p className="text-xs text-muted-foreground/90 mt-2 line-clamp-2 leading-relaxed bg-muted/40 p-2 rounded-lg border border-border/40">
                    {item.deskripsi}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Action Strip */}
            <div className="mt-3.5 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-9 px-3 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Link href="/kalender-akademik" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Lihat Publik
                </Link>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-9 px-3.5 text-xs border-border/80 text-foreground hover:bg-muted"
                >
                  <Link href={`/admin/kalender/edit/${item.id}`}>
                    <Edit className="h-3.5 w-3.5 mr-1.5 text-amber-600 dark:text-amber-400" />
                    Edit
                  </Link>
                </Button>
                <DeleteKegiatanButton kegiatanId={item.id} judulKegiatan={item.judul} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
