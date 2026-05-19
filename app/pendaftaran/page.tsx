import { createClient } from "@/lib/supabase/server";
import PendaftaranForm from "@/components/Pendaftaran/PendaftaranForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SCHOOL_NAME } from "@/lib/school-config";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    CalendarIcon,
    FileText,
    User,
    Info,
    MapPin,
    Download,
    MessageCircle,
    CreditCard,
    ArrowRight,
    ClipboardCheck,
    Upload,
    CheckCircle2,
    CalendarDays
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
                description={`Formulir pendaftaran siswa baru ${SCHOOL_NAME}`}
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
                                    <Card className="border-none shadow-sm bg-card">
                                        <CardHeader>
                                            <CardTitle className="flex items-center text-2xl">
                                                <FileText className="mr-2 h-6 w-6 text-primary" />
                                                Persyaratan Pendaftaran
                                            </CardTitle>
                                            <CardDescription>Informasi tentang persyaratan, jadwal, dan biaya pendaftaran siswa baru</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-10 pt-6">
                                            {/* Document Requirements */}
                                            <div className="relative pl-0 md:pl-4 border-l-0 md:border-l-2 border-primary/20">
                                                <h3 className="text-xl font-bold mb-4 flex items-center text-foreground">
                                                    <span className="hidden md:flex absolute -left-[11px] bg-primary rounded-full p-1 text-primary-foreground shadow-sm">
                                                        <ClipboardCheck className="h-4 w-4" />
                                                    </span>
                                                    {persyaratan?.persyaratan.judul || 'Persyaratan Dokumen'}
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {persyaratan?.persyaratan.items.map((item, index) => (
                                                        <div key={`syarat-${index}`} className="flex items-center space-x-3 bg-muted/40 p-3 rounded-lg border border-border/50 transition-colors hover:bg-muted/60">
                                                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                                            <span className="text-sm md:text-base">{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Schedule */}
                                            <div className="relative pl-0 md:pl-4 border-l-0 md:border-l-2 border-accent/20">
                                                <h3 className="text-xl font-bold mb-4 flex items-center text-foreground">
                                                    <span className="hidden md:flex absolute -left-[11px] bg-accent rounded-full p-1 text-accent-foreground shadow-sm">
                                                        <CalendarDays className="h-4 w-4" />
                                                    </span>
                                                    {persyaratan?.jadwal.judul || 'Jadwal Pendaftaran'}
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {persyaratan?.jadwal.items.map((item, index) => (
                                                        <Card key={`jadwal-${index}`} className="bg-muted/30 border-dashed">
                                                            <CardContent className="p-4">
                                                                <Badge variant="outline" className="mb-2 bg-accent/10 text-accent border-accent/20">
                                                                    {item.tahap}
                                                                </Badge>
                                                                <p className="font-semibold text-foreground flex items-center">
                                                                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                                                    {item.periode}
                                                                </p>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                                <div className="mt-4 flex items-start p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                                    <Info className="h-5 w-5 text-blue-500 mr-2 shrink-0 mt-0.5" />
                                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                                        Jadwal pendaftaran dapat berubah sewaktu-waktu. Jika sudah melewati jadwal pendaftaran, silakan hubungi pihak sekolah.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Fees Table */}
                                            <div className="relative pl-0 md:pl-4 border-l-0 md:border-l-2 border-primary/20">
                                                <h3 className="text-xl font-bold mb-4 flex items-center text-foreground">
                                                    <span className="hidden md:flex absolute -left-[11px] bg-primary rounded-full p-1 text-primary-foreground shadow-sm">
                                                        <CreditCard className="h-4 w-4" />
                                                    </span>
                                                    Biaya Pendaftaran
                                                </h3>
                                                <div className="rounded-xl border border-border overflow-hidden shadow-sm">
                                                    <Table>
                                                        <TableHeader className="bg-muted/50">
                                                            <TableRow>
                                                                <TableHead className="font-bold py-4">Komponen Biaya</TableHead>
                                                                <TableHead className="text-right font-bold">PUTRA (Rp)</TableHead>
                                                                <TableHead className="text-right font-bold">PUTRI (Rp)</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {biaya?.map((item: BiayaItem, index) => (
                                                                <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                                                                    <TableCell className="font-medium py-3">{item.komponen_biaya}</TableCell>
                                                                    <TableCell className="text-right">{item.biaya_putra?.toLocaleString('id-ID')}</TableCell>
                                                                    <TableCell className="text-right">{item.biaya_putri?.toLocaleString('id-ID')}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                        <TableFooter className="bg-muted/50">
                                                            <TableRow>
                                                                <TableCell className="font-bold text-base">Total Biaya</TableCell>
                                                                <TableCell className="text-right font-bold text-primary text-base">
                                                                    {totalPutra?.toLocaleString('id-ID')}
                                                                </TableCell>
                                                                <TableCell className="text-right font-bold text-primary text-base">
                                                                    {totalPutri?.toLocaleString('id-ID')}
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableFooter>
                                                    </Table>
                                                </div>
                                            </div>

                                            {/* SPP Notes */}
                                            <div className="relative pl-0 md:pl-4 border-l-0 md:border-l-2 border-accent/20">
                                                <h3 className="text-xl font-bold mb-4 flex items-center text-foreground">
                                                    <span className="hidden md:flex absolute -left-[11px] bg-accent rounded-full p-1 text-accent-foreground shadow-sm">
                                                        <Info className="h-4 w-4" />
                                                    </span>
                                                    Catatan SPP
                                                </h3>
                                                <Card className="bg-muted/30 border-none">
                                                    <CardContent className="p-4">
                                                        <p className="text-muted-foreground leading-relaxed italic">
                                                            &quot;{catatanSpp?.catatan}&quot;
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="flow">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Online Registration Flow */}
                                        <Card className="border-none shadow-sm bg-card overflow-hidden">
                                            <CardHeader className="bg-blue-500/5 border-b border-blue-500/10">
                                                <CardTitle className="flex items-center text-blue-600">
                                                    <div className="p-2 bg-blue-500 text-white rounded-lg mr-3 shadow-md">
                                                        <MessageCircle className="h-5 w-5" />
                                                    </div>
                                                    Pendaftaran Online
                                                </CardTitle>
                                                <CardDescription>Melalui formulir digital di website</CardDescription>
                                            </CardHeader>
                                            <CardContent className="pt-8 relative">
                                                <Separator orientation="vertical" className="absolute left-10 top-8 bottom-8 w-[2px] bg-blue-100 dark:bg-blue-900/30 z-0" />
                                                <div className="space-y-8 relative z-10">
                                                    {[
                                                        { title: "Siapkan Dokumen", desc: "Siapkan semua dokumen yang diperlukan sesuai dengan persyaratan", icon: <FileText className="h-4 w-4" /> },
                                                        { title: "Isi Formulir Online", desc: "Lengkapi formulir pendaftaran dengan data yang benar dan lengkap", icon: <ClipboardCheck className="h-4 w-4" /> },
                                                        { title: "Upload Dokumen", desc: "Upload scan atau foto dokumen dengan kualitas yang jelas", icon: <Upload className="h-4 w-4" /> },
                                                        { title: "Submit Pendaftaran", desc: "Periksa kembali data lalu klik tombol \"Daftar Sekarang\"", icon: <CheckCircle2 className="h-4 w-4" /> },
                                                        { title: "Konfirmasi & Bayar", desc: "Tunggu konfirmasi dan lakukan pembayaran sesuai instruksi", icon: <CreditCard className="h-4 w-4" /> }
                                                    ].map((step, idx) => (
                                                        <div key={idx} className="flex items-start">
                                                            <div className="relative z-20 flex-shrink-0">
                                                                <Badge className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center font-bold border-4 border-card shadow-sm text-lg p-0">
                                                                    {idx + 1}
                                                                </Badge>
                                                            </div>
                                                            <div className="ml-4">
                                                                <h4 className="font-bold text-foreground flex items-center">
                                                                    {step.title}
                                                                </h4>
                                                                <p className="text-sm text-muted-foreground mt-1">
                                                                    {step.desc}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Offline Registration Flow */}
                                        <Card className="border-none shadow-sm bg-card overflow-hidden">
                                            <CardHeader className="bg-green-500/5 border-b border-green-500/10">
                                                <CardTitle className="flex items-center text-green-600">
                                                    <div className="p-2 bg-green-500 text-white rounded-lg mr-3 shadow-md">
                                                        <MapPin className="h-5 w-5" />
                                                    </div>
                                                    Pendaftaran Offline
                                                </CardTitle>
                                                <CardDescription>Datang langsung ke lokasi sekolah</CardDescription>
                                            </CardHeader>
                                            <CardContent className="pt-8 relative">
                                                <Separator orientation="vertical" className="absolute left-10 top-8 bottom-8 w-[2px] bg-green-100 dark:bg-green-900/30 z-0" />
                                                <div className="space-y-8 relative z-10">
                                                    <div className="flex items-start">
                                                        <div className="relative z-20 flex-shrink-0">
                                                            <Badge className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center font-bold border-4 border-card shadow-sm text-lg p-0">1</Badge>
                                                        </div>
                                                        <div className="ml-4">
                                                            <h4 className="font-bold text-foreground">Siapkan Dokumen Asli</h4>
                                                            <p className="text-sm text-muted-foreground mt-1">Bawa semua dokumen asli dan fotokopi sesuai persyaratan</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start">
                                                        <div className="relative z-20 flex-shrink-0">
                                                            <Badge className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center font-bold border-4 border-card shadow-sm text-lg p-0">2</Badge>
                                                        </div>
                                                        <div className="ml-4">
                                                            <h4 className="font-bold text-foreground flex items-center">
                                                                Download Formulir
                                                                <Download className="ml-2 h-4 w-4 text-green-500" />
                                                            </h4>
                                                            <p className="text-sm text-muted-foreground mt-1 mb-3">Isi formulir dari rumah untuk mempercepat proses</p>
                                                            <a 
                                                                href="/Formulir Pendaftaran MIM PK Dimoro.pdf" 
                                                                download={`Formulir Pendaftaran ${SCHOOL_NAME}.pdf`}
                                                                className="inline-flex items-center px-4 py-1.5 text-xs font-semibold text-green-700 bg-green-100 hover:bg-green-200 rounded-full transition-all"
                                                            >
                                                                <Download className="mr-1.5 h-3.5 w-3.5" />
                                                                Download PDF
                                                            </a>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start">
                                                        <div className="relative z-20 flex-shrink-0">
                                                            <Badge className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center font-bold border-4 border-card shadow-sm text-lg p-0">3</Badge>
                                                        </div>
                                                        <div className="ml-4">
                                                            <h4 className="font-bold text-foreground">Kunjungi Sekolah</h4>
                                                            <p className="text-sm text-muted-foreground mt-1">Datang ke {SCHOOL_NAME} pada jam kerja (07:30 - 11:30 WIB)</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start">
                                                        <div className="relative z-20 flex-shrink-0">
                                                            <Badge className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center font-bold border-4 border-card shadow-sm text-lg p-0">4</Badge>
                                                        </div>
                                                        <div className="ml-4">
                                                            <h4 className="font-bold text-foreground">Serahkan Dokumen</h4>
                                                            <p className="text-sm text-muted-foreground mt-1">Berikan berkas lengkap kepada petugas pendaftaran</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start">
                                                        <div className="relative z-20 flex-shrink-0">
                                                            <Badge className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center font-bold border-4 border-card shadow-sm text-lg p-0">5</Badge>
                                                        </div>
                                                        <div className="ml-4">
                                                            <h4 className="font-bold text-foreground">Pembayaran</h4>
                                                            <p className="text-sm text-muted-foreground mt-1">Lakukan pembayaran biaya pendaftaran di loket sekolah</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Important Notes */}
                                    <Card className="mt-8 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30">
                                        <CardContent className="p-6">
                                            <h3 className="text-lg font-bold mb-4 flex items-center text-amber-800 dark:text-amber-400">
                                                <Info className="mr-2 h-5 w-5" />
                                                Catatan Penting
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {[
                                                    "Pastikan semua dokumen asli dan masih berlaku",
                                                    "Pendaftaran online mendapat prioritas pemrosesan",
                                                    "Hubungi admin jika mengalami kesulitan"
                                                ].map((note, i) => (
                                                    <div key={i} className="flex items-start bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-amber-200/50 dark:border-amber-900/50">
                                                        <ArrowRight className="mr-2 h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                                        <span className="text-sm text-amber-900 dark:text-amber-200/80">{note}</span>
                                                    </div>
                                                ))}
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
