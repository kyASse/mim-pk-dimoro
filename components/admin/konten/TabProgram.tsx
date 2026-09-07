"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { BookOpen, Clock, Award, Save, Loader2, Plus, Trash2, Edit2 } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { toast } from "sonner";
import {
  saveProgramContentAction,
  saveExtracurricularAction,
  deleteExtracurricularAction,
} from "@/app/admin/konten/actions";
import { ProgramKurikulumContent, EkstrakurikulerItem } from "@/lib/types/content";

interface TabProgramProps {
  initialProgram: ProgramKurikulumContent;
  initialEskul: EkstrakurikulerItem[];
}

export function TabProgram({ initialProgram, initialEskul }: TabProgramProps) {
  const [program, setProgram] = useState<ProgramKurikulumContent>(initialProgram);
  const [eskulList, setEskulList] = useState<EkstrakurikulerItem[]>(initialEskul);
  const [isSaving, setIsSaving] = useState(false);

  // Modal dialog state untuk Ekskul
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEskul, setEditingEskul] = useState<Partial<EkstrakurikulerItem>>({
    nama_eskul: "",
    deskripsi: "",
    jadwal: "",
    image_url: "/images/mim_hero_main.jpg",
  });
  const [isSavingEskul, setIsSavingEskul] = useState(false);

  const handleOpenAddEskul = () => {
    setEditingEskul({
      nama_eskul: "",
      deskripsi: "",
      jadwal: "",
      image_url: "/images/mim_hero_main.jpg",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditEskul = (item: EkstrakurikulerItem) => {
    setEditingEskul({ ...item });
    setIsModalOpen(true);
  };

  const handleSaveEskul = async () => {
    if (!editingEskul.nama_eskul?.trim()) {
      toast.error("Nama ekstrakurikuler wajib diisi");
      return;
    }

    setIsSavingEskul(true);
    const toastId = toast.loading("Menyimpan ekstrakurikuler...");

    try {
      const payload: EkstrakurikulerItem = {
        id: editingEskul.id,
        nama_eskul: editingEskul.nama_eskul.trim(),
        deskripsi: editingEskul.deskripsi || "",
        jadwal: editingEskul.jadwal || "",
        image_url: editingEskul.image_url || "/images/mim_hero_main.jpg",
      };

      const res = await saveExtracurricularAction(payload);
      if (!res.success) throw new Error(res.message);

      // Update state lokal
      if (payload.id) {
        setEskulList((prev) =>
          prev.map((e) => (e.id === payload.id ? { ...e, ...payload } : e))
        );
      } else {
        setEskulList((prev) => [
          ...prev,
          { ...payload, id: Date.now() },
        ]);
      }

      toast.success("Ekstrakurikuler berhasil disimpan!", { id: toastId });
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(`Gagal: ${err?.message || "Terjadi kesalahan"}`, { id: toastId });
    } finally {
      setIsSavingEskul(false);
    }
  };

  const handleDeleteEskul = async (id?: number) => {
    if (!id) return;
    if (!confirm("Apakah Anda yakin ingin menghapus ekstrakurikuler ini?")) return;

    const toastId = toast.loading("Menghapus ekstrakurikuler...");
    try {
      const res = await deleteExtracurricularAction(id);
      if (!res.success) throw new Error(res.message);

      setEskulList((prev) => prev.filter((e) => e.id !== id));
      toast.success("Ekstrakurikuler berhasil dihapus!", { id: toastId });
    } catch (err: any) {
      toast.error(`Gagal: ${err?.message || "Terjadi kesalahan"}`, { id: toastId });
    }
  };

  const handleSaveAllProgram = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Menyimpan pengaturan program kurikulum...");

    try {
      const res = await saveProgramContentAction(program);
      if (!res.success) throw new Error(res.message);

      toast.success("Program kurikulum berhasil diperbarui!", { id: toastId });
    } catch (err: any) {
      toast.error(`Gagal: ${err?.message || "Terjadi kesalahan"}`, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. SEKSI PENGANTAR & SHOWCASE PROGRAM */}
      <Card className="border-border/80 bg-card shadow-xs rounded-2xl overflow-hidden">
        <CardHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/30 dark:bg-muted/15">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <BookOpen className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg font-bold text-foreground leading-snug">
                Pengantar & Showcase Foto Kurikulum
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Teks pembuka dan banner foto showcase halaman program sekolah.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground/80">Judul Pengantar</Label>
                <Input
                  value={program.pengantar_judul}
                  onChange={(e) => setProgram({ ...program, pengantar_judul: e.target.value })}
                  placeholder="Kurikulum & Program Terpadu"
                  className="h-10 text-sm sm:h-8 sm:text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground/80">Deskripsi Pengantar</Label>
                <Textarea
                  rows={3}
                  value={program.pengantar_deskripsi}
                  onChange={(e) =>
                    setProgram({ ...program, pengantar_deskripsi: e.target.value })
                  }
                  className="text-sm sm:text-xs leading-relaxed"
                />
              </div>

              {/* Target Program Tahfidz & Klinik Belajar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground/80">Target Tahfidz</Label>
                  <Input
                    value={program.tahfidz_target}
                    onChange={(e) => setProgram({ ...program, tahfidz_target: e.target.value })}
                    placeholder="Minimal 2 Juz (Juz 30 & 29)"
                    className="h-10 text-sm sm:h-8 sm:text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground/80">Tujuan Tahfidz</Label>
                  <Input
                    value={program.tahfidz_objective}
                    onChange={(e) => setProgram({ ...program, tahfidz_objective: e.target.value })}
                    placeholder="Membentuk hafiz/hafizah cilik berakhlak mulia"
                    className="h-10 text-sm sm:h-8 sm:text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground/80">
                  Deskripsi Klinik Belajar (Bimbingan Tambahan)
                </Label>
                <Textarea
                  rows={2}
                  value={program.klinik_description}
                  onChange={(e) => setProgram({ ...program, klinik_description: e.target.value })}
                  className="text-sm sm:text-xs leading-relaxed"
                />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-2">
              <ImageUploader
                label="Foto Showcase Kurikulum"
                value={program.showcase_image_url}
                onChange={(url) => setProgram({ ...program, showcase_image_url: url })}
                folder="program"
                aspectRatio="video"
                defaultUrl="/images/mim_hero_main.jpg"
                description="Foto aktivitas pembelajaran kelas / kurikulum terpadu."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. SEKSI JAM KBM FASE 1-3 & FASE 4-6 */}
      <Card className="border-border/80 bg-card shadow-xs rounded-2xl overflow-hidden">
        <CardHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/30 dark:bg-muted/15">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <Clock className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg font-bold text-foreground leading-snug">
                Jam Belajar KBM per Fase
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Jadwal kegiatan belajar mengajar harian untuk Fase Bawah (Kelas 1-3) dan Fase Atas (Kelas 4-6).
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fase Bawah (Kelas 1-3) */}
            <div className="p-4 sm:p-5 rounded-xl border border-border/80 bg-muted/20 dark:bg-muted/10 space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                <h4 className="font-bold text-sm text-foreground">Fase A & B (Kelas 1 - 3)</h4>
                <Badge variant="secondary" className="text-xs bg-muted/60 text-muted-foreground border-border/60">Fase Bawah</Badge>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground/80">Judul Fase</Label>
                <Input
                  value={program.fase_bawah.judul}
                  onChange={(e) =>
                    setProgram({
                      ...program,
                      fase_bawah: { ...program.fase_bawah, judul: e.target.value },
                    })
                  }
                  className="h-10 text-sm sm:h-8 sm:text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground/80">Deskripsi</Label>
                <Textarea
                  rows={2}
                  value={program.fase_bawah.deskripsi}
                  onChange={(e) =>
                    setProgram({
                      ...program,
                      fase_bawah: { ...program.fase_bawah, deskripsi: e.target.value },
                    })
                  }
                  className="text-sm sm:text-xs leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-muted-foreground">Senin - Kamis</Label>
                  <Input
                    value={
                      program.fase_bawah.jam_kbm?.find((j) => j.hari.includes("Senin"))?.jam ||
                      (program.fase_bawah as any).jam_senin_kamis ||
                      "07:00 - 13:00 WIB"
                    }
                    onChange={(e) => {
                      const updated = [
                        { hari: "Senin - Kamis", jam: e.target.value },
                        {
                          hari: "Jumat",
                          jam:
                            program.fase_bawah.jam_kbm?.find((j) => j.hari.includes("Jumat"))
                              ?.jam || "07:00 - 11:00 WIB",
                        },
                      ];
                      setProgram({
                        ...program,
                        fase_bawah: {
                          ...program.fase_bawah,
                          jam_kbm: updated,
                          jam_senin_kamis: e.target.value,
                        } as any,
                      });
                    }}
                    className="h-9 text-xs font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-muted-foreground">Jumat</Label>
                  <Input
                    value={
                      program.fase_bawah.jam_kbm?.find((j) => j.hari.includes("Jumat"))?.jam ||
                      (program.fase_bawah as any).jam_jumat ||
                      "07:00 - 11:00 WIB"
                    }
                    onChange={(e) => {
                      const updated = [
                        {
                          hari: "Senin - Kamis",
                          jam:
                            program.fase_bawah.jam_kbm?.find((j) => j.hari.includes("Senin"))
                              ?.jam || "07:00 - 13:00 WIB",
                        },
                        { hari: "Jumat", jam: e.target.value },
                      ];
                      setProgram({
                        ...program,
                        fase_bawah: {
                          ...program.fase_bawah,
                          jam_kbm: updated,
                          jam_jumat: e.target.value,
                        } as any,
                      });
                    }}
                    className="h-9 text-xs font-medium"
                  />
                </div>
              </div>

              <ImageUploader
                label="Foto Kegiatan Fase Bawah"
                value={program.fase_bawah.image_url}
                onChange={(url) =>
                  setProgram({
                    ...program,
                    fase_bawah: { ...program.fase_bawah, image_url: url },
                  })
                }
                folder="program"
                aspectRatio="4/3"
                defaultUrl="/images/mim_tahfidz_learning.jpg"
              />
            </div>

            {/* Fase Atas (Kelas 4-6) */}
            <div className="p-4 sm:p-5 rounded-xl border border-border/80 bg-muted/20 dark:bg-muted/10 space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                <h4 className="font-bold text-sm text-foreground">Fase B & C (Kelas 4 - 6)</h4>
                <Badge variant="secondary" className="text-xs bg-muted/60 text-muted-foreground border-border/60">Fase Atas</Badge>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground/80">Judul Fase</Label>
                <Input
                  value={program.fase_atas.judul}
                  onChange={(e) =>
                    setProgram({
                      ...program,
                      fase_atas: { ...program.fase_atas, judul: e.target.value },
                    })
                  }
                  className="h-10 text-sm sm:h-8 sm:text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground/80">Deskripsi</Label>
                <Textarea
                  rows={2}
                  value={program.fase_atas.deskripsi}
                  onChange={(e) =>
                    setProgram({
                      ...program,
                      fase_atas: { ...program.fase_atas, deskripsi: e.target.value },
                    })
                  }
                  className="text-sm sm:text-xs leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-muted-foreground">Senin - Kamis</Label>
                  <Input
                    value={
                      program.fase_atas.jam_kbm?.find((j) => j.hari.includes("Senin"))?.jam ||
                      (program.fase_atas as any).jam_senin_kamis ||
                      "07:00 - 14:00 WIB"
                    }
                    onChange={(e) => {
                      const updated = [
                        { hari: "Senin - Kamis", jam: e.target.value },
                        {
                          hari: "Jumat",
                          jam:
                            program.fase_atas.jam_kbm?.find((j) => j.hari.includes("Jumat"))
                              ?.jam || "07:00 - 11:00 WIB",
                        },
                      ];
                      setProgram({
                        ...program,
                        fase_atas: {
                          ...program.fase_atas,
                          jam_kbm: updated,
                          jam_senin_kamis: e.target.value,
                        } as any,
                      });
                    }}
                    className="h-9 text-xs font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-muted-foreground">Jumat</Label>
                  <Input
                    value={
                      program.fase_atas.jam_kbm?.find((j) => j.hari.includes("Jumat"))?.jam ||
                      (program.fase_atas as any).jam_jumat ||
                      "07:00 - 11:00 WIB"
                    }
                    onChange={(e) => {
                      const updated = [
                        {
                          hari: "Senin - Kamis",
                          jam:
                            program.fase_atas.jam_kbm?.find((j) => j.hari.includes("Senin"))
                              ?.jam || "07:00 - 14:00 WIB",
                        },
                        { hari: "Jumat", jam: e.target.value },
                      ];
                      setProgram({
                        ...program,
                        fase_atas: {
                          ...program.fase_atas,
                          jam_kbm: updated,
                          jam_jumat: e.target.value,
                        } as any,
                      });
                    }}
                    className="h-9 text-xs font-medium"
                  />
                </div>
              </div>

              <ImageUploader
                label="Foto Kegiatan Fase Atas"
                value={program.fase_atas.image_url}
                onChange={(url) =>
                  setProgram({
                    ...program,
                    fase_atas: { ...program.fase_atas, image_url: url },
                  })
                }
                folder="program"
                aspectRatio="4/3"
                defaultUrl="/images/mim_hero_main.jpg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. SEKSI KELOLA EKSTRAKURIKULER (CRUD) */}
      <Card className="border-border/80 bg-card shadow-xs rounded-2xl overflow-hidden">
        <CardHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/30 dark:bg-muted/15">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-3.5 sm:gap-4 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Award className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <CardTitle className="text-base sm:text-lg font-bold text-foreground leading-snug">
                  Daftar Ekstrakurikuler ({eskulList.length} Kegiatan)
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Kelola daftar kegiatan ekstrakurikuler, jadwal pelaksanaan, dan foto dokumentasi.
                </CardDescription>
              </div>
            </div>
            <Button
              type="button"
              onClick={handleOpenAddEskul}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 font-medium shrink-0 shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Tambah Ekstrakurikuler
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {eskulList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-border/80 bg-card/60 dark:bg-muted/10 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-sm text-foreground line-clamp-1">
                      {item.nama_eskul}
                    </h5>
                    <Badge variant="outline" className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
                      {item.jadwal || "Sesuai Jadwal"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.deskripsi}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditEskul(item)}
                    className="h-8 text-xs px-2.5 border-border/80 hover:bg-muted/50"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEskul(item.id)}
                    className="h-8 text-xs px-2.5 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Hapus
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal Dialog Add / Edit Eskul */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-card border-border/80 text-card-foreground shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              {editingEskul.id ? "Edit Ekstrakurikuler" : "Tambah Ekstrakurikuler"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground/80">Nama Ekstrakurikuler</Label>
              <Input
                value={editingEskul.nama_eskul || ""}
                onChange={(e) =>
                  setEditingEskul({ ...editingEskul, nama_eskul: e.target.value })
                }
                placeholder="Tapak Suci Putera Muhammadiyah"
                className="h-10 text-sm sm:h-8 sm:text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground/80">Jadwal Pelaksanaan</Label>
              <Input
                value={editingEskul.jadwal || ""}
                onChange={(e) => setEditingEskul({ ...editingEskul, jadwal: e.target.value })}
                placeholder="Setiap Sabtu, 14:00 - 16:00 WIB"
                className="h-10 text-sm sm:h-8 sm:text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground/80">Deskripsi Singkat</Label>
              <Textarea
                rows={3}
                value={editingEskul.deskripsi || ""}
                onChange={(e) =>
                  setEditingEskul({ ...editingEskul, deskripsi: e.target.value })
                }
                placeholder="Pelatihan seni bela diri dan pembentukan karakter kesatria mandiri..."
                className="text-sm sm:text-xs leading-relaxed"
              />
            </div>

            <ImageUploader
              label="Foto Dokumentasi Eskul"
              value={editingEskul.image_url}
              onChange={(url) => setEditingEskul({ ...editingEskul, image_url: url })}
              folder="ekskul"
              aspectRatio="video"
              defaultUrl="/images/mim_tapak_suci.jpg"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="h-9 text-xs border-border/80 hover:bg-muted/50"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleSaveEskul}
              disabled={isSavingEskul}
              className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            >
              {isSavingEskul && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
              Simpan Ekstrakurikuler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Desktop Save Bar */}
      <div className="hidden lg:flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          onClick={handleSaveAllProgram}
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 h-10 shadow-sm"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Simpan Seluruh Pengaturan Program
        </Button>
      </div>
    </div>
  );
}
