// app/admin/pendaftar/page.tsx
import { createClient } from "@/lib/supabase/server";
export const dynamic = 'force-dynamic';
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PendaftarTable from "@/components/admin/PendaftarTable";
import { calculatePendaftarStats } from "@/lib/utils/pendaftar-stats";

export default async function KelolaPendaftarPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    const { data: pendaftar, error } = await supabase
        .from('pendaftar')
        .select('id, nama_lengkap, nama_ayah_kandung, nama_ibu_kandung, jenis_kelamin, tanggal_lahir, status_pendaftaran, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching pendaftar:', error);
        return <p>Gagal memuat data pendaftar.</p>;
    }

    // Hitung statistik menggunakan utility function
    const {
        totalPendaftar,
        menungguPersetujuan,
        pendaftarDisetujui: diterima,
        validasiUlang,
        pendaftarDitolak
    } = calculatePendaftarStats(pendaftar);

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                    <h1 className="text-2xl font-bold">Kelola Pendaftaran</h1>
                    <p className="text-gray-600 mt-1">mengelola pendaftaran siswa untuk tahun ajaran mendatang</p>
                </div>
                <Button variant="outline" size="sm" asChild className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Link href="/admin" className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Dasbor
                    </Link>
                </Button>
            </div>

            {/* Status Pendaftaran Cards */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Status Pendaftaran</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <Card className="bg-orange-50 border-orange-200">
                        <CardContent className="p-4 text-center">
                            <p className="text-sm text-gray-600 mb-2">Total Pendaftar</p>
                            <p className="text-2xl font-bold text-orange-600">{totalPendaftar}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4 text-center">
                            <p className="text-sm text-gray-600 mb-2">Menunggu Persetujuan</p>
                            <p className="text-2xl font-bold text-blue-600">{menungguPersetujuan}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4 text-center">
                            <p className="text-sm text-gray-600 mb-2">Pendaftaran Yang Disetujui</p>
                            <p className="text-2xl font-bold text-green-600">{diterima}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-yellow-50 border-yellow-200">
                        <CardContent className="p-4 text-center">
                            <p className="text-sm text-gray-600 mb-2">Validasi Ulang</p>
                            <p className="text-2xl font-bold text-yellow-600">{validasiUlang}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-red-50 border-red-200">
                        <CardContent className="p-4 text-center">
                            <p className="text-sm text-gray-600 mb-2">Pendaftar Yang Ditolak</p>
                            <p className="text-2xl font-bold text-red-600">{pendaftarDitolak}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Tabel Pendaftar dengan Search */}
            <PendaftarTable pendaftar={pendaftar || []} />
        </div>
    );
}