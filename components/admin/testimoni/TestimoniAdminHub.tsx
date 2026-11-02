'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    X,
    LayoutGrid,
    List,
    Eye,
    Edit,
    RotateCcw,
    MessageSquareQuote,
    CheckCircle2,
    EyeOff,
    Clock,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { toggleFeaturedTestimoniAction } from '@/app/admin/testimoni/actions';
import DeleteTestimoniButton from '@/app/admin/testimoni/DeleteTestimoniButton';
import TestimoniCard, { type TestimoniItem } from './TestimoniCard';
import TestimoniPreviewDialog from './TestimoniPreviewDialog';

export interface TestimoniAdminHubProps {
    initialTestimoni: TestimoniItem[];
}

type FilterStatus = 'all' | 'featured' | 'regular' | 'recent';
type ViewMode = 'grid' | 'table';

function formatDate(dateStr: string) {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    } catch {
        return '';
    }
}

export default function TestimoniAdminHub({ initialTestimoni }: TestimoniAdminHubProps) {
    const [items, setItems] = useState<TestimoniItem[]>(initialTestimoni);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    // Quick toggle loading state
    const [togglingId, setTogglingId] = useState<number | null>(null);

    // Preview dialog state
    const [previewItem, setPreviewItem] = useState<TestimoniItem | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        setItems(initialTestimoni);
    }, [initialTestimoni]);

    // Metric statistics calculation
    const metrics = useMemo(() => {
        const total = items.length;
        const featured = items.filter((item) => Boolean(item.is_featured)).length;
        const regular = items.filter((item) => !item.is_featured).length;
        const now = Date.now();
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        const recent = items.filter((item) => {
            if (!item.created_at) return false;
            const time = new Date(item.created_at).getTime();
            if (isNaN(time)) return false;
            return time >= (now - sevenDaysMs);
        }).length;

        return { total, featured, regular, recent };
    }, [items]);

    // Filter items based on activeFilter and searchQuery
    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            // Filter by active category
            if (activeFilter === 'featured' && !item.is_featured) return false;
            if (activeFilter === 'regular' && item.is_featured) return false;
            if (activeFilter === 'recent') {
                const time = new Date(item.created_at).getTime();
                const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                if (isNaN(time) || time < sevenDaysAgo) return false;
            }

            // Filter by search query (author name, author status, or quote text)
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase().trim();
                const parentName = (item.nama_orang_tua || '').toLowerCase();
                const parentStatus = (item.status_orang_tua || '').toLowerCase();
                const quote = (item.isi_testimoni || '').toLowerCase();
                if (!parentName.includes(query) && !parentStatus.includes(query) && !quote.includes(query)) {
                    return false;
                }
            }

            return true;
        });
    }, [items, activeFilter, searchQuery]);

    // Handle quick inline toggle
    const handleToggleFeatured = async (id: number, currentFeatured: boolean) => {
        setTogglingId(id);
        try {
            const res = await toggleFeaturedTestimoniAction(id, currentFeatured);
            if (res.success) {
                toast.success(res.message);
                const newState = res.is_featured ?? !currentFeatured;
                setItems((prev) =>
                    prev.map((item) =>
                        item.id === id ? { ...item, is_featured: newState } : item
                    )
                );
                if (previewItem && previewItem.id === id) {
                    setPreviewItem((prev) => (prev ? { ...prev, is_featured: newState } : null));
                }
            } else {
                toast.error(res.message || 'Gagal mengubah status testimoni');
            }
        } catch {
            toast.error('Terjadi kesalahan saat mengubah status testimoni');
        } finally {
            setTogglingId(null);
        }
    };

    const handlePreview = (item: TestimoniItem) => {
        setPreviewItem(item);
        setIsPreviewOpen(true);
    };

    const handleResetFilter = () => {
        setSearchQuery('');
        setActiveFilter('all');
    };

    const statusTabs = [
        { value: 'all' as const, label: 'Semua', count: metrics.total },
        { value: 'featured' as const, label: 'Tampil di Beranda', count: metrics.featured },
        { value: 'regular' as const, label: 'Belum Ditampilkan', count: metrics.regular },
    ];

    return (
        <div className="space-y-6">
            {/* 4 Metric Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                {/* Metric 1: Total */}
                <button
                    type="button"
                    onClick={() => setActiveFilter('all')}
                    className={cn(
                        "text-left rounded-2xl border transition-all p-4 sm:p-5 flex items-center justify-between bg-card shadow-2xs hover:border-primary/40 cursor-pointer",
                        activeFilter === 'all' ? "border-primary ring-1 ring-primary/40" : "border-border/80"
                    )}
                >
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Total Testimoni
                        </p>
                        <p data-testid="stat-total-count" className="text-2xl sm:text-3xl font-bold text-foreground">
                            {metrics.total}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                            Semua testimoni terdata
                        </p>
                    </div>
                    <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <MessageSquareQuote className="w-5 h-5" />
                    </div>
                </button>

                {/* Metric 2: Tampil di Beranda */}
                <button
                    type="button"
                    onClick={() => setActiveFilter('featured')}
                    className={cn(
                        "text-left rounded-2xl border transition-all p-4 sm:p-5 flex items-center justify-between bg-card shadow-2xs hover:border-emerald-500/40 cursor-pointer",
                        activeFilter === 'featured' ? "border-emerald-500 ring-1 ring-emerald-500/40" : "border-border/80"
                    )}
                >
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Tampil di Beranda
                        </p>
                        <p data-testid="stat-featured-count" className="text-2xl sm:text-3xl font-bold text-foreground">
                            {metrics.featured}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                            Aktif di halaman utama
                        </p>
                    </div>
                    <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                </button>

                {/* Metric 3: Belum Ditampilkan */}
                <button
                    type="button"
                    onClick={() => setActiveFilter('regular')}
                    className={cn(
                        "text-left rounded-2xl border transition-all p-4 sm:p-5 flex items-center justify-between bg-card shadow-2xs hover:border-amber-500/40 cursor-pointer",
                        activeFilter === 'regular' ? "border-amber-500 ring-1 ring-amber-500/40" : "border-border/80"
                    )}
                >
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Belum Ditampilkan
                        </p>
                        <p data-testid="stat-regular-count" className="text-2xl sm:text-3xl font-bold text-foreground">
                            {metrics.regular}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                            Draf atau arsip
                        </p>
                    </div>
                    <div className="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <EyeOff className="w-5 h-5" />
                    </div>
                </button>

                {/* Metric 4: Terbaru (7 Hari) */}
                <button
                    type="button"
                    onClick={() => setActiveFilter('recent')}
                    className={cn(
                        "text-left rounded-2xl border transition-all p-4 sm:p-5 flex items-center justify-between bg-card shadow-2xs hover:border-blue-500/40 cursor-pointer",
                        activeFilter === 'recent' ? "border-blue-500 ring-1 ring-blue-500/40" : "border-border/80"
                    )}
                >
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Terbaru (7 Hari)
                        </p>
                        <p data-testid="stat-recent-count" className="text-2xl sm:text-3xl font-bold text-foreground">
                            {metrics.recent}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                            Masuk 7 hari terakhir
                        </p>
                    </div>
                    <div className="h-11 w-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5" />
                    </div>
                </button>
            </div>

            {/* Filter Controls (Search Bar, Status Tabs, and View Mode) */}
            <div className="space-y-3.5">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                    {/* Live Search Bar */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <Input
                            type="text"
                            placeholder="Cari nama orang tua, status, atau isi testimoni..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-9 h-10 text-sm sm:h-8 sm:text-xs bg-card border-border/80 text-foreground placeholder:text-muted-foreground focus-visible:ring-1"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
                                title="Hapus pencarian"
                                aria-label="Hapus pencarian"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Result Counter & View Mode Switch */}
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                        <div className="text-xs text-muted-foreground self-center sm:self-auto">
                            Menampilkan <strong className="text-foreground">{filteredItems.length}</strong> dari{' '}
                            {items.length} testimoni
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-1 border border-border/80 rounded-xl p-1 bg-card">
                            <Button
                                type="button"
                                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                                className={cn(
                                    "h-10 text-sm sm:h-8 sm:text-xs px-2.5 sm:px-3 gap-1.5",
                                    viewMode === 'grid' ? "bg-muted font-semibold text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
                                )}
                                aria-label="Tampilan Grid"
                            >
                                <LayoutGrid className="w-4 h-4" />
                                <span className="hidden sm:inline">Grid</span>
                            </Button>
                            <Button
                                type="button"
                                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('table')}
                                className={cn(
                                    "h-10 text-sm sm:h-8 sm:text-xs px-2.5 sm:px-3 gap-1.5",
                                    viewMode === 'table' ? "bg-muted font-semibold text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
                                )}
                                aria-label="Tampilan Tabel"
                            >
                                <List className="w-4 h-4" />
                                <span className="hidden sm:inline">Tabel</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Status Tabs with mobile safeguards */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div
                        role="tablist"
                        aria-label="Filter status testimoni"
                        className="overflow-x-auto pb-1.5 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none"
                    >
                        <div className="flex items-center gap-1.5 min-w-max bg-muted/60 p-1 rounded-xl border border-border/80">
                            {statusTabs.map((tab) => {
                                const isSelected = activeFilter === tab.value;
                                return (
                                    <button
                                        key={tab.value}
                                        role="tab"
                                        type="button"
                                        aria-selected={isSelected}
                                        onClick={() => setActiveFilter(tab.value)}
                                        className={cn(
                                            "shrink-0 whitespace-nowrap min-w-max px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                                            isSelected
                                                ? "bg-card text-foreground shadow-2xs font-semibold"
                                                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                                        )}
                                    >
                                        <span>{tab.label}</span>
                                        <span
                                            className={cn(
                                                "px-1.5 py-0.5 rounded-full text-[10px]",
                                                isSelected
                                                    ? "bg-muted text-foreground font-semibold"
                                                    : "bg-muted/80 text-muted-foreground"
                                            )}
                                        >
                                            {tab.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {activeFilter === 'recent' && (
                        <Badge
                            variant="outline"
                            className="shrink-0 h-8 px-3 gap-1.5 text-xs bg-primary/10 text-primary border-primary/20"
                        >
                            <span>Filter: 7 Hari Terakhir</span>
                            <button
                                type="button"
                                onClick={() => setActiveFilter('all')}
                                className="hover:opacity-75"
                                aria-label="Hapus filter 7 hari terakhir"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </Badge>
                    )}
                </div>
            </div>

            {/* List / Grid / Table Content or Empty State */}
            {filteredItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 sm:p-12 text-center space-y-3">
                    <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <MessageSquareQuote className="w-6 h-6 opacity-40" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-semibold text-foreground text-sm sm:text-base">
                            Tidak ada testimoni yang ditemukan
                        </h4>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                            Tidak ada testimoni yang cocok dengan kata kunci pencarian atau filter status yang dipilih.
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleResetFilter}
                        className="mt-2 text-xs border-border/80 hover:bg-muted gap-1.5 h-10 sm:h-8"
                        aria-label="Reset filter"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset Filter
                    </Button>
                </div>
            ) : viewMode === 'grid' ? (
                /* Grid View Mode */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredItems.map((item) => (
                        <TestimoniCard
                            key={item.id}
                            item={item}
                            onPreview={handlePreview}
                            onToggleFeatured={handleToggleFeatured}
                            isToggling={togglingId === item.id}
                        />
                    ))}
                </div>
            ) : (
                /* Table View Mode */
                <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-2xs">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/80">
                                <TableHead className="w-[50px] text-xs font-semibold text-muted-foreground">No</TableHead>
                                <TableHead className="w-[180px] text-xs font-semibold text-muted-foreground">Nama Orang Tua</TableHead>
                                <TableHead className="w-[140px] text-xs font-semibold text-muted-foreground">Status</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground">Isi Testimoni</TableHead>
                                <TableHead className="w-[170px] text-xs font-semibold text-muted-foreground">Tampil di Beranda</TableHead>
                                <TableHead className="w-[120px] text-xs font-semibold text-muted-foreground">Tanggal</TableHead>
                                <TableHead className="w-[130px] text-right text-xs font-semibold text-muted-foreground">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredItems.map((item, index) => {
                                const isFeatured = Boolean(item.is_featured);
                                return (
                                    <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/60">
                                        <TableCell className="text-xs text-muted-foreground">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="font-semibold text-xs text-foreground">
                                            {item.nama_orang_tua || 'Anonim'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="bg-muted/60 text-muted-foreground border-border/60 font-normal text-xs"
                                            >
                                                {item.status_orang_tua || 'Wali Murid'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-md">
                                            <p className="line-clamp-2 text-xs italic text-foreground/80 leading-relaxed">
                                                &ldquo;{item.isi_testimoni || ''}&rdquo;
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    id={`table-toggle-${item.id}`}
                                                    checked={isFeatured}
                                                    disabled={togglingId === item.id}
                                                    onCheckedChange={() => handleToggleFeatured(item.id, isFeatured)}
                                                    aria-label="Toggle status featured"
                                                />
                                                <label
                                                    htmlFor={`table-toggle-${item.id}`}
                                                    className={cn(
                                                        "text-xs font-medium cursor-pointer select-none",
                                                        isFeatured ? "text-primary font-semibold" : "text-muted-foreground"
                                                    )}
                                                >
                                                    {isFeatured ? 'Ya' : 'Tidak'}
                                                </label>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                            {formatDate(item.created_at)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handlePreview(item)}
                                                    className="h-10 w-10 sm:h-8 sm:w-8 border-border/80 text-foreground hover:bg-muted"
                                                    aria-label="Preview Testimoni"
                                                >
                                                    <Eye className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    asChild
                                                    className="h-10 w-10 sm:h-8 sm:w-8 border-border/80 text-foreground hover:bg-muted"
                                                >
                                                    <Link
                                                        href={`/admin/testimoni/edit/${item.id}`}
                                                        aria-label="Edit Testimoni"
                                                    >
                                                        <Edit className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                                                    </Link>
                                                </Button>
                                                <DeleteTestimoniButton testimoniId={item.id} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Public Website Preview Dialog */}
            <TestimoniPreviewDialog
                item={previewItem}
                open={isPreviewOpen}
                onOpenChange={setIsPreviewOpen}
                onToggleFeatured={handleToggleFeatured}
                isToggling={previewItem ? togglingId === previewItem.id : false}
            />
        </div>
    );
}
