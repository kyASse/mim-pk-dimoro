'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { OpiniPerspektif } from '@/lib/types/ruang-perspektif';
import {
  Star,
  Eye,
  Clock,
  CheckCircle2,
  BookOpen,
  Search,
  X,
  FileText,
} from 'lucide-react';
import { toggleFeaturedOpiniAction } from '@/app/admin/ruang-perspektif/actions';
import { toast } from 'sonner';
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
import OpiniMobileCard from './OpiniMobileCard';
import { cn } from '@/lib/utils';

interface OpiniAdminTableProps {
  items: OpiniPerspektif[];
}

export default function OpiniAdminTable({ items }: OpiniAdminTableProps) {
  const [opiniList, setOpiniList] = useState<OpiniPerspektif[]>(items);
  const [statusFilter, setStatusFilter] = useState<
    'semua' | 'menunggu_kurasi' | 'terbit' | 'ditolak' | 'arsip'
  >('semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Keep state in sync with props
  useEffect(() => {
    setOpiniList(items);
  }, [items]);

  const handleToggleFeatured = async (id: string, current: boolean) => {
    // Optimistic update
    setOpiniList((prev) =>
      prev.map((op) => (op.id === id ? { ...op, is_featured: !current } : op))
    );

    const res = await toggleFeaturedOpiniAction(id, !current);
    if (res.success) {
      toast.success(current ? 'Dilepas dari sorotan' : 'Dijadikan naskah sorotan');
    } else {
      // Revert on error
      setOpiniList((prev) =>
        prev.map((op) => (op.id === id ? { ...op, is_featured: current } : op))
      );
      toast.error(res.error || 'Gagal mengubah sorotan');
    }
  };

  // 1. Metric Stats Calculation (computed from the full opinion list)
  const stats = useMemo(() => {
    const total = opiniList.length;
    const menunggu = opiniList.filter((o) => o.status === 'menunggu_kurasi').length;
    const terbit = opiniList.filter((o) => o.status === 'terbit').length;
    const featured = opiniList.filter((o) => o.is_featured).length;
    const ditolak = opiniList.filter((o) => o.status === 'ditolak').length;
    const arsip = opiniList.filter((o) => o.status === 'arsip').length;
    return { total, menunggu, terbit, featured, ditolak, arsip };
  }, [opiniList]);

  // 2. Filtered list
  const filteredItems = useMemo(() => {
    return opiniList.filter((op) => {
      // Status filter
      if (statusFilter !== 'semua' && op.status !== statusFilter) {
        return false;
      }

      // Search query filter (matches title, writer name, or category)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = op.judul?.toLowerCase().includes(query);
        const matchesPenulis = op.nama_penulis?.toLowerCase().includes(query);
        const matchesKategori = op.kategori?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesPenulis && !matchesKategori) {
          return false;
        }
      }

      return true;
    });
  }, [opiniList, statusFilter, searchQuery]);

  const statusBadge = (st: string) => {
    switch (st) {
      case 'menunggu_kurasi':
        return (
          <Badge
            variant="outline"
            className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
          >
            Menunggu Kurasi
          </Badge>
        );
      case 'terbit':
        return (
          <Badge
            variant="outline"
            className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
          >
            Terbit
          </Badge>
        );
      case 'ditolak':
        return (
          <Badge
            variant="outline"
            className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30"
          >
            Ditolak
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground border-border"
          >
            Arsip
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Summary Metric Highlights Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Perlu Kurasi */}
        <Card
          onClick={() => setStatusFilter('menunggu_kurasi')}
          className={cn(
            'cursor-pointer transition-all border shadow-xs hover:border-amber-500/50',
            statusFilter === 'menunggu_kurasi'
              ? 'border-amber-500/60 bg-amber-500/5 dark:bg-amber-500/10'
              : 'border-border/80 bg-card'
          )}
        >
          <CardContent className="p-3.5 sm:p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Perlu Kurasi</p>
              <p
                data-testid="stat-menunggu-count"
                className="text-xl sm:text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400"
              >
                {stats.menunggu}
              </p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Naskah Terbit */}
        <Card
          onClick={() => setStatusFilter('terbit')}
          className={cn(
            'cursor-pointer transition-all border shadow-xs hover:border-emerald-500/50',
            statusFilter === 'terbit'
              ? 'border-emerald-500/60 bg-emerald-500/5 dark:bg-emerald-500/10'
              : 'border-border/80 bg-card'
          )}
        >
          <CardContent className="p-3.5 sm:p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Naskah Terbit</p>
              <p
                data-testid="stat-terbit-count"
                className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400"
              >
                {stats.terbit}
              </p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Naskah Sorotan (Featured) */}
        <Card
          className="border border-border/80 bg-card shadow-xs transition-all hover:border-amber-500/40"
        >
          <CardContent className="p-3.5 sm:p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Naskah Sorotan</p>
              <p
                data-testid="stat-featured-count"
                className="text-xl sm:text-2xl font-bold tracking-tight text-amber-500"
              >
                {stats.featured}
              </p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-amber-500" />
            </div>
          </CardContent>
        </Card>

        {/* Total Masuk */}
        <Card
          onClick={() => setStatusFilter('semua')}
          className={cn(
            'cursor-pointer transition-all border shadow-xs hover:border-primary/50',
            statusFilter === 'semua'
              ? 'border-primary/60 bg-primary/5 dark:bg-primary/10'
              : 'border-border/80 bg-card'
          )}
        >
          <CardContent className="p-3.5 sm:p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Total Masuk</p>
              <p
                data-testid="stat-total-count"
                className="text-xl sm:text-2xl font-bold tracking-tight text-foreground"
              >
                {stats.total}
              </p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Interactive Toolbar: Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 dark:bg-muted/30 border border-border/60 rounded-xl overflow-x-auto scrollbar-none">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setStatusFilter('semua')}
            className={cn(
              'h-8 text-xs font-medium rounded-lg shrink-0 whitespace-nowrap min-w-max px-3.5 sm:px-4 transition-all',
              statusFilter === 'semua'
                ? 'bg-card text-foreground shadow-xs border border-border/80 font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Semua ({stats.total})
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setStatusFilter('menunggu_kurasi')}
            className={cn(
              'h-8 text-xs font-medium rounded-lg shrink-0 whitespace-nowrap min-w-max px-3.5 sm:px-4 transition-all',
              statusFilter === 'menunggu_kurasi'
                ? 'bg-card text-foreground shadow-xs border border-border/80 font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Menunggu Kurasi ({stats.menunggu})
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setStatusFilter('terbit')}
            className={cn(
              'h-8 text-xs font-medium rounded-lg shrink-0 whitespace-nowrap min-w-max px-3.5 sm:px-4 transition-all',
              statusFilter === 'terbit'
                ? 'bg-card text-foreground shadow-xs border border-border/80 font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Terbit ({stats.terbit})
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setStatusFilter('ditolak')}
            className={cn(
              'h-8 text-xs font-medium rounded-lg shrink-0 whitespace-nowrap min-w-max px-3.5 sm:px-4 transition-all',
              statusFilter === 'ditolak'
                ? 'bg-card text-foreground shadow-xs border border-border/80 font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Ditolak ({stats.ditolak})
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setStatusFilter('arsip')}
            className={cn(
              'h-8 text-xs font-medium rounded-lg shrink-0 whitespace-nowrap min-w-max px-3.5 sm:px-4 transition-all',
              statusFilter === 'arsip'
                ? 'bg-card text-foreground shadow-xs border border-border/80 font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Arsip ({stats.arsip})
          </Button>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari naskah atau penulis..."
            className="h-10 sm:h-9 pl-9 pr-8 text-sm sm:text-xs rounded-xl bg-card border-border/80 focus-visible:ring-primary/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full"
              aria-label="Bersihkan pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Data Presentation */}
      {filteredItems.length > 0 ? (
        <>
          {/* Mobile Card List */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredItems.map((op) => (
              <OpiniMobileCard
                key={op.id}
                item={op}
                onToggleFeatured={handleToggleFeatured}
              />
            ))}
          </div>

          {/* Desktop Data Table */}
          <div className="hidden md:block rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-16 font-semibold text-foreground">Sampul</TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Judul & Ringkasan
                  </TableHead>
                  <TableHead className="w-44 font-semibold text-foreground">
                    Penulis & Peran
                  </TableHead>
                  <TableHead className="w-32 font-semibold text-foreground">
                    Tanggal Masuk
                  </TableHead>
                  <TableHead className="w-32 font-semibold text-foreground">Status</TableHead>
                  <TableHead className="w-20 text-center font-semibold text-foreground">
                    Sorotan
                  </TableHead>
                  <TableHead className="w-28 text-right font-semibold text-foreground pr-6">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border/60">
                {filteredItems.map((op) => {
                  const imageSrc = op.gambar_sampul_url || op.foto_penulis_url;
                  const displayRole =
                    op.keterangan_peran || op.peran_penulis.replace('_', ' ');
                  const formattedDate = new Date(op.created_at).toLocaleDateString(
                    'id-ID',
                    {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    }
                  );

                  return (
                    <TableRow
                      key={op.id}
                      className="border-border hover:bg-muted/30 transition-colors"
                    >
                      {/* Cover Thumbnail */}
                      <TableCell className="py-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border/60 bg-muted/40 flex items-center justify-center shrink-0">
                          {imageSrc ? (
                            <Image
                              src={imageSrc}
                              alt={op.judul}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <FileText className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>

                      {/* Judul & Ringkasan */}
                      <TableCell className="py-3 max-w-sm">
                        <div className="space-y-1">
                          <Badge
                            variant="secondary"
                            className="text-[10px] font-medium bg-primary/10 text-primary border-primary/20 max-w-[200px] truncate"
                          >
                            {op.kategori}
                          </Badge>
                          <Link
                            href={`/admin/ruang-perspektif/${op.id}`}
                            className="block font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
                          >
                            {op.judul}
                          </Link>
                          {op.ringkasan && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {op.ringkasan}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* Penulis & Peran */}
                      <TableCell className="py-3">
                        <p className="font-semibold text-xs text-foreground">
                          {op.nama_penulis}
                        </p>
                        <p className="text-[11px] text-muted-foreground capitalize">
                          {displayRole}
                        </p>
                      </TableCell>

                      {/* Tanggal */}
                      <TableCell className="py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {formattedDate}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-3">{statusBadge(op.status)}</TableCell>

                      {/* Sorotan */}
                      <TableCell className="py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(op.id, op.is_featured)}
                          aria-label={
                            op.is_featured ? 'Hapus sorotan' : 'Jadikan sorotan'
                          }
                          className={cn(
                            'p-1.5 rounded-lg border border-transparent transition-colors',
                            op.is_featured
                              ? 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                              : 'text-muted-foreground hover:text-amber-500 hover:bg-muted'
                          )}
                          title={
                            op.is_featured
                              ? 'Lepas dari sorotan'
                              : 'Jadikan naskah sorotan'
                          }
                        >
                          <Star
                            className={cn(
                              'w-4 h-4',
                              op.is_featured && 'fill-amber-500 text-amber-500'
                            )}
                          />
                        </button>
                      </TableCell>

                      {/* Aksi */}
                      <TableCell className="py-3 text-right pr-6">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs gap-1.5 hover:bg-muted"
                        >
                          <Link href={`/admin/ruang-perspektif/${op.id}`}>
                            <Eye className="w-3.5 h-3.5 text-primary" />
                            <span>Tinjau</span>
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        /* Empty State */
        <Card className="border border-border/80 bg-card rounded-2xl shadow-xs py-12 px-4 text-center">
          <CardContent className="flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-muted/60 border border-border/60 flex items-center justify-center text-muted-foreground">
              <BookOpen className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-base text-foreground">
                Tidak Ada Naskah Opini
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                {searchQuery || statusFilter !== 'semua'
                  ? 'Tidak ada naskah opini yang cocok dengan filter atau kata kunci pencarian Anda.'
                  : 'Belum ada naskah opini yang masuk ke meja redaksi.'}
              </p>
            </div>
            {(searchQuery || statusFilter !== 'semua') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('semua');
                }}
                className="mt-2 text-xs h-9 rounded-xl"
              >
                Reset Filter
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
