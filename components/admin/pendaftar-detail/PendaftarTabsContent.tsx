"use client";

import React from "react";
import { 
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
  GraduationCap,
  Sparkles,
  Car,
  Activity,
  Compass,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProcessRegistrationButton from "@/app/admin/pendaftar/detail/[id]/ProcessRegistrationButton";

interface PendaftarTabsContentProps {
  pendaftar: any;
  defaultTab?: string;
}

function DataRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  if (!value && value !== 0 && value !== false) {
    return null;
  }

  return (
    <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-b-0">
      {Icon && (
        <div className="flex-shrink-0 w-4 h-4 mt-0.5 text-muted-foreground">
          <Icon className="w-full h-full" />
        </div>
      )}
      <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-1">
        <dt className="text-xs font-semibold text-muted-foreground">{label}</dt>
        <dd className="text-xs sm:text-sm font-medium text-foreground sm:col-span-2 break-words">
          {value}
        </dd>
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

export default function PendaftarTabsContent({ pendaftar, defaultTab = "biodata" }: PendaftarTabsContentProps) {
  const hasWali = Boolean(
    pendaftar.wali_nama ||
    pendaftar.wali_hubungan ||
    pendaftar.wali_alamat ||
    pendaftar.wali_telepon
  );

  const kebutuhanKhusus = Array.isArray(pendaftar.jenis_kebutuhan_khusus)
    ? pendaftar.jenis_kebutuhan_khusus
    : pendaftar.jenis_kebutuhan_khusus
    ? (() => {
        try {
          return JSON.parse(pendaftar.jenis_kebutuhan_khusus);
        } catch {
          return [pendaftar.jenis_kebutuhan_khusus];
        }
      })()
    : [];

  const isProcessed = ["Diterima", "Akun Dibuat"].includes(
    pendaftar.status_pendaftaran || ""
  );
  const isRejected = pendaftar.status_pendaftaran === "Ditolak";
  const isRevisi = pendaftar.status_pendaftaran === "Revisi" || pendaftar.status_pendaftaran === "Validasi Ulang";

  return (
    <Tabs defaultValue={defaultTab} className="w-full space-y-4">
      {/* Tabs Navigation */}
      <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto p-1 bg-muted/60 rounded-xl border border-border/60">
        <TabsTrigger
          value="biodata"
          className="py-2.5 text-xs sm:text-sm font-semibold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-lg"
        >
          <User className="h-4 w-4 mr-1.5 hidden sm:inline" />
          Biodata Siswa
        </TabsTrigger>
        <TabsTrigger
          value="orangtua"
          className="py-2.5 text-xs sm:text-sm font-semibold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-lg"
        >
          <Users className="h-4 w-4 mr-1.5 hidden sm:inline" />
          Orang Tua & Wali
        </TabsTrigger>
        <TabsTrigger
          value="kebutuhan"
          className="py-2.5 text-xs sm:text-sm font-semibold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-lg"
        >
          <FileText className="h-4 w-4 mr-1.5 hidden sm:inline" />
          Kebutuhan & Berkas
        </TabsTrigger>
        <TabsTrigger
          value="administrasi"
          className="py-2.5 text-xs sm:text-sm font-semibold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-lg"
        >
          <GraduationCap className="h-4 w-4 mr-1.5 hidden sm:inline" />
          Administrasi & Akun
        </TabsTrigger>
      </TabsList>

      {/* ============================================================ */}
      {/* TAB 1: BIODATA CALON SISWA */}
      {/* ============================================================ */}
      <TabsContent value="biodata" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Personal & Family Identity */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Identitas Pribadi & Keluarga
              </CardTitle>
              <CardDescription className="text-xs">
                Data diri calon peserta didik sesuai akta dan KK
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <dl className="space-y-0">
                <DataRow label="Nama Lengkap" value={pendaftar.nama_lengkap} />
                <DataRow label="Nama Panggilan" value={pendaftar.nama_panggilan} />
                <DataRow
                  label="Jenis Kelamin"
                  value={
                    pendaftar.jenis_kelamin === "L"
                      ? "Laki-laki"
                      : pendaftar.jenis_kelamin === "P"
                      ? "Perempuan"
                      : pendaftar.jenis_kelamin
                  }
                />
                <DataRow
                  label="Tempat, Tgl Lahir"
                  value={
                    pendaftar.tanggal_lahir
                      ? `${pendaftar.tempat_lahir || "-"}, ${new Date(
                          pendaftar.tanggal_lahir
                        ).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}`
                      : pendaftar.tempat_lahir
                  }
                  icon={Calendar}
                />
                <DataRow label="Agama" value={pendaftar.agama || "Islam"} />
                <DataRow label="Kewarganegaraan" value={pendaftar.kewarganegaraan || "WNI"} />
                <DataRow label="Status Anak" value={pendaftar.status_anak} />
                <DataRow
                  label="Anak Ke / Dari"
                  value={
                    pendaftar.anak_ke
                      ? `Anak ke-${pendaftar.anak_ke} dari ${
                          pendaftar.jumlah_saudara_kandung ?? "-"
                        } bersaudara`
                      : null
                  }
                />
                <DataRow label="Bahasa Sehari-hari" value={pendaftar.bahasa_sehari_hari} />
              </dl>
            </CardContent>
          </Card>

          {/* School, Address, and Physical Characteristics */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Compass className="h-4 w-4 text-emerald-600" />
                Pendidikan Asal, Domisili & Fisik
              </CardTitle>
              <CardDescription className="text-xs">
                Asal sekolah, lokasi tempat tinggal, dan kondisi fisik siswa
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <dl className="space-y-0">
                <DataRow label="Asal TK / RA" value={pendaftar.tk_asal} icon={GraduationCap} />
                <DataRow label="Cita-cita" value={pendaftar.cita_cita} icon={Sparkles} />
                <DataRow label="Hobi / Kegemaran" value={pendaftar.hobi} icon={Heart} />
                <DataRow label="Alamat Lengkap" value={pendaftar.alamat_lengkap} icon={MapPin} />
                <DataRow
                  label="Jarak ke Madrasah"
                  value={
                    pendaftar.jarak_tempat_tinggal
                      ? `${pendaftar.jarak_tempat_tinggal} km`
                      : null
                  }
                />
                <DataRow label="Transportasi" value={pendaftar.transportasi} icon={Car} />
                <DataRow
                  label="Kondisi Fisik"
                  value={
                    pendaftar.berat_badan || pendaftar.tinggi_badan || pendaftar.golongan_darah
                      ? `Berat: ${pendaftar.berat_badan ? `${pendaftar.berat_badan} kg` : "-"} | Tinggi: ${
                          pendaftar.tinggi_badan ? `${pendaftar.tinggi_badan} cm` : "-"
                        } | Gol. Darah: ${pendaftar.golongan_darah || "-"}`
                      : null
                  }
                  icon={Activity}
                />
              </dl>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* ============================================================ */}
      {/* TAB 2: ORANG TUA & WALI */}
      {/* ============================================================ */}
      <TabsContent value="orangtua" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Data Orang Tua Kandung */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                Data Orang Tua Kandung
              </CardTitle>
              <CardDescription className="text-xs">
                Informasi ayah dan ibu kandung calon siswa
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 space-y-4">
              {/* Ayah */}
              <div>
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  Ayah Kandung
                </h4>
                <dl className="space-y-0">
                  <DataRow label="Nama Ayah" value={pendaftar.nama_ayah_kandung} />
                  <DataRow label="Pendidikan" value={pendaftar.pendidikan_ayah} />
                  <DataRow label="Pekerjaan" value={pendaftar.pekerjaan_ayah} />
                </dl>
              </div>

              {/* Ibu */}
              <div className="border-t border-border/40 pt-3">
                <h4 className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  Ibu Kandung
                </h4>
                <dl className="space-y-0">
                  <DataRow label="Nama Ibu" value={pendaftar.nama_ibu_kandung} />
                  <DataRow label="Pendidikan" value={pendaftar.pendidikan_ibu} />
                  <DataRow label="Pekerjaan" value={pendaftar.pekerjaan_ibu} />
                </dl>
              </div>
            </CardContent>
          </Card>

          {/* Kontak, Finansial & Data Wali */}
          <div className="space-y-4">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-600" />
                  Domisili & Kontak Orang Tua
                </CardTitle>
                <CardDescription className="text-xs">
                  Alamat domisili, finansial, dan kontak aktif keluarga
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <dl className="space-y-0">
                  <DataRow
                    label="Alamat Orang Tua"
                    value={pendaftar.alamat_orang_tua || pendaftar.alamat_lengkap}
                    icon={MapPin}
                  />
                  <DataRow label="Penghasilan / Gaji" value={pendaftar.gaji_orang_tua} />
                  <DataRow label="Nomor Telepon/WA" value={pendaftar.nomor_telepon} icon={Phone} />
                  <DataRow label="Email Utama" value={pendaftar.email} icon={Mail} />
                </dl>
              </CardContent>
            </Card>

            {/* Data Wali jika ada */}
            {hasWali && (
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3 border-b border-border/40">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-purple-600" />
                    Data Wali Calon Siswa
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Informasi wali bila calon siswa tinggal bersama wali
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <dl className="space-y-0">
                    <DataRow label="Nama Wali" value={pendaftar.wali_nama} />
                    <DataRow label="Hubungan" value={pendaftar.wali_hubungan} />
                    <DataRow label="Pendidikan" value={pendaftar.wali_pendidikan} />
                    <DataRow label="Pekerjaan" value={pendaftar.wali_pekerjaan} />
                    <DataRow label="Alamat Wali" value={pendaftar.wali_alamat} icon={MapPin} />
                    <DataRow label="No. Telepon Wali" value={pendaftar.wali_telepon} icon={Phone} />
                  </dl>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </TabsContent>

      {/* ============================================================ */}
      {/* TAB 3: KEBUTUHAN KHUSUS & BERKAS */}
      {/* ============================================================ */}
      <TabsContent value="kebutuhan" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Asesmen Kebutuhan Khusus */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-600" />
                Asesmen Kebutuhan Khusus
              </CardTitle>
              <CardDescription className="text-xs">
                Informasi kondisi khusus dan kebutuhan pendampingan belajar
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <dl className="space-y-0">
                <DataRow
                  label="Status Kebutuhan Khusus"
                  value={
                    pendaftar.memiliki_kebutuhan_khusus ? (
                      <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30">
                        Ya (Memerlukan Perhatian Khusus)
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Tidak Ada
                      </Badge>
                    )
                  }
                />

                {kebutuhanKhusus && kebutuhanKhusus.length > 0 && (
                  <div className="py-3 border-b border-border/50">
                    <dt className="text-xs font-semibold text-muted-foreground mb-2">
                      Kategori Kebutuhan Khusus
                    </dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {kebutuhanKhusus.map((itemKey: string) => {
                        const found = jenisKebutuhanKhususItems.find(
                          (i) => i.id === itemKey
                        );
                        return (
                          <Badge
                            key={itemKey}
                            variant="secondary"
                            className="text-xs font-medium bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300"
                          >
                            {found ? found.label : itemKey}
                          </Badge>
                        );
                      })}
                    </dd>
                  </div>
                )}

                <DataRow
                  label="Deskripsi / Catatan"
                  value={pendaftar.deskripsi_kebutuhan_khusus}
                />
              </dl>
            </CardContent>
          </Card>

          {/* Dokumen Pendukung */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-sky-600" />
                Dokumen Pendukung & Lampiran
              </CardTitle>
              <CardDescription className="text-xs">
                Berkas akta kelahiran, kartu keluarga, atau asesmen medis/psikolog
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-3">
              {pendaftar.dokumen_pendukung_url ? (
                <div className="p-4 rounded-xl border border-border bg-muted/20 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        Dokumen Lampiran Pendaftar
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Format PDF / Gambar
                      </p>
                    </div>
                  </div>

                  <a
                    href={
                      pendaftar.dokumen_pendukung_url.startsWith("http")
                        ? pendaftar.dokumen_pendukung_url
                        : `/api/dokumen/download?path=${encodeURIComponent(
                            pendaftar.dokumen_pendukung_url
                          )}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Unduh Berkas
                  </a>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground text-xs">
                  <FileText className="h-8 w-8 mx-auto opacity-40 mb-2" />
                  <p>Tidak ada dokumen pendukung yang diunggah saat pendaftaran.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* ============================================================ */}
      {/* TAB 4: ADMINISTRASI MADRASAH & AKUN PORTAL */}
      {/* ============================================================ */}
      <TabsContent value="administrasi" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Data Administratif Madrasah */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-indigo-600" />
                Data Administratif Madrasah
              </CardTitle>
              <CardDescription className="text-xs">
                Nomor Induk Siswa (NIPD/NISN) dan penetapan kelas
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <dl className="space-y-0">
                <DataRow
                  label="Nomor Induk (NIPD/NISN)"
                  value={
                    pendaftar.nomor_induk ? (
                      <span className="font-mono font-semibold text-primary">
                        {pendaftar.nomor_induk}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic text-xs">Belum diisi</span>
                    )
                  }
                />
                <DataRow
                  label="Diterima di Kelas"
                  value={
                    pendaftar.diterima_di_kelas ? (
                      <Badge className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/30">
                        {pendaftar.diterima_di_kelas}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground italic text-xs">Belum ditentukan</span>
                    )
                  }
                />
                <DataRow
                  label="Diterima pada Tanggal"
                  value={
                    pendaftar.diterima_pada_tanggal
                      ? new Date(pendaftar.diterima_pada_tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : <span className="text-muted-foreground italic text-xs">Belum ditentukan</span>
                  }
                  icon={Calendar}
                />
              </dl>
            </CardContent>
          </Card>

          {/* Akun Portal Orang Tua & Eksekusi Penerimaan */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-emerald-600" />
                Manajemen Akun Portal Wali Murid
              </CardTitle>
              <CardDescription className="text-xs">
                Pembuatan akun akses portal wali murid untuk monitoring rapor dan SPP
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {isProcessed ? (
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                      Akun Portal Wali Murid Aktif
                    </p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      Siswa ini telah terdaftar di database madrasah dan wali murid dapat login ke Portal Orang Tua menggunakan email <span className="font-semibold">{pendaftar.email || "terdaftar"}</span>.
                    </p>
                  </div>
                </div>
              ) : isRejected ? (
                <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-semibold text-rose-800 dark:text-rose-300">
                      Pendaftaran Ditolak
                    </p>
                    <p className="text-xs text-rose-700 dark:text-rose-400">
                      Status calon siswa ini ditolak. Tidak ada akun portal yang dibuat.
                    </p>
                  </div>
                </div>
              ) : isRevisi ? (
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-semibold text-amber-800 dark:text-amber-300">
                      Memerlukan Validasi / Revisi
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      Data pendaftaran ini ditandai untuk revisi kelengkapan dokumen atau informasi dari wali murid.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-border bg-muted/30 flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm font-semibold text-foreground">
                        Akun Portal Belum Dibuat
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Klik tombol di bawah untuk menerima siswa dan otomatis membuatkan akun portal wali murid untuk email <span className="font-medium text-foreground">{pendaftar.email || "-"}</span>.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <ProcessRegistrationButton pendaftar={pendaftar} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
