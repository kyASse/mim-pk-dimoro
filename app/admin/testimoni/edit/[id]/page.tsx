'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, User, MessageSquare, Star, Loader2, Edit } from "lucide-react";
import TestimonialCard from "@/components/home/TestimonialCard";
import { toast } from "sonner";

type TestimoniData = {
    id: number;
    nama_orang_tua: string | null;
    status_orang_tua: string | null;
    isi_testimoni: string | null;
    is_featured: boolean | null;
};

export default function EditTestimoniPage() {
    const [nama, setNama] = useState('');
    const [status, setStatus] = useState('');
    const [isi, setIsi] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [testimoni, setTestimoni] = useState<TestimoniData | null>(null);
    
    const supabase = createClient();
    const router = useRouter();
    const params = useParams();
    const testimoniId = parseInt(params.id as string, 10);

    // Load data testimoni
    useEffect(() => {
        const loadTestimoni = async () => {
            try {
                const { data, error } = await supabase
                    .from('testimoni')
                    .select('*')
                    .eq('id', testimoniId)
                    .single();

                if (error) throw error;

                if (data) {
                    setTestimoni(data);
                    setNama(data.nama_orang_tua || '');
                    setStatus(data.status_orang_tua || '');
                    setIsi(data.isi_testimoni || '');
                    setIsFeatured(data.is_featured || false);
                } else {
                    toast.error("Testimoni tidak ditemukan");
                    router.push('/admin/testimoni');
                }
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui';
                console.error("Error loading testimoni:", errorMessage);
                toast.error("Gagal memuat data testimoni", {
                    description: errorMessage,
                });
                router.push('/admin/testimoni');
            } finally {
                setIsLoadingData(false);
            }
        };

        loadTestimoni();
    }, [testimoniId, router, supabase]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!testimoni) return;
        
        setIsLoading(true);

        try {
            const { error: updateError } = await supabase
                .from('testimoni')
                .update({
                    nama_orang_tua: nama,
                    status_orang_tua: status,
                    isi_testimoni: isi,
                    is_featured: isFeatured,
                })
                .eq('id', testimoni.id);

            if (updateError) throw updateError;

            toast.success("Testimoni berhasil diperbarui!", {
                description: "Perubahan testimoni telah disimpan.",
            });

            router.push('/admin/testimoni');
            router.refresh();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui';
            toast.error("Gagal memperbarui testimoni", {
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Loading state
    if (isLoadingData) {
        return (
            <div className="min-h-screen p-6 space-y-6">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">Memuat data testimoni...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Testimoni</h1>
                    <p className="text-gray-600 mt-1">Perbarui testimoni dari orang tua siswa</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/admin/testimoni">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali ke Manajemen
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Edit className="w-5 h-5" />
                            Edit Form Testimoni
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nama Orang Tua */}
                            <div className="space-y-2">
                                <Label htmlFor="nama" className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Nama Orang Tua
                                </Label>
                                <Input
                                    id="nama"
                                    type="text"
                                    placeholder="Masukkan nama orang tua..."
                                    value={nama}
                                    onChange={(e) => setNama(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Input
                                    id="status"
                                    type="text"
                                    placeholder="Contoh: Orang Tua Siswa TK A"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Isi Testimoni */}
                            <div className="space-y-2">
                                <Label htmlFor="isi">Isi Testimoni</Label>
                                <Textarea
                                    id="isi"
                                    placeholder="Tuliskan testimoni dari orang tua..."
                                    value={isi}
                                    onChange={(e) => setIsi(e.target.value)}
                                    rows={6}
                                    required
                                    disabled={isLoading}
                                    className="resize-none"
                                />
                                <p className="text-sm text-gray-500">
                                    {isi.length} karakter
                                </p>
                            </div>

                            {/* Featured Checkbox */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isFeatured"
                                    checked={isFeatured}
                                    onCheckedChange={(checked) => setIsFeatured(checked === true)}
                                    disabled={isLoading}
                                />
                                <Label 
                                    htmlFor="isFeatured" 
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                                >
                                    <Star className="w-4 h-4" />
                                    Tampilkan di halaman Beranda
                                </Label>
                            </div>

                            {/* Submit Button */}
                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Memperbarui...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Perbarui Testimoni
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Preview Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Preview Testimoni</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {nama && isi && status ? (
                            <div className="space-y-4">
                                <TestimonialCard
                                    name={nama}
                                    role={status}
                                    testimonial={isi}
                                    avatarUrl={undefined}
                                />
                                {isFeatured && (
                                    <div className="text-center">
                                        <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-sm">
                                            <Star className="w-4 h-4" />
                                            Akan ditampilkan di Beranda
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Preview Testimoni</h3>
                                <p className="text-gray-600">
                                    Isi form untuk melihat preview testimoni
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}