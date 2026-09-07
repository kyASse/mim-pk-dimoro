"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BarChart3, LayoutGrid, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { toast } from "sonner";
import {
  saveHeroContentAction,
  saveBerandaKeunggulanAction,
  saveMainStatsAction,
} from "@/app/admin/konten/actions";
import { HeroContent, BerandaKeunggulanContent, MainStatItem } from "@/lib/types/content";

interface TabBerandaProps {
  initialHero: HeroContent;
  initialKeunggulan: BerandaKeunggulanContent;
  initialStats: MainStatItem[];
}

export function TabBeranda({
  initialHero,
  initialKeunggulan,
  initialStats,
}: TabBerandaProps) {
  const [hero, setHero] = useState<HeroContent>(initialHero);
  const [keunggulan, setKeunggulan] = useState<BerandaKeunggulanContent>(initialKeunggulan);
  const [stats, setStats] = useState<MainStatItem[]>(initialStats);
  const [isSaving, setIsSaving] = useState(false);

  // Helper badge trust
  const [newBadge, setNewBadge] = useState("");

  const handleAddBadge = () => {
    if (!newBadge.trim()) return;
    setHero({ ...hero, trust_badges: [...hero.trust_badges, newBadge.trim()] });
    setNewBadge("");
  };

  const handleRemoveBadge = (index: number) => {
    setHero({
      ...hero,
      trust_badges: hero.trust_badges.filter((_, i) => i !== index),
    });
  };

  const handleStatChange = (kunci: string, val: string) => {
    setStats((prev) =>
      prev.map((s) => (s.kunci === kunci ? { ...s, nilai: val } : s))
    );
  };

  const handleKeunggulanItemChange = (
    index: number,
    field: "title" | "description" | "badge",
    val: string
  ) => {
    setKeunggulan((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: val };
      return { ...prev, items };
    });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Menyimpan konten Beranda...");

    try {
      const [resHero, resKeunggulan, resStats] = await Promise.all([
        saveHeroContentAction(hero),
        saveBerandaKeunggulanAction(keunggulan),
        saveMainStatsAction(stats),
      ]);

      if (!resHero.success || !resKeunggulan.success || !resStats.success) {
        throw new Error(
          resHero.message || resKeunggulan.message || resStats.message || "Gagal menyimpan"
        );
      }

      toast.success("Konten Beranda berhasil diperbarui!", { id: toastId });
    } catch (err: any) {
      console.error("[TabBeranda] Save error:", err);
      toast.error(`Gagal: ${err?.message || "Terjadi kesalahan"}`, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. SEKSI HERO BANNER */}
      <Card className="border-gray-200/80 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <CardTitle className="text-base sm:text-lg font-bold text-gray-900">
              Hero Banner Utama Beranda
            </CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm text-gray-500">
            Teks pembuka, foto utama siswa, dan lencana akreditasi yang tampil di bagian paling atas website.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sisi Kiri: Form Teks */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="hero-eyebrow" className="text-xs font-semibold text-gray-700">
                  Label Atas (Eyebrow Tag)
                </Label>
                <Input
                  id="hero-eyebrow"
                  value={hero.eyebrow}
                  onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}
                  placeholder="Madrasah Ibtidaiyah Program Khusus"
                  className="h-10 text-sm sm:h-8 sm:text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="hero-headline" className="text-xs font-semibold text-gray-700">
                  Judul Utama (Headline)
                </Label>
                <Input
                  id="hero-headline"
                  value={hero.headline}
                  onChange={(e) => setHero({ ...hero, headline: e.target.value })}
                  placeholder="MIM PK Dimoro"
                  className="h-10 text-sm sm:h-8 sm:text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="hero-subheadline" className="text-xs font-semibold text-gray-700">
                  Sub-judul (Deskripsi Singkat)
                </Label>
                <Textarea
                  id="hero-subheadline"
                  rows={3}
                  value={hero.subheadline}
                  onChange={(e) => setHero({ ...hero, subheadline: e.target.value })}
                  placeholder="Membentuk Generasi Qur'ani, Berakhlak Mulia, Cerdas, dan Berprestasi..."
                  className="text-sm sm:text-xs leading-relaxed"
                />
              </div>

              {/* Floating Stat Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="hero-stat-num" className="text-xs font-semibold text-gray-700">
                    Angka Floating Card
                  </Label>
                  <Input
                    id="hero-stat-num"
                    value={hero.floating_stat_number}
                    onChange={(e) => setHero({ ...hero, floating_stat_number: e.target.value })}
                    placeholder="59"
                    className="h-10 text-sm sm:h-8 sm:text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hero-stat-txt" className="text-xs font-semibold text-gray-700">
                    Teks Floating Card
                  </Label>
                  <Input
                    id="hero-stat-txt"
                    value={hero.floating_stat_text}
                    onChange={(e) => setHero({ ...hero, floating_stat_text: e.target.value })}
                    placeholder="Pengalaman Berdiri Sejak 1967"
                    className="h-10 text-sm sm:h-8 sm:text-xs"
                  />
                </div>
              </div>

              {/* Trust Badges */}
              <div className="space-y-2 pt-2">
                <Label className="text-xs font-semibold text-gray-700">
                  Lencana Kepercayaan (Trust Badges)
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {hero.trust_badges?.map((badge, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-1 rounded-full font-medium"
                    >
                      {badge}
                      <button
                        type="button"
                        onClick={() => handleRemoveBadge(idx)}
                        className="text-emerald-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddBadge();
                      }
                    }}
                    placeholder="Tambah badge baru (contoh: Akreditasi Unggul)"
                    className="h-10 text-sm sm:h-8 sm:text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddBadge}
                    className="h-10 sm:h-8 px-3 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Tambah
                  </Button>
                </div>
              </div>
            </div>

            {/* Sisi Kanan: Upload Foto Hero */}
            <div className="lg:col-span-5 space-y-2">
              <ImageUploader
                label="Foto Banner Utama"
                value={hero.hero_image_url}
                onChange={(url) => setHero({ ...hero, hero_image_url: url })}
                folder="hero"
                aspectRatio="video"
                defaultUrl="/images/mim_hero_main.jpg"
                description="Foto aktivitas belajar siswa. Disarankan aspek rasio 16:9 atau 4:3."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. SEKSI 4 ANGKA STATISTIK UTAMA */}
      <Card className="border-gray-200/80 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <CardTitle className="text-base sm:text-lg font-bold text-gray-900">
              4 Angka Statistik Utama
            </CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm text-gray-500">
            Angka counter pencapaian sekolah yang tampil di bawah Hero banner.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
              <Label className="text-xs font-bold text-gray-700">Siswa Aktif</Label>
              <Input
                value={stats.find((s) => s.kunci === "siswa_aktif")?.nilai || "150+"}
                onChange={(e) => handleStatChange("siswa_aktif", e.target.value)}
                placeholder="150+"
                className="h-10 text-sm sm:h-8 sm:text-xs font-semibold"
              />
              <p className="text-[11px] text-muted-foreground">Kunci: siswa_aktif</p>
            </div>

            <div className="space-y-1.5 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
              <Label className="text-xs font-bold text-gray-700">Guru & Tenaga Pendidik</Label>
              <Input
                value={stats.find((s) => s.kunci === "guru_staf")?.nilai || "15"}
                onChange={(e) => handleStatChange("guru_staf", e.target.value)}
                placeholder="15"
                className="h-10 text-sm sm:h-8 sm:text-xs font-semibold"
              />
              <p className="text-[11px] text-muted-foreground">Kunci: guru_staf</p>
            </div>

            <div className="space-y-1.5 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
              <Label className="text-xs font-bold text-gray-700">Tingkat Kelulusan</Label>
              <Input
                value={stats.find((s) => s.kunci === "kelulusan")?.nilai || "100%"}
                onChange={(e) => handleStatChange("kelulusan", e.target.value)}
                placeholder="100%"
                className="h-10 text-sm sm:h-8 sm:text-xs font-semibold"
              />
              <p className="text-[11px] text-muted-foreground">Kunci: kelulusan</p>
            </div>

            <div className="space-y-1.5 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
              <Label className="text-xs font-bold text-gray-700">Akreditasi</Label>
              <Input
                value={stats.find((s) => s.kunci === "akreditasi")?.nilai || "A"}
                onChange={(e) => handleStatChange("akreditasi", e.target.value)}
                placeholder="A"
                className="h-10 text-sm sm:h-8 sm:text-xs font-semibold"
              />
              <p className="text-[11px] text-muted-foreground">Kunci: akreditasi</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. SEKSI BENTO KEUNGGULAN */}
      <Card className="border-gray-200/80 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
          <div className="flex items-center space-x-2">
            <LayoutGrid className="w-5 h-5 text-emerald-600" />
            <CardTitle className="text-base sm:text-lg font-bold text-gray-900">
              Bento Grid Keunggulan Sekolah
            </CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm text-gray-500">
            4 pilar keunggulan pendidikan yang ditampilkan dalam kartu bento beranda.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Judul Seksi</Label>
              <Input
                value={keunggulan.judul}
                onChange={(e) => setKeunggulan({ ...keunggulan, judul: e.target.value })}
                className="h-10 text-sm sm:h-8 sm:text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Sub-judul Seksi</Label>
              <Input
                value={keunggulan.subjudul}
                onChange={(e) => setKeunggulan({ ...keunggulan, subjudul: e.target.value })}
                className="h-10 text-sm sm:h-8 sm:text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keunggulan.items?.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs font-medium">
                    Kartu #{idx + 1}
                  </Badge>
                  <Input
                    value={item.badge}
                    onChange={(e) =>
                      handleKeunggulanItemChange(idx, "badge", e.target.value)
                    }
                    placeholder="Lencana (contoh: Fondasi Utama)"
                    className="h-7 text-xs w-40 text-right"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-600">Judul Pilar</Label>
                  <Input
                    value={item.title}
                    onChange={(e) =>
                      handleKeunggulanItemChange(idx, "title", e.target.value)
                    }
                    className="h-10 text-sm sm:h-8 sm:text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-600">Deskripsi Ringkas</Label>
                  <Textarea
                    rows={3}
                    value={item.description}
                    onChange={(e) =>
                      handleKeunggulanItemChange(idx, "description", e.target.value)
                    }
                    className="text-sm sm:text-xs leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Save Bar (Desktop Only, Mobile is on Sticky Dock) */}
      <div className="hidden lg:flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 h-10 shadow-sm"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Simpan Seluruh Perubahan Beranda
        </Button>
      </div>
    </div>
  );
}
