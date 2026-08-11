import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { ArrowLeft, Save, Coins, FileText, Receipt, Info, AlertCircle } from "lucide-react";
import { updateBiayaAction, updateCatatanSppAction } from "../actions"; 
import { parseCatatanSpp } from "../../konten/edit/[slug]/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PageProps {
    searchParams: Promise<{ error?: string }>;
}

export default async function EditBiayaPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const errorMsg = params.error;
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');
    
    const biayaPromise = supabase.from('biaya_pendaftaran').select('*').order('id');
    const sppPromise = supabase.from('konten_halaman').select('isi').eq('slug', 'catatan-spp').single();

    const [{ data: biaya }, { data: catatanSpp }] = await Promise.all([biayaPromise, sppPromise]);
    
    if (!biaya) return redirect('/admin/akademik');

    const defaultSppText = parseCatatanSpp(catatanSpp?.isi).catatan;
    
    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
            {errorMsg && (
                <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/20 border-red-200/50 dark:border-red-900/30 text-red-800 dark:text-red-300">
                    <AlertCircle className="w-4.5 h-4.5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <AlertDescription className="font-semibold">
                        Gagal menyimpan perubahan: {decodeURIComponent(errorMsg)}
                    </AlertDescription>
                </Alert>
            )}

            {/* Header Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border border-blue-100 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500 text-white rounded-xl shadow-inner shrink-0">
                        <Coins className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">Edit Rincian Keuangan</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base">Kelola biaya pendaftaran dan catatan SPP</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" asChild className="text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-slate-800 border-blue-200 dark:border-slate-700">
                    <Link href="/admin/akademik" className="flex items-center gap-2 font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Akademik
                    </Link>
                </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Form untuk tabel biaya (Col Span 2) */}
                <Card className="lg:col-span-2 border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="border-b border-slate-50 dark:border-slate-800/50 pb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg">
                                <Receipt className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">Tabel Biaya Pendaftaran</CardTitle>
                                <CardDescription>Rincian pengeluaran pendaftaran untuk santri baru putra/putri.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form action={async (formData) => { 'use server'; await updateBiayaAction(formData); }} className="space-y-6">
                            <div className="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                                        <TableRow>
                                            <TableHead className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300 w-1/2">Komponen Biaya</TableHead>
                                            <TableHead className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">PUTRA (Rp)</TableHead>
                                            <TableHead className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">PUTRI (Rp)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {biaya.map((item, index) => (
                                            <TableRow key={item.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors">
                                                <TableCell className="py-4 px-4 font-medium text-slate-900 dark:text-slate-100">
                                                    <span>{item.komponen_biaya}</span>
                                                    <input type="hidden" name={`biaya[${index}][id]`} value={item.id} />
                                                </TableCell>
                                                <TableCell className="py-3 px-4">
                                                    <div className="relative flex items-center">
                                                        <span className="absolute left-3 text-xs font-semibold text-slate-400 select-none">Rp</span>
                                                        <Input 
                                                            type="number" 
                                                            name={`biaya[${index}][putra]`} 
                                                            defaultValue={item.biaya_putra || 0}
                                                            className="w-full pl-8 text-sm font-semibold text-slate-800 dark:text-slate-100"
                                                            min="0"
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3 px-4">
                                                    <div className="relative flex items-center">
                                                        <span className="absolute left-3 text-xs font-semibold text-slate-400 select-none">Rp</span>
                                                        <Input 
                                                            type="number" 
                                                            name={`biaya[${index}][putri]`} 
                                                            defaultValue={item.biaya_putri || 0}
                                                            className="w-full pl-8 text-sm font-semibold text-slate-800 dark:text-slate-100"
                                                            min="0"
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 font-medium shadow-sm hover:shadow transition-all duration-200 transform hover:scale-[1.01]">
                                    <Save className="w-4 h-4 mr-2" />
                                    Simpan Tabel Biaya
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Form terpisah untuk catatan SPP (Col Span 1) */}
                <Card className="border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="border-b border-slate-50 dark:border-slate-800/50 pb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-lg">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">Catatan SPP</CardTitle>
                                <CardDescription>Catatan tambahan mengenai SPP bulanan.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        {/* Info Alert Box */}
                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded-xl p-3.5 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <p className="leading-relaxed">Catatan ini akan langsung terbit pada seksi SPP halaman Pendaftaran Publik.</p>
                        </div>
                        
                        <form action={async (formData) => { 'use server'; await updateCatatanSppAction(formData); }} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="catatan-spp" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Isi Catatan SPP
                                </Label>
                                <Textarea 
                                    id="catatan-spp" 
                                    name="catatan-spp" 
                                    defaultValue={defaultSppText} 
                                    className="w-full min-h-[160px] resize-y text-sm text-slate-800 dark:text-slate-100 leading-relaxed"
                                    placeholder="Masukkan catatan tambahan untuk SPP..."
                                    required
                                />
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-sm hover:shadow transition-all duration-200 transform hover:scale-[1.01]">
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