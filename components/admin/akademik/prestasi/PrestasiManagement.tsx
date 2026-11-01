'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Trophy, Calendar, RotateCcw, Medal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PrestasiTable, { type PrestasiTableItem } from './PrestasiTable';
import PrestasiMobileList from './PrestasiMobileList';

export type PrestasiItem = PrestasiTableItem;

interface PrestasiManagementProps {
    initialData: PrestasiItem[];
    currentYear?: number;
}

const TINGKAT_TABS = [
    'Semua',
    'Internasional',
    'Nasional',
    'Provinsi',
    'Kabupaten',
    'Kecamatan',
] as const;

export default function PrestasiManagement({
    initialData,
    currentYear = new Date().getFullYear(),
}: PrestasiManagementProps) {
    const [items, setItems] = useState<PrestasiItem[]>(initialData);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTingkat, setSelectedTingkat] = useState<string>('Semua');

    // Metrik ringkas
    const metrics = useMemo(() => {
        const total = items.length;
        const thisYearCount = items.filter(
            (item) => item.tahun === currentYear
        ).length;
        const nationalOrGlobal = items.filter((item) => {
            const t = (item.tingkat || '').toLowerCase();
            return t === 'nasional' || t === 'internasional';
        }).length;

        return {
            total,
            thisYearCount,
            nationalOrGlobal,
        };
    }, [items, currentYear]);

    // Handle delete item from client state
    const handleDeleteSuccess = (deletedId: number) => {
        setItems((prev) => prev.filter((item) => item.id !== deletedId));
    };

    // Filter data berdasarkan search dan tab tingkat
    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const matchesTingkat =
                selectedTingkat === 'Semua' ||
                (item.tingkat || '').toLowerCase() === selectedTingkat.toLowerCase();

            if (!matchesTingkat) return false;

            if (!searchQuery.trim()) return true;

            const query = searchQuery.toLowerCase();
            const namaSiswa = (item.nama_siswa || '').toLowerCase();
            const namaPrestasi = (item.nama_prestasi || '').toLowerCase();
            const deskripsi = (item.deskripsi || '').toLowerCase();
            const tahunStr = item.tahun ? item.tahun.toString() : '';

            return (
                namaSiswa.includes(query) ||
                namaPrestasi.includes(query) ||
                deskripsi.includes(query) ||
                tahunStr.includes(query)
            );
        });
    }, [items, searchQuery, selectedTingkat]);

    const handleResetFilter = () => {
        setSearchQuery('');
        setSelectedTingkat('Semua');
    };

    return (
        <div className="space-y-6">
            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                {/* Metric 1: Total Prestasi */}
                <Card
                    data-testid="metric-total-prestasi"
                    className="border-border bg-card shadow-2xs transition-all hover:border-primary/30"
                >
                    <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Total Prestasi
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold text-foreground">
                                {metrics.total}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                                Terdata di madrasah
                            </p>
                        </div>
                        <div className="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <Trophy className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>

                {/* Metric 2: Prestasi Tahun Ini */}
                <Card
                    data-testid="metric-tahun-ini"
                    className="border-border bg-card shadow-2xs transition-all hover:border-primary/30"
                >
                    <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Tahun {currentYear}
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold text-foreground">
                                {metrics.thisYearCount}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                                Prestasi tahun berjalan
                            </p>
                        </div>
                        <div className="h-11 w-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <Calendar className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>

                {/* Metric 3: Nasional & Internasional */}
                <Card
                    data-testid="metric-nasional-internasional"
                    className="border-border bg-card shadow-2xs transition-all hover:border-primary/30"
                >
                    <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Nasional & Global
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold text-foreground">
                                {metrics.nationalOrGlobal}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                                Capaian tingkat tertinggi
                            </p>
                        </div>
                        <div className="h-11 w-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                            <Medal className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Controls (Live Search & Category Tabs) */}
            <div className="space-y-3.5">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <Input
                            type="text"
                            placeholder="Cari nama siswa, prestasi, atau tahun..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-8 h-10 text-sm bg-card border-border text-foreground placeholder:text-muted-foreground/80 focus-visible:ring-1"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors"
                                title="Hapus pencarian"
                                aria-label="Hapus pencarian"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Result Counter */}
                    <div className="text-xs text-muted-foreground self-center sm:self-auto">
                        Menampilkan <strong className="text-foreground">{filteredItems.length}</strong> dari{' '}
                        {items.length} prestasi
                    </div>
                </div>

                {/* Horizontal Swipeable Category Tabs */}
                <div className="overflow-x-auto pb-1.5 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
                    <div className="flex items-center gap-1.5 min-w-max">
                        {TINGKAT_TABS.map((tab) => {
                            const isSelected = selectedTingkat === tab;
                            const count =
                                tab === 'Semua'
                                    ? items.length
                                    : items.filter(
                                          (i) => (i.tingkat || '').toLowerCase() === tab.toLowerCase()
                                      ).length;

                            return (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setSelectedTingkat(tab)}
                                    className={`shrink-0 whitespace-nowrap min-w-max px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border ${
                                        isSelected
                                            ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                                            : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60 border-border'
                                    }`}
                                >
                                    <span>{tab}</span>
                                    <span
                                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                                            isSelected
                                                ? 'bg-primary-foreground/20 text-primary-foreground'
                                                : 'bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* List / Table Content or Empty State */}
            {filteredItems.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center space-y-3">
                    <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <Trophy className="w-6 h-6 opacity-40" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-semibold text-foreground text-sm">
                            Tidak ada data prestasi yang cocok
                        </h4>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                            Tidak ditemukan hasil untuk kata kunci pencarian atau filter tingkat yang dipilih.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetFilter}
                        className="mt-2 text-xs border-border hover:bg-muted gap-1.5"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset Filter
                    </Button>
                </div>
            ) : (
                <>
                    {/* Desktop View */}
                    <PrestasiTable
                        items={filteredItems}
                        onDeleteSuccess={handleDeleteSuccess}
                    />

                    {/* Mobile View */}
                    <PrestasiMobileList
                        items={filteredItems}
                        onDeleteSuccess={handleDeleteSuccess}
                    />
                </>
            )}
        </div>
    );
}
