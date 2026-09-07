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
import { ArrowLeft, Save, Phone, MapPin, Mail, Clock, Globe, Eye, EyeOff, Facebook, Instagram, Youtube, Share2 } from "lucide-react";
import { toast } from "sonner";

interface KontakSekolahItem {
    id: number;
    alamat: string;
    whatsapp: string;
    email_utama: string;
    email_admin: string;
    jam_operasional: string;
    maps_embed_url: string | null;
    facebook_url?: string | null;
    instagram_url?: string | null;
    youtube_url?: string | null;
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
        maps_embed_url: '',
        facebook_url: '',
        instagram_url: '',
        youtube_url: ''
    });
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        async function fetchKontakSekolah() {
            const { data, error } = await supabase
                .from('kontak_sekolah')
                .select('*')
                .maybeSingle();

            if (error && error.code !== 'PGRST116') {
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
                    maps_embed_url: data.maps_embed_url || '',
                    facebook_url: data.facebook_url || '',
                    instagram_url: data.instagram_url || '',
                    youtube_url: data.youtube_url || ''
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
                    facebook_url: formData.facebook_url || null,
                    instagram_url: formData.instagram_url || null,
                    youtube_url: formData.youtube_url || null,
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
            <div className="min-h-screen bg-background p-4 sm:p-6">
                <div className="mx-auto max-w-6xl">
                    <Card className="border-border/80 bg-card">
                        <CardContent className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <Phone className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                <p className="text-muted-foreground text-sm">Memuat data kontak...</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!kontakSekolah) {
        return (
            <div className="min-h-screen bg-background p-4 sm:p-6">
                <div className="mx-auto max-w-6xl">
                    <Card className="border-border/80 bg-card">
                        <CardContent className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <Phone className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                <p className="text-muted-foreground text-sm">Data kontak sekolah tidak ditemukan</p>
                                <Link href="/admin/konten">
                                    <Button className="mt-4 border-border/80" variant="outline">
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
        <div className="min-h-screen bg-background p-4 sm:p-6">
            <div className="mx-auto max-w-6xl space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card p-5 sm:p-6 rounded-2xl border border-border/80 shadow-xs">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link href="/admin/konten">
                                <Button variant="outline" size="sm" className="border-border/80 h-8 text-xs">
                                    <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                                    Kembali
                                </Button>
                            </Link>
                            <Badge variant="outline" className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
                                <Phone className="w-3 h-3 mr-1" />
                                Kontak Sekolah
                            </Badge>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Edit Kontak Sekolah</h1>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Perbarui informasi kontak dan lokasi sekolah</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowPreview(!showPreview)}
                            className="border-border/80 h-9 text-xs flex items-center gap-2"
                        >
                            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {showPreview ? 'Sembunyikan Preview' : 'Lihat Preview'}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Form Section */}
                    <Card className="border-border/80 bg-card shadow-xs">
                        <CardHeader className="bg-muted/30 dark:bg-muted/15 border-b border-border/80 py-4">
                            <CardTitle className="flex items-center gap-2 text-base text-foreground font-semibold">
                                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                Form Edit Kontak
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 sm:p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="alamat" className="flex items-center gap-2 text-foreground/90 text-xs font-semibold">
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
                                        className="border-border/80 bg-background text-foreground"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp" className="flex items-center gap-2 text-foreground/90 text-xs font-semibold">
                                        <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                        Nomor WhatsApp
                                    </Label>
                                    <Input
                                        id="whatsapp"
                                        name="whatsapp"
                                        type="text"
                                        value={formData.whatsapp}
                                        onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                                        placeholder="0818-xxxx-xxxx"
                                        className="border-border/80 bg-background text-foreground"
                                        required
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="email_utama" className="flex items-center gap-2 text-foreground/90 text-xs font-semibold">
                                            <Mail className="w-4 h-4 text-purple-500" />
                                            Email Utama
                                        </Label>
                                        <Input
                                            id="email_utama"
                                            name="email_utama"
                                            type="email"
                                            value={formData.email_utama}
                                            onChange={(e) => handleInputChange('email_utama', e.target.value)}
                                            placeholder="contoh@mimpkdimoro.sch.id"
                                            className="border-border/80 bg-background text-foreground"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email_admin" className="flex items-center gap-2 text-foreground/90 text-xs font-semibold">
                                            <Mail className="w-4 h-4 text-amber-500" />
                                            Email Admin
                                        </Label>
                                        <Input
                                            id="email_admin"
                                            name="email_admin"
                                            type="email"
                                            value={formData.email_admin}
                                            onChange={(e) => handleInputChange('email_admin', e.target.value)}
                                            placeholder="admin@mimpkdimoro.sch.id"
                                            className="border-border/80 bg-background text-foreground"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jam_operasional" className="flex items-center gap-2 text-foreground/90 text-xs font-semibold">
                                        <Clock className="w-4 h-4 text-sky-500" />
                                        Jam Operasional
                                    </Label>
                                    <Textarea
                                        id="jam_operasional"
                                        name="jam_operasional"
                                        value={formData.jam_operasional}
                                        onChange={(e) => handleInputChange('jam_operasional', e.target.value)}
                                        placeholder="Senin - Kamis: 07:30 - 11:30 WIB&#10;Jumat: 07:30 - 11:00 WIB"
                                        rows={3}
                                        className="border-border/80 bg-background text-foreground"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="maps_embed_url" className="flex items-center gap-2 text-foreground/90 text-xs font-semibold">
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
                                        className="font-mono text-xs border-border/80 bg-background text-foreground"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Opsional: Dapatkan dari Google Maps → Share → Embed → Copy HTML
                                    </p>
                                </div>

                                {/* Media Sosial */}
                                <div className="space-y-4 pt-4 border-t border-border/80">
                                    <div className="flex items-center gap-2">
                                        <Share2 className="w-4 h-4 text-sky-500" />
                                        <h3 className="font-semibold text-foreground text-sm">Media Sosial</h3>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="facebook_url" className="flex items-center gap-2 text-foreground/90 text-xs font-semibold">
                                            <Facebook className="w-4 h-4 text-sky-500" />
                                            Facebook URL
                                        </Label>
                                        <Input
                                            id="facebook_url"
                                            name="facebook_url"
                                            type="url"
                                            value={formData.facebook_url}
                                            onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                                            placeholder="https://facebook.com/..."
                                            className="border-border/80 bg-background text-foreground"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="instagram_url" className="flex items-center gap-2 text-foreground/90 text-xs font-semibold">
                                            <Instagram className="w-4 h-4 text-pink-500" />
                                            Instagram URL
                                        </Label>
                                        <Input
                                            id="instagram_url"
                                            name="instagram_url"
                                            type="url"
                                            value={formData.instagram_url}
                                            onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                                            placeholder="https://instagram.com/..."
                                            className="border-border/80 bg-background text-foreground"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="youtube_url" className="flex items-center gap-2 text-foreground/90 text-xs font-semibold">
                                            <Youtube className="w-4 h-4 text-red-500" />
                                            YouTube URL
                                        </Label>
                                        <Input
                                            id="youtube_url"
                                            name="youtube_url"
                                            type="url"
                                            value={formData.youtube_url}
                                            onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                                            placeholder="https://youtube.com/..."
                                            className="border-border/80 bg-background text-foreground"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-border/80">
                                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" />
                                        Terakhir diperbarui: {new Date(kontakSekolah.updated_at).toLocaleDateString('id-ID')}
                                    </div>
                                    <Button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9">
                                        <Save className="w-4 h-4" />
                                        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Preview Section */}
                    {showPreview && (
                        <Card className="border-border/80 bg-card shadow-xs">
                            <CardHeader className="bg-muted/30 dark:bg-muted/15 border-b border-border/80 py-4">
                                <CardTitle className="flex items-center gap-2 text-base text-foreground font-semibold">
                                    <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    Preview Kontak Sekolah
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 sm:p-6">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3 p-3 rounded-xl border border-border/80 bg-muted/20">
                                            <MapPin className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Alamat</p>
                                                <p className="text-muted-foreground text-sm mt-0.5">
                                                    {formData.alamat || 'Alamat akan muncul di sini'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-3 rounded-xl border border-border/80 bg-muted/20">
                                            <Phone className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="font-semibold text-foreground text-xs uppercase tracking-wider">WhatsApp</p>
                                                <p className="text-muted-foreground text-sm mt-0.5">
                                                    {formData.whatsapp || 'Nomor WhatsApp akan muncul di sini'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-3 rounded-xl border border-border/80 bg-muted/20">
                                            <Mail className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Email Utama</p>
                                                <p className="text-muted-foreground text-sm mt-0.5">
                                                    {formData.email_utama || 'Email utama akan muncul di sini'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-3 rounded-xl border border-border/80 bg-muted/20">
                                            <Mail className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Email Admin</p>
                                                <p className="text-muted-foreground text-sm mt-0.5">
                                                    {formData.email_admin || 'Email admin akan muncul di sini'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-3 rounded-xl border border-border/80 bg-muted/20">
                                            <Clock className="w-5 h-5 text-sky-500 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Jam Operasional</p>
                                                <div className="text-muted-foreground text-sm whitespace-pre-line mt-0.5">
                                                    {formData.jam_operasional || 'Jam operasional akan muncul di sini'}
                                                </div>
                                            </div>
                                        </div>

                                        {formData.maps_embed_url && (
                                            <div className="flex items-start gap-3 p-3 rounded-xl border border-border/80 bg-muted/20">
                                                <Globe className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                                                <div className="w-full min-w-0">
                                                    <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Google Maps</p>
                                                    <div className="mt-2 border border-border/80 rounded-lg overflow-hidden">
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

                                        {(formData.facebook_url || formData.instagram_url || formData.youtube_url) && (
                                            <div className="flex items-start gap-3 p-3 rounded-xl border border-border/80 bg-muted/20">
                                                <Share2 className="w-5 h-5 text-sky-500 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Media Sosial</p>
                                                    <div className="flex flex-wrap gap-3 mt-1.5">
                                                        {formData.facebook_url && (
                                                            <a href={formData.facebook_url} target="_blank" rel="noopener noreferrer" className="text-sky-600 dark:text-sky-400 hover:underline text-xs flex items-center gap-1 font-medium">
                                                                <Facebook className="w-3.5 h-3.5" /> Facebook
                                                            </a>
                                                        )}
                                                        {formData.instagram_url && (
                                                            <a href={formData.instagram_url} target="_blank" rel="noopener noreferrer" className="text-pink-600 dark:text-pink-400 hover:underline text-xs flex items-center gap-1 font-medium">
                                                                <Instagram className="w-3.5 h-3.5" /> Instagram
                                                            </a>
                                                        )}
                                                        {formData.youtube_url && (
                                                            <a href={formData.youtube_url} target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 hover:underline text-xs flex items-center gap-1 font-medium">
                                                                <Youtube className="w-3.5 h-3.5" /> YouTube
                                                            </a>
                                                        )}
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
