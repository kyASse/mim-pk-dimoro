'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Upload,
  ImageIcon,
  X,
  FileCheck2,
  Info,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

export const KATEGORI_PILIHAN = [
  'Kegiatan Belajar',
  'Bermain',
  'Seni & Kreativitas',
  'Ibadah',
  'Acara Khusus',
] as const;

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, 'Ukuran file maksimal 5MB')
  .refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    'Format file harus JPG, PNG, atau WebP'
  );

const formSchema = z.object({
  keterangan: z.string().min(1, 'Keterangan harus diisi'),
  kategori: z.string().min(1, 'Kategori harus dipilih'),
  gambar: fileSchema.optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function GaleriUploadForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFileMeta, setSelectedFileMeta] = useState<{
    name: string;
    sizeFormatted: string;
    type: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keterangan: '',
      kategori: KATEGORI_PILIHAN[0],
      gambar: undefined,
    },
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error('Format file tidak didukung', {
          description: 'Hanya file JPG, PNG, atau WebP yang diperbolehkan.',
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File terlalu besar', {
          description: 'Ukuran file maksimal adalah 5MB.',
        });
        return;
      }

      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setSelectedFileMeta({
        name: file.name,
        sizeFormatted: formatFileSize(file.size),
        type: file.type.split('/')[1]?.toUpperCase() || 'IMAGE',
      });
      form.setValue('gambar', file, { shouldValidate: true });
    } else {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
      setSelectedFileMeta(null);
      form.setValue('gambar', undefined, { shouldValidate: true });
    }
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setSelectedFileMeta(null);
    form.setValue('gambar', undefined);
  };

  const onSubmit = async (values: FormValues) => {
    if (!values.gambar) {
      toast.error('Foto belum dipilih', {
        description: 'Silakan pilih atau tarik foto ke area unggah.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const timestamp = Date.now();
      const sanitizedName = values.gambar.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${timestamp}-${sanitizedName}`;
      const filePath = `galeri/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('konten-publik')
        .upload(filePath, values.gambar);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('konten-publik').getPublicUrl(filePath);

      const { error: insertError } = await supabase.from('galeri').insert({
        keterangan: values.keterangan,
        kategori: values.kategori,
        image_url: publicUrl,
      });

      if (insertError) throw insertError;

      toast.success('Foto berhasil ditambahkan!', {
        description: 'Foto telah dipublikasikan ke galeri sekolah.',
      });

      router.push('/admin/galeri');
      router.refresh();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Gagal menambahkan foto', {
        description: (error as Error).message || 'Terjadi kesalahan sistem saat mengunggah foto.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 2-Column Studio Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Visual Dropzone & Live Inspector (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border border-border/80 bg-card shadow-xs overflow-hidden">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-sm font-semibold flex items-center justify-between text-foreground">
                  <span className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    File Visual Foto
                  </span>
                  {selectedFileMeta && (
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-primary/10 text-primary border-primary/30"
                    >
                      {selectedFileMeta.type}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-5">
                <FormField
                  control={form.control}
                  name="gambar"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <div>
                          {imagePreview ? (
                            /* Live Preview Inspector */
                            <div className="space-y-3">
                              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-border/80 bg-black/90 group shadow-inner">
                                <Image
                                  src={imagePreview}
                                  alt="Preview Unggahan"
                                  fill
                                  className="object-contain"
                                  unoptimized
                                />
                                <button
                                  type="button"
                                  onClick={removeImage}
                                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/70 hover:bg-destructive text-white flex items-center justify-center transition-colors shadow-md"
                                  title="Hapus foto ini"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>

                              {/* File Meta Pill */}
                              {selectedFileMeta && (
                                <div className="p-2.5 rounded-lg border border-border/80 bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
                                  <div className="flex items-center gap-2 min-w-0 pr-2">
                                    <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                    <span className="truncate font-medium text-foreground">
                                      {selectedFileMeta.name}
                                    </span>
                                  </div>
                                  <span className="shrink-0 text-[11px] font-mono">
                                    {selectedFileMeta.sizeFormatted}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            /* Drag & Drop Visual Zone */
                            <div
                              onDrop={(e) => {
                                e.preventDefault();
                                setIsDragOver(false);
                                const file = e.dataTransfer.files?.[0];
                                if (file) handleFileChange(file);
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragOver(true);
                              }}
                              onDragLeave={(e) => {
                                e.preventDefault();
                                setIsDragOver(false);
                              }}
                              className={cn(
                                'border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[260px]',
                                isDragOver
                                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                  : 'border-border/80 dark:border-border/60 hover:border-primary/60 dark:hover:border-primary/60 bg-muted/20 dark:bg-muted/10'
                              )}
                            >
                              <div className="w-12 h-12 rounded-2xl bg-muted/60 dark:bg-muted/30 border border-border/80 flex items-center justify-center text-muted-foreground mb-3">
                                <Upload className="w-6 h-6 text-primary" />
                              </div>
                              <label
                                htmlFor="file-photo-upload"
                                className="cursor-pointer space-y-1 block"
                              >
                                <p className="text-sm font-semibold text-foreground">
                                  Pilih foto atau drag & drop
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Format JPG, PNG, atau WebP (Maksimal 5MB)
                                </p>
                              </label>
                              <input
                                id="file-photo-upload"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileChange(file);
                                }}
                                className="hidden"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Metadata & Categorization (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-5">
            <Card className="border border-border/80 bg-card shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Informasi Dokumentasi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-5">
                {/* Keterangan Foto */}
                <FormField
                  control={form.control}
                  name="keterangan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-foreground">
                        Keterangan / Judul Foto *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tuliskan keterangan foto (misal: Praktik Sains Kelas 4)"
                          {...field}
                          className="h-10 text-sm sm:h-9 sm:text-xs rounded-xl border-border/80 bg-background"
                        />
                      </FormControl>
                      <p className="text-[11px] text-muted-foreground">
                        Keterangan ini akan menjadi teks judul yang tampil di kartu galeri dan halaman publik.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Kategori Foto */}
                <FormField
                  control={form.control}
                  name="kategori"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-foreground">
                        Kategori *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 text-sm sm:h-9 sm:text-xs rounded-xl border-border/80 bg-background">
                            <SelectValue placeholder="Pilih kategori foto" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-popover border-border">
                          {KATEGORI_PILIHAN.map((kat) => (
                            <SelectItem key={kat} value={kat} className="text-xs">
                              {kat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Desktop Action Buttons */}
                <div className="pt-3 hidden lg:flex items-center gap-3">
                  <Button
                    asChild
                    variant="outline"
                    className="h-9 text-xs rounded-xl border-border"
                  >
                    <Link href="/admin/galeri">Batal</Link>
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-9 text-xs rounded-xl gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 shadow-xs"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Mengupload Foto...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Simpan Foto</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Photography & Upload Tips Card */}
            <Card className="border border-border/80 bg-muted/20 dark:bg-muted/10">
              <CardContent className="p-4 flex gap-3 text-xs text-muted-foreground">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Panduan Unggah Foto</p>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] leading-relaxed">
                    <li>Gunakan rasio foto landscape (4:3 atau 16:9) atau persegi untuk tampilan terbaik.</li>
                    <li>Pastikan foto memiliki pencahayaan cukup dan tidak buram.</li>
                    <li>Jaga privasi dan kesopanan pose siswa dalam setiap dokumentasi madrasah.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Sticky Floating Bottom Action Dock (Rule #5 Admin & Mobile-First) */}
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-background/95 backdrop-blur-md border-t border-border z-40 lg:hidden flex items-center gap-2.5 shadow-lg">
          <Button
            asChild
            variant="outline"
            className="flex-1 h-10 text-xs rounded-xl border-border"
          >
            <Link href="/admin/galeri">Batal</Link>
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-[2] h-10 text-xs rounded-xl gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mengupload...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Simpan Foto</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
