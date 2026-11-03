'use client';

import { useState } from "react";
import Image from "next/image";
import { updateGaleriAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

type Props = {
    galeriId: number;
    imageUrl: string;
    keterangan: string | null;
    kategori: string | null;
    onUpdated?: () => void;
};

const kategoriPilihan = [
    "Kegiatan Belajar",
    "Bermain",
    "Seni & Kreativitas",
    "Ibadah",
    "Acara Khusus"
];

export default function EditImageButton({ galeriId, imageUrl, keterangan, kategori, onUpdated }: Props) {
    const [open, setOpen] = useState(false);
    const [newKeterangan, setNewKeterangan] = useState(keterangan || "");
    const [newKategori, setNewKategori] = useState(kategori || "");
    const [newImage, setNewImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImage(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const result = await updateGaleriAction(galeriId, {
                keterangan: newKeterangan,
                kategori: newKategori,
                image: newImage,
            });

            if (result.success) {
                toast.success("Berhasil!", {
                    description: "Gambar berhasil diperbarui",
                });
                setOpen(false);
                if (onUpdated) onUpdated();
                if (imagePreview) {
                    URL.revokeObjectURL(imagePreview);
                    setImagePreview(null);
                }
            } else {
                toast.error("Gagal memperbarui gambar", {
                    description: result.message || "Terjadi kesalahan saat memperbarui gambar",
                });
            }
        } catch {
            toast.error("Terjadi kesalahan", {
                description: "Silakan coba lagi atau hubungi administrator",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setNewKeterangan(keterangan || "");
            setNewKategori(kategori || "");
            setNewImage(null);
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
                setImagePreview(null);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs gap-1.5 border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
                >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md bg-card border-border text-foreground">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-foreground">
                        <Edit className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        Edit Informasi Foto
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Current/Preview Image */}
                    <Card className="border-border/80 bg-muted/20 dark:bg-muted/10 overflow-hidden">
                        <CardContent className="p-3">
                            <div className="flex justify-center">
                                <div className="relative aspect-video w-full max-w-[240px] rounded-lg overflow-hidden border border-border/80">
                                    <Image 
                                        src={imagePreview || imageUrl} 
                                        alt="Preview" 
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                    {imagePreview && (
                                        <div className="absolute top-2 right-2 bg-emerald-600 text-white rounded-full p-1 shadow-sm">
                                            <Upload className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* File Input */}
                    <div className="space-y-1.5">
                        <Label htmlFor="image-replace" className="text-xs font-medium text-foreground">
                            Ganti Gambar (opsional)
                        </Label>
                        <Input
                            id="image-replace"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="h-9 text-xs file:text-xs file:font-medium file:text-foreground cursor-pointer"
                        />
                    </div>

                    {/* Keterangan Input */}
                    <div className="space-y-1.5">
                        <Label htmlFor="keterangan" className="text-xs font-medium text-foreground">
                            Keterangan / Judul Foto
                        </Label>
                        <Input
                            id="keterangan"
                            type="text"
                            value={newKeterangan}
                            onChange={(e) => setNewKeterangan(e.target.value)}
                            required
                            placeholder="Masukkan keterangan gambar"
                            className="h-9 text-xs"
                        />
                    </div>

                    {/* Kategori Select */}
                    <div className="space-y-1.5">
                        <Label htmlFor="kategori-select" className="text-xs font-medium text-foreground">
                            Kategori Foto
                        </Label>
                        <Select value={newKategori} onValueChange={setNewKategori} required>
                            <SelectTrigger id="kategori-select" className="h-9 text-xs">
                                <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                                {kategoriPilihan.map((kat) => (
                                    <SelectItem key={kat} value={kat} className="text-xs">
                                        {kat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setOpen(false)}
                            className="flex-1 h-9 text-xs border-border"
                        >
                            Batal
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSaving}
                            className="flex-1 h-9 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                "Simpan Perubahan"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
