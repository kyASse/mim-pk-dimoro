"use client";

import React from "react";
import {
  User,
  Users,
  FileText,
  GraduationCap,
  MapPin,
  Phone,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PendaftarDocumentCard from "./PendaftarDocumentCard";

interface PendaftarDossierCanvasProps {
  pendaftar: any;
  defaultTab?: string;
}

function PropertyRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  if (!value && value !== 0 && value !== false) {
    return null;
  }

  return (
    <div className="flex items-start py-2.5 border-b border-border/40 last:border-b-0">
      <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-0.5 sm:gap-1">
        <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
        <dd className="text-xs sm:text-sm font-semibold text-foreground sm:col-span-2 break-words">
          {value}
        </dd>
      </div>
    </div>
  );
}

function SectionBlock({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex items-center gap-2 border-b border-border/50 pb-2.5">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground shrink-0" />}
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <dl className="space-y-0">{children}</dl>
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

export default function PendaftarDossierCanvas({
  pendaftar,
  defaultTab = "biodata",
}: PendaftarDossierCanvasProps) {
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

  const isAccepted = ["Diterima", "Akun Dibuat"].includes(
    pendaftar.status_pendaftaran || ""
  );

  return (
    <Tabs defaultValue={defaultTab} className="w-full space-y-4">
      {/* Segmented Tab Navigation: Horizontal Swipeable on Mobile with comfortable margin/padding, Grid on Desktop */}
      <TabsList className="flex overflow-x-auto no-scrollbar sm:grid sm:grid-cols-4 w-full h-auto p-1.5 bg-muted/60 rounded-xl border border-border/80 gap-2 sm:gap-0">
        <TabsTrigger
          value="biodata"
          className="shrink-0 min-w-max py-2 px-4 sm:px-3 text-xs sm:text-sm font-semibold whitespace-nowrap data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs rounded-lg transition-all"
        >
          <User className="h-3.5 w-3.5 mr-1.5 hidden sm:inline text-muted-foreground" />
          Biodata Siswa
        </TabsTrigger>
        <TabsTrigger
          value="orangtua"
          className="shrink-0 min-w-max py-2 px-4 sm:px-3 text-xs sm:text-sm font-semibold whitespace-nowrap data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs rounded-lg transition-all"
        >
          <Users className="h-3.5 w-3.5 mr-1.5 hidden sm:inline text-muted-foreground" />
          Keluarga & Wali
        </TabsTrigger>
        <TabsTrigger
          value="kebutuhan"
          className="shrink-0 min-w-max py-2 px-4 sm:px-3 text-xs sm:text-sm font-semibold whitespace-nowrap data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs rounded-lg transition-all"
        >
          <FileText className="h-3.5 w-3.5 mr-1.5 hidden sm:inline text-muted-foreground" />
          Kebutuhan & Berkas
        </TabsTrigger>
        <TabsTrigger
          value="administrasi"
          className="shrink-0 min-w-max py-2 px-4 sm:px-3 text-xs sm:text-sm font-semibold whitespace-nowrap data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs rounded-lg transition-all"
        >
          <GraduationCap className="h-3.5 w-3.5 mr-1.5 hidden sm:inline text-muted-foreground" />
          Administrasi
        </TabsTrigger>
      </TabsList>

      {/* ============================================================ */}
      {/* TAB 1: BIODATA SISWA */}
      {/* ============================================================ */}
      <TabsContent value="biodata" className="space-y-4 outline-none">
        <SectionBlock title="Identitas Calon Peserta Didik" icon={User}>
          <PropertyRow label="Nama Lengkap" value={pendaftar.nama_lengkap} />
          <PropertyRow label="Nama Panggilan" value={pendaftar.nama_panggilan} />
          <PropertyRow
            label="Jenis Kelamin"
            value={
              pendaftar.jenis_kelamin === "L" || pendaftar.jenis_kelamin === "Laki-laki"
                ? "Laki-laki"
                : pendaftar.jenis_kelamin === "P" || pendaftar.jenis_kelamin === "Perempuan"
                ? "Perempuan"
                : pendaftar.jenis_kelamin
            }
          />
          <PropertyRow
            label="Tempat, Tanggal Lahir"
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
          />
          <PropertyRow label="Agama" value={pendaftar.agama || "Islam"} />
          <PropertyRow label="Kewarganegaraan" value={pendaftar.kewarganegaraan || "WNI"} />
          <PropertyRow label="Status Anak" value={pendaftar.status_anak} />
          <PropertyRow
            label="Anak Ke / Dari"
            value={
              pendaftar.anak_ke
                ? `Anak ke-${pendaftar.anak_ke} dari ${
                    pendaftar.jumlah_saudara_kandung ?? "-"
                  } bersaudara`
                : null
            }
          />
          <PropertyRow label="Bahasa Sehari-hari" value={pendaftar.bahasa_sehari_hari} />
        </SectionBlock>

        <SectionBlock title="Pendidikan Asal, Domisili & Fisik" icon={MapPin}>
          <PropertyRow label="Asal TK / RA" value={pendaftar.tk_asal} />
          <PropertyRow label="Cita-cita" value={pendaftar.cita_cita} />
          <PropertyRow label="Hobi / Kegemaran" value={pendaftar.hobi} />
          <PropertyRow label="Alamat Lengkap" value={pendaftar.alamat_lengkap} />
          <PropertyRow
            label="Jarak ke Madrasah"
            value={
              pendaftar.jarak_tempat_tinggal
                ? `${pendaftar.jarak_tempat_tinggal} km`
                : null
            }
          />
          <PropertyRow label="Transportasi" value={pendaftar.transportasi} />
          <PropertyRow
            label="Kondisi Fisik"
            value={
              pendaftar.berat_badan || pendaftar.tinggi_badan || pendaftar.golongan_darah
                ? `Berat: ${pendaftar.berat_badan ? `${pendaftar.berat_badan} kg` : "-"} · Tinggi: ${
                    pendaftar.tinggi_badan ? `${pendaftar.tinggi_badan} cm` : "-"
                  } · Gol. Darah: ${pendaftar.golongan_darah || "-"}`
                : null
            }
          />
        </SectionBlock>
      </TabsContent>

      {/* ============================================================ */}
      {/* TAB 2: ORANG TUA & WALI */}
      {/* ============================================================ */}
      <TabsContent value="orangtua" className="space-y-4 outline-none">
        <SectionBlock title="Orang Tua Kandung" icon={Users}>
          {/* Ayah */}
          <div className="pb-3 border-b border-border/40 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Ayah Kandung
            </span>
            <PropertyRow label="Nama Ayah" value={pendaftar.nama_ayah_kandung} />
            <PropertyRow label="Pendidikan" value={pendaftar.pendidikan_ayah} />
            <PropertyRow label="Pekerjaan" value={pendaftar.pekerjaan_ayah} />
          </div>

          {/* Ibu */}
          <div className="pt-2 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Ibu Kandung
            </span>
            <PropertyRow label="Nama Ibu" value={pendaftar.nama_ibu_kandung} />
            <PropertyRow label="Pendidikan" value={pendaftar.pendidikan_ibu} />
            <PropertyRow label="Pekerjaan" value={pendaftar.pekerjaan_ibu} />
          </div>
        </SectionBlock>

        <SectionBlock title="Domisili & Kontak Keluarga" icon={Phone}>
          <PropertyRow
            label="Alamat Orang Tua"
            value={pendaftar.alamat_orang_tua || pendaftar.alamat_lengkap}
          />
          <PropertyRow label="Penghasilan / Gaji" value={pendaftar.gaji_orang_tua} />
          <PropertyRow label="Nomor Telepon / WA" value={pendaftar.nomor_telepon} />
          <PropertyRow label="Email Kontak" value={pendaftar.email} />
        </SectionBlock>

        {hasWali && (
          <SectionBlock title="Data Wali Calon Siswa" icon={User}>
            <PropertyRow label="Nama Wali" value={pendaftar.wali_nama} />
            <PropertyRow label="Hubungan" value={pendaftar.wali_hubungan} />
            <PropertyRow label="Pendidikan" value={pendaftar.wali_pendidikan} />
            <PropertyRow label="Pekerjaan" value={pendaftar.wali_pekerjaan} />
            <PropertyRow label="Alamat Domisili" value={pendaftar.wali_alamat} />
            <PropertyRow label="Nomor Telepon Wali" value={pendaftar.wali_telepon} />
          </SectionBlock>
        )}
      </TabsContent>

      {/* ============================================================ */}
      {/* TAB 3: KEBUTUHAN KHUSUS & BERKAS */}
      {/* ============================================================ */}
      <TabsContent value="kebutuhan" className="space-y-4 outline-none">
        <SectionBlock title="Asesmen Kebutuhan Khusus" icon={ShieldAlert}>
          <PropertyRow
            label="Status Kebutuhan Khusus"
            value={
              pendaftar.memiliki_kebutuhan_khusus ? (
                <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30">
                  Memerlukan Pendampingan / Penanganan Khusus
                </Badge>
              ) : (
                <span className="text-muted-foreground text-xs font-normal">
                  Tidak Ada Kebutuhan Khusus
                </span>
              )
            }
          />

          {kebutuhanKhusus && kebutuhanKhusus.length > 0 && (
            <div className="py-2.5 border-b border-border/40">
              <dt className="text-xs font-medium text-muted-foreground mb-1.5">
                Kategori Kebutuhan
              </dt>
              <dd className="flex flex-wrap gap-1.5">
                {kebutuhanKhusus.map((itemKey: string) => {
                  const found = jenisKebutuhanKhususItems.find(
                    (i) => i.id === itemKey
                  );
                  return (
                    <Badge
                      key={itemKey}
                      variant="outline"
                      className="text-xs font-medium bg-muted/40 border-border/80"
                    >
                      {found ? found.label : itemKey}
                    </Badge>
                  );
                })}
              </dd>
            </div>
          )}

          <PropertyRow
            label="Deskripsi / Catatan"
            value={pendaftar.deskripsi_kebutuhan_khusus}
          />
        </SectionBlock>

        <SectionBlock title="Dokumen Lampiran" icon={FileText}>
          <div className="pt-1">
            <PendaftarDocumentCard documentUrl={pendaftar.dokumen_pendukung_url} />
          </div>
        </SectionBlock>
      </TabsContent>

      {/* ============================================================ */}
      {/* TAB 4: ADMINISTRASI MADRASAH & AKUN */}
      {/* ============================================================ */}
      <TabsContent value="administrasi" className="space-y-4 outline-none">
        <SectionBlock title="Data Administratif Madrasah" icon={GraduationCap}>
          <PropertyRow
            label="Nomor Induk (NIPD/NISN)"
            value={
              pendaftar.nomor_induk ? (
                <span className="font-mono font-bold text-foreground">
                  {pendaftar.nomor_induk}
                </span>
              ) : (
                <span className="text-muted-foreground italic text-xs font-normal">
                  Belum diisi
                </span>
              )
            }
          />
          <PropertyRow
            label="Diterima di Kelas"
            value={
              pendaftar.diterima_di_kelas ? (
                <Badge variant="outline" className="font-semibold">
                  {pendaftar.diterima_di_kelas}
                </Badge>
              ) : (
                <span className="text-muted-foreground italic text-xs font-normal">
                  Belum ditentukan
                </span>
              )
            }
          />
          <PropertyRow
            label="Diterima pada Tanggal"
            value={
              pendaftar.diterima_pada_tanggal ? (
                new Date(pendaftar.diterima_pada_tanggal).toLocaleDateString(
                  "id-ID",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )
              ) : (
                <span className="text-muted-foreground italic text-xs font-normal">
                  Belum ditentukan
                </span>
              )
            }
          />
        </SectionBlock>

        <SectionBlock title="Status Akun Portal Wali Murid" icon={CheckCircle2}>
          <div className="pt-1">
            {isAccepted ? (
              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                    Akun Portal Wali Murid Terhubung
                  </p>
                  <p className="text-emerald-700/90 dark:text-emerald-400 leading-relaxed">
                    Wali murid dapat masuk ke Portal Orang Tua menggunakan email terdaftar{" "}
                    <span className="font-semibold font-mono text-foreground">
                      {pendaftar.email || "-"}
                    </span>
                    .
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20 flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-foreground">
                    Akun Belum Diterbitkan
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Akun portal wali murid akan otomatis dibuat ketika status pendaftaran diubah menjadi <strong>Diterima</strong> melalui tombol di panel kanan.
                  </p>
                </div>
              </div>
            )}
          </div>
        </SectionBlock>
      </TabsContent>
    </Tabs>
  );
}
