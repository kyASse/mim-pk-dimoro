'use client';

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { updateBeritaAction } from '../actions';
import { useRouter } from 'next/navigation';
import { Save, ImageIcon, AlertCircle, Calendar } from "lucide-react";
import Image from "next/image";

import { Alert, AlertDescription } from "@/components/ui/alert";
// Schema validation untuk form edit
const editNewsFormSchema = z.object({
    judul: z.string().min(1, "Judul berita wajib diisi").max(200, "Judul maksimal 200 karakter"),
    ringkasan: z.string().min(1, "Ringkasan wajib diisi").max(500, "Ringkasan maksimal 500 karakter"),
    isiLengkap: z.string().min(1, "Isi lengkap berita wajib diisi"),
    status: z.enum(["draft", "published"]),
    tanggalTerbit: z.string().min(1, "Tanggal terbit wajib diisi"),
});

type EditNewsFormData = z.infer<typeof editNewsFormSchema>;

// Tipe untuk data awal berita
type BeritaData = {
    id: number;
    judul: string;
    ringkasan: string;
    isi_lengkap: string;
    image_url: string;
    status?: string;
    tanggal_terbit?: string;
};

export default function EditForm({ berita }: { berita: BeritaData }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const form = useForm<EditNewsFormData>({
        resolver: zodResolver(editNewsFormSchema),
        defaultValues: {
            judul: berita.judul,
            ringkasan: berita.ringkasan,
            isiLengkap: berita.isi_lengkap,
            status: (berita.status as "draft" | "published") || "draft",
            tanggalTerbit: berita.tanggal_terbit?.split('T')[0] || new Date().toISOString().split('T')[0],
        },
    });

    const onSubmit = async (data: EditNewsFormData) => {
        setIsSubmitting(true);

        try {
            const result = await updateBeritaAction(berita.id, {
                judul: data.judul,
                ringkasan: data.ringkasan,
                isi_lengkap: data.isiLengkap,
                status: data.status,
                tanggal_terbit: data.tanggalTerbit,
            });

            if (!result.success) {
                throw new Error(result.message);
            }

            toast.success('Berita berhasil diperbarui!');
            router.push('/admin/berita');
            router.refresh();
        } catch (error) {
            console.error('Error updating news:', error);
            toast.error('Terjadi kesalahan saat memperbarui berita');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Berita</CardTitle>
                <CardDescription>
                    Perbarui informasi berita yang sudah ada
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Alert untuk gambar */}
                <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Untuk mengubah gambar berita, silakan hapus berita ini dan buat berita baru.
                    </AlertDescription>
                </Alert>

                {/* Gambar Saat Ini */}
                <div className="space-y-2 mb-6">
                    <Label>Gambar Saat Ini</Label>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                                <Image
                                    src={berita.image_url}
                                    alt={berita.judul}
                                    width={120}
                                    height={80}
                                    className="w-30 h-20 object-cover rounded-lg border"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <ImageIcon className="w-4 h-4" />
                                    <span>Gambar utama berita</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Gambar tidak dapat diubah pada mode edit
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Judul */}
                        <FormField
                            control={form.control}
                            name="judul"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Judul Berita *</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Masukkan judul berita yang menarik..." 
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Ringkasan */}
                        <FormField
                            control={form.control}
                            name="ringkasan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ringkasan *</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tulis ringkasan singkat tentang berita ini..."
                                            className="resize-none"
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Isi Lengkap */}
                        <FormField
                            control={form.control}
                            name="isiLengkap"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Isi Lengkap *</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tulis isi lengkap berita di sini..."
                                            className="resize-none min-h-[200px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Row untuk Status dan Tanggal */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Status */}
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="published">Dipublikasikan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Tanggal Terbit */}
                            <FormField
                                control={form.control}
                                name="tanggalTerbit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tanggal Terbit *</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type="date" {...field} />
                                                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-6">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Simpan Perubahan
                                    </>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/admin/berita')}
                                disabled={isSubmitting}
                                className="flex-1 sm:flex-none"
                            >
                                Batal
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}