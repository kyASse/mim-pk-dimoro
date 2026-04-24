"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Phone, MapPin, Mail, Clock, Globe, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface KontakSekolahItem {
    id: number;
    alamat: string;
    whatsapp: string;
    email_utama: string;
    email_admin: string;
    jam_operasional: string;
    maps_embed_url: string | null;
    created_at: string;
    updated_at: string;
}

export default function EditContactPage() {
    const [kontakSekolah, setKontakSekolah] = useState<KontakSekolahItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [formData, setFormData] = useState({
        alamat: '',
        whatsapp: '',
        email_utama: '',
        email_admin: '',
        jam_operasional: '',
        maps_embed_url: ''
    });
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        async function fetchKontakSekolah() {
            const { data, error } = await supabase
                .from('kontak_sekolah')
                .select('*')
                .single();

            if (error) {
                console.error('Error fetching kontak:', error);
                toast.error('Gagal memuat data kontak sekolah');
                return;
            }

            if (data) {
                setKontakSekolah(data);
                setFormData({
                    alamat: data.alamat || '',
                    whatsapp: data.whatsapp || '',
                    email_utama: data.email_utama || '',
                    email_admin: data.email_admin || '',
                    jam_operasional: data.jam_operasional || '',
                    maps_embed_url: data.maps_embed_url || ''
                });
            }
            setIsLoading(false);
        }

        fetchKontakSekolah();
    }, [supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!kontakSekolah) return;

        setIsSaving(true);

        try {
            const { error } = await supabase
                .from('kontak_sekolah')
                .update({
                    alamat: formData.alamat,
                    whatsapp: formData.whatsapp,
                    email_utama: formData.email_utama,
                    email_admin: formData.email_admin,
                    jam_operasional: formData.jam_operasional,
                    maps_embed_url: formData.maps_embed_url || null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', kontakSekolah.id);

            if (error) throw error;

            toast.success('Kontak sekolah berhasil diperbarui!');
            router.push('/admin/konten');
        } catch (error) {
            console.error('Error updating kontak:', error);
            toast.error('Gagal memperbarui kontak sekolah. Silakan coba lagi.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto max-w-6xl">
                    <Card>
                        <CardContent className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <Phone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">Memuat data kontak...</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!kontakSekolah) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto max-w-6xl">
                    <Card>
                        <CardContent className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <Phone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">Data kontak sekolah tidak ditemukan</p>
                                <Link href="/admin/konten">
                                    <Button className="mt-4" variant="outline">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Kembali
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-6xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <Link href="/admin/konten">
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Kembali
                                </Button>
                            </Link>
                            <Badge variant="secondary">
                                <Phone className="w-3 h-3 mr-1" />
                                Kontak Sekolah
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Kontak Sekolah</h1>
                        <p className="text-gray-600">Perbarui informasi kontak dan lokasi sekolah</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowPreview(!showPreview)}
                            className="flex items-center gap-2"
                        >
                            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {showPreview ? 'Sembunyikan Preview' : 'Lihat Preview'}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Form Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="w-5 h-5" />
                                Form Edit Kontak
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="alamat" className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-red-500" />
                                        Alamat Lengkap
                                    </Label>
                                    <Textarea
                                        id="alamat"
                                        name="alamat"
                                        value={formData.alamat}
                                        onChange={(e) => handleInputChange('alamat', e.target.value)}
                                        placeholder="Masukkan alamat lengkap sekolah"
                                        rows={3}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp" className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-green-500" />
                                        Nomor WhatsApp
                                    </Label>
                                    <Input
                                        id="whatsapp"
                                        name="whatsapp"
                                        type="text"
                                        value={formData.whatsapp}
                                        onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                                        placeholder="0818-xxxx-xxxx"
                                        required
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="email_utama" className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-purple-500" />
                                            Email Utama
                                        </Label>
                                        <Input
                                            id="email_utama"
                                            name="email_utama"
                                            type="email"
                                            value={formData.email_utama}
                                            onChange={(e) => handleInputChange('email_utama', e.target.value)}
                                            placeholder="email@tkabamertosanan.com"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email_admin" className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-orange-500" />
                                            Email Admin
                                        </Label>
                                        <Input
                                            id="email_admin"
                                            name="email_admin"
                                            type="email"
                                            value={formData.email_admin}
                                            onChange={(e) => handleInputChange('email_admin', e.target.value)}
                                            placeholder="admin@tkabamertosanan.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jam_operasional" className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-500" />
                                        Jam Operasional
                                    </Label>
                                    <Textarea
                                        id="jam_operasional"
                                        name="jam_operasional"
                                        value={formData.jam_operasional}
                                        onChange={(e) => handleInputChange('jam_operasional', e.target.value)}
                                        placeholder="Senin - Kamis: 07:30 - 11:30 WIB&#10;Jumat: 07:30 - 11:00 WIB"
                                        rows={3}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="maps_embed_url" className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-indigo-500" />
                                        URL Google Maps Embed
                                    </Label>
                                    <Textarea
                                        id="maps_embed_url"
                                        name="maps_embed_url"
                                        value={formData.maps_embed_url}
                                        onChange={(e) => handleInputChange('maps_embed_url', e.target.value)}
                                        placeholder="https://www.google.com/maps/embed?pb=..."
                                        rows={3}
                                        className="font-mono text-xs"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Opsional: Dapatkan dari Google Maps → Share → Embed → Copy HTML
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t">
                                    <div className="text-sm text-gray-500 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Terakhir diperbarui: {new Date(kontakSekolah.updated_at).toLocaleDateString('id-ID')}
                                    </div>
                                    <Button type="submit" disabled={isSaving} className="flex items-center gap-2">
                                        <Save className="w-4 h-4" />
                                        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Preview Section */}
                    {showPreview && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="w-5 h-5" />
                                    Preview Kontak Sekolah
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium text-gray-700">Alamat</p>
                                                <p className="text-gray-600 text-sm">
                                                    {formData.alamat || 'Alamat akan muncul di sini'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Phone className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium text-gray-700">WhatsApp</p>
                                                <p className="text-gray-600 text-sm">
                                                    {formData.whatsapp || 'Nomor WhatsApp akan muncul di sini'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Mail className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium text-gray-700">Email Utama</p>
                                                <p className="text-gray-600 text-sm">
                                                    {formData.email_utama || 'Email utama akan muncul di sini'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Mail className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium text-gray-700">Email Admin</p>
                                                <p className="text-gray-600 text-sm">
                                                    {formData.email_admin || 'Email admin akan muncul di sini'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Clock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium text-gray-700">Jam Operasional</p>
                                                <div className="text-gray-600 text-sm whitespace-pre-line">
                                                    {formData.jam_operasional || 'Jam operasional akan muncul di sini'}
                                                </div>
                                            </div>
                                        </div>

                                        {formData.maps_embed_url && (
                                            <div className="flex items-start gap-3">
                                                <Globe className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="font-medium text-gray-700">Google Maps</p>
                                                    <div className="mt-2 border rounded overflow-hidden">
                                                        <iframe
                                                            src={formData.maps_embed_url}
                                                            width="100%"
                                                            height="200"
                                                            style={{ border: 0 }}
                                                            allowFullScreen
                                                            loading="lazy"
                                                            referrerPolicy="no-referrer-when-downgrade"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
