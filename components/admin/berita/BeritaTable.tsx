'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Newspaper,
  CheckCircle2,
  Clock,
  Search,
  X,
  Plus,
  Eye,
  Edit,
  FileText,
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
import BeritaMobileCard, { BeritaItem } from './BeritaMobileCard';
import DeleteButton from '@/app/admin/berita/DeleteButton';
import { cn } from '@/lib/utils';

export type { BeritaItem };

interface BeritaTableProps {
  berita: BeritaItem[];
}

export default function BeritaTable({ berita }: BeritaTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'terbit' | 'draft'>('ALL');

  // Stats calculation
  const stats = useMemo(() => {
    const total = berita.length;
    const published = berita.filter(
      (b) => b.status === 'published' || b.status === 'terbit'
    ).length;
    const draft = berita.filter((b) => b.status === 'draft').length;
    return { total, published, draft };
  }, [berita]);

  // Filtered list
  const filteredBerita = useMemo(() => {
    return berita.filter((item) => {
      // Status filter
      if (statusFilter === 'terbit') {
        const isPublished = item.status === 'published' || item.status === 'terbit';
        if (!isPublished) return false;
      } else if (statusFilter === 'draft') {
        if (item.status !== 'draft') return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.judul?.toLowerCase().includes(query);
        const matchesSummary = item.ringkasan?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSummary) return false;
      }

      return true;
    });
  }, [berita, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 1. Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Total Berita */}
        <Card
          onClick={() => setStatusFilter('ALL')}
          className={cn(
            'cursor-pointer transition-all border shadow-xs hover:border-primary/50',
            statusFilter === 'ALL'
              ? 'border-primary/60 bg-primary/5 dark:bg-primary/10'
              : 'border-border/80 bg-card'
          )}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Total Berita</p>
              <p
                data-testid="stat-total-count"
                className="text-2xl font-bold tracking-tight text-foreground"
              >
                {stats.total}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Newspaper className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Diterbitkan */}
        <Card
          onClick={() => setStatusFilter('terbit')}
          className={cn(
            'cursor-pointer transition-all border shadow-xs hover:border-emerald-500/50',
            statusFilter === 'terbit'
              ? 'border-emerald-500/60 bg-emerald-500/5 dark:bg-emerald-500/10'
              : 'border-border/80 bg-card'
          )}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Diterbitkan</p>
              <p
                data-testid="stat-published-count"
                className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400"
              >
                {stats.published}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Draft */}
        <Card
          onClick={() => setStatusFilter('draft')}
          className={cn(
            'cursor-pointer transition-all border shadow-xs hover:border-amber-500/50',
            statusFilter === 'draft'
              ? 'border-amber-500/60 bg-amber-500/5 dark:bg-amber-500/10'
              : 'border-border/80 bg-card'
          )}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Draft</p>
              <p
                data-testid="stat-draft-count"
                className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400"
              >
                {stats.draft}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Controls Toolbar: Search & Status Pills */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        {/* Status Pill Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 dark:bg-muted/30 border border-border/60 rounded-xl overflow-x-auto scrollbar-none">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setStatusFilter('ALL')}
            className={cn(
              'h-8 text-xs font-medium rounded-lg shrink-0 whitespace-nowrap min-w-max px-4 transition-all',
              statusFilter === 'ALL'
                ? 'bg-card text-foreground shadow-xs border border-border/80'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Semua ({stats.total})
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setStatusFilter('terbit')}
            className={cn(
              'h-8 text-xs font-medium rounded-lg shrink-0 whitespace-nowrap min-w-max px-4 transition-all',
              statusFilter === 'terbit'
                ? 'bg-card text-foreground shadow-xs border border-border/80'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Diterbitkan ({stats.published})
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setStatusFilter('draft')}
            className={cn(
              'h-8 text-xs font-medium rounded-lg shrink-0 whitespace-nowrap min-w-max px-4 transition-all',
              statusFilter === 'draft'
                ? 'bg-card text-foreground shadow-xs border border-border/80'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Draft ({stats.draft})
          </Button>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berita berdasarkan judul..."
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

      {/* 3. News Presentation: Hybrid (Table on Desktop, Cards on Mobile) */}
      {filteredBerita.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-14 text-center font-semibold text-foreground">
                    No
                  </TableHead>
                  <TableHead className="w-20 font-semibold text-foreground">Cover</TableHead>
                  <TableHead className="font-semibold text-foreground">Judul & Ringkasan</TableHead>
                  <TableHead className="w-36 font-semibold text-foreground">Tanggal</TableHead>
                  <TableHead className="w-28 font-semibold text-foreground">Status</TableHead>
                  <TableHead className="w-32 text-right font-semibold text-foreground pr-6">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border/60">
                {filteredBerita.map((item, index) => {
                  const isPublished =
                    item.status === 'published' || item.status === 'terbit';
                  const formattedDate = new Date(item.tanggal_terbit).toLocaleDateString(
                    'id-ID',
                    {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    }
                  );

                  return (
                    <TableRow
                      key={item.id}
                      className="border-border hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="text-center font-mono text-xs text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border/60 bg-muted/40 flex items-center justify-center shrink-0">
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.judul}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <FileText className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-sm text-foreground line-clamp-1 hover:text-primary transition-colors">
                            <Link href={`/admin/berita/edit/${item.id}`}>{item.judul}</Link>
                          </p>
                          {item.ringkasan && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {item.ringkasan}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {formattedDate}
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-muted"
                            asChild
                            title="Lihat Pratinjau"
                          >
                            <Link href={`/berita/${item.id}`}>
                              <Eye className="h-4 w-4 text-primary" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-muted"
                            asChild
                            title="Edit Berita"
                          >
                            <Link href={`/admin/berita/edit/${item.id}`}>
                              <Edit className="h-4 w-4 text-amber-500" />
                            </Link>
                          </Button>
                          <DeleteButton beritaId={item.id} imageUrl={item.image_url} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards List View */}
          <div className="block md:hidden space-y-3">
            {filteredBerita.map((item, index) => (
              <BeritaMobileCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </>
      ) : (
        /* Empty State */
        <Card className="border border-border/80 bg-card rounded-2xl shadow-xs py-12 px-4 text-center">
          <CardContent className="flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-muted/60 border border-border/60 flex items-center justify-center text-muted-foreground">
              <Newspaper className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-base text-foreground">Belum Ada Berita</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                {searchQuery || statusFilter !== 'ALL'
                  ? 'Tidak ada artikel berita yang cocok dengan kriteria filter atau pencarian Anda.'
                  : 'Mulai publikasikan artikel informasi dan kegiatan sekolah untuk pembaca website.'}
              </p>
            </div>
            {searchQuery || statusFilter !== 'ALL' ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                }}
                className="mt-2 text-xs h-9 rounded-xl"
              >
                Reset Filter
              </Button>
            ) : (
              <Button asChild size="sm" className="mt-2 gap-2 text-xs h-9 rounded-xl font-medium">
                <Link href="/admin/berita/tambah">
                  <Plus className="w-4 h-4" />
                  Tambah Berita Baru
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
