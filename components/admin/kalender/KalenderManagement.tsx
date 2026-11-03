// components/admin/kalender/KalenderManagement.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Search, Calendar, CalendarDays, Clock, Filter, Sparkles, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import KalenderTable from './KalenderTable';
import KalenderMobileList from './KalenderMobileList';
import { getCategoryConfig } from '@/lib/constants/calendar';

export type KegiatanAkademik = {
  id: number;
  judul: string;
  tanggal: string;
  tanggal_berakhir: string | null;
  waktu: string | null;
  kategori: string;
  deskripsi: string | null;
  warna?: string;
};

interface KalenderManagementProps {
  initialKegiatan: KegiatanAkademik[];
}

export default function KalenderManagement({ initialKegiatan }: KalenderManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState<string>('Semua');

  // Daftar kategori unik yang ada di data
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    initialKegiatan.forEach((k) => {
      if (k.kategori) set.add(k.kategori);
    });
    return Array.from(set);
  }, [initialKegiatan]);

  // Perhitungan metrics
  const metrics = useMemo(() => {
    const total = initialKegiatan.length;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Agenda bulan ini
    const thisMonthEvents = initialKegiatan.filter((item) => {
      const d = new Date(item.tanggal);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    // Agenda terdekat (tanggal >= hari ini, terdekat)
    const todayStr = now.toISOString().split('T')[0];
    const upcoming = [...initialKegiatan]
      .filter((item) => (item.tanggal_berakhir ? item.tanggal_berakhir >= todayStr : item.tanggal >= todayStr))
      .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())[0];

    return {
      total,
      bulanIni: thisMonthEvents.length,
      upcoming,
      monthName: now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
    };
  }, [initialKegiatan]);

  // Filter data berdasarkan search query dan kategori
  const filteredKegiatan = useMemo(() => {
    return initialKegiatan.filter((item) => {
      const matchesSearch =
        !searchQuery.trim() ||
        item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.deskripsi && item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedKategori === 'Semua' || item.kategori === selectedKategori;

      return matchesSearch && matchesCategory;
    });
  }, [initialKegiatan, searchQuery, selectedKategori]);

  return (
    <div className="space-y-6">
      {/* 3 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Agenda */}
        <div className="bg-card rounded-2xl border border-border/80 p-4 sm:p-5 shadow-xs flex items-center gap-4 transition-all hover:border-border">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Kegiatan
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-foreground font-mono">{metrics.total}</span>
              <span className="text-xs text-muted-foreground">kegiatan terdaftar</span>
            </div>
          </div>
        </div>

        {/* Card 2: Bulan Ini */}
        <div className="bg-card rounded-2xl border border-border/80 p-4 sm:p-5 shadow-xs flex items-center gap-4 transition-all hover:border-border">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Bulan Ini ({metrics.monthName})
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-foreground font-mono">{metrics.bulanIni}</span>
              <span className="text-xs text-muted-foreground">agenda aktif</span>
            </div>
          </div>
        </div>

        {/* Card 3: Agenda Terdekat */}
        <div className="bg-card rounded-2xl border border-border/80 p-4 sm:p-5 shadow-xs flex items-center gap-4 transition-all hover:border-border">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Agenda Terdekat
            </p>
            {metrics.upcoming ? (
              <div className="mt-0.5">
                <p className="text-sm font-bold text-foreground truncate">{metrics.upcoming.judul}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {new Date(metrics.upcoming.tanggal).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                  })}
                  {metrics.upcoming.waktu ? ` · ${metrics.upcoming.waktu}` : ''}
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">Tidak ada agenda mendatang</p>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="bg-card rounded-2xl border border-border/80 p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Cari judul atau deskripsi kegiatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 h-10 text-base sm:h-9 sm:text-sm bg-background border-border/80 rounded-xl focus-visible:ring-primary shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                aria-label="Bersihkan pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Results Summary Info */}
          <div className="text-xs text-muted-foreground flex items-center justify-between sm:justify-end gap-2 shrink-0">
            <span className="font-medium text-foreground">
              Menampilkan {filteredKegiatan.length} dari {initialKegiatan.length} agenda
            </span>
            {(searchQuery || selectedKategori !== 'Semua') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedKategori('Semua');
                }}
                className="h-7 px-2 text-xs text-primary hover:text-primary/80"
              >
                Reset Filter
              </Button>
            )}
          </div>
        </div>

        {/* Category Pill Tabs with Swipe Safeguards */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none select-none">
          <button
            type="button"
            onClick={() => setSelectedKategori('Semua')}
            className={`shrink-0 whitespace-nowrap min-w-max px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              selectedKategori === 'Semua'
                ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                : 'bg-muted/60 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted'
            }`}
          >
            Semua ({initialKegiatan.length})
          </button>

          {categoriesList.map((cat) => {
            const config = getCategoryConfig(cat);
            const count = initialKegiatan.filter((k) => k.kategori === cat).length;
            const isSelected = selectedKategori === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedKategori(cat)}
                className={`shrink-0 whitespace-nowrap min-w-max px-3 py-1.5 rounded-full text-xs font-medium transition-all inline-flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-foreground text-background border-foreground shadow-xs font-semibold'
                    : 'bg-background text-muted-foreground border-border/80 hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: config.dotColor }}
                />
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-background/20 text-background' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Views: Desktop Table & Mobile Cards */}
      <KalenderTable kegiatan={filteredKegiatan} />
      <KalenderMobileList kegiatan={filteredKegiatan} />
    </div>
  );
}
