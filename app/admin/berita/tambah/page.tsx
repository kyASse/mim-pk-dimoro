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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createBeritaAction } from "@/app/admin/berita/actions";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Image as ImageIcon, X, Calendar, Save, Sparkles } from "lucide-react";
import Image from "next/image";
import RichTextEditor from "@/components/admin/berita/RichTextEditor";
import { compressImageToWebP } from "@/lib/utils/image-compression";

// Schema validation untuk form berita
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
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
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
    <div className="space-y-6 pb-28 lg:pb-8">
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
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Tambah Berita Baru
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Buat dan publikasikan berita atau pengumuman terbaru untuk website sekolah
          </p>
        </div>
      </div>

      {/* Main Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Editor & Content (lg:col-span-8) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Double-Bezel Card Container */}
              <div className="rounded-2xl sm:rounded-3xl p-1 sm:p-1.5 bg-muted/40 dark:bg-muted/20 border border-border/60 shadow-xs">
                <Card className="rounded-xl sm:rounded-2xl border border-border/80 bg-card shadow-xs">
                  <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4 border-b border-border/60">
                    <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                      Konten Berita
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                      Tulis judul artikel, ringkasan pendek, dan isi lengkap berita
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 space-y-5">
                    {/* Judul */}
                    <FormField
                      control={form.control}
                      name="judul"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-semibold text-foreground">
                            Judul Berita *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Masukkan judul berita yang menarik..."
                              className="h-10 text-base sm:h-9 sm:text-sm rounded-lg bg-background border-border/80 focus-visible:ring-primary/20"
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
                          <FormLabel className="text-xs sm:text-sm font-semibold text-foreground">
                            Ringkasan Singkat *
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tulis ringkasan singkat tentang berita ini..."
                              className="resize-none text-base sm:text-sm rounded-lg bg-background border-border/80 focus-visible:ring-primary/20 leading-relaxed"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Isi Lengkap (RichTextEditor) */}
                    <FormField
                      control={form.control}
                      name="isiLengkap"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-semibold text-foreground">
                            Isi Lengkap Berita *
                          </FormLabel>
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
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column: Metadata & Settings Sidebar (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-5">
              {/* Card 1: Publikasi & Jadwal */}
              <Card className="rounded-xl border border-border/80 bg-card shadow-xs">
                <CardHeader className="p-4 pb-3 border-b border-border/60">
                  <CardTitle className="text-sm font-bold text-foreground">
                    Pengaturan Publikasi
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {/* Status */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-foreground">
                          Status Publikasi *
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10 sm:h-9 text-xs rounded-lg bg-background border-border/80">
                              <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-popover border-border">
                            <SelectItem value="draft">Draft (Draf)</SelectItem>
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
                        <FormLabel className="text-xs font-semibold text-foreground">
                          Tanggal Terbit *
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="date"
                              className="h-10 sm:h-9 text-xs rounded-lg pr-9 bg-background border-border/80"
                              {...field}
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Card 2: Cover Image */}
              <Card className="rounded-xl border border-border/80 bg-card shadow-xs">
                <CardHeader className="p-4 pb-3 border-b border-border/60">
                  <CardTitle className="text-sm font-bold text-foreground">
                    Gambar Cover Utama *
                  </CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">
                    Otomatis terkompresi ke WebP resolusi tajam
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="border-2 border-dashed border-border/80 hover:border-primary/50 transition-colors rounded-xl p-3 sm:p-4 bg-muted/20">
                    {imagePreview ? (
                      <div className="relative rounded-lg overflow-hidden shadow-xs border border-border/60">
                        <Image
                          src={imagePreview}
                          alt="Preview Cover"
                          width={400}
                          height={220}
                          className="w-full h-auto max-h-[220px] object-cover"
                          unoptimized={true}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 h-7 w-7 p-0 rounded-full shadow-md"
                          onClick={removeImage}
                          aria-label="Hapus gambar cover"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="text-center py-4"
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files?.[0];
                          if (file && file.type.startsWith('image/')) {
                            setImageFile(file);
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setImagePreview(event.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => e.preventDefault()}
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-2">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                        <Label htmlFor="image-upload" className="cursor-pointer">
                          <div className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Pilih gambar / Drag & drop</span>
                          </div>
                        </Label>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">
                          PNG, JPG, WebP hingga 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Galeri Sekolah Checkbox */}
              <Card className="rounded-xl border border-border/80 bg-card shadow-xs">
                <CardContent className="p-4">
                  <FormField
                    control={form.control}
                    name="tambahkanKeGaleri"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-0.5"
                          />
                        </FormControl>
                        <div className="space-y-0.5 leading-none">
                          <FormLabel className="text-xs font-semibold text-foreground cursor-pointer">
                            Tambahkan foto dan judul ke galeri
                          </FormLabel>
                          <p className="text-[11px] text-muted-foreground leading-normal">
                            Gambar berita otomatis ditampilkan di halaman galeri publik
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Card 4: Desktop Action Buttons (hidden lg:block) */}
              <Card className="hidden lg:block rounded-xl border border-border/80 bg-card shadow-xs">
                <CardContent className="p-4 space-y-2.5">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-10 text-sm font-semibold shadow-xs"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
                    className="w-full h-9 text-xs border-border"
                  >
                    Batal
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mobile Sticky Floating Action Dock (lg:hidden) */}
          <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-background/95 backdrop-blur-md border-t border-border lg:hidden flex items-center gap-2 shadow-lg safe-area-pb">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/berita')}
              disabled={isSubmitting}
              className="flex-1 h-11 text-xs font-semibold rounded-xl border-border"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11 text-xs font-semibold rounded-xl shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
    </div>
  );
}
