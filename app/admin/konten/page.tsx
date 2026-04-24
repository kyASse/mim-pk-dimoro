import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, FileText, Edit, Calendar, Hash, MapPin, Phone, Mail, Clock, Edit3, Plus } from "lucide-react";

type KontenItem = {
    id: number;
    slug: string;
    judul: string | null;
    updated_at: string;
};

type KontakSekolahItem = {
    id: number;
    alamat: string;
    whatsapp: string;
    email_utama: string;
    email_admin: string;
    jam_operasional: string;
    maps_embed_url: string | null;
    updated_at: string;
};

export default async function KelolaKontenPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    const { data: konten, error } = await supabase
        .from('konten_halaman')
        .select('id, slug, judul, updated_at')
        .order('judul', { ascending: true });

    const { data: kontakSekolah, error: kontakError } = await supabase
        .from('kontak_sekolah')
        .select('*')
        .single() as { data: KontakSekolahItem | null, error: Error | null };

    if (error || kontakError) {
        console.error('Error fetching data:', error || kontakError);
        return (
            <div className="min-h-screen p-6">
                <Card>
                    <CardContent className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <p className="text-red-600">Gagal memuat data. Silakan coba lagi.</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Error: {error?.message || kontakError?.message}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Hitung statistik
    const totalKonten = konten?.length || 0;
    const recentlyUpdated = konten?.filter(item => {
        const updated = new Date(item.updated_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return updated >= weekAgo;
    }).length || 0;

    return (
        <div className="min-h-screen p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manajemen Konten Halaman</h1>
                    <p className="text-gray-600 mt-1">Kelola konten statis halaman website</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/admin">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali ke Dashboard
                    </Link>
                </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="flex items-center p-6">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Konten</p>
                            <p className="text-2xl font-bold text-gray-900">{totalKonten}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center p-6">
                        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4">
                            <Calendar className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Diperbarui Minggu Ini</p>
                            <p className="text-2xl font-bold text-gray-900">{recentlyUpdated}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* School Contact Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Phone className="w-5 h-5" />
                            <span>Informasi Kontak Sekolah</span>
                        </div>
                        <Link href="/admin/konten/edit-kontak">
                            <Button variant="outline" size="sm">
                                <Edit3 className="w-4 h-4 mr-2" />
                                Edit Kontak
                            </Button>
                        </Link>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {kontakSekolah ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-700">Alamat</p>
                                        <p className="text-gray-600">{kontakSekolah.alamat}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-green-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-700">WhatsApp</p>
                                        <p className="text-gray-600">{kontakSekolah.whatsapp}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-700">Jam Operasional</p>
                                        <p className="text-gray-600">{kontakSekolah.jam_operasional}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-purple-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-700">Email Utama</p>
                                        <p className="text-gray-600">{kontakSekolah.email_utama}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-orange-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-700">Email Admin</p>
                                        <p className="text-gray-600">{kontakSekolah.email_admin}</p>
                                    </div>
                                </div>
                                {kontakSekolah.maps_embed_url && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-indigo-500 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-gray-700">Google Maps</p>
                                            <p className="text-gray-600">Tersedia</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Phone className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                            <p>Belum ada informasi kontak sekolah</p>
                            <Button className="mt-4" variant="outline">
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Kontak
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Content Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span>Daftar Konten Halaman</span>
                        {konten && <Badge variant="secondary">{konten.length} konten</Badge>}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {konten && konten.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Konten</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Terakhir Diperbarui</TableHead>
                                    <TableHead className="w-[140px]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {konten.map((item: KontenItem) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-blue-600" />
                                                {item.judul || 'Tidak ada judul'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Hash className="w-3 h-3 text-gray-400" />
                                                <Badge variant="outline" className="text-xs font-mono">
                                                    {item.slug}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(item.updated_at).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/konten/edit/${item.slug}`}>
                                                    <Edit className="w-3 h-3 mr-1" />
                                                    Edit
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-8">
                            <div className="bg-gray-50 rounded-lg p-8">
                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada konten</h3>
                                <p className="text-gray-600 mb-4">
                                    Belum ada konten halaman yang tersedia untuk dikelola.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}