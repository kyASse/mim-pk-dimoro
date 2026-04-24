import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { updateBiayaAction, updateCatatanSppAction } from "../actions"; 

export default async function EditBiayaPage() {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');
    
    const biayaPromise = supabase.from('biaya_pendaftaran').select('*').order('id');
    const sppPromise = supabase.from('konten_halaman').select('isi').eq('slug', 'catatan-spp').single();

    const [{ data: biaya }, { data: catatanSpp }] = await Promise.all([biayaPromise, sppPromise]);
    
    if (!biaya) return redirect('/admin/akademik');

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Rincian Keuangan</h1>
                    <p className="text-gray-600 mt-2">Kelola biaya pendaftaran dan catatan SPP</p>
                </div>
                <Button variant="outline" size="sm" asChild className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Link href="/admin/akademik" className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Akademik
                    </Link>
                </Button>
            </div>
            
            <div className="space-y-8">
                {/* Form untuk tabel biaya */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Tabel Biaya Pendaftaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={updateBiayaAction} className="space-y-6">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200">
                                            <th className="text-left py-4 px-4 font-semibold text-gray-700">Komponen Biaya</th>
                                            <th className="text-left py-4 px-4 font-semibold text-gray-700">PUTRA (Rp)</th>
                                            <th className="text-left py-4 px-4 font-semibold text-gray-700">PUTRI (Rp)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {biaya.map((item, index) => (
                                            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-4 px-4">
                                                    <span className="font-medium text-gray-900">{item.komponen_biaya}</span>
                                                    <input type="hidden" name={`biaya[${index}][id]`} value={item.id} />
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Input 
                                                        type="number" 
                                                        name={`biaya[${index}][putra]`} 
                                                        defaultValue={item.biaya_putra || 0}
                                                        className="w-full"
                                                        min="0"
                                                    />
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Input 
                                                        type="number" 
                                                        name={`biaya[${index}][putri]`} 
                                                        defaultValue={item.biaya_putri || 0}
                                                        className="w-full"
                                                        min="0"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                                    <Save className="w-4 h-4 mr-2" />
                                    Simpan Perubahan Tabel Biaya
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Form terpisah untuk catatan SPP */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Catatan Tambahan SPP</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={updateCatatanSppAction} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="catatan-spp" className="text-sm font-medium text-gray-700">
                                    Teks Catatan SPP
                                </Label>
                                <Input 
                                    id="catatan-spp" 
                                    name="catatan-spp" 
                                    type="text" 
                                    defaultValue={catatanSpp?.isi || ''} 
                                    className="w-full"
                                    placeholder="Masukkan catatan tambahan untuk SPP..."
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                                    <Save className="w-4 h-4 mr-2" />
                                    Simpan Catatan SPP
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}