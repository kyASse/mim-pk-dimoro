// app/admin/testimoni/page.tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowLeft, Users, Star } from "lucide-react";
import TestimoniTable from "@/components/admin/TestimoniTable";

export default async function KelolaTestimoniPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    const { data: testimoni, error } = await supabase
        .from('testimoni')
        .select('id, nama_orang_tua, status_orang_tua, is_featured, isi_testimoni, created_at, created_by')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching testimoni:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return (
            <div className="min-h-screen p-6">
                <Card>
                    <CardContent className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <p className="text-red-600">Gagal memuat data testimoni. Silakan coba lagi.</p>
                            <p className="text-sm text-gray-500 mt-2">Error: {error.message}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Hitung statistik
    const totalTestimoni = testimoni?.length || 0;
    const featuredTestimoni = testimoni?.filter(t => t.is_featured).length || 0;
    const recentTestimoni = testimoni?.filter(t => {
        const created = new Date(t.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return created >= weekAgo;
    }).length || 0;

    return (
        <div className="min-h-screen p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manajemen Testimoni</h1>
                    <p className="text-gray-600 mt-1">Kelola testimoni dari orang tua siswa</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/admin">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Dashboard
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="flex items-center p-6">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Testimoni</p>
                            <p className="text-2xl font-bold text-gray-900">{totalTestimoni}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center p-6">
                        <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mr-4">
                            <Star className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tampil di Beranda</p>
                            <p className="text-2xl font-bold text-gray-900">{featuredTestimoni}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center p-6">
                        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4">
                            <Plus className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Terbaru (7 hari)</p>
                            <p className="text-2xl font-bold text-gray-900">{recentTestimoni}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span>Daftar Testimoni</span>
                                {testimoni && <Badge variant="secondary">{testimoni.length} items</Badge>}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {testimoni && testimoni.length > 0 ? (
                                <TestimoniTable testimoni={testimoni} />
                            ) : (
                                <div className="text-center py-8">
                                    <div className="bg-gray-50 rounded-lg p-8">
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada testimoni</h3>
                                        <p className="text-gray-600 mb-4">
                                            Menunggu testimoni dari orang tua.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}