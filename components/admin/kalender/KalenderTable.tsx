// components/admin/kalender/KalenderTable.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Edit, ExternalLink, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DeleteKegiatanButton from '@/app/admin/kalender/DeleteKegiatanButton';
import { getCategoryConfig, getCategoryBadgeClasses } from '@/lib/constants/calendar';
import type { KegiatanAkademik } from './KalenderManagement';

interface KalenderTableProps {
  kegiatan: KegiatanAkademik[];
}

export default function KalenderTable({ kegiatan }: KalenderTableProps) {
  const formatTanggal = (tanggal: string) => {
    const d = new Date(tanggal);
    return d.toLocaleDateString('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="hidden md:block bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border/80 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3.5 w-14 text-center">No</th>
              <th className="px-5 py-3.5">Judul Kegiatan</th>
              <th className="px-5 py-3.5">Tanggal Pelaksanaan</th>
              <th className="px-5 py-3.5">Waktu</th>
              <th className="px-5 py-3.5">Kategori</th>
              <th className="px-5 py-3.5 text-right pr-6">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {kegiatan.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground/60 mb-1">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-foreground">Tidak Ada Kegiatan</p>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      Tidak ada data kegiatan akademik yang sesuai dengan kriteria pencarian atau filter saat ini.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              kegiatan.map((item, index) => {
                const catConfig = getCategoryConfig(item.kategori);
                const isMultiDay = item.tanggal_berakhir && item.tanggal_berakhir !== item.tanggal;

                return (
                  <tr key={item.id} className="hover:bg-muted/40 transition-colors group">
                    <td className="px-5 py-4 text-center text-xs text-muted-foreground font-mono">
                      {index + 1}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-border/60 mt-0.5"
                          style={{
                            backgroundColor: `${catConfig.dotColor}18`,
                            color: catConfig.dotColor,
                          }}
                        >
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground leading-snug line-clamp-1">
                            {item.judul}
                          </p>
                          {item.deskripsi && (
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 leading-relaxed">
                              {item.deskripsi}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-foreground/90 whitespace-nowrap">
                      <div className="text-xs leading-relaxed">
                        <span className="font-medium">{formatTanggal(item.tanggal)}</span>
                        {isMultiDay && (
                          <div className="text-muted-foreground flex items-center gap-1 mt-0.5">
                            <span>s.d.</span>
                            <span className="font-medium">{formatTanggal(item.tanggal_berakhir!)}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-foreground/90 whitespace-nowrap">
                      {item.waktu ? (
                        <div className="inline-flex items-center gap-1.5 text-xs text-foreground/80">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{item.waktu}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Sepanjang hari</span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1.5 border shadow-2xs ${getCategoryBadgeClasses(
                          item.kategori
                        )}`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: catConfig.dotColor }}
                        />
                        {item.kategori}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right pr-6 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Lihat di Kalender Publik"
                        >
                          <Link href="/kalender-akademik" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">Lihat Kalender Publik</span>
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0 border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="Edit Kegiatan"
                        >
                          <Link href={`/admin/kalender/edit/${item.id}`}>
                            <Edit className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            <span className="sr-only">Edit Kegiatan</span>
                          </Link>
                        </Button>
                        <DeleteKegiatanButton kegiatanId={item.id} judulKegiatan={item.judul} />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
