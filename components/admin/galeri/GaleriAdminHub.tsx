'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ImageIcon,
  Search,
  X,
  LayoutGrid,
  List,
  Plus,
  BookOpen,
  Heart,
  Trophy,
  ExternalLink,
  Layers,
  Maximize2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import GaleriCard, { GaleriItem, getCategoryBadgeClass } from './GaleriCard';
import GaleriPreviewDialog from './GaleriPreviewDialog';
import EditImageButton from '@/app/admin/galeri/EditImageButton';
import DeleteImageButton from '@/app/admin/galeri/DeleteImageButton';
import { cn } from '@/lib/utils';

export const KATEGORI_TABS = [
  'Semua',
  'Kegiatan Belajar',
  'Bermain',
  'Seni & Kreativitas',
  'Ibadah',
  'Acara Khusus',
] as const;

interface GaleriAdminHubProps {
  items: GaleriItem[];
}

export default function GaleriAdminHub({ items }: GaleriAdminHubProps) {
  const [selectedKategori, setSelectedKategori] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [previewItem, setPreviewItem] = useState<GaleriItem | null>(null);

  // 1. Metric stats computation from the full dataset
  const stats = useMemo(() => {
    const total = items.length;
    const belajar = items.filter((i) => i.kategori === 'Kegiatan Belajar').length;
    const ibadah = items.filter((i) => i.kategori === 'Ibadah').length;
    const acaraKreativitas = items.filter(
      (i) =>
        i.kategori === 'Acara Khusus' ||
        i.kategori === 'Seni & Kreativitas' ||
        i.kategori === 'Bermain'
    ).length;

    return { total, belajar, ibadah, acaraKreativitas };
  }, [items]);

  // 2. Filtered list based on category & search query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (selectedKategori !== 'Semua' && item.kategori !== selectedKategori) {
        return false;
      }

      // Search filter (keterangan)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesCaption = item.keterangan?.toLowerCase().includes(query);
        const matchesCategory = item.kategori?.toLowerCase().includes(query);
        if (!matchesCaption && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [items, selectedKategori, searchQuery]);

  const handleResetFilters = () => {
    setSelectedKategori('Semua');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* 1. Summary Metric Highlights Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Foto */}
        <Card
          onClick={() => setSelectedKategori('Semua')}
          className={cn(
            'cursor-pointer transition-all border shadow-xs hover:border-primary/50',
            selectedKategori === 'Semua'
              ? 'border-primary/60 bg-primary/5 dark:bg-primary/10'
              : 'border-border/80 bg-card'
          )}
        >
          <CardContent className="p-3.5 sm:p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Total Foto</p>
              <p
                data-testid="stat-total-count"
                className="text-xl sm:text-2xl font-bold tracking-tight text-foreground"
              >
                {stats.total}
              </p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Kegiatan Belajar */}
        <Card
          onClick={() => setSelectedKategori('Kegiatan Belajar')}
          className={cn(
            'cursor-pointer transition-all border shadow-xs hover:border-sky-500/50',
            selectedKategori === 'Kegiatan Belajar'
              ? 'border-sky-500/60 bg-sky-500/5 dark:bg-sky-500/10'
              : 'border-border/80 bg-card'
          )}
        >
          <CardContent className="p-3.5 sm:p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Kegiatan Belajar</p>
              <p
                data-testid="stat-belajar-count"
                className="text-xl sm:text-2xl font-bold tracking-tight text-sky-600 dark:text-sky-400"
              >
                {stats.belajar}
              </p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Ibadah & Karakter */}
        <Card
          onClick={() => setSelectedKategori('Ibadah')}
          className={cn(
            'cursor-pointer transition-all border shadow-xs hover:border-emerald-500/50',
            selectedKategori === 'Ibadah'
              ? 'border-emerald-500/60 bg-emerald-500/5 dark:bg-emerald-500/10'
              : 'border-border/80 bg-card'
          )}
        >
          <CardContent className="p-3.5 sm:p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Ibadah & Karakter</p>
              <p
                data-testid="stat-ibadah-count"
                className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400"
              >
                {stats.ibadah}
              </p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Acara & Kreativitas */}
        <Card
          onClick={() => setSelectedKategori('Acara Khusus')}
          className={cn(
            'cursor-pointer transition-all border shadow-xs hover:border-amber-500/50',
            selectedKategori === 'Acara Khusus'
              ? 'border-amber-500/60 bg-amber-500/5 dark:bg-amber-500/10'
              : 'border-border/80 bg-card'
          )}
        >
          <CardContent className="p-3.5 sm:p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Acara & Kreativitas</p>
              <p
                data-testid="stat-acara-count"
                className="text-xl sm:text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400"
              >
                {stats.acaraKreativitas}
              </p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Interactive Controls Toolbar */}
      <div className="space-y-3">
        {/* Category Swipeable Pill Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 dark:bg-muted/30 border border-border/60 rounded-xl overflow-x-auto scrollbar-none">
          {KATEGORI_TABS.map((kat) => {
            const isActive = selectedKategori === kat;
            const count =
              kat === 'Semua'
                ? items.length
                : items.filter((i) => i.kategori === kat).length;

            return (
              <Button
                key={kat}
                type="button"
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedKategori(kat)}
                className={cn(
                  'h-8 text-xs font-medium rounded-lg transition-all shrink-0 whitespace-nowrap min-w-max px-3 sm:px-4',
                  isActive
                    ? 'bg-background text-foreground shadow-xs border border-border/80 dark:bg-card'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <span>{kat}</span>
                <span
                  className={cn(
                    'ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full',
                    isActive
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {count}
                </span>
              </Button>
            );
          })}
        </div>

        {/* Search Bar & View Mode Toggle */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Cari foto berdasarkan keterangan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 h-10 text-sm sm:h-9 sm:text-xs rounded-xl border-border/80 bg-card"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* View Mode Switcher */}
            <div className="flex items-center p-0.5 bg-muted/60 dark:bg-muted/30 border border-border/60 rounded-lg">
              <Button
                type="button"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'h-8 px-2.5 rounded-md text-xs',
                  viewMode === 'grid'
                    ? 'bg-background text-foreground shadow-xs dark:bg-card'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                title="Tampilan Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5 mr-1.5" />
                <span>Grid</span>
              </Button>
              <Button
                type="button"
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className={cn(
                  'h-8 px-2.5 rounded-md text-xs',
                  viewMode === 'table'
                    ? 'bg-background text-foreground shadow-xs dark:bg-card'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                title="Tampilan Tabel"
              >
                <List className="w-3.5 h-3.5 mr-1.5" />
                <span>Tabel</span>
              </Button>
            </div>

            <Button
              asChild
              size="sm"
              className="h-9 sm:h-8 text-xs rounded-xl gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 hidden sm:flex"
            >
              <Link href="/admin/galeri/tambah">
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Foto</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Main Content: Grid or Table View */}
      {filteredItems.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredItems.map((item) => (
              <GaleriCard
                key={item.id}
                item={item}
                onPreview={(selected) => setPreviewItem(selected)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
            <Table>
              <TableHeader>
                <TableRow className="border-border/80 bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-[100px] text-xs font-semibold">Foto</TableHead>
                  <TableHead className="text-xs font-semibold">Keterangan</TableHead>
                  <TableHead className="w-[160px] text-xs font-semibold">Kategori</TableHead>
                  <TableHead className="w-[150px] text-right text-xs font-semibold">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id} className="border-border/60 hover:bg-muted/30">
                    <TableCell>
                      <div
                        onClick={() => setPreviewItem(item)}
                        className="relative w-14 h-14 rounded-lg overflow-hidden border border-border/80 cursor-pointer group bg-muted/30"
                      >
                        <Image
                          src={item.image_url}
                          alt={item.keterangan || 'Foto'}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs sm:text-sm font-medium text-foreground line-clamp-2">
                        {item.keterangan || 'Tanpa Keterangan'}
                      </p>
                    </TableCell>
                    <TableCell>
                      {item.kategori ? (
                        <Badge
                          variant="outline"
                          className={cn('text-[11px] font-semibold', getCategoryBadgeClass(item.kategori))}
                        >
                          {item.kategori}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <EditImageButton
                          galeriId={item.id}
                          imageUrl={item.image_url}
                          keterangan={item.keterangan}
                          kategori={item.kategori}
                        />
                        <DeleteImageButton galeriId={item.id} imageUrl={item.image_url} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      ) : (
        /* Empty State */
        <Card className="border border-dashed border-border/80 bg-card p-8 sm:p-12 text-center rounded-2xl">
          <div className="max-w-md mx-auto flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 dark:bg-muted/30 border border-border/80 flex items-center justify-center text-muted-foreground">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-foreground">
                {items.length === 0 ? 'Galeri Masih Kosong' : 'Tidak ada foto yang cocok'}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {items.length === 0
                  ? 'Mulai dokumentasikan kegiatan dan momen terbaik madrasah dengan menambahkan foto pertama.'
                  : 'Coba ubah kata kunci pencarian atau pilih kategori lain.'}
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2">
              {items.length === 0 ? (
                <Button asChild size="sm" className="rounded-xl gap-2">
                  <Link href="/admin/galeri/tambah">
                    <Plus className="w-4 h-4" />
                    <span>Tambah Foto Pertama</span>
                  </Link>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="rounded-xl border-border"
                >
                  Reset Filter
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* 4. Preview Lightbox Dialog */}
      <GaleriPreviewDialog
        item={previewItem}
        open={!!previewItem}
        onOpenChange={(isOpen) => !isOpen && setPreviewItem(null)}
      />

      {/* 5. Mobile Sticky Bottom Action Dock */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-background/95 backdrop-blur-md border-t border-border z-40 sm:hidden flex items-center justify-between gap-3 shadow-lg">
        <div className="text-xs text-muted-foreground font-medium pl-1">
          <span>{filteredItems.length} foto ditampilkan</span>
        </div>
        <Button
          asChild
          size="sm"
          className="h-10 text-xs rounded-xl gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 shadow-sm"
        >
          <Link href="/admin/galeri/tambah">
            <Plus className="w-4 h-4" />
            <span>Tambah Foto</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
