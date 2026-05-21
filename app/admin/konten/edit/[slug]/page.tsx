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
import { ArrowLeft, Save, FileText, Calendar, Eye, EyeOff, Trash2, Plus, ClipboardCheck, CheckCircle2, CalendarDays, Info } from "lucide-react";
import { toast } from "sonner";



import {
    parseCatatanSpp,
    parsePersyaratan,
    parseJadwalPendaftaran
} from "./utils";


type EditPageProps = { params: Promise<{ slug: string }> };

interface KontenItem {
    slug: string;
    judul: string | null;
    isi: Record<string, unknown> | null; // JSONB field - can be any JSON structure
    created_at: string;
}

export default function EditKontenPage({ params }: EditPageProps) {
    const [konten, setKonten] = useState<KontenItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [judul, setJudul] = useState("");
    
    // Catatan SPP State
    const [catatanSppText, setCatatanSppText] = useState("");

    // Persyaratan Pendaftaran State
    const [persyaratanJudul, setPersyaratanJudul] = useState("");
    const [persyaratanItems, setPersyaratanItems] = useState<string[]>([]);
    const [jadwalJudul, setJadwalJudul] = useState("");
    const [jadwalItems, setJadwalItems] = useState<{ tahap: string; periode: string }[]>([]);

    // Jadwal Pendaftaran State
    const [jadwalPendaftaranJudul, setJadwalPendaftaranJudul] = useState("");
    const [gelombangItems, setGelombangItems] = useState<{ nama: string; periode: string }[]>([]);

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        async function fetchKonten() {
            const { slug } = await params;
            const { data, error } = await supabase
                .from('konten_halaman')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error || !data) {
                toast.error('Konten tidak ditemukan');
                router.push('/admin/konten');
                return;
            }

            setKonten(data);
            setJudul(data.judul || "");

            if (slug === 'catatan-spp') {
                const parsed = parseCatatanSpp(data.isi);
                setCatatanSppText(parsed.catatan);
            } else if (slug === 'persyaratan-pendaftaran') {
                const parsed = parsePersyaratan(data.isi);
                setPersyaratanJudul(parsed.persyaratan.judul);
                setPersyaratanItems(parsed.persyaratan.items);
                setJadwalJudul(parsed.jadwal.judul);
                setJadwalItems(parsed.jadwal.items);
            } else if (slug === 'jadwal-pendaftaran') {
                const parsed = parseJadwalPendaftaran(data.isi);
                setJadwalPendaftaranJudul(parsed.judul);
                setGelombangItems(parsed.items);
            }

            setIsLoading(false);
        }

        fetchKonten();
    }, [params, router, supabase]);

    const renderPreviewContent = () => {
        if (!konten) return null;

        if (konten.slug === 'catatan-spp') {
            return (
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Tampilan Pada Halaman Pendaftaran</h3>
                    <div className="pl-4 border-l-2 border-amber-500 bg-amber-50/50 p-4 rounded-r-lg">
                        <div className="flex gap-2">
                            <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm mb-1">Catatan SPP</h4>
                                <p className="text-gray-600 text-sm leading-relaxed italic">
                                    &quot;{catatanSppText || "Catatan SPP belum diisi."}&quot;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (konten.slug === 'persyaratan-pendaftaran') {
            return (
                <div className="space-y-8">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Tampilan Pada Halaman Pendaftaran</h3>
                    
                    {/* Requirements documents section */}
                    <div className="relative pl-4 border-l-2 border-emerald-500">
                        <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <ClipboardCheck className="h-5 w-5 text-emerald-500" />
                            {persyaratanJudul || "Persyaratan Dokumen"}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {persyaratanItems.filter(Boolean).length > 0 ? (
                                persyaratanItems.filter(Boolean).map((item, index) => (
                                    <div key={index} className="flex items-center space-x-2 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100/50">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                        <span className="text-sm text-gray-700">{item}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 italic">Belum ada persyaratan ditambahkan.</p>
                            )}
                        </div>
                    </div>

                    {/* Schedule section */}
                    <div className="relative pl-4 border-l-2 border-blue-500">
                        <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-blue-500" />
                            {jadwalJudul || "Jadwal Pendaftaran"}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {jadwalItems.filter(item => item.tahap || item.periode).length > 0 ? (
                                jadwalItems.filter(item => item.tahap || item.periode).map((item, index) => (
                                    <div key={index} className="bg-blue-50/50 border border-blue-100/50 rounded-lg p-3">
                                        <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 mb-1">
                                            {item.tahap || "Nama Tahap"}
                                        </span>
                                        <p className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
                                            <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                                            {item.periode || "Periode Tanggal"}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 italic">Belum ada tahapan jadwal ditambahkan.</p>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        if (konten.slug === 'jadwal-pendaftaran') {
            return (
                <div className="space-y-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Tampilan Gelombang Pendaftaran</h3>
                    <div className="border rounded-xl p-4 bg-gray-50/50 space-y-4">
                        <h4 className="text-base font-bold text-gray-800 flex items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-indigo-500" />
                            {jadwalPendaftaranJudul || "Jadwal Pendaftaran"}
                        </h4>
                        <div className="space-y-3">
                            {gelombangItems.filter(item => item.nama || item.periode).length > 0 ? (
                                gelombangItems.filter(item => item.nama || item.periode).map((item, index) => (
                                    <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg border shadow-sm">
                                        <span className="font-semibold text-sm text-gray-800">{item.nama}</span>
                                        <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium border border-indigo-100">
                                            {item.periode}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 italic">Belum ada gelombang ditambahkan.</p>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="p-4 bg-yellow-50 text-yellow-700 rounded border border-yellow-200 text-sm">
                Preview tidak tersedia untuk tipe konten ini.
            </div>
        );
    };

    const renderFormFields = () => {
        if (!konten) return null;

        if (konten.slug === 'catatan-spp') {
            return (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="catatan-spp">Teks Catatan SPP</Label>
                        <Textarea
                            id="catatan-spp"
                            value={catatanSppText}
                            onChange={(e) => setCatatanSppText(e.target.value)}
                            placeholder="Contoh: SPP bulanan sudah termasuk makan siang..."
                            rows={8}
                            required
                        />
                    </div>
                </div>
            );
        }

        if (konten.slug === 'persyaratan-pendaftaran') {
            return (
                <div className="space-y-8">
                    {/* Persyaratan Dokumen */}
                    <div className="space-y-4 border-b pb-6">
                        <h3 className="font-semibold text-lg text-gray-800">Persyaratan Dokumen</h3>
                        <div className="space-y-2">
                            <Label htmlFor="persyaratan-judul">Judul Seksi</Label>
                            <Input
                                id="persyaratan-judul"
                                value={persyaratanJudul}
                                onChange={(e) => setPersyaratanJudul(e.target.value)}
                                placeholder="Persyaratan Dokumen"
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <Label>Daftar Persyaratan</Label>
                            {persyaratanItems.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        value={item}
                                        onChange={(e) => {
                                            const updated = [...persyaratanItems];
                                            updated[index] = e.target.value;
                                            setPersyaratanItems(updated);
                                        }}
                                        placeholder={`Persyaratan #${index + 1}`}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setPersyaratanItems(persyaratanItems.filter((_, i) => i !== index));
                                        }}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setPersyaratanItems([...persyaratanItems, ""])}
                                className="flex items-center gap-2 mt-1"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Persyaratan
                            </Button>
                        </div>
                    </div>

                    {/* Jadwal Pendaftaran */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-800">Jadwal Tahapan</h3>
                        <div className="space-y-2">
                            <Label htmlFor="jadwal-judul">Judul Seksi</Label>
                            <Input
                                id="jadwal-judul"
                                value={jadwalJudul}
                                onChange={(e) => setJadwalJudul(e.target.value)}
                                placeholder="Jadwal Pendaftaran"
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <Label>Tahapan Jadwal</Label>
                            {jadwalItems.map((item, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <Input
                                        value={item.tahap}
                                        onChange={(e) => {
                                            const updated = [...jadwalItems];
                                            updated[index] = { ...updated[index], tahap: e.target.value };
                                            setJadwalItems(updated);
                                        }}
                                        placeholder="Nama Tahap (cth: Gelombang 1)"
                                        className="w-1/2"
                                        required
                                    />
                                    <Input
                                        value={item.periode}
                                        onChange={(e) => {
                                            const updated = [...jadwalItems];
                                            updated[index] = { ...updated[index], periode: e.target.value };
                                            setJadwalItems(updated);
                                        }}
                                        placeholder="Periode (cth: Jan - Feb 2026)"
                                        className="w-1/2"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setJadwalItems(jadwalItems.filter((_, i) => i !== index));
                                        }}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setJadwalItems([...jadwalItems, { tahap: "", periode: "" }])}
                                className="flex items-center gap-2 mt-1"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Jadwal
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        if (konten.slug === 'jadwal-pendaftaran') {
            return (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="jadwal-pendaftaran-judul">Judul Seksi/Halaman</Label>
                        <Input
                            id="jadwal-pendaftaran-judul"
                            value={jadwalPendaftaranJudul}
                            onChange={(e) => setJadwalPendaftaranJudul(e.target.value)}
                            placeholder="Jadwal Pendaftaran"
                            required
                        />
                    </div>
                    <div className="space-y-3">
                        <Label>Daftar Gelombang</Label>
                        {gelombangItems.map((item, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <Input
                                    value={item.nama}
                                    onChange={(e) => {
                                        const updated = [...gelombangItems];
                                        updated[index] = { ...updated[index], nama: e.target.value };
                                        setGelombangItems(updated);
                                    }}
                                    placeholder="Nama Gelombang (cth: Gelombang 1)"
                                    className="w-1/2"
                                    required
                                />
                                <Input
                                    value={item.periode}
                                    onChange={(e) => {
                                        const updated = [...gelombangItems];
                                        updated[index] = { ...updated[index], periode: e.target.value };
                                        setGelombangItems(updated);
                                    }}
                                    placeholder="Periode (cth: Jan - Feb 2026)"
                                    className="w-1/2"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setGelombangItems(gelombangItems.filter((_, i) => i !== index));
                                    }}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setGelombangItems([...gelombangItems, { nama: "", periode: "" }])}
                            className="flex items-center gap-2 mt-1"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Gelombang
                        </Button>
                    </div>
                </div>
            );
        }

        return (
            <div className="p-4 bg-yellow-50 text-yellow-700 rounded border border-yellow-200 text-sm">
                Tipe konten ini tidak dikenali atau belum didukung oleh form editor terstruktur.
            </div>
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!konten) return;

        setIsSaving(true);

        try {
            let isiData: Record<string, any> | null = null;
            const { slug } = await params;

            if (slug === 'catatan-spp') {
                isiData = { catatan: catatanSppText };
            } else if (slug === 'persyaratan-pendaftaran') {
                isiData = {
                    persyaratan: { judul: persyaratanJudul, items: persyaratanItems.filter(Boolean) },
                    jadwal: { judul: jadwalJudul, items: jadwalItems.filter(item => item.tahap || item.periode) }
                };
            } else if (slug === 'jadwal-pendaftaran') {
                isiData = {
                    judul: jadwalPendaftaranJudul,
                    items: gelombangItems.filter(item => item.nama || item.periode)
                };
            } else {
                isiData = konten?.isi || null;
            }

            const { error } = await supabase
                .from('konten_halaman')
                .update({
                    judul: judul,
                    isi: isiData
                })
                .eq('slug', konten.slug);

            if (error) throw error;

            toast.success('Konten berhasil diperbarui!');
            router.push('/admin/konten');
        } catch (error) {
            console.error('Error updating konten:', error);
            toast.error('Gagal memperbarui konten. Silakan coba lagi.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto max-w-6xl">
                    <Card>
                        <CardContent className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">Memuat konten...</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!konten) return null;

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
                                <FileText className="w-3 h-3 mr-1" />
                                {konten.slug}
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Konten</h1>
                        <p className="text-gray-600">Perbarui konten halaman website</p>
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
                                <FileText className="w-5 h-5" />
                                Form Edit Konten
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="judul">Judul Konten</Label>
                                    <Input
                                        id="judul"
                                        name="judul"
                                        type="text"
                                        value={judul}
                                        onChange={(e) => setJudul(e.target.value)}
                                        placeholder="Masukkan judul konten"
                                        required
                                    />
                                </div>

                                {renderFormFields()}

                                <div className="flex items-center justify-between pt-4 border-t">
                                    <div className="text-sm text-gray-500 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Dibuat pada: {new Date(konten.created_at).toLocaleDateString('id-ID')}
                                    </div>
                                    <Button 
                                        type="submit" 
                                        disabled={isSaving} 
                                        className="flex items-center gap-2"
                                    >
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
                                    Preview Konten
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {renderPreviewContent()}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}