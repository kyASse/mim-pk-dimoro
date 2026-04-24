import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, DollarSign, Trophy, Edit, ExternalLink } from "lucide-react";
import DeletePrestasiButton from "./DeletePrestasiButton";

type BiayaItem = { id: number; komponen_biaya: string | null; biaya_putra: number | null; biaya_putri: number | null; };
type PrestasiItem = { id: number; tahun: number | null; nama_siswa: string | null; nama_prestasi: string | null; tingkat: string | null; dokumentasi_url: string | null;};

export default async function KelolaAkademikPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    const { data: biaya, error: biayaError } = await supabase
        .from('biaya_pendaftaran')
        .select('*')
        .order('id');

    const { data: prestasi, error: prestasiError } = await supabase
        .from('prestasi')
        .select('*')
        .order('tahun', { ascending: false });

    const { data: catatanSpp, error: sppError } = await supabase
        .from('konten_halaman')
        .select('isi')
        .eq('slug', 'catatan-spp')
        .single();

    // Handle errors
    if (biayaError) console.error('Error fetching biaya:', biayaError);
    if (prestasiError) console.error('Error fetching prestasi:', prestasiError);
    if (sppError) console.error('Error fetching SPP:', sppError);

    const totalPutra = biaya?.reduce((acc: number, item: BiayaItem) => acc + (item.biaya_putra || 0), 0) || 0;
    const totalPutri = biaya?.reduce((acc: number, item: BiayaItem) => acc + (item.biaya_putri || 0), 0) || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Akademik</h1>
                    <p className="text-gray-600">Kelola biaya pendaftaran dan prestasi siswa</p>
                </div>
            </div>

            {/* Bagian Manajemen Biaya */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            Rincian Keuangan Anak Baru
                        </CardTitle>
                        <Link href="/admin/akademik/edit-biaya">
                            <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Tabel Biaya
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Komponen Biaya</TableHead>
                                <TableHead className="text-center">PUTRA (Rp)</TableHead>
                                <TableHead className="text-center">PUTRI (Rp)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {biaya && biaya.length > 0 ? biaya.map((item: BiayaItem) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">
                                        {item.komponen_biaya || 'Tidak tersedia'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {item.biaya_putra ? item.biaya_putra.toLocaleString('id-ID') : '0'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {item.biaya_putri ? item.biaya_putri.toLocaleString('id-ID') : '0'}
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                                        {biayaError ? 'Error memuat data biaya' : 'Belum ada data biaya pendaftaran'}
                                    </TableCell>
                                </TableRow>
                            )}
                            {biaya && biaya.length > 0 && (
                                <TableRow className="bg-gray-50 font-semibold">
                                    <TableCell>JUMLAH</TableCell>
                                    <TableCell className="text-center">
                                        {totalPutra ? totalPutra.toLocaleString('id-ID') : '0'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {totalPutri ? totalPutri.toLocaleString('id-ID') : '0'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    {catatanSpp?.isi && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800 font-medium">
                                {(() => {
                                    if (typeof catatanSpp.isi === 'string') {
                                        return catatanSpp.isi;
                                    } else if (typeof catatanSpp.isi === 'object' && catatanSpp.isi !== null) {
                                        // Handle JSONB object
                                        if ('catatan' in catatanSpp.isi) {
                                            return catatanSpp.isi.catatan;
                                        }
                                        // If it's an object but no 'catatan' property, stringify it
                                        return JSON.stringify(catatanSpp.isi);
                                    }
                                    return 'Data catatan tidak tersedia';
                                })()}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Bagian Manajemen Prestasi */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-600" />
                            Daftar Prestasi
                        </CardTitle>
                        <Link href="/admin/akademik/prestasi/tambah">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Prestasi Baru
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>Tahun</TableHead>
                                <TableHead>Nama Siswa</TableHead>
                                <TableHead>Prestasi</TableHead>
                                <TableHead>Tingkat</TableHead>
                                <TableHead>Dokumentasi</TableHead>
                                <TableHead className="text-center">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {prestasi && prestasi.length > 0 ? prestasi.map((item: PrestasiItem, idx: number) => (
                                <TableRow key={item.id}>
                                    <TableCell className="text-center">{idx + 1}.</TableCell>
                                    <TableCell className="text-center">{item.tahun || 'N/A'}</TableCell>
                                    <TableCell>{item.nama_siswa || 'Tidak tersedia'}</TableCell>
                                    <TableCell>{item.nama_prestasi || 'Tidak tersedia'}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline">{item.tingkat || 'N/A'}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {item.dokumentasi_url ? (
                                            <a 
                                                href={item.dokumentasi_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-block"
                                            >
                                                <div className="relative w-10 h-10 mx-auto">
                                                    <Image
                                                        src={item.dokumentasi_url}
                                                        alt="Dokumentasi"
                                                        fill
                                                        className="rounded-md object-cover border hover:scale-110 transition-transform"
                                                    />
                                                    <ExternalLink className="absolute -top-1 -right-1 w-3 h-3 text-blue-600 bg-white rounded-full p-0.5" />
                                                </div>
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 justify-center">
                                            <Link href={`/admin/akademik/prestasi/edit/${item.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <DeletePrestasiButton prestasiId={item.id} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                        {prestasiError ? 'Error memuat data prestasi' : 'Belum ada data prestasi.'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}