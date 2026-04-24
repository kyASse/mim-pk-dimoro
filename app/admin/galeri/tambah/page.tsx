'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Upload, ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';


const kategoriPilihan = [
    "Kegiatan Belajar",
    "Bermain",
    "Seni & Kreativitas",
    "Ibadah",
    "Acara Khusus"
];

const fileSchema = z.instanceof(File)
    .refine((file) => file.size <= 5000000, "Ukuran file maksimal 5MB")
    .refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), "Format file harus JPG, PNG, atau WebP");

const formSchema = z.object({
    keterangan: z.string().min(1, "Keterangan harus diisi"),
    kategori: z.string().min(1, "Kategori harus dipilih"),
    gambar: fileSchema.optional()
});

export default function TambahGaleriPage() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const supabase = createClient();
    const router = useRouter();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            keterangan: '',
            kategori: kategoriPilihan[0],
            gambar: undefined
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!values.gambar) {
            toast.error('Silakan pilih gambar untuk galeri');
            return;
        }

        setIsLoading(true);

        try {
            const fileName = `${Date.now()}-${values.gambar.name.replace(/\s/g, '_')}`;
            const filePath = `galeri/${fileName}`;
            
            const { error: uploadError } = await supabase.storage
                .from('konten-publik')
                .upload(filePath, values.gambar);
            
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('konten-publik')
                .getPublicUrl(filePath);

            const { error: insertError } = await supabase
                .from('galeri')
                .insert({
                    keterangan: values.keterangan,
                    kategori: values.kategori,
                    image_url: publicUrl
                });
            
            if (insertError) throw insertError;

            toast.success('Foto berhasil ditambahkan ke galeri!');
            router.push('/admin/galeri');
            router.refresh();
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Gagal menambahkan foto: ' + (error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (file: File | undefined) => {
        if (file) {
            const url = URL.createObjectURL(file);
            setImagePreview(url);
            form.setValue('gambar', file);
        } else {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
            setImagePreview(null);
            form.setValue('gambar', undefined);
        }
    };

    const removeImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
        form.setValue('gambar', undefined);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tambah Foto Galeri</h1>
                    <p className="text-gray-600">Upload foto baru untuk galeri sekolah</p>
                </div>
            </div>
            <div>
                <Link href="/admin/galeri">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Informasi Foto
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="keterangan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Keterangan/Judul Foto</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Masukkan keterangan foto" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="kategori"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kategori</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih kategori foto" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {kategoriPilihan.map((kat) => (
                                                    <SelectItem key={kat} value={kat}>
                                                        {kat}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="gambar"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>File Gambar *</FormLabel>
                                        <FormControl>
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                                {imagePreview ? (
                                                    <div className="relative">
                                                        <Image
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            width={500}
                                                            height={192}
                                                            className="w-full h-auto object-cover rounded-lg"
                                                            unoptimized={true}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            className="absolute top-2 right-2"
                                                            onClick={removeImage}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div 
                                                        className="text-center"
                                                        onDrop={(e) => {
                                                            e.preventDefault();
                                                            const file = e.dataTransfer.files?.[0];
                                                            if (file && file.type.startsWith('image/')) {
                                                                handleFileChange(file);
                                                            }
                                                        }}
                                                        onDragOver={(e) => {
                                                            e.preventDefault();
                                                        }}
                                                        onDragEnter={(e) => {
                                                            e.preventDefault();
                                                        }}
                                                    >
                                                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                        <div className="mt-4">
                                                            <Label htmlFor="image-upload" className="cursor-pointer">
                                                                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                                                    <Upload className="w-4 h-4" />
                                                                    Pilih gambar atau drag & drop
                                                                </div>
                                                            </Label>
                                                            <Input
                                                                id="image-upload"
                                                                type="file"
                                                                accept="image/jpeg,image/png,image/webp"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    handleFileChange(file);
                                                                }}
                                                                className="hidden"
                                                            />
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-2">JPG, PNG, WebP maksimal 5MB</p>
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-3">
                                <Button type="submit" disabled={isLoading} className="flex-1">
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Mengupload...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Simpan Foto
                                        </>
                                    )}
                                </Button>
                                <Link href="/admin/galeri">
                                    <Button type="button" variant="outline">
                                        Batal
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}