"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Compass, Building2, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { toast } from "sonner";
import {
  saveHeadmasterContentAction,
  saveVisionMissionAction,
  saveSchoolIdentityAction,
} from "@/app/admin/konten/actions";
import {
  HeadmasterContent,
  VisionMissionContent,
  SchoolIdentityContent,
} from "@/lib/types/content";

interface TabProfilProps {
  initialHeadmaster: HeadmasterContent;
  initialVisionMission: VisionMissionContent;
  initialIdentity: SchoolIdentityContent;
}

export function TabProfil({
  initialHeadmaster,
  initialVisionMission,
  initialIdentity,
}: TabProfilProps) {
  const [kepsek, setKepsek] = useState<HeadmasterContent>(initialHeadmaster);
  const [vm, setVm] = useState<VisionMissionContent>(initialVisionMission);
  const [identity, setIdentity] = useState<SchoolIdentityContent>(initialIdentity);
  const [isSaving, setIsSaving] = useState(false);

  // Helper Paragraf Sambutan
  const handleAddParagraph = () => {
    setKepsek({
      ...kepsek,
      paragraphs: [...kepsek.paragraphs, "Tulis paragraf baru di sini..."],
    });
  };

  const handleUpdateParagraph = (idx: number, text: string) => {
    setKepsek((prev) => {
      const p = [...prev.paragraphs];
      p[idx] = text;
      return { ...prev, paragraphs: p };
    });
  };

  const handleRemoveParagraph = (idx: number) => {
    setKepsek((prev) => ({
      ...prev,
      paragraphs: prev.paragraphs.filter((_, i) => i !== idx),
    }));
  };

  // Helper Misi
  const [newMisi, setNewMisi] = useState("");
  const handleAddMisi = () => {
    if (!newMisi.trim()) return;
    setVm({ ...vm, misi: [...vm.misi, newMisi.trim()] });
    setNewMisi("");
  };

  const handleRemoveMisi = (idx: number) => {
    setVm({ ...vm, misi: vm.misi.filter((_, i) => i !== idx) });
  };

  // Helper Indikator Visi
  const [newIndikator, setNewIndikator] = useState("");
  const handleAddIndikator = () => {
    if (!newIndikator.trim()) return;
    setVm({ ...vm, indikator_visi: [...vm.indikator_visi, newIndikator.trim()] });
    setNewIndikator("");
  };

  const handleRemoveIndikator = (idx: number) => {
    setVm({ ...vm, indikator_visi: vm.indikator_visi.filter((_, i) => i !== idx) });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Menyimpan data Profil & Sambutan...");

    try {
      const [resKepsek, resVm, resIdentity] = await Promise.all([
        saveHeadmasterContentAction(kepsek),
        saveVisionMissionAction(vm),
        saveSchoolIdentityAction(identity),
      ]);

      if (!resKepsek.success || !resVm.success || !resIdentity.success) {
        throw new Error(
          resKepsek.message || resVm.message || resIdentity.message || "Gagal menyimpan"
        );
      }

      toast.success("Data Profil & Sambutan berhasil diperbarui!", { id: toastId });
    } catch (err: any) {
      console.error("[TabProfil] Save error:", err);
      toast.error(`Gagal: ${err?.message || "Terjadi kesalahan"}`, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. SEKSI SAMBUTAN KEPALA MADRASAH */}
      <Card className="border-gray-200/80 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <CardTitle className="text-base sm:text-lg font-bold text-gray-900">
              Sambutan Kepala Madrasah
            </CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm text-gray-500">
            Foto resmi, kutipan singkat, dan teks sambutan lengkap kepala madrasah.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Teks Kepsek */}
            <div className="lg:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-700">Nama Lengkap</Label>
                  <Input
                    value={kepsek.nama}
                    onChange={(e) => setKepsek({ ...kepsek, nama: e.target.value })}
                    placeholder="Anik Sulityowati"
                    className="h-10 text-sm sm:h-8 sm:text-xs font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-700">Gelar / Jabatan</Label>
                  <Input
                    value={kepsek.gelar}
                    onChange={(e) => setKepsek({ ...kepsek, gelar: e.target.value })}
                    placeholder="S.Ag."
                    className="h-10 text-sm sm:h-8 sm:text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  Ringkasan / Kutipan Pembuka (Highlight Quote)
                </Label>
                <Textarea
                  rows={2}
                  value={kepsek.summary}
                  onChange={(e) => setKepsek({ ...kepsek, summary: e.target.value })}
                  placeholder="Selamat datang di Website Resmi MIM PK Dimoro..."
                  className="text-sm sm:text-xs leading-relaxed"
                />
              </div>

              {/* Paragraf Sambutan Lengkap */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-gray-700">
                    Paragraf Sambutan Lengkap ({kepsek.paragraphs.length} Paragraf)
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddParagraph}
                    className="h-7 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Tambah Paragraf
                  </Button>
                </div>

                <div className="space-y-3">
                  {kepsek.paragraphs.map((paragraf, idx) => (
                    <div key={idx} className="relative group">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-bold text-gray-400 mt-2 w-5 text-right shrink-0">
                          {idx + 1}.
                        </span>
                        <Textarea
                          rows={3}
                          value={paragraf}
                          onChange={(e) => handleUpdateParagraph(idx, e.target.value)}
                          className="text-sm sm:text-xs leading-relaxed flex-1"
                        />
                        {kepsek.paragraphs.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveParagraph(idx)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 shrink-0 mt-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upload Foto Kepsek */}
            <div className="lg:col-span-4 space-y-2">
              <ImageUploader
                label="Foto Resmi Kepala Madrasah"
                value={kepsek.foto_url}
                onChange={(url) => setKepsek({ ...kepsek, foto_url: url })}
                folder="profil"
                aspectRatio="portrait"
                defaultUrl="/images/headmaster.jpg"
                description="Foto resmi format portrait (rasio 3:4). Otomatis dikompresi ke WebP."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. SEKSI VISI, MISI & MOTTO */}
      <Card className="border-gray-200/80 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-emerald-600" />
            <CardTitle className="text-base sm:text-lg font-bold text-gray-900">
              Visi, Misi & Motto Madrasah
            </CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm text-gray-500">
            Arah panduan strategis dan landasan pendidikan madrasah.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Motto Madrasah</Label>
              <Input
                value={vm.motto}
                onChange={(e) => setVm({ ...vm, motto: e.target.value })}
                placeholder="Membentuk Generasi Qur'ani, Berakhlak Mulia, Cerdas, dan Berprestasi"
                className="h-10 text-sm sm:h-8 sm:text-xs font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Visi Madrasah</Label>
              <Input
                value={vm.visi}
                onChange={(e) => setVm({ ...vm, visi: e.target.value })}
                className="h-10 text-sm sm:h-8 sm:text-xs font-medium"
              />
            </div>
          </div>

          {/* Indikator Visi */}
          <div className="space-y-2 pt-2">
            <Label className="text-xs font-semibold text-gray-700">
              Butir Indikator Visi ({vm.indikator_visi?.length || 0} Butir)
            </Label>
            <div className="space-y-2">
              {vm.indikator_visi?.map((indikator, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-600 w-5 text-right shrink-0">
                    {idx + 1}.
                  </span>
                  <Input
                    value={indikator}
                    onChange={(e) => {
                      const updated = [...vm.indikator_visi];
                      updated[idx] = e.target.value;
                      setVm({ ...vm, indikator_visi: updated });
                    }}
                    className="h-10 text-sm sm:h-8 sm:text-xs flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveIndikator(idx)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <Input
                value={newIndikator}
                onChange={(e) => setNewIndikator(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddIndikator();
                  }
                }}
                placeholder="Tambah butir indikator baru..."
                className="h-10 text-sm sm:h-8 sm:text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddIndikator}
                className="h-10 sm:h-8 px-3 text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Tambah
              </Button>
            </div>
          </div>

          {/* Butir Misi */}
          <div className="space-y-2 pt-2">
            <Label className="text-xs font-semibold text-gray-700">
              Butir Misi Madrasah ({vm.misi?.length || 0} Butir)
            </Label>
            <div className="space-y-2">
              {vm.misi?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-600 w-5 text-right shrink-0">
                    {idx + 1}.
                  </span>
                  <Input
                    value={item}
                    onChange={(e) => {
                      const updated = [...vm.misi];
                      updated[idx] = e.target.value;
                      setVm({ ...vm, misi: updated });
                    }}
                    className="h-10 text-sm sm:h-8 sm:text-xs flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMisi(idx)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <Input
                value={newMisi}
                onChange={(e) => setNewMisi(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddMisi();
                  }
                }}
                placeholder="Tambah butir misi baru..."
                className="h-10 text-sm sm:h-8 sm:text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddMisi}
                className="h-10 sm:h-8 px-3 text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Tambah
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. SEKSI IDENTITAS RESMI & LEGALITAS */}
      <Card className="border-gray-200/80 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <CardTitle className="text-base sm:text-lg font-bold text-gray-900">
              Identitas & Legalitas Madrasah
            </CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm text-gray-500">
            NPSN, NSM, status akreditasi, dan alamat administrasi resmi.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">NPSN</Label>
              <Input
                value={identity.npsn}
                onChange={(e) => setIdentity({ ...identity, npsn: e.target.value })}
                className="h-10 text-sm sm:h-8 sm:text-xs font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">NSM</Label>
              <Input
                value={identity.nsm}
                onChange={(e) => setIdentity({ ...identity, nsm: e.target.value })}
                className="h-10 text-sm sm:h-8 sm:text-xs font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Akreditasi</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={identity.akreditasi}
                  onChange={(e) => setIdentity({ ...identity, akreditasi: e.target.value })}
                  placeholder="A"
                  className="h-10 text-sm sm:h-8 sm:text-xs font-bold"
                />
                <Input
                  value={identity.akreditasi_label}
                  onChange={(e) => setIdentity({ ...identity, akreditasi_label: e.target.value })}
                  placeholder="Unggul"
                  className="h-10 text-sm sm:h-8 sm:text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Tanggal Berdiri</Label>
              <Input
                value={identity.tanggal_berdiri}
                onChange={(e) => setIdentity({ ...identity, tanggal_berdiri: e.target.value })}
                className="h-10 text-sm sm:h-8 sm:text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Status Madrasah</Label>
              <Input
                value={identity.status_sekolah}
                onChange={(e) => setIdentity({ ...identity, status_sekolah: e.target.value })}
                className="h-10 text-sm sm:h-8 sm:text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Bentuk Pendidikan</Label>
              <Input
                value={identity.bentuk_pendidikan}
                onChange={(e) => setIdentity({ ...identity, bentuk_pendidikan: e.target.value })}
                className="h-10 text-sm sm:h-8 sm:text-xs"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Alamat Lengkap</Label>
              <Input
                value={identity.alamat_lengkap}
                onChange={(e) => setIdentity({ ...identity, alamat_lengkap: e.target.value })}
                className="h-10 text-sm sm:h-8 sm:text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Desa / Kelurahan</Label>
              <Input
                value={identity.desa_kelurahan}
                onChange={(e) => setIdentity({ ...identity, desa_kelurahan: e.target.value })}
                className="h-10 text-sm sm:h-8 sm:text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Kecamatan</Label>
              <Input
                value={identity.kecamatan}
                onChange={(e) => setIdentity({ ...identity, kecamatan: e.target.value })}
                className="h-10 text-sm sm:h-8 sm:text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Kabupaten</Label>
              <Input
                value={identity.kabupaten}
                onChange={(e) => setIdentity({ ...identity, kabupaten: e.target.value })}
                className="h-10 text-sm sm:h-8 sm:text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Save Bar (Desktop Only) */}
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
          Simpan Seluruh Data Profil
        </Button>
      </div>
    </div>
  );
}
