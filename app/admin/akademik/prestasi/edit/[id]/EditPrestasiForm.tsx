'use client';

import { useState } from 'react';
import { updatePrestasiAction } from "../../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ImageIcon, Trash2, Check, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useActionState } from 'react';
import { toast } from 'sonner';
import { TINGKAT_PRESTASI_OPTIONS, getTingkatBadgeClasses } from "@/lib/constants/prestasi";

type Prestasi = {
    id: number;
    tahun: number | null;
    nama_prestasi: string | null;
    tingkat: string | null;
    nama_siswa: string | null;
    deskripsi: string | null;
    dokumentasi_url: string | null; 
};

type Props = {
    prestasi: Prestasi;
    imageUrl: string | null;
};

export default function EditPrestasiForm({ prestasi, imageUrl }: Props) {
    const [selectedTingkat, setSelectedTingkat] = useState<string>(prestasi.tingkat || 'Kabupaten');

    const [_textFormState, textFormAction] = useActionState(async (_: any, formData: FormData) => {
        const result = await updatePrestasiAction(prestasi.id, formData);
        if (result.success) toast.success("Informasi prestasi berhasil diperbarui.");
        else toast.error(result.message);
        return result;
    }, { success: false, message: "" });
    
    const [_imageFormState, imageFormAction] = useActionState(async (_: any, formData: FormData) => {
        toast.info("Mengunggah gambar...");
        const result = await updatePrestasiAction(prestasi.id, formData);
        if (result.success) toast.success("Gambar berhasil diunggah/diganti.");
        else toast.error(result.message);
        return result;
    }, { success: false, message: "" });
    
    const [_deleteImageState, deleteImageAction] = useActionState(async (_: any, formData: FormData) => {
        const result = await updatePrestasiAction(prestasi.id, formData);
        if (result.success) toast.success("Gambar berhasil dihapus.");
        else toast.error(result.message);
        return result;
    }, { success: false, message: "" });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Informasi Teks */}
            <Card className="lg:col-span-7 border-border bg-card shadow-xs">
                <CardHeader className="pb-4 border-b border-border/60">
                    <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                        Informasi Prestasi
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-5 sm:p-6">
                    <form action={textFormAction} className="space-y-5">
                        <input type="hidden" name="action" value="update_text" />
                        <input type="hidden" name="tingkat" value={selectedTingkat} />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="tahun" className="text-xs font-semibold text-foreground">Tahun</Label>
                                <Input 
                                    id="tahun" 
                                    name="tahun" 
                                    type="number" 
                                    defaultValue={prestasi.tahun || ''} 
                                    required 
                                    className="h-10 text-base sm:h-9 sm:text-sm bg-background border-border text-foreground"
                                />
                            </div>

                            <div className="sm:col-span-2 space-y-2">
                                <Label className="text-xs font-semibold text-foreground">Tingkat</Label>
                                <div className="flex flex-wrap gap-1.5 pt-0.5">
                                    {TINGKAT_PRESTASI_OPTIONS.map((opt) => {
                                        const isSelected = selectedTingkat === opt.value;
                                        const style = getTingkatBadgeClasses(opt.value);

                                        return (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setSelectedTingkat(opt.value)}
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

                        <div className="space-y-2">
                            <Label htmlFor="nama_siswa" className="text-xs font-semibold text-foreground">Nama Siswa</Label>
                            <Input 
                                id="nama_siswa" 
                                name="nama_siswa" 
                                type="text" 
                                defaultValue={prestasi.nama_siswa || ''} 
                                required
                                className="h-10 text-base sm:h-9 sm:text-sm bg-background border-border text-foreground"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nama_prestasi" className="text-xs font-semibold text-foreground">Nama Prestasi / Kejuaraan</Label>
                            <Input 
                                id="nama_prestasi" 
                                name="nama_prestasi" 
                                type="text" 
                                defaultValue={prestasi.nama_prestasi || ''} 
                                required 
                                className="h-10 text-base sm:h-9 sm:text-sm bg-background border-border text-foreground"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deskripsi" className="text-xs font-semibold text-foreground">Deskripsi / Penyelenggara</Label>
                            <Textarea 
                                id="deskripsi" 
                                name="deskripsi" 
                                rows={4} 
                                defaultValue={prestasi.deskripsi || ''} 
                                className="text-base sm:text-sm bg-background border-border text-foreground resize-none"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button type="submit" className="bg-primary text-primary-foreground font-semibold px-6">
                                <Check className="w-4 h-4 mr-2" />
                                Simpan Perubahan Teks
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Media Prestasi */}
            <Card className="lg:col-span-5 border-border bg-card shadow-xs">
                <CardHeader className="pb-4 border-b border-border/60">
                    <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                        Dokumentasi / Foto Prestasi
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-5 sm:p-6 space-y-5">
                    {imageUrl ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-semibold text-foreground">Foto Saat Ini</Label>
                                <form action={deleteImageAction}>
                                    <input type="hidden" name="action" value="delete_image" />
                                    <Button variant="destructive" size="sm" type="submit" className="h-8 text-xs">
                                        <Trash2 size={13} className="mr-1.5" /> Hapus Foto
                                    </Button>
                                </form>
                            </div>
                            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted/30">
                                <Image src={imageUrl} alt={prestasi.nama_prestasi || 'Gambar Prestasi'} fill className="object-contain" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-border bg-muted/20 text-muted-foreground gap-2">
                            <ImageIcon size={28} className="opacity-40" />
                            <p className="text-xs">Belum ada foto dokumentasi</p>
                        </div>
                    )}

                    <Accordion type="single" collapsible className="border-t border-border/60 pt-2">
                        <AccordionItem value="change-image" className="border-none">
                            <AccordionTrigger className="text-xs font-semibold text-foreground py-2 hover:no-underline">
                                <span className="flex items-center gap-2">
                                    <UploadCloud className="w-4 h-4 text-primary" />
                                    {imageUrl ? 'Ganti Foto Dokumentasi' : 'Unggah Foto Dokumentasi'}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-3">
                                <form action={imageFormAction} className="space-y-3">
                                    <input type="hidden" name="action" value="upload_image" />
                                    <Input 
                                        id="image" 
                                        name="image" 
                                        type="file" 
                                        accept="image/*" 
                                        required 
                                        onChange={(e) => e.currentTarget.form?.requestSubmit()} 
                                        className="h-10 text-xs bg-background border-border text-foreground cursor-pointer"
                                    />
                                    <p className="text-[11px] text-muted-foreground">
                                        Format PNG, JPG, WebP hingga 5MB. Foto otomatis tersimpan saat dipilih.
                                    </p>
                                </form>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
