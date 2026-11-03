'use client';

import React, { useState, useTransition, useId } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    Trophy,
    Calendar,
    User,
    Award,
    UploadCloud,
    X,
    Check,
    Loader2,
    Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    TINGKAT_PRESTASI_OPTIONS,
    getTingkatBadgeClasses,
} from '@/lib/constants/prestasi';
import { createPrestasiAction } from '@/app/admin/akademik/actions';
import { toast } from 'sonner';

interface TambahPrestasiFormProps {
    defaultYear?: number;
}

export default function TambahPrestasiForm({
    defaultYear = new Date().getFullYear(),
}: TambahPrestasiFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Form states for live preview
    const [tahun, setTahun] = useState<number>(defaultYear);
    const [namaSiswa, setNamaSiswa] = useState<string>('');
    const [namaPrestasi, setNamaPrestasi] = useState<string>('');
    const [tingkat, setTingkat] = useState<string>('Kabupaten');
    const [deskripsi, setDeskripsi] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fileInputId = useId();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Ukuran file terlalu besar! Maksimal 5MB.');
            return;
        }

        setSelectedFile(file);
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!namaSiswa.trim() || !namaPrestasi.trim()) {
            toast.error('Harap lengkapi nama siswa dan nama prestasi.');
            return;
        }

        const formData = new FormData();
        formData.append('tahun', tahun.toString());
        formData.append('nama_siswa', namaSiswa.trim());
        formData.append('nama_prestasi', namaPrestasi.trim());
        formData.append('tingkat', tingkat);
        if (deskripsi.trim()) {
            formData.append('deskripsi', deskripsi.trim());
        }
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        startTransition(async () => {
            try {
                const res = await createPrestasiAction(null, formData);
                if (res?.success) {
                    toast.success('Prestasi berhasil ditambahkan!');
                    router.push('/admin/akademik/prestasi');
                } else {
                    toast.error(res?.message || 'Gagal menyimpan prestasi.');
                }
            } catch (err) {
                console.error('Submit error:', err);
                toast.error('Terjadi kesalahan saat menyimpan data.');
            }
        });
    };

    const badgeStyle = getTingkatBadgeClasses(tingkat);

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-20 lg:pb-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Kolom Kiri: Form Controls (7 Kolom) */}
                <div className="lg:col-span-7 space-y-6">
                    <Card className="border-border bg-card shadow-xs">
                        <CardHeader className="pb-4 border-b border-border/60">
                            <CardTitle className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-amber-500" />
                                Informasi Prestasi & Kejuaraan
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-5 sm:p-6 space-y-5">
                            {/* Baris 1: Tahun & Tingkat */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tahun" className="text-xs font-semibold text-foreground">
                                        Tahun <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="tahun"
                                        name="tahun"
                                        type="number"
                                        value={tahun}
                                        onChange={(e) => setTahun(parseInt(e.target.value, 10) || defaultYear)}
                                        required
                                        className="h-10 text-base sm:h-9 sm:text-sm bg-background border-border text-foreground"
                                    />
                                </div>

                                <div className="sm:col-span-2 space-y-2">
                                    <Label className="text-xs font-semibold text-foreground">
                                        Tingkat Kejuaraan <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                                        {TINGKAT_PRESTASI_OPTIONS.map((opt) => {
                                            const isSelected = tingkat === opt.value;
                                            const style = getTingkatBadgeClasses(opt.value);

                                            return (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => setTingkat(opt.value)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 ${
                                                        isSelected
                                                            ? `${style.combined} font-semibold ring-1 ring-primary/40 shadow-2xs`
                                                            : 'bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                                                    }`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                                                    {opt.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Nama Siswa */}
                            <div className="space-y-2">
                                <Label htmlFor="nama_siswa" className="text-xs font-semibold text-foreground">
                                    Nama Santri / Siswa <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                    <Input
                                        id="nama_siswa"
                                        name="nama_siswa"
                                        placeholder="Contoh: Muhammad Faiz Al-Farizi"
                                        value={namaSiswa}
                                        onChange={(e) => setNamaSiswa(e.target.value)}
                                        required
                                        className="pl-9 h-10 text-base sm:h-9 sm:text-sm bg-background border-border text-foreground"
                                    />
                                </div>
                            </div>

                            {/* Nama Prestasi / Lomba */}
                            <div className="space-y-2">
                                <Label htmlFor="nama_prestasi" className="text-xs font-semibold text-foreground">
                                    Nama Prestasi / Kejuaraan <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                    <Input
                                        id="nama_prestasi"
                                        name="nama_prestasi"
                                        placeholder="Contoh: Juara 1 Lomba Pidato Bahasa Arab"
                                        value={namaPrestasi}
                                        onChange={(e) => setNamaPrestasi(e.target.value)}
                                        required
                                        className="pl-9 h-10 text-base sm:h-9 sm:text-sm bg-background border-border text-foreground"
                                    />
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div className="space-y-2">
                                <Label htmlFor="deskripsi" className="text-xs font-semibold text-foreground">
                                    Keterangan / Penyelenggara (Opsional)
                                </Label>
                                <Textarea
                                    id="deskripsi"
                                    name="deskripsi"
                                    rows={3}
                                    placeholder="Contoh: Diselenggarakan oleh Kantor Kementerian Agama Kab. Bantul pada peringatan Hari Santri Nasional..."
                                    value={deskripsi}
                                    onChange={(e) => setDeskripsi(e.target.value)}
                                    className="text-base sm:text-sm bg-background border-border text-foreground resize-none"
                                />
                            </div>

                            {/* Unggah Foto Dokumentasi */}
                            <div className="space-y-2 pt-1">
                                <Label htmlFor={fileInputId} className="text-xs font-semibold text-foreground">
                                    Foto / Dokumentasi Piagam (Opsional)
                                </Label>

                                {!previewUrl ? (
                                    <div className="relative border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-xl p-5 text-center bg-muted/20 flex flex-col items-center justify-center gap-2 cursor-pointer">
                                        <input
                                            id={fileInputId}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        />
                                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                            <UploadCloud className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-medium text-foreground">
                                                Klik atau seret foto sertifikat / piala ke sini
                                            </p>
                                            <p className="text-[11px] text-muted-foreground">
                                                PNG, JPG, WebP hingga 5MB
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative rounded-xl border border-border p-3 bg-muted/30 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-border shrink-0">
                                                <Image
                                                    src={previewUrl}
                                                    alt="Preview dokumentasi"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-foreground truncate max-w-[200px] sm:max-w-[260px]">
                                                    {selectedFile?.name || 'Foto Dokumentasi'}
                                                </p>
                                                <p className="text-[11px] text-muted-foreground">
                                                    {(selectedFile ? selectedFile.size / 1024 : 0).toFixed(1)} KB
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleRemoveFile}
                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                            title="Hapus foto"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Desktop Action Buttons */}
                    <div className="hidden lg:flex items-center justify-end gap-3 pt-2">
                        <Button
                            asChild
                            variant="outline"
                            className="border-border hover:bg-muted text-foreground"
                        >
                            <Link href="/admin/akademik/prestasi">Batal</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Menyimpan Data...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Simpan Prestasi
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Kolom Kanan: Sticky Real-time Live Preview Card (5 Kolom) */}
                <div
                    data-testid="prestasi-live-preview"
                    className="lg:col-span-5 lg:sticky lg:top-6 space-y-3"
                >
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Pratinjau Kartu Prestasi
                    </div>

                    <Card className="border-border bg-card shadow-sm overflow-hidden">
                        {/* Card Image Area */}
                        <div className="relative aspect-video w-full bg-muted/60 border-b border-border flex items-center justify-center overflow-hidden">
                            {previewUrl ? (
                                <Image
                                    src={previewUrl}
                                    alt="Pratinjau Foto Prestasi"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="text-center p-6 space-y-2">
                                    <div className="h-12 w-12 rounded-full bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
                                        <Trophy className="w-6 h-6" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Belum ada foto dokumentasi diunggah
                                    </p>
                                </div>
                            )}

                            {/* Tingkat Badge Overlay */}
                            <div className="absolute top-3 left-3">
                                <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-xs ${badgeStyle.combined}`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                                    {tingkat}
                                </span>
                            </div>

                            {/* Tahun Badge Overlay */}
                            <div className="absolute top-3 right-3">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-background/90 text-foreground border border-border backdrop-blur-md shadow-xs">
                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                    {tahun}
                                </span>
                            </div>
                        </div>

                        {/* Card Body */}
                        <CardContent className="p-5 space-y-3">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">
                                    Nama Santri / Peraih:
                                </p>
                                <h3 className="text-lg font-bold text-foreground">
                                    {namaSiswa.trim() || 'Nama Lengkap Santri'}
                                </h3>
                            </div>

                            <div className="space-y-1 pt-1 border-t border-border/60">
                                <p className="text-xs font-medium text-muted-foreground">
                                    Kejuaraan / Penghargaan:
                                </p>
                                <p className="text-sm font-semibold text-primary">
                                    {namaPrestasi.trim() || 'Judul Prestasi / Lomba'}
                                </p>
                            </div>

                            {deskripsi.trim() && (
                                <p className="text-xs text-muted-foreground pt-1 leading-relaxed border-t border-border/40">
                                    {deskripsi.trim()}
                                </p>
                            )}

                            <div className="pt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                                <span>MIM PK Dimoro</span>
                                <span>Status: Siap Ditampilkan</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Mobile Sticky Bottom Action Dock */}
            <div className="fixed bottom-0 left-0 right-0 p-3 bg-card/95 backdrop-blur-md border-t border-border lg:hidden z-30 shadow-lg flex items-center gap-2">
                <Button
                    asChild
                    variant="outline"
                    className="flex-1 h-11 border-border text-foreground hover:bg-muted"
                >
                    <Link href="/admin/akademik/prestasi">Batal</Link>
                </Button>
                <Button
                    type="submit"
                    disabled={isPending}
                    className="flex-2 h-11 bg-primary text-primary-foreground font-semibold"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Menyimpan...
                        </>
                    ) : (
                        <>
                            <Check className="w-4 h-4 mr-2" />
                            Simpan Prestasi
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
