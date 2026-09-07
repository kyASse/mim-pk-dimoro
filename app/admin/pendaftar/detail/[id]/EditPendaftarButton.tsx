"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit3, Save, Loader2, User, Users, ShieldAlert, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { updatePendaftarData } from "../../actions";

const kebutuhanKhususOptions = [
  { id: "gangguan_penglihatan", label: "Gangguan Penglihatan" },
  { id: "gangguan_pendengaran", label: "Gangguan Pendengaran" },
  { id: "gangguan_komunikasi", label: "Gangguan Komunikasi / Wicara" },
  { id: "autisme", label: "Spektrum Autisme (ASD)" },
  { id: "adhd", label: "ADHD (Attention Deficit Hyperactivity Disorder)" },
  { id: "kesulitan_belajar", label: "Kesulitan Belajar Spesifik" },
  { id: "hambatan_fisik", label: "Hambatan Fisik / Motorik" },
  { id: "lainnya", label: "Lainnya" },
];

const transportasiOptions = [
  "Jalan Kaki",
  "Sepeda",
  "Sepeda Motor",
  "Mobil Pribadi",
  "Antar Jemput",
  "Angkutan Umum",
  "Lainnya",
];

const golonganDarahOptions = ["A", "B", "AB", "O", "Tidak Tahu"];

const gajiOptions = [
  "< Rp 1.000.000",
  "Rp 1.000.000 - Rp 3.000.000",
  "Rp 3.000.000 - Rp 5.000.000",
  "Rp 5.000.000 - Rp 10.000.000",
  "> Rp 10.000.000",
];

export default function EditPendaftarButton({ pendaftar }: { pendaftar: any }) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    ...pendaftar,
    jenis_kebutuhan_khusus: Array.isArray(pendaftar.jenis_kebutuhan_khusus)
      ? pendaftar.jenis_kebutuhan_khusus
      : pendaftar.jenis_kebutuhan_khusus
      ? (() => {
          try {
            return JSON.parse(pendaftar.jenis_kebutuhan_khusus);
          } catch {
            return [];
          }
        })()
      : [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setForm({ ...form, [name]: value === "" ? null : Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleKebutuhanKhusus = (itemId: string, checked: boolean) => {
    let updated = [...(form.jenis_kebutuhan_khusus || [])];
    if (checked) {
      if (!updated.includes(itemId)) updated.push(itemId);
    } else {
      updated = updated.filter((v: string) => v !== itemId);
    }
    setForm({ ...form, jenis_kebutuhan_khusus: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const dataToSend = {
        ...form,
        anak_ke: form.anak_ke ? Number(form.anak_ke) : null,
        jumlah_saudara_kandung:
          form.jumlah_saudara_kandung !== null &&
          form.jumlah_saudara_kandung !== ""
            ? Number(form.jumlah_saudara_kandung)
            : null,
        berat_badan: form.berat_badan ? Number(form.berat_badan) : null,
        tinggi_badan: form.tinggi_badan ? Number(form.tinggi_badan) : null,
        memiliki_kebutuhan_khusus:
          form.memiliki_kebutuhan_khusus === true ||
          form.memiliki_kebutuhan_khusus === "true",
        jenis_kebutuhan_khusus: form.memiliki_kebutuhan_khusus
          ? form.jenis_kebutuhan_khusus
          : [],
        diterima_pada_tanggal: form.diterima_pada_tanggal || null,
      };

      const result = await updatePendaftarData(pendaftar.id, dataToSend);
      setIsSaving(false);
      if (result.success) {
        setOpen(false);
        toast.success("Data Pendaftar Berhasil Diperbarui", {
          description: "Seluruh butir formulir telah disinkronkan ke database.",
        });
        router.refresh();
      } else {
        toast.error("Gagal Menyimpan Data", {
          description: result.message || "Silakan periksa kembali isian formulir.",
        });
      }
    } catch (err: any) {
      setIsSaving(false);
      toast.error("Terjadi Kesalahan", {
        description: err.message || "Gagal memperbarui data pendaftar.",
      });
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="w-full justify-center gap-1.5 text-xs font-semibold h-9 shadow-2xs border-border/80 hover:bg-muted"
      >
        <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
        <span>Edit Data Lengkap</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden">
          {/* Header */}
          <DialogHeader className="px-5 sm:px-6 py-4 border-b border-border/60 bg-muted/20">
            <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
              Edit Data Formulir Pendaftar
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Sesuaikan data 27 butir formulir pendaftaran fisik resmi MIM PK Dimoro.
            </DialogDescription>
          </DialogHeader>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="overflow-y-auto px-5 sm:px-6 py-5 space-y-6 flex-1">
            {/* BAGIAN A: DATA SISWA */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1.5 border-b border-border/60">
                <User className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  A. Identitas Calon Siswa
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">1. Nama Lengkap *</Label>
                  <Input
                    name="nama_lengkap"
                    value={form.nama_lengkap || ""}
                    onChange={handleChange}
                    className="h-10 sm:h-8 text-sm sm:text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Nama Panggilan</Label>
                  <Input
                    name="nama_panggilan"
                    value={form.nama_panggilan || ""}
                    onChange={handleChange}
                    className="h-10 sm:h-8 text-sm sm:text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">2. Jenis Kelamin</Label>
                  <Select
                    value={form.jenis_kelamin || ""}
                    onValueChange={(val) => handleSelectChange("jenis_kelamin", val)}
                  >
                    <SelectTrigger className="h-10 sm:h-8 text-sm sm:text-xs">
                      <SelectValue placeholder="Pilih Jenis Kelamin" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="Laki-laki">Laki-laki (L)</SelectItem>
                      <SelectItem value="Perempuan">Perempuan (P)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">3. Tempat Lahir</Label>
                    <Input
                      name="tempat_lahir"
                      value={form.tempat_lahir || ""}
                      onChange={handleChange}
                      className="h-10 sm:h-8 text-sm sm:text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Tanggal Lahir</Label>
                    <Input
                      type="date"
                      name="tanggal_lahir"
                      value={
                        form.tanggal_lahir ? form.tanggal_lahir.slice(0, 10) : ""
                      }
                      onChange={handleChange}
                      className="h-10 sm:h-8 text-sm sm:text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">4. Agama</Label>
                  <Input
                    name="agama"
                    value={form.agama || ""}
                    onChange={handleChange}
                    className="h-10 sm:h-8 text-sm sm:text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">5. Kewarganegaraan</Label>
                  <Select
                    value={form.kewarganegaraan || "WNI"}
                    onValueChange={(val) =>
                      handleSelectChange("kewarganegaraan", val)
                    }
                  >
                    <SelectTrigger className="h-10 sm:h-8 text-sm sm:text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="WNI">WNI (Indonesia)</SelectItem>
                      <SelectItem value="WNA">WNA (Asing)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">6. Status Anak</Label>
                  <Input
                    name="status_anak"
                    placeholder="Anak Kandung / Tiri / Angkat"
                    value={form.status_anak || ""}
                    onChange={handleChange}
                    className="h-10 sm:h-8 text-sm sm:text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">7. Anak Ke</Label>
                    <Input
                      type="number"
                      name="anak_ke"
                      value={form.anak_ke ?? ""}
                      onChange={handleChange}
                      className="h-10 sm:h-8 text-sm sm:text-xs"
                      min={1}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">8. Jml Saudara</Label>
                    <Input
                      type="number"
                      name="jumlah_saudara_kandung"
                      value={form.jumlah_saudara_kandung ?? ""}
                      onChange={handleChange}
                      className="h-10 sm:h-8 text-sm sm:text-xs"
                      min={0}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">9. Bahasa Sehari-hari</Label>
                  <Input
                    name="bahasa_sehari_hari"
                    value={form.bahasa_sehari_hari || ""}
                    onChange={handleChange}
                    className="h-10 sm:h-8 text-sm sm:text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">10. Asal TK / RA</Label>
                  <Input
                    name="tk_asal"
                    value={form.tk_asal || ""}
                    onChange={handleChange}
                    className="h-10 sm:h-8 text-sm sm:text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">11. Cita-cita</Label>
                  <Input
                    name="cita_cita"
                    value={form.cita_cita || ""}
                    onChange={handleChange}
                    className="h-10 sm:h-8 text-sm sm:text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">12. Hobi / Kegemaran</Label>
                  <Input
                    name="hobi"
                    value={form.hobi || ""}
                    onChange={handleChange}
                    className="h-10 sm:h-8 text-sm sm:text-xs"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <Label className="text-xs font-medium">13. Alamat Lengkap</Label>
                  <Textarea
                    name="alamat_lengkap"
                    rows={2}
                    value={form.alamat_lengkap || ""}
                    onChange={handleChange}
                    className="text-sm sm:text-xs resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">14. Nomor Telepon / HP</Label>
                  <Input
                    name="nomor_telepon"
                    value={form.nomor_telepon || ""}
                    onChange={handleChange}
                    className="h-10 sm:h-8 text-sm sm:text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">15. Jarak ke Sekolah (km)</Label>
                  <Input
                    name="jarak_tempat_tinggal"
                    placeholder="Contoh: 1, 2.5"
                    value={form.jarak_tempat_tinggal || ""}
                    onChange={handleChange}
                    className="h-10 sm:h-8 text-sm sm:text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">16. Transportasi</Label>
                  <Select
                    value={form.transportasi || ""}
                    onValueChange={(val) => handleSelectChange("transportasi", val)}
                  >
                    <SelectTrigger className="h-10 sm:h-8 text-sm sm:text-xs">
                      <SelectValue placeholder="Pilih Transportasi" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      {transportasiOptions.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">17a. Berat (kg)</Label>
                    <Input
                      type="number"
                      name="berat_badan"
                      value={form.berat_badan ?? ""}
                      onChange={handleChange}
                      className="h-10 sm:h-8 text-sm sm:text-xs"
                      min={0}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">17b. Tinggi (cm)</Label>
                    <Input
                      type="number"
                      name="tinggi_badan"
                      value={form.tinggi_badan ?? ""}
                      onChange={handleChange}
                      className="h-10 sm:h-8 text-sm sm:text-xs"
                      min={0}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">17c. Gol. Darah</Label>
                    <Select
                      value={form.golongan_darah || ""}
                      onValueChange={(val) =>
                        handleSelectChange("golongan_darah", val)
                      }
                    >
                      <SelectTrigger className="h-10 sm:h-8 text-sm sm:text-xs">
                        <SelectValue placeholder="Golongan" />
                      </SelectTrigger>
                      <SelectContent className="text-xs">
                        {golonganDarahOptions.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* BAGIAN B: DATA ORANG TUA */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 pb-1.5 border-b border-border/60">
                <Users className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  B. Data Orang Tua (Ayah & Ibu)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ayah */}
                <div className="space-y-2.5 p-3 rounded-xl border border-border/60 bg-muted/20">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Data Ayah Kandung
                  </span>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">18a. Nama Ayah</Label>
                    <Input
                      name="nama_ayah_kandung"
                      value={form.nama_ayah_kandung || ""}
                      onChange={handleChange}
                      className="h-10 sm:h-8 text-sm sm:text-xs bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">19a. Pendidikan Ayah</Label>
                    <Input
                      name="pendidikan_ayah"
                      value={form.pendidikan_ayah || ""}
                      onChange={handleChange}
                      className="h-10 sm:h-8 text-sm sm:text-xs bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">20a. Pekerjaan Ayah</Label>
                    <Input
                      name="pekerjaan_ayah"
                      value={form.pekerjaan_ayah || ""}
                      onChange={handleChange}
                      className="h-10 sm:h-8 text-sm sm:text-xs bg-background"
                    />
                  </div>
                </div>

                {/* Ibu */}
                <div className="space-y-2.5 p-3 rounded-xl border border-border/60 bg-muted/20">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Data Ibu Kandung
                  </span>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">18b. Nama Ibu</Label>
                    <Input
                      name="nama_ibu_kandung"
                      value={form.nama_ibu_kandung || ""}
                      onChange={handleChange}
                      className="h-10 sm:h-8 text-sm sm:text-xs bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">19b. Pendidikan Ibu</Label>
                    <Input
                      name="pendidikan_ibu"
                      value={form.pendidikan_ibu || ""}
                      onChange={handleChange}
                      className="h-10 sm:h-8 text-sm sm:text-xs bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">20b. Pekerjaan Ibu</Label>
                    <Input
                      name="pekerjaan_ibu"
                      value={form.pekerjaan_ibu || ""}
                      onChange={handleChange}
                      className="h-10 sm:h-8 text-sm sm:text-xs bg-background"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <Label className="text-xs font-medium">21. Alamat Domisili Orang Tua</Label>
                  <Input
                    name="alamat_orang_tua"
                    value={form.alamat_orang_tua || ""}
                    onChange={handleChange}
                    className="h-10 sm:h-8 text-sm sm:text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">22. Penghasilan / Gaji</Label>
                  <Select
                    value={form.gaji_orang_tua || ""}
                    onValueChange={(val) =>
                      handleSelectChange("gaji_orang_tua", val)
                    }
                  >
                    <SelectTrigger className="h-10 sm:h-8 text-sm sm:text-xs">
                      <SelectValue placeholder="Pilih Rentang Gaji" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      {gajiOptions.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">23. Email Utama Kontak</Label>
                  <Input
                    type="email"
                    name="email"
                    value={form.email || ""}
                    onChange={handleChange}
                    className="h-10 sm:h-8 text-sm sm:text-xs"
                  />
                </div>
              </div>
            </div>

            {/* BAGIAN C: DATA WALI */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 pb-1.5 border-b border-border/60">
                <Users className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  C. Data Wali (Opsional)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">24. Nama Wali</Label>
                  <Input
                    name="wali_nama"
                    value={form.wali_nama || ""}
                    onChange={handleChange}
                    className="h-10 sm:h-8 text-sm sm:text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">25. Hubungan dengan Calon Siswa</Label>
                  <Input
                    name="wali_hubungan"
                    placeholder="Contoh: Kakek, Paman"
                    value={form.wali_hubungan || ""}
                    onChange={handleChange}
                    className="h-10 sm:h-8 text-sm sm:text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">26a. Pendidikan Wali</Label>
                  <Input
                    name="wali_pendidikan"
                    value={form.wali_pendidikan || ""}
                    onChange={handleChange}
                    className="h-10 sm:h-8 text-sm sm:text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">26b. Pekerjaan Wali</Label>
                  <Input
                    name="wali_pekerjaan"
                    value={form.wali_pekerjaan || ""}
                    onChange={handleChange}
                    className="h-10 sm:h-8 text-sm sm:text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">27a. Alamat Domisili Wali</Label>
                  <Input
                    name="wali_alamat"
                    value={form.wali_alamat || ""}
                    onChange={handleChange}
                    className="h-10 sm:h-8 text-sm sm:text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">27b. Nomor Telepon Wali</Label>
                  <Input
                    name="wali_telepon"
                    value={form.wali_telepon || ""}
                    onChange={handleChange}
                    className="h-10 sm:h-8 text-sm sm:text-xs"
                  />
                </div>
              </div>
            </div>

            {/* BAGIAN D: KEBUTUHAN KHUSUS */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 pb-1.5 border-b border-border/60">
                <ShieldAlert className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  D. Asesmen Kebutuhan Khusus
                </h3>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">
                    Memiliki Kebutuhan Khusus?
                  </Label>
                  <Select
                    value={
                      form.memiliki_kebutuhan_khusus ? "true" : "false"
                    }
                    onValueChange={(val) =>
                      setForm({
                        ...form,
                        memiliki_kebutuhan_khusus: val === "true",
                      })
                    }
                  >
                    <SelectTrigger className="h-10 sm:h-8 text-sm sm:text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="false">Tidak Ada</SelectItem>
                      <SelectItem value="true">Ya, Memerlukan Pendampingan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {Boolean(form.memiliki_kebutuhan_khusus) && (
                  <div className="space-y-3 p-3.5 rounded-xl border border-border/80 bg-muted/20">
                    <Label className="text-xs font-semibold">
                      Pilih Kategori Kebutuhan Khusus
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {kebutuhanKhususOptions.map((opt) => (
                        <label
                          key={opt.id}
                          className="flex items-center gap-2 p-2.5 sm:p-2 rounded-lg border border-border/70 bg-background text-xs cursor-pointer hover:bg-muted/40 transition-colors"
                        >
                          <Checkbox
                            checked={form.jenis_kebutuhan_khusus?.includes(
                              opt.id
                            )}
                            onCheckedChange={(checked) =>
                              handleKebutuhanKhusus(opt.id, !!checked)
                            }
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>

                    <div className="space-y-1 pt-1">
                      <Label className="text-xs font-medium">Deskripsi Kebutuhan</Label>
                      <Textarea
                        name="deskripsi_kebutuhan_khusus"
                        rows={2}
                        value={form.deskripsi_kebutuhan_khusus || ""}
                        onChange={handleChange}
                        className="text-sm sm:text-xs bg-background resize-none"
                        placeholder="Catatan tambahan mengenai penanganan..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* BAGIAN E: ADMINISTRASI */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 pb-1.5 border-b border-border/60">
                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  E. Data Administratif Madrasah
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-3.5 rounded-xl border border-border/80 bg-muted/20">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Nomor Induk (NIPD/NISN)</Label>
                  <Input
                    name="nomor_induk"
                    placeholder="Contoh: 2026001"
                    value={form.nomor_induk || ""}
                    onChange={handleChange}
                    className="h-10 sm:h-8 text-sm sm:text-xs bg-background font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Diterima di Kelas</Label>
                  <Input
                    name="diterima_di_kelas"
                    placeholder="Contoh: Kelas 1A"
                    value={form.diterima_di_kelas || ""}
                    onChange={handleChange}
                    className="h-10 sm:h-8 text-sm sm:text-xs bg-background"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Diterima pada Tanggal</Label>
                  <Input
                    type="date"
                    name="diterima_pada_tanggal"
                    value={
                      form.diterima_pada_tanggal
                        ? form.diterima_pada_tanggal.slice(0, 10)
                        : ""
                    }
                    onChange={handleChange}
                    className="h-10 sm:h-8 text-sm sm:text-xs bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Sticky Modal Footer */}
            <DialogFooter className="pt-4 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSaving}
                className="text-xs h-9 sm:h-8"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="text-xs font-semibold gap-1.5 h-9 sm:h-8"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}