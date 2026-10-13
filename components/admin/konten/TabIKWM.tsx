"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  UserCheck,
  Video,
  Users2,
  CalendarDays,
  Save,
  Loader2,
  Plus,
  Trash2,
  PlayCircle,
  Clock,
  EyeOff,
  Shield,
  Layers,
} from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { toast } from "sonner";
import { saveIKWMContentAction } from "@/app/admin/konten/actions";
import type {
  IKWMContent,
  IKWMPembina,
  IKWMPengurusInti,
  IKWMBidang,
  IKWMKegiatanItem,
} from "@/lib/types/content";

interface TabIKWMProps {
  initialData: IKWMContent;
}

export function TabIKWM({ initialData }: TabIKWMProps) {
  const [content, setContent] = useState<IKWMContent>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  // -------------------------------------------------------------
  // 1. HERO HANDLERS
  // -------------------------------------------------------------
  const handleHeroChange = (field: keyof IKWMContent["hero"], value: string) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  // -------------------------------------------------------------
  // 2. KATA PENGANTAR HANDLERS
  // -------------------------------------------------------------
  const handleKataPengantarChange = (
    field: keyof Omit<IKWMContent["kata_pengantar"], "sambutan">,
    value: string
  ) => {
    setContent((prev) => ({
      ...prev,
      kata_pengantar: { ...prev.kata_pengantar, [field]: value },
    }));
  };

  const handleAddParagraph = () => {
    setContent((prev) => ({
      ...prev,
      kata_pengantar: {
        ...prev.kata_pengantar,
        sambutan: [...prev.kata_pengantar.sambutan, ""],
      },
    }));
  };

  const handleUpdateParagraph = (idx: number, val: string) => {
    setContent((prev) => {
      const nextSambutan = [...prev.kata_pengantar.sambutan];
      nextSambutan[idx] = val;
      return {
        ...prev,
        kata_pengantar: { ...prev.kata_pengantar, sambutan: nextSambutan },
      };
    });
  };

  const handleRemoveParagraph = (idx: number) => {
    setContent((prev) => ({
      ...prev,
      kata_pengantar: {
        ...prev.kata_pengantar,
        sambutan: prev.kata_pengantar.sambutan.filter((_, i) => i !== idx),
      },
    }));
  };

  // -------------------------------------------------------------
  // 3. VIDEO HANDLERS
  // -------------------------------------------------------------
  const handleVideoChange = (field: keyof IKWMContent["video"], value: string) => {
    setContent((prev) => ({
      ...prev,
      video: { ...prev.video, [field]: value },
    }));
  };

  // -------------------------------------------------------------
  // 4. STRUKTURAL HANDLERS
  // -------------------------------------------------------------
  // Pembina
  const handleAddPembina = () => {
    setContent((prev) => ({
      ...prev,
      struktural: {
        ...prev.struktural,
        pembina: [
          ...prev.struktural.pembina,
          { nama: "", jabatan: "Penasihat / Pembina", foto_url: "" },
        ],
      },
    }));
  };

  const handleUpdatePembina = (idx: number, field: keyof IKWMPembina, val: string) => {
    setContent((prev) => {
      const updated = [...prev.struktural.pembina];
      updated[idx] = { ...updated[idx], [field]: val };
      return {
        ...prev,
        struktural: { ...prev.struktural, pembina: updated },
      };
    });
  };

  const handleRemovePembina = (idx: number) => {
    setContent((prev) => ({
      ...prev,
      struktural: {
        ...prev.struktural,
        pembina: prev.struktural.pembina.filter((_, i) => i !== idx),
      },
    }));
  };

  // Pengurus Inti
  const handleAddPengurusInti = () => {
    setContent((prev) => ({
      ...prev,
      struktural: {
        ...prev.struktural,
        pengurus_inti: [
          ...prev.struktural.pengurus_inti,
          {
            id: `pengurus-${Date.now()}`,
            nama: "",
            jabatan: "Pengurus Harian",
            divisi: "Operasional",
            foto_url: "",
          },
        ],
      },
    }));
  };

  const handleUpdatePengurusInti = (
    idx: number,
    field: keyof IKWMPengurusInti,
    val: string
  ) => {
    setContent((prev) => {
      const updated = [...prev.struktural.pengurus_inti];
      updated[idx] = { ...updated[idx], [field]: val };
      return {
        ...prev,
        struktural: { ...prev.struktural, pengurus_inti: updated },
      };
    });
  };

  const handleRemovePengurusInti = (idx: number) => {
    setContent((prev) => ({
      ...prev,
      struktural: {
        ...prev.struktural,
        pengurus_inti: prev.struktural.pengurus_inti.filter((_, i) => i !== idx),
      },
    }));
  };

  // Bidang
  const handleAddBidang = () => {
    setContent((prev) => ({
      ...prev,
      struktural: {
        ...prev.struktural,
        bidang: [
          ...prev.struktural.bidang,
          {
            id: `bidang-${Date.now()}`,
            nama_bidang: "Bidang Baru",
            koordinator: "",
            anggota: [],
          },
        ],
      },
    }));
  };

  const handleUpdateBidang = (
    idx: number,
    field: "nama_bidang" | "koordinator",
    val: string
  ) => {
    setContent((prev) => {
      const updated = [...prev.struktural.bidang];
      updated[idx] = { ...updated[idx], [field]: val };
      return {
        ...prev,
        struktural: { ...prev.struktural, bidang: updated },
      };
    });
  };

  const handleUpdateBidangAnggota = (idx: number, val: string) => {
    // Memecah teks baris baru atau koma menjadi array anggota
    const parsed = val
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    setContent((prev) => {
      const updated = [...prev.struktural.bidang];
      updated[idx] = { ...updated[idx], anggota: parsed };
      return {
        ...prev,
        struktural: { ...prev.struktural, bidang: updated },
      };
    });
  };

  const handleRemoveBidang = (idx: number) => {
    setContent((prev) => ({
      ...prev,
      struktural: {
        ...prev.struktural,
        bidang: prev.struktural.bidang.filter((_, i) => i !== idx),
      },
    }));
  };

  // -------------------------------------------------------------
  // 5. KEGIATAN BENTO HANDLERS
  // -------------------------------------------------------------
  const handleAddKegiatan = () => {
    setContent((prev) => ({
      ...prev,
      kegiatan: [
        ...prev.kegiatan,
        {
          id: `kegiatan-${Date.now()}`,
          kategori: "parenting",
          badge_label: "Program Baru",
          judul: "",
          deskripsi: "",
          jadwal: "Fleksibel",
          foto_url: "",
          highlight_tag: "Terbaru",
        },
      ],
    }));
  };

  const handleUpdateKegiatan = (
    idx: number,
    field: keyof IKWMKegiatanItem,
    val: string
  ) => {
    setContent((prev) => {
      const updated = [...prev.kegiatan];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, kegiatan: updated };
    });
  };

  const handleRemoveKegiatan = (idx: number) => {
    setContent((prev) => ({
      ...prev,
      kegiatan: prev.kegiatan.filter((_, i) => i !== idx),
    }));
  };

  // -------------------------------------------------------------
  // SAVE ACTION
  // -------------------------------------------------------------
  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Menyimpan konten Ikatan Wali Murid (IKWM)...");

    try {
      const res = await saveIKWMContentAction(content);
      if (!res.success) {
        throw new Error(res.message || "Gagal menyimpan konten IKWM");
      }
      toast.success(res.message || "Konten IKWM berhasil diperbarui!", { id: toastId });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan sistem";
      console.error("[TabIKWM] Save error:", err);
      toast.error(`Gagal: ${message}`, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. SEKSI HERO & PERIODE */}
      <Card className="border-border/80 bg-card shadow-xs rounded-2xl overflow-hidden">
        <CardHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/30 dark:bg-muted/15">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <Sparkles className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg font-bold text-foreground leading-snug">
                Hero Banner & Periode Kepengurusan
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Informasi identitas judul halaman, deskripsi pembuka, dan rentang masa bakti IKWM.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground/80">Badge Label Atas</Label>
              <Input
                value={content.hero.badge}
                onChange={(e) => handleHeroChange("badge", e.target.value)}
                placeholder="Mitra Strategis & Paguyuban Madrasah"
                className="h-10 text-sm sm:h-8 sm:text-xs font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground/80">Periode Masa Bakti</Label>
              <Input
                value={content.hero.periode}
                onChange={(e) => handleHeroChange("periode", e.target.value)}
                placeholder="Periode 2024 - 2026"
                className="h-10 text-sm sm:h-8 sm:text-xs font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground/80">Judul Utama Halaman</Label>
            <Input
              value={content.hero.judul}
              onChange={(e) => handleHeroChange("judul", e.target.value)}
              placeholder="Ikatan Wali Murid (IKWM) MIM PK Dimoro"
              className="h-10 text-sm sm:h-8 sm:text-xs font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground/80">Subjudul / Deskripsi Pendukung</Label>
            <Textarea
              rows={3}
              value={content.hero.subjudul}
              onChange={(e) => handleHeroChange("subjudul", e.target.value)}
              placeholder="Wadah kolaborasi, aspirasi, dan kepedulian bersama..."
              className="text-sm sm:text-xs leading-relaxed"
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. SEKSI KATA PENGANTAR KETUA */}
      <Card className="border-border/80 bg-card shadow-xs rounded-2xl overflow-hidden">
        <CardHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/30 dark:bg-muted/15">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <UserCheck className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg font-bold text-foreground leading-snug">
                Kata Pengantar Ketua IKWM
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Sambutan resmi, identitas ketua, foto profil, dan kutipan kunci paguyuban.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Kolom Teks */}
            <div className="lg:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground/80">Nama Ketua</Label>
                  <Input
                    value={content.kata_pengantar.nama_ketua}
                    onChange={(e) => handleKataPengantarChange("nama_ketua", e.target.value)}
                    placeholder="H. Ahmad Fauzi, S.E."
                    className="h-10 text-sm sm:h-8 sm:text-xs font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground/80">Jabatan Resmi</Label>
                  <Input
                    value={content.kata_pengantar.jabatan}
                    onChange={(e) => handleKataPengantarChange("jabatan", e.target.value)}
                    placeholder="Ketua IKWM MIM PK Dimoro"
                    className="h-10 text-sm sm:h-8 sm:text-xs font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground/80">Judul Seksi Sambutan</Label>
                <Input
                  value={content.kata_pengantar.judul}
                  onChange={(e) => handleKataPengantarChange("judul", e.target.value)}
                  placeholder="Sinergi dan Kemitraan Menuju Generasi Rabbani"
                  className="h-10 text-sm sm:h-8 sm:text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground/80">
                  Kutipan Kunci (Key Highlight Quote)
                </Label>
                <Textarea
                  rows={2}
                  value={content.kata_pengantar.kutipan_kunci}
                  onChange={(e) => handleKataPengantarChange("kutipan_kunci", e.target.value)}
                  placeholder="Mendidik generasi unggul bukan sekadar tanggung jawab madrasah..."
                  className="text-sm sm:text-xs leading-relaxed"
                />
              </div>

              {/* Paragraf Sambutan Dinamis */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-foreground/80">
                    Paragraf Sambutan Lengkap ({content.kata_pengantar.sambutan.length} Paragraf)
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddParagraph}
                    className="h-7 text-xs border-border/80 hover:bg-muted/50"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Tambah Paragraf
                  </Button>
                </div>

                <div className="space-y-3">
                  {content.kata_pengantar.sambutan.map((paragraf, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-xs font-bold text-muted-foreground mt-2 w-5 text-right shrink-0">
                        {idx + 1}.
                      </span>
                      <Textarea
                        rows={3}
                        value={paragraf}
                        onChange={(e) => handleUpdateParagraph(idx, e.target.value)}
                        className="text-sm sm:text-xs leading-relaxed flex-1"
                        placeholder={`Tulis paragraf sambutan ke-${idx + 1}...`}
                      />
                      {content.kata_pengantar.sambutan.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveParagraph(idx)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 shrink-0 mt-1"
                          title="Hapus paragraf"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Kolom Foto Ketua */}
            <div className="lg:col-span-4 space-y-3">
              <Label className="text-xs font-semibold text-foreground/80">Foto Resmi Ketua</Label>
              <ImageUploader
                label="Unggah Foto Ketua"
                value={content.kata_pengantar.foto_url}
                onChange={(url) => handleKataPengantarChange("foto_url", url)}
                aspectRatio="portrait"
                folder="ikwm"
                description="Format WebP / JPG, rasio potret 3:4 atau 4:5 resolusi tinggi."
              />
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">Atau masukkan URL Foto langsung</Label>
                <Input
                  value={content.kata_pengantar.foto_url}
                  onChange={(e) => handleKataPengantarChange("foto_url", e.target.value)}
                  placeholder="https://... atau /images/..."
                  className="h-10 text-sm sm:h-8 sm:text-xs font-mono text-[11px]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. SEKSI VIDEO PROFIL PAGUYUBAN */}
      <Card className="border-border/80 bg-card shadow-xs rounded-2xl overflow-hidden">
        <CardHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/30 dark:bg-muted/15">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <Video className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg font-bold text-foreground leading-snug">
                Video Profil & Sorotan Dokumenter
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Kelola status penayangan video YouTube (Aktif, Teaser Segera Hadir, atau Disembunyikan).
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-5">
          {/* Radio Card Display Mode */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground/80">Mode Penayangan Video</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleVideoChange("display_mode", "active")}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  content.video.display_mode === "active"
                    ? "border-emerald-600 bg-emerald-500/10 text-foreground ring-1 ring-emerald-500"
                    : "border-border/80 bg-muted/20 hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <PlayCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-foreground">Video Aktif</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Embed pemutar YouTube tampil langsung di halaman publik.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleVideoChange("display_mode", "placeholder")}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  content.video.display_mode === "placeholder"
                    ? "border-amber-600 bg-amber-500/10 text-foreground ring-1 ring-amber-500"
                    : "border-border/80 bg-muted/20 hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-foreground">Teaser (Segera Hadir)</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Tampilkan banner estetik pemberitahuan produksi video.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleVideoChange("display_mode", "hidden")}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  content.video.display_mode === "hidden"
                    ? "border-zinc-500 bg-zinc-500/10 text-foreground ring-1 ring-zinc-500"
                    : "border-border/80 bg-muted/20 hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <EyeOff className="w-4 h-4 text-zinc-500" />
                  <span className="text-xs font-bold text-foreground">Disembunyikan</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Seksi video tidak akan ditampilkan kepada pengunjung.
                </p>
              </button>
            </div>
          </div>

          {/* Form Detail Video */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold text-foreground/80">URL Video YouTube</Label>
              <Input
                value={content.video.youtube_url}
                onChange={(e) => handleVideoChange("youtube_url", e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                className="h-10 text-sm sm:h-8 sm:text-xs font-mono"
              />
              <p className="text-[11px] text-muted-foreground">
                Mendukung tautan reguler watch?v=, tautan pendek youtu.be, atau tautan embed.
              </p>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold text-foreground/80">Judul Video</Label>
              <Input
                value={content.video.judul}
                onChange={(e) => handleVideoChange("judul", e.target.value)}
                placeholder="Kolaborasi Nyata Wali Murid Membangun Generasi Qur'ani"
                className="h-10 text-sm sm:h-8 sm:text-xs font-medium"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold text-foreground/80">Deskripsi Video</Label>
              <Textarea
                rows={2}
                value={content.video.deskripsi}
                onChange={(e) => handleVideoChange("deskripsi", e.target.value)}
                placeholder="Dokumentasi sinergi madrasah dan paguyuban wali murid..."
                className="text-sm sm:text-xs leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground/80">Judul Teaser (Placeholder)</Label>
              <Input
                value={content.video.placeholder_title}
                onChange={(e) => handleVideoChange("placeholder_title", e.target.value)}
                placeholder="Video Dokumenter IKWM Segera Hadir"
                className="h-10 text-sm sm:h-8 sm:text-xs font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground/80">Deskripsi Teaser (Placeholder)</Label>
              <Input
                value={content.video.placeholder_desc}
                onChange={(e) => handleVideoChange("placeholder_desc", e.target.value)}
                placeholder="Nantikan tayangan dokumenter program kemitraan kami..."
                className="h-10 text-sm sm:h-8 sm:text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. SEKSI STRUKTUR KEPENGURUSAN */}
      <Card className="border-border/80 bg-card shadow-xs rounded-2xl overflow-hidden">
        <CardHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/30 dark:bg-muted/15">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <Users2 className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg font-bold text-foreground leading-snug">
                Bagan Struktur Kepengurusan
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Dewan penasihat pembina, pengurus inti harian, dan divisi bidang kerja paguyuban.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-8">
          {/* 4a. Pembina */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs sm:text-sm font-bold text-foreground">
                  Dewan Penasihat & Pembina ({content.struktural.pembina.length})
                </h4>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddPembina}
                className="h-7 text-xs border-border/80 hover:bg-muted/50"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Tambah Pembina
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {content.struktural.pembina.map((pem, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-2.5 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted-foreground">
                      Pembina #{idx + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePembina(idx)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-foreground/80">Nama</Label>
                      <Input
                        value={pem.nama}
                        onChange={(e) => handleUpdatePembina(idx, "nama", e.target.value)}
                        placeholder="Nama Pembina"
                        className="h-10 text-sm sm:h-8 sm:text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-foreground/80">Peran / Jabatan</Label>
                      <Input
                        value={pem.jabatan}
                        onChange={(e) => handleUpdatePembina(idx, "jabatan", e.target.value)}
                        placeholder="Kepala Madrasah / Komite"
                        className="h-10 text-sm sm:h-8 sm:text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-foreground/80">URL Foto (Opsional)</Label>
                    <Input
                      value={pem.foto_url || ""}
                      onChange={(e) => handleUpdatePembina(idx, "foto_url", e.target.value)}
                      placeholder="/images/pembina.jpg atau link foto"
                      className="h-10 text-sm sm:h-8 sm:text-xs font-mono text-[11px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4b. Pengurus Inti */}
          <div className="space-y-3 pt-4 border-t border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs sm:text-sm font-bold text-foreground">
                  Pengurus Inti & Harian ({content.struktural.pengurus_inti.length})
                </h4>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddPengurusInti}
                className="h-7 text-xs border-border/80 hover:bg-muted/50"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Tambah Pengurus
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {content.struktural.pengurus_inti.map((peng, idx) => (
                <div
                  key={peng.id || idx}
                  className="p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-2.5 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted-foreground">
                      Pengurus #{idx + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePengurusInti(idx)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-foreground/80">Nama</Label>
                      <Input
                        value={peng.nama}
                        onChange={(e) => handleUpdatePengurusInti(idx, "nama", e.target.value)}
                        placeholder="Nama Pengurus"
                        className="h-10 text-sm sm:h-8 sm:text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-foreground/80">Jabatan</Label>
                      <Input
                        value={peng.jabatan}
                        onChange={(e) => handleUpdatePengurusInti(idx, "jabatan", e.target.value)}
                        placeholder="Ketua / Sekretaris / Bendahara"
                        className="h-10 text-sm sm:h-8 sm:text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-foreground/80">Divisi / Sub-tugas</Label>
                      <Input
                        value={peng.divisi}
                        onChange={(e) => handleUpdatePengurusInti(idx, "divisi", e.target.value)}
                        placeholder="Pimpinan Utama / Administrasi"
                        className="h-10 text-sm sm:h-8 sm:text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-foreground/80">URL Foto (Opsional)</Label>
                      <Input
                        value={peng.foto_url || ""}
                        onChange={(e) => handleUpdatePengurusInti(idx, "foto_url", e.target.value)}
                        placeholder="/images/pengurus.jpg"
                        className="h-10 text-sm sm:h-8 sm:text-xs font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4c. Bidang Kerja */}
          <div className="space-y-3 pt-4 border-t border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs sm:text-sm font-bold text-foreground">
                  Bidang & Kelompok Kerja ({content.struktural.bidang.length})
                </h4>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddBidang}
                className="h-7 text-xs border-border/80 hover:bg-muted/50"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Tambah Bidang
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {content.struktural.bidang.map((bid, idx) => (
                <div
                  key={bid.id || idx}
                  className="p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-2.5 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted-foreground">
                      Bidang #{idx + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveBidang(idx)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-foreground/80">Nama Bidang</Label>
                      <Input
                        value={bid.nama_bidang}
                        onChange={(e) => handleUpdateBidang(idx, "nama_bidang", e.target.value)}
                        placeholder="Bidang Pendidikan & Dakwah"
                        className="h-10 text-sm sm:h-8 sm:text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-foreground/80">Koordinator</Label>
                      <Input
                        value={bid.koordinator}
                        onChange={(e) => handleUpdateBidang(idx, "koordinator", e.target.value)}
                        placeholder="Nama Koordinator"
                        className="h-10 text-sm sm:h-8 sm:text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-foreground/80">
                      Daftar Anggota (Pisahkan dengan koma atau baris baru)
                    </Label>
                    <Textarea
                      rows={2}
                      value={bid.anggota.join(", ")}
                      onChange={(e) => handleUpdateBidangAnggota(idx, e.target.value)}
                      placeholder="Anggota 1, Anggota 2, Anggota 3..."
                      className="text-sm sm:text-xs leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. SEKSI BENTO PROGRAM & KEGIATAN */}
      <Card className="border-border/80 bg-card shadow-xs rounded-2xl overflow-hidden">
        <CardHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/30 dark:bg-muted/15">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <CalendarDays className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg font-bold text-foreground leading-snug">
                Bento Program & Kegiatan Unggulan
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Kelola kartu kegiatan kolaboratif wali murid (Parenting, Sosial, Sarpras, & Kemitraan).
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <Label className="text-xs font-semibold text-foreground/80">
              Daftar Program Kegiatan ({content.kegiatan.length} Kegiatan)
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddKegiatan}
              className="h-7 text-xs border-border/80 hover:bg-muted/50"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Tambah Kegiatan
            </Button>
          </div>

          <div className="space-y-4">
            {content.kegiatan.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-xl border border-border/70 bg-muted/15 space-y-4 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[11px] font-semibold uppercase">
                      #{idx + 1} {item.kategori}
                    </Badge>
                    <span className="text-xs font-bold text-foreground truncate max-w-[200px] sm:max-w-md">
                      {item.judul || "Kegiatan Tanpa Judul"}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveKegiatan(idx)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                    title="Hapus kegiatan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs font-semibold text-foreground/80">Judul Kegiatan</Label>
                    <Input
                      value={item.judul}
                      onChange={(e) => handleUpdateKegiatan(idx, "judul", e.target.value)}
                      placeholder="Seminar Parenting & Pendidikan Karakter Anak"
                      className="h-10 text-sm sm:h-8 sm:text-xs font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-foreground/80">Kategori</Label>
                    <select
                      value={item.kategori}
                      onChange={(e) =>
                        handleUpdateKegiatan(
                          idx,
                          "kategori",
                          e.target.value as IKWMKegiatanItem["kategori"]
                        )
                      }
                      className="flex h-10 sm:h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm sm:text-xs shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="parenting">Parenting</option>
                      <option value="sosial">Sosial</option>
                      <option value="sarpras">Sarpras</option>
                      <option value="kemitraan">Kemitraan</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-foreground/80">Label Badge</Label>
                    <Input
                      value={item.badge_label}
                      onChange={(e) => handleUpdateKegiatan(idx, "badge_label", e.target.value)}
                      placeholder="Edukasi Keluarga"
                      className="h-10 text-sm sm:h-8 sm:text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-foreground/80">Jadwal / Frekuensi</Label>
                    <Input
                      value={item.jadwal}
                      onChange={(e) => handleUpdateKegiatan(idx, "jadwal", e.target.value)}
                      placeholder="Triwulanan / Setiap Sabtu Pekan ke-2"
                      className="h-10 text-sm sm:h-8 sm:text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-foreground/80">Highlight Tag (Opsional)</Label>
                    <Input
                      value={item.highlight_tag || ""}
                      onChange={(e) => handleUpdateKegiatan(idx, "highlight_tag", e.target.value)}
                      placeholder="Program Unggulan"
                      className="h-10 text-sm sm:h-8 sm:text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-8 space-y-1">
                    <Label className="text-xs font-semibold text-foreground/80">Deskripsi Kegiatan</Label>
                    <Textarea
                      rows={3}
                      value={item.deskripsi}
                      onChange={(e) => handleUpdateKegiatan(idx, "deskripsi", e.target.value)}
                      placeholder="Penjelasan ringkas mengenai sasaran dan manfaat kegiatan..."
                      className="text-sm sm:text-xs leading-relaxed"
                    />
                  </div>

                  <div className="lg:col-span-4 space-y-2">
                    <Label className="text-xs font-semibold text-foreground/80">Foto Dokumentasi</Label>
                    <ImageUploader
                      label="Unggah Dokumentasi"
                      value={item.foto_url}
                      onChange={(url) => handleUpdateKegiatan(idx, "foto_url", url)}
                      aspectRatio="video"
                      folder="ikwm"
                      description="Foto rasio 16:9 dokumentasi kegiatan."
                    />
                    <Input
                      value={item.foto_url}
                      onChange={(e) => handleUpdateKegiatan(idx, "foto_url", e.target.value)}
                      placeholder="Atau URL foto..."
                      className="h-10 text-sm sm:h-8 sm:text-xs font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ACTION SAVE BUTTON */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 h-10 shadow-sm"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Simpan Seluruh Perubahan Wali Murid (IKWM)
        </Button>
      </div>
    </div>
  );
}
