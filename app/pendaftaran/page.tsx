import { createClient } from "@/lib/supabase/server";
import PendaftaranForm from "@/components/Pendaftaran/PendaftaranForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    CalendarIcon,
    FileText,
    User,
    School,
    Info,
    MapPin,
    Download,
    MessageCircle,
    CreditCard,
    UserCheck,
    ArrowRight
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

type BiayaItem = {
    komponen_biaya: string | null;
    biaya_putra: number | null;
    biaya_putri: number | null;
};

type PersyaratanIsi = {
    persyaratan: { judul: string; items: string[] };
    jadwal: { judul: string; items: { tahap: string; periode: string }[] };
};

type CatatanSppIsi = {
    catatan: string;
};

type JadwalIsi = {
    kegiatan: string;
    tanggal: string;
}[];

export default async function PendaftaranPage() {
    const supabase = await createClient();
    const persyaratanPromise = supabase.from('konten_halaman').select('judul, isi').eq('slug', 'persyaratan-pendaftaran').single();
    const biayaPromise = supabase.from('biaya_pendaftaran').select('*').order('id');
    const sppPromise = supabase.from('konten_halaman').select('isi').eq('slug', 'catatan-spp').single();
    const jadwalPromise = supabase.from('konten_halaman').select('isi').eq('slug', 'jadwal-pendaftaran').single();

    const [
        { data: persyaratanData }, 
        { data: biaya }, 
        { data: catatanSppData },
        { data: jadwalData }
    ] = await Promise.all([persyaratanPromise, biayaPromise, sppPromise, jadwalPromise]);

    
    const persyaratan = persyaratanData?.isi as PersyaratanIsi | null;
    const catatanSpp = catatanSppData?.isi as CatatanSppIsi | null;
    const _jadwal = jadwalData?.isi as JadwalIsi | null;

    const totalPutra = biaya?.reduce((acc, item) => acc + (item.biaya_putra || 0), 0);
    const totalPutri = biaya?.reduce((acc, item) => acc + (item.biaya_putri || 0), 0);

    return (
        <div className="min-h-screen">
            <PageHeader
                title="Pendaftaran Siswa Baru"
                description="Formulir pendaftaran siswa baru TK ABA Mertosanan"
                background="bg-accent/20"
            />

            <section className="py-16">
                <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <Tabs defaultValue="form" className="w-full">
                                <TabsList className="grid w-full grid-cols-3 mb-8">
                                    <TabsTrigger value="requirements">Persyaratan</TabsTrigger>
                                    <TabsTrigger value="flow">Alur Pendaftaran</TabsTrigger>
                                    <TabsTrigger value="form">Formulir Pendaftaran</TabsTrigger>
                                </TabsList>

                                <TabsContent value="requirements">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <FileText className="mr-2 h-5 w-5 text-primary" />
                                                Persyaratan Pendaftaran
                                            </CardTitle>
                                            <CardDescription>Informasi tentang persyaratan, jadwal, dan biaya pendaftaran siswa baru</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-8">
                                            <div>
                                                <h3 
                                                    className="text-lg font-semibold mb-3 flex items-center"
                                                >
                                                    <Info className="mr-2 h-5 w-5 text-accent" />
                                                    {persyaratan?.persyaratan.judul || 'Persyaratan Dokumen'}
                                                </h3>
                                                <ul className="ml-7 space-y-2 list-disc text-muted-foreground">
                                                    {persyaratan?.persyaratan.items.map((item, index) => (
                                                        <li key={`syarat-${index}`}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div>
                                                <h3 
                                                    className="text-lg font-semibold mb-3 flex items-center"
                                                >
                                                    <CalendarIcon className="mr-2 h-5 w-5 text-highlight" />
                                                    {persyaratan?.jadwal.judul || 'Jadwal Pendaftaran'}
                                                </h3>
                                                <div className="bg-muted rounded-lg p-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {persyaratan?.jadwal.items.map((item, index) => (
                                                            <div key={`jadwal-${index}`}>
                                                                <h4 className="font-medium">{item.tahap}</h4>
                                                                <p className="text-muted-foreground">{item.periode}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-2">Jadwal pendaftaran dapat berubah sewaktu-waktu. Jika sudah melewati jadwal pendaftaran, silakan hubungi pihak sekolah.</p>
                                            </div>

                                            <div>
                                                <h3 
                                                    className="text-lg font-semibold mb-3 flex items-center"
                                                >
                                                    <School 
                                                        className="mr-2 h-5 w-5 text-primary" 
                                                    />
                                                    Biaya Pendaftaran
                                                </h3>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full border-collapse">
                                                        <thead>
                                                            <tr className="bg-muted">
                                                                <th className="border px-4 py-2 text-left">Komponen Biaya</th>
                                                                <th className="border px-4 py-2 text-left">PUTRA (Rp)</th>
                                                                <th className="border px-4 py-2 text-left">PUTRI (Rp)</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {biaya?.map((item: BiayaItem, index) => (
                                                                <tr key={index}>
                                                                    <td className="border px-4 py-2 font-medium">{item.komponen_biaya}</td>
                                                                    <td className="border px-4 py-2">{item.biaya_putra?.toLocaleString('id-ID')}</td>
                                                                    <td className="border px-4 py-2">{item.biaya_putri?.toLocaleString('id-ID')}</td>
                                                                </tr>
                                                            ))}
                                                            <tr className="font-semibold bg-muted/50">
                                                                <td className="border px-4 py-2 font-bold">Total Biaya</td>
                                                                <td className="border px-4 py-2">{totalPutra?.toLocaleString('id-ID')}</td>
                                                                <td className="border px-4 py-2">{totalPutri?.toLocaleString('id-ID')}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-semibold mb-3 flex items-center">
                                                    <Info className="mr-2 h-5 w-5 text-primary" />
                                                    Catatan SPP
                                                </h3>
                                                <div className="bg-muted rounded-lg p-4">
                                                    <p className="text-muted-foreground">{catatanSpp?.catatan}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="flow">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <UserCheck className="mr-2 h-5 w-5 text-primary" />
                                                Alur Pendaftaran Siswa Baru
                                            </CardTitle>
                                            <CardDescription>
                                                Panduan langkah demi langkah untuk melakukan pendaftaran siswa baru
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-8">
                                            {/* Online Registration Flow */}
                                            <div>
                                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                                    <MessageCircle className="mr-2 h-5 w-5 text-blue-500" />
                                                    Pendaftaran Online
                                                </h3>
                                                <div className="space-y-4">
                                                    <div className="flex items-start space-x-4 p-4 border rounded-lg">
                                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                                                            1
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium mb-1">Siapkan Dokumen</h4>
                                                            <p className="text-muted-foreground text-sm">
                                                                Siapkan semua dokumen yang diperlukan sesuai dengan persyaratan pendaftaran
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-start space-x-4 p-4 border rounded-lg">
                                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                                                            2
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium mb-1">Isi Formulir Online</h4>
                                                            <p className="text-muted-foreground text-sm">
                                                                Lengkapi formulir pendaftaran dengan data yang benar dan lengkap
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-start space-x-4 p-4 border rounded-lg">
                                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                                                            3
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium mb-1">Upload Dokumen</h4>
                                                            <p className="text-muted-foreground text-sm">
                                                                Upload scan atau foto dokumen dengan kualitas yang jelas dan dapat dibaca
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-start space-x-4 p-4 border rounded-lg">
                                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                                                            4
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium mb-1">Submit Pendaftaran</h4>
                                                            <p className="text-muted-foreground text-sm">
                                                                Periksa kembali data yang telah diisi, lalu klik tombol &quot;Daftar Sekarang&quot;
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-start space-x-4 p-4 border rounded-lg">
                                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                                                            5
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium mb-1">Konfirmasi & Pembayaran</h4>
                                                            <p className="text-muted-foreground text-sm">
                                                                Tunggu konfirmasi dari pihak sekolah dan lakukan pembayaran sesuai instruksi
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Offline Registration Flow */}
                                            <div>
                                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                                    <MapPin className="mr-2 h-5 w-5 text-green-500" />
                                                    Pendaftaran Offline
                                                </h3>
                                                <div className="space-y-4">
                                                    <div className="flex items-start space-x-4 p-4 border rounded-lg">
                                                        <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">
                                                            1
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium mb-1">Siapkan Dokumen Asli</h4>
                                                            <p className="text-muted-foreground text-sm">
                                                                Bawa semua dokumen asli dan fotokopi sesuai persyaratan
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-start space-x-4 p-4 border rounded-lg">
                                                        <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">
                                                            2
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium mb-1 flex items-center">
                                                                Download Formulir
                                                                <Download className="ml-2 h-4 w-4" />
                                                            </h4>
                                                            <p className="text-muted-foreground text-sm mb-3">
                                                                Download dan isi formulir pendaftaran, atau ambil di kantor sekolah
                                                            </p>
                                                            <a 
                                                                href="/Formulir Pendaftaran TK ABA Mertosanan.pdf" 
                                                                download="Formulir Pendaftaran TK ABA Mertosanan.pdf"
                                                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                                            >
                                                                <Download className="mr-2 h-4 w-4" />
                                                                Download PDF
                                                            </a>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-start space-x-4 p-4 border rounded-lg">
                                                        <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">
                                                            3
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium mb-1">Kunjungi Sekolah</h4>
                                                            <p className="text-muted-foreground text-sm">
                                                                Datang langsung ke TK ABA Mertosanan pada jam kerja (07:30 - 11:30 WIB)
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-start space-x-4 p-4 border rounded-lg">
                                                        <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">
                                                            4
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium mb-1">Serahkan Dokumen</h4>
                                                            <p className="text-muted-foreground text-sm">
                                                                Serahkan formulir dan dokumen lengkap kepada petugas pendaftaran
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-start space-x-4 p-4 border rounded-lg">
                                                        <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">
                                                            5
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium mb-1 flex items-center">
                                                                Pembayaran
                                                                <CreditCard className="ml-2 h-4 w-4" />
                                                            </h4>
                                                            <p className="text-muted-foreground text-sm">
                                                                Lakukan pembayaran biaya pendaftaran sesuai dengan ketentuan yang berlaku
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Important Notes */}
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                <h3 className="text-lg font-semibold mb-3 flex items-center text-yellow-800">
                                                    <Info className="mr-2 h-5 w-5" />
                                                    Catatan Penting
                                                </h3>
                                                <ul className="space-y-2 text-yellow-700 text-sm">
                                                    <li className="flex items-start">
                                                        <ArrowRight className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5" />
                                                        Pastikan semua dokumen yang diberikan adalah asli dan masih berlaku
                                                    </li>
                                                    <li className="flex items-start">
                                                        <ArrowRight className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5" />
                                                        Pendaftaran online akan mendapat prioritas pemrosesan lebih cepat
                                                    </li>
                                                    <li className="flex items-start">
                                                        <ArrowRight className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5" />
                                                        Hubungi kami jika mengalami kesulitan dalam proses pendaftaran
                                                    </li>
                                                </ul>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="form">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <User className="mr-2 h-5 w-5 text-primary" />
                                                Formulir Pendaftaran
                                            </CardTitle>
                                            <CardDescription>
                                                Mohon isi formulir dengan data yang benar dan lengkap
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <PendaftaranForm />
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                </div>
            </section>
        </div>
    )
}
