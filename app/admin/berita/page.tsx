import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Eye, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DeleteButton from './DeleteButton';

type Berita = {
    id: number;
    judul: string;
    tanggal_terbit: string;
    image_url: string;
    status: string;
};

export default async function KelolaBeritaPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return redirect('/auth/login');
    }

    const { data: berita, error } = await supabase
        .from('berita')
        .select('id, judul, tanggal_terbit, image_url, status')
        .order('tanggal_terbit', { ascending: false });

    if (error) {
        console.error('Error fetching berita:', error);
        return <p>Gagal memuat data berita. Cek konsol server untuk detail.</p>;
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Daftar Berita</h1>
                        <p className="text-gray-600 mt-1">Daftar artikel berita situs web TK ABA Mertosanan</p>
                    </div>
                    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Link href="/admin/berita/tambah">
                            <span className="mr-2">+</span>
                            Tambah Berita Baru
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
                                <th className="text-left px-6 py-4 font-semibold text-gray-900">Judul</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-900">Tanggal</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-900">Status</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-900">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {berita && berita.length > 0 ? (
                                berita.map((item: Berita, index: number) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-900 font-medium">
                                            {index + 1}.
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {item.image_url && (
                                                    <Image
                                                        src={item.image_url}
                                                        alt={item.judul}
                                                        width={48}
                                                        height={48}
                                                        className="w-12 h-12 object-cover rounded-lg shadow-sm"
                                                    />
                                                )}
                                                <span className="font-medium text-gray-900 line-clamp-2">
                                                    {item.judul}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(item.tanggal_terbit).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge 
                                                variant={item.status === 'published' ? 'default' : 'secondary'}
                                                className={
                                                    item.status === 'published' 
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                                                        : 'bg-purple-100 text-purple-800 hover:bg-purple-100'
                                                }
                                            >
                                                {item.status === 'published' ? 'Diterbitkan' : 'Draft'}
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
                                                    <Link href={`/berita/${item.id}`}>
                                                        <Eye className="h-4 w-4 text-blue-600" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 hover:bg-orange-50 hover:border-orange-300"
                                                    asChild
                                                >
                                                    <Link href={`/admin/berita/edit/${item.id}`}>
                                                        <Edit className="h-4 w-4 text-orange-600" />
                                                    </Link>
                                                </Button>
                                                <DeleteButton beritaId={item.id} imageUrl={item.image_url} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <p className="font-medium">Belum ada berita</p>
                                            <p className="text-sm">Silakan tambahkan berita baru untuk memulai</p>
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