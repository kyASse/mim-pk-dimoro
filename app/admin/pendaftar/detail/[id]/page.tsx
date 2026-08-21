import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    ArrowLeft, 
    User, 
    Users, 
    Heart, 
    Phone, 
    Mail, 
    MapPin, 
    Calendar,
    FileText,
    Download,
    UserCheck,
    Settings,
    GraduationCap,
    Sparkles,
    Car,
    Activity
} from "lucide-react";
import ProcessRegistrationButton from "./ProcessRegistrationButton";
import StatusSelect from "./StatusSelect";
import EditPendaftarButton from "./EditPendaftarButton";
import WhatsAppButton from "./WhatsAppButton";
import CetakFormulirButton from "@/components/admin/CetakFormulirButton";

type DetailPageProps = { params: Promise<{ id: string }> };

function DataField({ 
    label, 
    value, 
    icon: Icon 
}: { 
    label: string; 
    value: string | number | null | undefined; 
    icon?: React.ComponentType<{ className?: string }>;
}) {
    if (!value && value !== 0) {
        return null;
    }
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-b-0">
            {Icon && (
                <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                    <Icon className="w-full h-full text-gray-400" />
                </div>
            )}
            <div className="flex-1 min-w-0">
                <dt className="text-sm font-medium text-gray-500 mb-1">{label}</dt>
                <dd className="text-sm text-gray-900 break-words">{value}</dd>
            </div>
        </div>
    );
}

const jenisKebutuhanKhususItems = [
    { id: "gangguan_penglihatan", label: "Gangguan Penglihatan" },
    { id: "gangguan_pendengaran", label: "Gangguan Pendengaran" },
    { id: "gangguan_komunikasi", label: "Gangguan Komunikasi / Wicara" },
    { id: "autisme", label: "Spektrum Autisme (ASD)" },
    { id: "adhd", label: "ADHD (Attention Deficit Hyperactivity Disorder)" },
    { id: "kesulitan_belajar", label: "Kesulitan Belajar Spesifik" },
    { id: "hambatan_fisik", label: "Hambatan Fisik / Motorik" },
    { id: "lainnya", label: "Lainnya" },
];

export default async function DetailPendaftarPage({ params }: DetailPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: pendaftar, error } = await supabase
        .from('pendaftar')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !pendaftar) {
        console.error("Gagal menemukan pendaftar:", error);
        return redirect('/admin/pendaftar');
    }

    const canBeProcessed = pendaftar.status_pendaftaran === 'Menunggu Persetujuan' || pendaftar.status_pendaftaran === 'Menunggu Konfirmasi';
    const isProcessed = ['Diterima', 'Akun Dibuat'].includes(pendaftar.status_pendaftaran || '');
    const isRejected = pendaftar.status_pendaftaran === 'Ditolak';
    const isRevisi = pendaftar.status_pendaftaran === "Revisi";

    const kebutuhanKhusus = Array.isArray(pendaftar.jenis_kebutuhan_khusus)
        ? pendaftar.jenis_kebutuhan_khusus
        : (pendaftar.jenis_kebutuhan_khusus ? JSON.parse(pendaftar.jenis_kebutuhan_khusus) : []);

    const hasWali = Boolean(pendaftar.wali_nama || pendaftar.wali_hubungan || pendaftar.wali_alamat || pendaftar.wali_telepon);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/pendaftar">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Detail Pendaftar</h1>
                        <p className="text-gray-600">{pendaftar.nama_lengkap}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <EditPendaftarButton pendaftar={pendaftar} />
                    <CetakFormulirButton pendaftar={pendaftar} />
                </div>
            </div>

            {/* Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* A. Keterangan Anak */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            A. Keterangan Anak
                        </CardTitle>
                        <CardDescription>
                            Informasi personal dan data calon peserta didik
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-0">
                            <DataField label="Nama Lengkap" value={pendaftar.nama_lengkap} icon={User} />
                            <DataField label="Nama Panggilan" value={pendaftar.nama_panggilan} />
                            <DataField label="Jenis Kelamin" value={pendaftar.jenis_kelamin} />
                            <DataField 
                                label="Tempat, Tanggal Lahir" 
                                value={pendaftar.tanggal_lahir ? `${pendaftar.tempat_lahir || '-'}, ${new Date(pendaftar.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}` : pendaftar.tempat_lahir} 
                                icon={Calendar}
                            />
                            <DataField label="Agama" value={pendaftar.agama || 'Islam'} />
                            <DataField label="Kewarganegaraan" value={pendaftar.kewarganegaraan || 'WNI'} />
                            <DataField label="Status Anak dalam Keluarga" value={pendaftar.status_anak} />
                            <DataField label="Anak ke" value={pendaftar.anak_ke} />
                            <DataField label="Jumlah Saudara Kandung" value={pendaftar.jumlah_saudara_kandung} />
                            <DataField label="Bahasa Sehari-hari" value={pendaftar.bahasa_sehari_hari} />
                            <DataField label="RA / TK Asal" value={pendaftar.tk_asal} icon={GraduationCap} />
                            <DataField label="Cita-cita" value={pendaftar.cita_cita} icon={Heart} />
                            <DataField label="Hobi / Kegemaran" value={pendaftar.hobi} icon={Sparkles} />
                            <DataField label="Alamat Tempat Tinggal" value={pendaftar.alamat_lengkap} icon={MapPin} />
                            <DataField label="Nomor Telepon/HP" value={pendaftar.nomor_telepon} icon={Phone} />
                            <DataField 
                                label="Jarak Tempat Tinggal" 
                                value={pendaftar.jarak_tempat_tinggal ? `${pendaftar.jarak_tempat_tinggal} km` : null} 
                            />
                            <DataField label="Transportasi ke Sekolah" value={pendaftar.transportasi} icon={Car} />
                            <DataField 
                                label="Kondisi Fisik (Berat / Tinggi / Gol. Darah)" 
                                value={`${pendaftar.berat_badan ? `${pendaftar.berat_badan} Kg` : '-'} / ${pendaftar.tinggi_badan ? `${pendaftar.tinggi_badan} Cm` : '-'} / Gol: ${pendaftar.golongan_darah || '-'}`} 
                                icon={Activity}
                            />
                        </dl>
                    </CardContent>
                </Card>

                {/* B. Orang Tua */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-green-600" />
                            B. Data Orang Tua
                        </CardTitle>
                        <CardDescription>
                            Informasi ayah, ibu, domisili, dan kontak keluarga
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-0">
                            {/* Data Ayah */}
                            <div className="border-b border-gray-100 pb-4 mb-4">
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-600" />
                                    Data Ayah Kandung
                                </h4>
                                <div className="space-y-0">
                                    <DataField label="Nama Ayah" value={pendaftar.nama_ayah_kandung} />
                                    <DataField label="Pendidikan Ayah" value={pendaftar.pendidikan_ayah} />
                                    <DataField label="Pekerjaan Ayah" value={pendaftar.pekerjaan_ayah} />
                                </div>
                            </div>
                            
                            {/* Data Ibu */}
                            <div className="border-b border-gray-100 pb-4 mb-4">
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                    <User className="w-4 h-4 text-pink-600" />
                                    Data Ibu Kandung
                                </h4>
                                <div className="space-y-0">
                                    <DataField label="Nama Ibu" value={pendaftar.nama_ibu_kandung} />
                                    <DataField label="Pendidikan Ibu" value={pendaftar.pendidikan_ibu} />
                                    <DataField label="Pekerjaan Ibu" value={pendaftar.pekerjaan_ibu} />
                                </div>
                            </div>
                            
                            {/* Alamat & Finansial */}
                            <DataField label="Alamat Domisili Orang Tua" value={pendaftar.alamat_orang_tua || pendaftar.alamat_lengkap} icon={MapPin} />
                            <DataField label="Gaji / Penghasilan Orang Tua" value={pendaftar.gaji_orang_tua} />
                            <DataField label="Email Kontak Utama" value={pendaftar.email} icon={Mail} />
                        </dl>
                    </CardContent>
                </Card>

                {/* C. Wali Anak */}
                {hasWali && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserCheck className="w-5 h-5 text-purple-600" />
                                C. Wali Anak
                            </CardTitle>
                            <CardDescription>
                                Informasi wali calon siswa (jika tinggal bersama wali)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <dl className="space-y-0">
                                <DataField label="Nama Wali" value={pendaftar.wali_nama} icon={User} />
                                <DataField label="Hubungan dengan Siswa" value={pendaftar.wali_hubungan} />
                                <DataField label="Pendidikan Wali" value={pendaftar.wali_pendidikan} />
                                <DataField label="Pekerjaan Wali" value={pendaftar.wali_pekerjaan} />
                                <DataField label="Alamat Domisili Wali" value={pendaftar.wali_alamat} icon={MapPin} />
                                <DataField label="Nomor Telepon Wali" value={pendaftar.wali_telepon} icon={Phone} />
                            </dl>
                        </CardContent>
                    </Card>
                )}

                {/* D. Kebutuhan Khusus */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-600" />
                            D. Kebutuhan Khusus
                        </CardTitle>
                        <CardDescription>
                            Informasi kebutuhan khusus dan dokumen asesmen
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-0">
                            <DataField 
                                label="Memiliki Kebutuhan Khusus" 
                                value={pendaftar.memiliki_kebutuhan_khusus ? "Ya" : "Tidak"} 
                            />
                            {kebutuhanKhusus && kebutuhanKhusus.length > 0 && (
                                <div className="flex items-start gap-3 py-3 border-b border-gray-100">
                                    <div className="flex-1 min-w-0">
                                        <dt className="text-sm font-medium text-gray-500 mb-2">Jenis Kebutuhan Khusus</dt>
                                        <dd className="flex flex-wrap gap-2">
                                            {kebutuhanKhusus.map((id: string) => {
                                                const item = jenisKebutuhanKhususItems.find(i => i.id === id);
                                                return item ? (
                                                    <Badge key={id} variant="secondary" className="text-xs">
                                                        {item.label}
                                                    </Badge>
                                                ) : (
                                                    <Badge key={id} variant="secondary" className="text-xs">
                                                        {id}
                                                    </Badge>
                                                );
                                            })}
                                        </dd>
                                    </div>
                                </div>
                            )}
                            <DataField label="Deskripsi Kebutuhan Khusus" value={pendaftar.deskripsi_kebutuhan_khusus} />
                            {pendaftar.dokumen_pendukung_url && (
                                <div className="flex items-start gap-3 py-3">
                                    <Download className="w-5 h-5 mt-0.5 text-gray-400" />
                                    <div className="flex-1 min-w-0">
                                        <dt className="text-sm font-medium text-gray-500 mb-1">Dokumen Pendukung</dt>
                                        <dd>
                                            <a 
                                                href={pendaftar.dokumen_pendukung_url.startsWith('http')
                                                    ? pendaftar.dokumen_pendukung_url
                                                    : `/api/dokumen/download?path=${encodeURIComponent(pendaftar.dokumen_pendukung_url)}`}
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                <FileText className="w-4 h-4" />
                                                Download Dokumen Pendukung
                                            </a>
                                        </dd>
                                    </div>
                                </div>
                            )}
                        </dl>
                    </CardContent>
                </Card>

                {/* E. Data Administratif Madrasah */}
                <Card className="border-indigo-100 bg-indigo-50/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-indigo-900">
                            <GraduationCap className="w-5 h-5 text-indigo-600" />
                            E. Data Administratif Madrasah
                        </CardTitle>
                        <CardDescription>
                            Nomor induk madrasah dan penetapan kelas siswa
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-0">
                            <DataField 
                                label="Nomor Induk (NIPD/NISN)" 
                                value={pendaftar.nomor_induk || "Belum diisi"} 
                            />
                            <DataField 
                                label="Diterima di Kelas" 
                                value={pendaftar.diterima_di_kelas || "Belum ditentukan"} 
                            />
                            <DataField 
                                label="Diterima pada Tanggal" 
                                value={pendaftar.diterima_pada_tanggal ? new Date(pendaftar.diterima_pada_tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "Belum ditentukan"} 
                                icon={Calendar}
                            />
                        </dl>
                    </CardContent>
                </Card>

                {/* Status & Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="w-5 h-5 text-gray-600" />
                            Status & Aksi Pendaftaran
                        </CardTitle>
                        <CardDescription>
                            Kelola status pendaftaran dan komunikasi dengan orang tua
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Set Status */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Status:</span>
                            <StatusSelect id={pendaftar.id} value={pendaftar.status_pendaftaran} />
                        </div>

                        {/* Communication Actions */}
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-emerald-600" />
                                    Aksi Komunikasi
                                </h4>
                                <p className="text-sm text-gray-600 mb-3">
                                    Kirim pesan WhatsApp cepat ke orang tua pendaftar untuk konfirmasi berkas atau status.
                                </p>
                                <WhatsAppButton 
                                    namaOrangTua={pendaftar.nama_ayah_kandung || pendaftar.nama_ibu_kandung || pendaftar.wali_nama}
                                    namaAnak={pendaftar.nama_lengkap}
                                    nomorTelepon={pendaftar.nomor_telepon}
                                />
                            </div>
                            
                            {/* Final Action */}
                            {canBeProcessed && (
                                <div className="pt-4 border-t border-gray-200">
                                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                        <UserCheck className="w-4 h-4" />
                                        Aksi Penerimaan & Pembuatan Akun
                                    </h4>
                                    <p className="text-sm text-blue-700 mb-3">
                                        Terima pendaftar, tetapkan tanggal masuk, dan buatkan akun portal dalam satu klik.
                                    </p>
                                    <ProcessRegistrationButton pendaftar={pendaftar} />
                                </div>
                            )}
                        </div>

                        {/* Status Messages */}
                        {isProcessed && (
                            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <UserCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <p className="text-green-700 font-medium text-sm">
                                    ✓ Proses penerimaan untuk siswa ini sudah selesai. Akun portal aktif.
                                </p>
                            </div>
                        )}
                        
                        {isRejected && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <User className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <p className="text-red-700 font-medium text-sm">
                                    Pendaftaran untuk siswa ini telah ditolak.
                                </p>
                            </div>
                        )}
                        
                        {isRevisi && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <FileText className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                                    <p className="text-yellow-700 font-medium text-sm">
                                        Pendaftaran ini memerlukan revisi data dari orang tua / madrasah.
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}