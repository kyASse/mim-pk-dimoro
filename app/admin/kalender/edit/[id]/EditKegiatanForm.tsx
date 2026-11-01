"use client";

import React, { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, Calendar, Clock, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { categoryColors, availableCategories, getCategoryConfig, getCategoryBadgeClasses } from '@/lib/constants/calendar';
import { updateKegiatanAction } from '../../actions';
import { useRouter } from 'next/navigation';

type KegiatanAkademik = {
    id: number;
    judul: string;
    tanggal: string;
    tanggal_berakhir: string | null;
    waktu: string | null;
    kategori: string;
    deskripsi: string | null;
    warna: string;
};

function SubmitButton({ isMobile = false }: { isMobile?: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button 
            type="submit" 
            disabled={pending} 
            className={`${isMobile ? 'w-full h-11 text-sm font-semibold' : 'h-10 px-5 text-sm font-semibold'} rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs`}
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan Perubahan...
                </>
            ) : (
                <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                </>
            )}
        </Button>
    );
}

export default function EditKegiatanForm({ kegiatan }: { kegiatan: KegiatanAkademik }) {
    const router = useRouter();
    const updateKegiatanWithId = updateKegiatanAction.bind(null, kegiatan.id);
    const [state, formAction] = useActionState(updateKegiatanWithId, { success: false, message: "" });

    // Live preview states initialized from kegiatan prop
    const [judul, setJudul] = useState(kegiatan.judul || '');
    const [tanggal, setTanggal] = useState(kegiatan.tanggal || '');
    const [tanggalBerakhir, setTanggalBerakhir] = useState(kegiatan.tanggal_berakhir || '');
    const [waktu, setWaktu] = useState(kegiatan.waktu || '');
    const [isAllDay, setIsAllDay] = useState(!kegiatan.waktu);
    const [selectedKategori, setSelectedKategori] = useState(kegiatan.kategori || availableCategories[0] || 'Libur Umum');
    const [deskripsi, setDeskripsi] = useState(kegiatan.deskripsi || '');

    useEffect(() => {
        if (state?.success) {
            router.push('/admin/kalender');
        }
    }, [state?.success, router]);

    const activeCatConfig = getCategoryConfig(selectedKategori);

    const formatPreviewDate = (dateStr: string) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '-';
        return d.toLocaleDateString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <form action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Form Controls (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Error Alert */}
                    {state && !state.success && state.message && (
                        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold">Gagal Memperbarui Kegiatan</p>
                                <p className="text-xs opacity-90 mt-0.5">{state.message}</p>
                            </div>
                        </div>
                    )}

                    {/* Section 1: Detail Utama */}
                    <div className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-border/60 text-foreground font-semibold text-sm">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>1. Informasi Utama Kegiatan</span>
                        </div>

                        {/* Judul Kegiatan */}
                        <div className="space-y-2">
                            <Label htmlFor="judul" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                Judul Kegiatan <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="judul"
                                name="judul"
                                required
                                value={judul}
                                onChange={(e) => setJudul(e.target.value)}
                                placeholder="Contoh: Penilaian Tengah Semester (PTS) Ganjil"
                                className="h-10 text-base sm:h-9 sm:text-sm bg-background border-border/80 rounded-xl focus-visible:ring-primary shadow-2xs"
                            />
                        </div>

                        {/* Kategori */}
                        <div className="space-y-2">
                            <Label htmlFor="kategori-select" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                Kategori Kegiatan <span className="text-destructive">*</span>
                            </Label>
                            
                            <Select 
                                name="kategori" 
                                value={selectedKategori}
                                onValueChange={setSelectedKategori}
                                required
                            >
                                <SelectTrigger id="kategori-select" className="h-10 text-base sm:h-9 sm:text-sm bg-background border-border/80 rounded-xl focus-visible:ring-primary shadow-2xs">
                                    <SelectValue placeholder="Pilih kategori kegiatan" />
                                </SelectTrigger>
                                <SelectContent className="max-h-72">
                                    {availableCategories.map(category => {
                                        const config = getCategoryConfig(category);
                                        return (
                                            <SelectItem key={category} value={category} className="py-2.5">
                                                <div className="flex items-center gap-2.5">
                                                    <span 
                                                        className="w-2.5 h-2.5 rounded-full shrink-0"
                                                        style={{ backgroundColor: config.dotColor }}
                                                    />
                                                    <span className="font-medium text-foreground">{category}</span>
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>

                            {/* Quick Category Pills */}
                            <div className="pt-1.5 flex flex-wrap gap-1.5">
                                {availableCategories.slice(0, 6).map((cat) => {
                                    const cfg = getCategoryConfig(cat);
                                    const isSelected = selectedKategori === cat;
                                    return (
                                        <button
                                            type="button"
                                            key={cat}
                                            onClick={() => setSelectedKategori(cat)}
                                            className={`text-[11px] px-2.5 py-1 rounded-full border transition-all inline-flex items-center gap-1.5 ${
                                                isSelected 
                                                    ? 'bg-foreground text-background border-foreground font-semibold shadow-2xs'
                                                    : 'bg-muted/50 text-muted-foreground border-border/80 hover:bg-muted hover:text-foreground'
                                            }`}
                                        >
                                            <span 
                                                className="w-1.5 h-1.5 rounded-full shrink-0" 
                                                style={{ backgroundColor: cfg.dotColor }}
                                            />
                                            {cat}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Jadwal & Durasi */}
                    <div className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-border/60 text-foreground font-semibold text-sm">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>2. Waktu & Tanggal Pelaksanaan</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Tanggal Mulai */}
                            <div className="space-y-2">
                                <Label htmlFor="tanggal" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Tanggal Mulai <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="tanggal"
                                    name="tanggal"
                                    type="date"
                                    required
                                    value={tanggal}
                                    onChange={(e) => setTanggal(e.target.value)}
                                    className="h-10 text-base sm:h-9 sm:text-sm bg-background border-border/80 rounded-xl focus-visible:ring-primary shadow-2xs"
                                />
                            </div>

                            {/* Tanggal Berakhir */}
                            <div className="space-y-2">
                                <Label htmlFor="tanggal_berakhir" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Tanggal Berakhir <span className="text-muted-foreground text-[11px] font-normal">(Opsional)</span>
                                </Label>
                                <Input
                                    id="tanggal_berakhir"
                                    name="tanggal_berakhir"
                                    type="date"
                                    min={tanggal || undefined}
                                    value={tanggalBerakhir}
                                    onChange={(e) => setTanggalBerakhir(e.target.value)}
                                    className="h-10 text-base sm:h-9 sm:text-sm bg-background border-border/80 rounded-xl focus-visible:ring-primary shadow-2xs"
                                />
                                <p className="text-[11px] text-muted-foreground">
                                    Kosongkan jika kegiatan hanya 1 hari
                                </p>
                            </div>
                        </div>

                        {/* All-day switch toggle */}
                        <div className="pt-2 flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60">
                            <div>
                                <Label htmlFor="all-day-switch" className="text-xs font-semibold text-foreground cursor-pointer">
                                    Acara Sepanjang Hari
                                </Label>
                                <p className="text-[11px] text-muted-foreground">
                                    {isAllDay ? 'Waktu spesifik tidak ditentukan' : 'Tentukan jam pelaksanaan kegiatan'}
                                </p>
                            </div>
                            <Switch 
                                id="all-day-switch"
                                checked={isAllDay} 
                                onCheckedChange={(checked) => {
                                    setIsAllDay(checked);
                                    if (checked) setWaktu('');
                                }} 
                            />
                        </div>

                        {/* Waktu Input (jika bukan sepanjang hari) */}
                        {!isAllDay && (
                            <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                                <Label htmlFor="waktu" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Jam / Waktu Pelaksanaan
                                </Label>
                                <Input
                                    id="waktu"
                                    name="waktu"
                                    type="text"
                                    value={waktu}
                                    onChange={(e) => setWaktu(e.target.value)}
                                    placeholder="Contoh: 07:30 - 12:00 WIB"
                                    className="h-10 text-base sm:h-9 sm:text-sm bg-background border-border/80 rounded-xl focus-visible:ring-primary shadow-2xs"
                                />
                            </div>
                        )}
                        {isAllDay && (
                            <input type="hidden" name="waktu" value="" />
                        )}
                    </div>

                    {/* Section 3: Deskripsi */}
                    <div className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-xs space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="deskripsi" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                Deskripsi Kegiatan <span className="text-muted-foreground text-[11px] font-normal">(Opsional)</span>
                            </Label>
                            <Textarea
                                id="deskripsi"
                                name="deskripsi"
                                rows={4}
                                value={deskripsi}
                                onChange={(e) => setDeskripsi(e.target.value)}
                                placeholder="Tuliskan catatan, rincian peserta, atau perlengkapan yang perlu dibawa..."
                                className="text-base sm:text-sm bg-background border-border/80 rounded-xl focus-visible:ring-primary shadow-2xs resize-y"
                            />
                        </div>
                    </div>

                    {/* Hidden input warna */}
                    <input 
                        type="hidden" 
                        name="warna" 
                        value={categoryColors[selectedKategori] || '#3b82f6'} 
                    />

                    {/* Desktop Submit Button Strip */}
                    <div className="hidden lg:flex items-center justify-end gap-3 pt-2">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => router.push('/admin/kalender')}
                            className="rounded-xl border-border/80 text-foreground hover:bg-muted"
                        >
                            Batal
                        </Button>
                        <SubmitButton />
                    </div>
                </div>

                {/* Right Column: Sticky Live Preview (5 cols) */}
                <div className="lg:col-span-5 sticky top-6 space-y-4">
                    <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-border/60">
                            <div className="flex items-center gap-2 text-foreground font-semibold text-xs tracking-wider uppercase">
                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                <span>Pratinjau Langsung (Live)</span>
                            </div>
                            <span className="text-[11px] text-muted-foreground font-mono">
                                Real-Time Preview
                            </span>
                        </div>

                        {/* Event Card Mockup */}
                        <div className="rounded-2xl border border-border/80 bg-background p-4 shadow-sm space-y-3 transition-all">
                            <div className="flex items-start gap-3">
                                {/* Date Box Mockup */}
                                <div 
                                    className="w-14 rounded-xl border border-border/70 p-2 text-center shrink-0 shadow-2xs"
                                    style={{
                                        backgroundColor: `${activeCatConfig.dotColor}12`,
                                        borderColor: `${activeCatConfig.dotColor}35`,
                                    }}
                                >
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                                        {tanggal ? new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'short' }) : 'Hari'}
                                    </span>
                                    <span className="text-xl font-extrabold text-foreground leading-tight block">
                                        {tanggal ? new Date(tanggal).getDate() : '--'}
                                    </span>
                                    <span className="text-[11px] font-medium text-foreground/80 block">
                                        {tanggal ? new Date(tanggal).toLocaleDateString('id-ID', { month: 'short' }) : 'Bulan'}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <Badge
                                        variant="outline"
                                        className={`text-[11px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1.5 border mb-1.5 ${getCategoryBadgeClasses(
                                            selectedKategori
                                        )}`}
                                    >
                                        <span 
                                            className="w-1.5 h-1.5 rounded-full shrink-0" 
                                            style={{ backgroundColor: activeCatConfig.dotColor }}
                                        />
                                        {selectedKategori}
                                    </Badge>

                                    <h4 className="font-bold text-foreground text-sm leading-snug line-clamp-2">
                                        {judul || 'Judul Kegiatan'}
                                    </h4>

                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 shrink-0" />
                                        <span>{isAllDay ? 'Sepanjang hari' : (waktu || 'Waktu belum diisi')}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Tanggal Berakhir Badge if present */}
                            {tanggalBerakhir && tanggalBerakhir !== tanggal && (
                                <div className="text-xs text-muted-foreground bg-muted/40 p-2 rounded-lg border border-border/40 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                                    <span>Berlangsung hingga: <strong>{formatPreviewDate(tanggalBerakhir)}</strong></span>
                                </div>
                            )}

                            {/* Deskripsi Preview */}
                            <p className="text-xs text-muted-foreground/90 leading-relaxed bg-muted/20 p-2.5 rounded-lg border border-border/40 min-h-[3rem] italic">
                                {deskripsi || 'Tidak ada deskripsi tambahan.'}
                            </p>
                        </div>

                        {/* Dark Mode Guarantee Note */}
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>Kartu otomatis menyesuaikan tema Terang (*Light*) dan Gelap (*Dark*).</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Fixed Bottom Action Dock (Sticky Bottom Dock) */}
            <div className="fixed bottom-0 left-0 right-0 p-3.5 bg-background/95 backdrop-blur-md border-t border-border z-30 lg:hidden flex items-center gap-2 shadow-lg">
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => router.push('/admin/kalender')}
                    className="flex-1 h-11 text-xs font-semibold rounded-xl border-border/80 text-foreground"
                >
                    Batal
                </Button>
                <div className="flex-1">
                    <SubmitButton isMobile={true} />
                </div>
            </div>
        </form>
    );
}
