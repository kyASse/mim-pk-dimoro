// app/admin/kalender/page.tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar, Edit, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { categoryColors } from '@/lib/constants/calendar';
import DeleteKegiatanButton from "./DeleteKegiatanButton";

type KegiatanAkademik = {
    id: number;
    judul: string;
    tanggal: string;
    tanggal_berakhir: string | null;
    waktu: string | null;
    kategori: string;
    deskripsi: string | null;
};

export default async function KelolaKalenderPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    const { data: kegiatan, error } = await supabase
        .from('kalender_akademik')
        .select('*')
        .order('tanggal', { ascending: true });

    if (error) {
        console.error('Error fetching kalender akademik:', error);
        return <p>Gagal memuat data kalender akademik. Cek konsol server untuk detail.</p>;
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manajemen Kalender Akademik</h1>
                        <p className="text-gray-600 mt-1">Kelola jadwal kegiatan dan acara akademik TK ABA Mertosanan</p>
                    </div>
                    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Link href="/admin/kalender/tambah">
                            <span className="mr-2">+</span>
                            Tambah Kegiatan Baru
                        </Link>
                    </Button>
                </div>
                
                <Button variant="ghost" size="sm" asChild className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Link href="/admin" className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Dasbor
                    </Link>
                </Button>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left px-6 py-4 font-semibold text-gray-900">No</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-900">Judul Kegiatan</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-900">Tanggal Mulai</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-900">Tanggal Berakhir</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-900">Waktu</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-900">Kategori</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-900">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {kegiatan && kegiatan.length > 0 ? (
                                kegiatan.map((item: KegiatanAkademik, index: number) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-900 font-medium">
                                            {index + 1}.
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <Calendar className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-900 line-clamp-1">
                                                        {item.judul}
                                                    </span>
                                                    {item.deskripsi && (
                                                        <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                                                            {item.deskripsi}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(item.tanggal).toLocaleDateString('id-ID', {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {item.tanggal_berakhir ? (
                                                new Date(item.tanggal_berakhir).toLocaleDateString('id-ID', {
                                                    weekday: 'short',
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })
                                            ) : (
                                                <span className="text-gray-400 italic">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {item.waktu || (
                                                <span className="text-gray-400 italic">Sepanjang hari</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge 
                                                variant="secondary"
                                                className="text-gray-800 border"
                                                style={{ 
                                                    backgroundColor: categoryColors[item.kategori] || '#e5e7eb',
                                                    color: '#1f2937',
                                                    borderColor: categoryColors[item.kategori] || '#e5e7eb'
                                                }}
                                            >
                                                <div className="flex items-center gap-1">
                                                    <div 
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ 
                                                            backgroundColor: categoryColors[item.kategori] || '#6b7280',
                                                            filter: 'brightness(0.7)'
                                                        }}
                                                    />
                                                    {item.kategori}
                                                </div>
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300"
                                                    asChild
                                                >
                                                    <Link href={`/kalender-akademik`}>
                                                        <Eye className="h-4 w-4 text-blue-600" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 hover:bg-orange-50 hover:border-orange-300"
                                                    asChild
                                                >
                                                    <Link href={`/admin/kalender/edit/${item.id}`}>
                                                        <Edit className="h-4 w-4 text-orange-600" />
                                                    </Link>
                                                </Button>
                                                <DeleteKegiatanButton kegiatanId={item.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                <Calendar className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="font-medium">Belum ada kegiatan</p>
                                            <p className="text-sm">Silakan tambahkan kegiatan akademik baru untuk memulai</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}