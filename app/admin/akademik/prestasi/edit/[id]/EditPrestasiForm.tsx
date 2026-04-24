'use client';

import { updatePrestasiAction } from "../../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

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
    imageUrl: string | null; // URL lengkap dari server
};

export default function EditPrestasiForm({ prestasi, imageUrl }: Props) {
    const [_textFormState, textFormAction] = useFormState(async (_: any, formData: FormData) => {
        const result = await updatePrestasiAction(prestasi.id, formData);
        if (result.success) toast.success("Informasi prestasi berhasil diperbarui.");
        else toast.error(result.message);
        return result;
    }, { success: false, message: "" });
    
    // Pisahkan state/action untuk setiap form
    const [_imageFormState, imageFormAction] = useFormState(async (_: any, formData: FormData) => {
        toast.info("Mengunggah gambar...");
        const result = await updatePrestasiAction(prestasi.id, formData);
        if (result.success) toast.success("Gambar berhasil diunggah/diganti.");
        else toast.error(result.message);
        return result;
    }, { success: false, message: "" });
    
    const [_deleteImageState, deleteImageAction] = useFormState(async (_: any, formData: FormData) => {
        const result = await updatePrestasiAction(prestasi.id, formData);
        if (result.success) toast.success("Gambar berhasil dihapus.");
        else toast.error(result.message);
        return result;
    }, { success: false, message: "" });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader><CardTitle>Informasi Prestasi</CardTitle></CardHeader>
                <CardContent>
                    <form action={textFormAction} className="space-y-6">
                        <input type="hidden" name="action" value="update_text" />
                        <div className="grid gap-2">
                            <Label htmlFor="tahun">Tahun</Label>
                            <Input id="tahun" name="tahun" type="number" defaultValue={prestasi.tahun || ''} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="nama_prestasi">Nama Prestasi/Lomba</Label>
                            <Input id="nama_prestasi" name="nama_prestasi" type="text" defaultValue={prestasi.nama_prestasi || ''} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tingkat">Tingkat</Label>
                            <Input id="tingkat" name="tingkat" type="text" defaultValue={prestasi.tingkat || ''} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="nama_siswa">Nama Siswa</Label>
                            <Input id="nama_siswa" name="nama_siswa" type="text" defaultValue={prestasi.nama_siswa || ''} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <Textarea id="deskripsi" name="deskripsi" rows={4} defaultValue={prestasi.deskripsi || ''} />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">Simpan Perubahan Teks</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Media Prestasi</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    {imageUrl ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Gambar Saat Ini</Label>
                                <form action={deleteImageAction}>
                                    <input type="hidden" name="action" value="delete_image" />
                                    <Button variant="destructive" size="sm" type="submit"><Trash2 size={14} className="mr-2"/> Hapus Gambar</Button>
                                </form>
                            </div>
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                                <Image src={imageUrl} alt={prestasi.nama_prestasi || 'Gambar Prestasi'} fill className="object-contain" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-muted-foreground"><ImageIcon size={20} /><p>Belum ada gambar</p></div>
                    )}
                    <Accordion type="single" collapsible>
                        <AccordionItem value="change-image">
                            <AccordionTrigger>{imageUrl ? 'Ganti Gambar' : 'Tambah Gambar'}</AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <form action={imageFormAction}>
                                    <input type="hidden" name="action" value="upload_image" />
                                    <Input id="image" name="image" type="file" accept="image/*" required onChange={(e) => e.currentTarget.form?.requestSubmit()} />
                                </form>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}