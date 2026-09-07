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
import RichTextEditor from "@/components/admin/berita/RichTextEditor";

import { Alert, AlertDescription } from "@/components/ui/alert";
// Schema validation untuk form edit
const editNewsFormSchema = z.object({
    judul: z.string().min(1, "Judul berita wajib diisi").max(200, "Judul maksimal 200 karakter"),
    ringkasan: z.string().min(1, "Ringkasan wajib diisi").max(500, "Ringkasan maksimal 500 karakter"),
    isiLengkap: z.string().min(1, "Isi lengkap berita wajib diisi"),
    status: z.enum(["draft", "terbit"]),
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
            status: (berita.status as "draft" | "terbit") || "draft",
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
        <div className="space-y-6 pb-28 sm:pb-8">
            {/* Outer Shell (Double-Bezel) */}
            <div className="rounded-2xl sm:rounded-3xl p-1 sm:p-1.5 bg-muted/40 dark:bg-muted/20 border border-border/60 shadow-xs">
                <Card className="rounded-xl sm:rounded-2xl border border-border/80 shadow-xs">
                    <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4 border-b border-border/60">
                        <CardTitle className="text-lg sm:text-xl font-bold">Edit Berita</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Perbarui informasi berita yang sudah ada
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-4 sm:pt-6">
                        {/* Alert untuk gambar */}
                        <Alert className="mb-5 rounded-xl border-amber-200 dark:border-amber-900 bg-amber-50/60 dark:bg-amber-950/30">
                            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            <AlertDescription className="text-xs text-amber-800 dark:text-amber-300">
                                Untuk mengubah gambar cover utama berita, silakan hapus berita ini dan buat berita baru.
                            </AlertDescription>
                        </Alert>

                        {/* Gambar Saat Ini */}
                        <div className="space-y-2 mb-6">
                            <Label className="text-xs sm:text-sm font-semibold">Gambar Utama Saat Ini</Label>
                            <div className="border border-border/80 rounded-xl p-3 sm:p-4 bg-muted/20">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="shrink-0 rounded-lg overflow-hidden border border-border/60">
                                        <Image
                                            src={berita.image_url}
                                            alt={berita.judul}
                                            width={140}
                                            height={90}
                                            className="w-24 sm:w-32 h-16 sm:h-20 object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-foreground">
                                            <ImageIcon className="w-4 h-4 text-primary shrink-0" />
                                            <span className="truncate">Gambar utama berita</span>
                                        </div>
                                        <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                                            Gambar utama tidak dapat diubah pada mode edit
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

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
                                                Simpan Perubahan
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