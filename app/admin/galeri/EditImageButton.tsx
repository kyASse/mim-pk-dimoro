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
            // Create preview URL
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
                // Clean up preview URL
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
            // Reset form when closing
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
                    className="bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200 hover:border-amber-300"
                >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Edit className="w-5 h-5 text-amber-600" />
                        Edit Gambar
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Current/Preview Image */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <Image 
                                        src={imagePreview || imageUrl} 
                                        alt="Preview" 
                                        width={200} 
                                        height={200} 
                                        className="object-cover rounded-lg shadow-sm border"
                                    />
                                    {imagePreview && (
                                        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                                            <Upload className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* File Input */}
                    <div className="space-y-2">
                        <Label htmlFor="image">Ganti Gambar (opsional)</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    {/* Keterangan Input */}
                    <div className="space-y-2">
                        <Label htmlFor="keterangan">Judul/Keterangan</Label>
                        <Input
                            id="keterangan"
                            type="text"
                            value={newKeterangan}
                            onChange={(e) => setNewKeterangan(e.target.value)}
                            required
                            placeholder="Masukkan keterangan gambar"
                        />
                    </div>

                    {/* Kategori Select */}
                    <div className="space-y-2">
                        <Label htmlFor="kategori">Kategori</Label>
                        <Select value={newKategori} onValueChange={setNewKategori} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                {kategoriPilihan.map((kat) => (
                                    <SelectItem key={kat} value={kat}>
                                        {kat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Submit Button */}
                    <Button 
                        type="submit" 
                        disabled={isSaving}
                        className="w-full"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            "Simpan Perubahan"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}