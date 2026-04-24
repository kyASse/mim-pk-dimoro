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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Image as ImageIcon, X, Calendar, Save } from "lucide-react";
import Image from "next/image";

// Schema validation untuk form
const newsFormSchema = z.object({
  judul: z.string().min(1, "Judul berita wajib diisi").max(200, "Judul maksimal 200 karakter"),
  ringkasan: z.string().min(1, "Ringkasan wajib diisi").max(500, "Ringkasan maksimal 500 karakter"),
  isiLengkap: z.string().min(1, "Isi lengkap berita wajib diisi"),
  status: z.enum(["draft", "published"]),
  tanggalTerbit: z.string().min(1, "Tanggal terbit wajib diisi"),
  tambahkanKeGaleri: z.boolean().optional(),
});

type NewsFormData = z.infer<typeof newsFormSchema>;

export default function TambahBeritaPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  const form = useForm<NewsFormData>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      judul: "",
      ringkasan: "",
      isiLengkap: "",
      status: "draft",
      tanggalTerbit: new Date().toISOString().split('T')[0],
      tambahkanKeGaleri: false,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data: NewsFormData) => {
    if (!imageFile) {
      toast.error('Silakan pilih gambar untuk berita');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Dapatkan ID admin yang sedang login
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Tidak dapat menemukan user. Silakan login ulang.");
        return;
      }

      // 2. Upload gambar ke Storage
      const fileName = `${Date.now()}-${imageFile.name.replace(/\s/g, '_')}`;
      const filePath = `berita/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from('konten-publik')
        .upload(filePath, imageFile);
      
      if (uploadError) throw uploadError;

      // 3. Dapatkan URL publik dari gambar yang baru di-upload
      const { data: { publicUrl } } = supabase.storage
        .from('konten-publik')
        .getPublicUrl(filePath);

      // 4. Simpan data berita ke tabel 'berita'
      const { error: insertError } = await supabase
        .from('berita')
        .insert({
          judul: data.judul,
          ringkasan: data.ringkasan,
          isi_lengkap: data.isiLengkap,
          image_url: publicUrl,
          penulis_id: user.id,
          status: data.status,
          tanggal_terbit: data.tanggalTerbit,
        });
      
      if (insertError) throw insertError;

      // 5. Tambahkan ke galeri jika diminta
      if (data.tambahkanKeGaleri) {
        const { error: galeriError } = await supabase
          .from('galeri')
          .insert({
            image_url: publicUrl,
            keterangan: data.judul,
            kategori: 'Berita',
          });
        
        if (galeriError) {
          console.warn('Gagal menambahkan ke galeri:', galeriError);
          toast.warning('Berita berhasil disimpan, tetapi gagal menambahkan ke galeri');
        }
      }

      toast.success('Berita berhasil ditambahkan!');
      router.push('/admin/berita');
      router.refresh();

    } catch (error) {
      console.error('Error adding news:', error);
      toast.error('Terjadi kesalahan saat menyimpan berita');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/berita">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Berita Baru</h1>
          <p className="text-gray-600">Buat dan publikasikan berita terbaru untuk website</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Berita</CardTitle>
          <CardDescription>
            Isi form di bawah ini untuk menambahkan berita baru
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                        placeholder="Tulis isi lengkap berita di sini. Anda bisa menggunakan format Markdown..."
                        className="resize-none min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gambar Utama */}
              <div className="space-y-2">
                <Label>Gambar Utama *</Label>
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
                        setImageFile(file);
                        const reader = new FileReader();
                        reader.onload = (e) => {
                        setImagePreview(e.target?.result as string);
                        };
                        reader.readAsDataURL(file);
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
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF hingga 10MB</p>
                    </div>
                  )}
                </div>
              </div>

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

              {/* Checkbox Galeri */}
              <FormField
                control={form.control}
                name="tambahkanKeGaleri"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Tambahkan foto dan judul ke galeri
                      </FormLabel>
                      <p className="text-xs text-gray-500">
                        Gambar berita ini akan otomatis ditambahkan ke halaman galeri
                      </p>
                    </div>
                  </FormItem>
                )}
              />

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
                      Simpan Berita
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
    </div>
  );
}