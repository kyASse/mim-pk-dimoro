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
import { createBeritaAction } from "@/app/admin/berita/actions";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Image as ImageIcon, X, Calendar, Save } from "lucide-react";
import Image from "next/image";
import RichTextEditor from "@/components/admin/berita/RichTextEditor";
import { compressImageToWebP } from "@/lib/utils/image-compression";

// Schema validation untuk form
const newsFormSchema = z.object({
  judul: z.string().min(1, "Judul berita wajib diisi").max(200, "Judul maksimal 200 karakter"),
  ringkasan: z.string().min(1, "Ringkasan wajib diisi").max(500, "Ringkasan maksimal 500 karakter"),
  isiLengkap: z.string().min(1, "Isi lengkap berita wajib diisi"),
  status: z.enum(["draft", "terbit"]),
  tanggalTerbit: z.string().min(1, "Tanggal terbit wajib diisi"),
  tambahkanKeGaleri: z.boolean().optional(),
});

type NewsFormData = z.infer<typeof newsFormSchema>;

export default function TambahBeritaPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      const fd = new FormData();
      fd.append('judul', data.judul);
      fd.append('ringkasan', data.ringkasan);
      fd.append('isiLengkap', data.isiLengkap);
      fd.append('status', data.status);
      fd.append('tanggalTerbit', data.tanggalTerbit);
      fd.append('tambahkanKeGaleri', data.tambahkanKeGaleri ? 'true' : 'false');
      
      const compressedCover = await compressImageToWebP(imageFile);
      fd.append('image', compressedCover);

      const res = await createBeritaAction(fd);

      if (!res.success) {
        console.error('Error adding news:', res.message);
        toast.error(res.message || 'Terjadi kesalahan saat menyimpan berita');
        return;
      }

      toast.success('Berita berhasil ditambahkan!');
      router.push('/admin/berita');
      router.refresh();

    } catch (error: unknown) {
      const msg = (error as Error)?.message || 'Terjadi kesalahan sistem saat menyimpan berita';
      console.error('Error adding news:', msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-28 sm:pb-8">
      {/* Header with Breadcrumb Back Navigation */}
      <div className="space-y-1.5 sm:space-y-2">
        <Link
          href="/admin/berita"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors group w-fit -ml-1 px-2 py-1 rounded-md hover:bg-muted/60"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Kembali ke Kelola Berita</span>
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Tambah Berita Baru
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Buat dan publikasikan berita terbaru untuk website
          </p>
        </div>
      </div>

      {/* Outer Shell (Double-Bezel) */}
      <div className="rounded-2xl sm:rounded-3xl p-1 sm:p-1.5 bg-muted/40 dark:bg-muted/20 border border-border/60 shadow-xs">
        <Card className="rounded-xl sm:rounded-2xl border border-border/80 shadow-xs">
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4 border-b border-border/60">
            <CardTitle className="text-lg sm:text-xl font-bold">Informasi Berita</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Isi form di bawah ini untuk menambahkan berita baru
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-4 sm:pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
                {/* Judul */}
                <FormField
                  control={form.control}
                  name="judul"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-semibold">Judul Berita *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Masukkan judul berita yang menarik..." 
                          className="h-10 text-base sm:h-9 sm:text-sm rounded-lg"
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
                      <FormLabel className="text-xs sm:text-sm font-semibold">Ringkasan *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tulis ringkasan singkat tentang berita ini..."
                          className="resize-none text-base sm:text-sm rounded-lg"
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
                      <FormLabel className="text-xs sm:text-sm font-semibold">Isi Lengkap *</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Tulis isi lengkap berita di sini..."
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gambar Utama */}
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold">Gambar Utama *</Label>
                  <div className="border-2 border-dashed border-border/80 hover:border-primary/50 transition-colors rounded-xl p-4 sm:p-6 bg-muted/20">
                    {imagePreview ? (
                      <div className="relative rounded-xl overflow-hidden shadow-xs border border-border/60">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={600}
                          height={280}
                          className="w-full h-auto max-h-[360px] object-cover"
                          unoptimized={true}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-3 right-3 h-8 w-8 p-0 rounded-full shadow-md"
                          onClick={removeImage}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="text-center py-4 sm:py-6"
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
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => e.preventDefault()}
                      >
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-3">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                        <div className="mt-2">
                          <Label htmlFor="image-upload" className="cursor-pointer">
                            <div className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-primary hover:underline">
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
                        <p className="text-[11px] sm:text-xs text-muted-foreground mt-1.5">
                          PNG, JPG, WebP hingga 10MB (Otomatis terkompresi ke WebP)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Row untuk Status dan Tanggal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Status */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm font-semibold">Status *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10 text-base sm:h-9 sm:text-sm rounded-lg">
                              <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="terbit">Dipublikasikan</SelectItem>
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
                        <FormLabel className="text-xs sm:text-sm font-semibold">Tanggal Terbit *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type="date" 
                              className="h-10 text-base sm:h-9 sm:text-sm rounded-lg pr-9" 
                              {...field} 
                            />
                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
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
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-border/60 p-3.5 sm:p-4 bg-muted/20">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-xs sm:text-sm font-semibold cursor-pointer">
                          Tambahkan foto dan judul ke galeri
                        </FormLabel>
                        <p className="text-[11px] sm:text-xs text-muted-foreground">
                          Gambar berita ini akan otomatis ditambahkan ke halaman galeri sekolah
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Action Buttons: Unified Responsive Mobile & Desktop Action Bar */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 sm:pt-6 border-t border-border/60">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/admin/berita')}
                    disabled={isSubmitting}
                    className="h-11 sm:h-10 px-6 text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-11 sm:h-10 text-xs sm:text-sm font-semibold shadow-xs"
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
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}