"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, GitFork, Calendar, Wallet, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { DocumentUploader } from "./DocumentUploader";
import { toast } from "sonner";
import { savePPDBFlowAction, saveTextContentAction } from "@/app/admin/konten/actions";
import { PPDBFlowContent } from "@/lib/types/content";

interface TabPPDBProps {
  initialFlow: PPDBFlowContent;
  initialPersyaratanText: string;
  initialJadwalText: string;
  initialSppText: string;
}

export function TabPPDB({
  initialFlow,
  initialPersyaratanText,
  initialJadwalText,
  initialSppText,
}: TabPPDBProps) {
  const [flow, setFlow] = useState<PPDBFlowContent>(initialFlow);
  const [persyaratan, setPersyaratan] = useState(initialPersyaratanText);
  const [jadwal, setJadwal] = useState(initialJadwalText);
  const [sppCatatan, setSppCatatan] = useState(initialSppText);
  const [isSaving, setIsSaving] = useState(false);

  // Helper step alur online
  const handleUpdateOnlineStep = (idx: number, field: "title" | "desc", val: string) => {
    setFlow((prev) => {
      const steps = [...prev.alur_online];
      steps[idx] = { ...steps[idx], [field]: val };
      return { ...prev, alur_online: steps };
    });
  };

  const handleAddOnlineStep = () => {
    setFlow((prev) => ({
      ...prev,
      alur_online: [
        ...prev.alur_online,
        { title: "Tahap Baru", desc: "Deskripsi alur tahapan pendaftaran online" },
      ],
    }));
  };

  const handleRemoveOnlineStep = (idx: number) => {
    setFlow((prev) => ({
      ...prev,
      alur_online: prev.alur_online.filter((_, i) => i !== idx),
    }));
  };

  // Helper step alur offline
  const handleUpdateOfflineStep = (idx: number, field: "title" | "desc", val: string) => {
    setFlow((prev) => {
      const steps = [...prev.alur_offline];
      steps[idx] = { ...steps[idx], [field]: val };
      return { ...prev, alur_offline: steps };
    });
  };

  const handleAddOfflineStep = () => {
    setFlow((prev) => ({
      ...prev,
      alur_offline: [
        ...prev.alur_offline,
        { title: "Tahap Baru", desc: "Deskripsi alur tahapan pendaftaran langsung di sekolah" },
      ],
    }));
  };

  const handleRemoveOfflineStep = (idx: number) => {
    setFlow((prev) => ({
      ...prev,
      alur_offline: prev.alur_offline.filter((_, i) => i !== idx),
    }));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Menyimpan pengaturan PPDB & Dokumen...");

    try {
      const [resFlow, resSyarat, resJadwal, resSpp] = await Promise.all([
        savePPDBFlowAction(flow),
        saveTextContentAction("persyaratan-pendaftaran", "Persyaratan Pendaftaran", persyaratan),
        saveTextContentAction("jadwal-pendaftaran", "Jadwal Pendaftaran PPDB", jadwal),
        saveTextContentAction("catatan-spp", "Catatan SPP & Pembiayaan", sppCatatan),
      ]);

      if (!resFlow.success || !resSyarat.success || !resJadwal.success || !resSpp.success) {
        throw new Error(
          resFlow.message || resSyarat.message || resJadwal.message || resSpp.message || "Gagal menyimpan"
        );
      }

      toast.success("Pengaturan PPDB & Dokumen berhasil diperbarui!", { id: toastId });
    } catch (err: any) {
      toast.error(`Gagal: ${err?.message || "Terjadi kesalahan"}`, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. SEKSI FORMULIR PDF OFFLINE */}
      <Card className="border-border/80 bg-card shadow-xs rounded-2xl overflow-hidden">
        <CardHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/30 dark:bg-muted/15">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <FileText className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg font-bold text-foreground leading-snug">
                Formulir Pendaftaran Fisik (PDF)
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                File PDF resmi yang diunduh oleh calon wali murid untuk pendaftaran jalur offline / langsung.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <DocumentUploader
            label="File Formulir Pendaftaran PDF"
            value={flow.formulir_pdf_url}
            onChange={(url) => setFlow({ ...flow, formulir_pdf_url: url })}
            defaultUrl="/Formulir Pendaftaran MIM PK Dimoro.pdf"
            description="Format .pdf dengan ukuran maksimal 15MB. Dokumen ini terhubung ke tombol 'Unduh Formulir' di halaman pendaftaran."
          />
        </CardContent>
      </Card>

      {/* 2. SEKSI PERSYARATAN & JADWAL & SPP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Persyaratan Pendaftaran */}
        <Card className="border-border/80 bg-card shadow-xs rounded-2xl overflow-hidden">
          <CardHeader className="p-4 border-b border-border/60 bg-muted/30 dark:bg-muted/15">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs">
                <FileText className="w-4 h-4" />
              </div>
              <CardTitle className="text-sm sm:text-base font-bold text-foreground leading-tight">
                Persyaratan Berkas
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            <Label className="text-xs text-muted-foreground">
              Daftar syarat dokumen pendaftaran (1 baris per poin)
            </Label>
            <Textarea
              rows={8}
              value={persyaratan}
              onChange={(e) => setPersyaratan(e.target.value)}
              className="text-sm sm:text-xs leading-relaxed font-mono"
              placeholder="1. Mengisi formulir pendaftaran&#10;2. Fotokopi Akta Kelahiran..."
            />
          </CardContent>
        </Card>

        {/* Jadwal Gelombang */}
        <Card className="border-border/80 bg-card shadow-xs rounded-2xl overflow-hidden">
          <CardHeader className="p-4 border-b border-border/60 bg-muted/30 dark:bg-muted/15">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs">
                <Calendar className="w-4 h-4" />
              </div>
              <CardTitle className="text-sm sm:text-base font-bold text-foreground leading-tight">
                Jadwal & Gelombang
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            <Label className="text-xs text-muted-foreground">
              Periode pendaftaran dan tes observasi calon siswa
            </Label>
            <Textarea
              rows={8}
              value={jadwal}
              onChange={(e) => setJadwal(e.target.value)}
              className="text-sm sm:text-xs leading-relaxed font-mono"
              placeholder="Gelombang 1: Januari - Maret&#10;Gelombang 2: April - Juni..."
            />
          </CardContent>
        </Card>

        {/* Catatan SPP */}
        <Card className="border-border/80 bg-card shadow-xs rounded-2xl overflow-hidden">
          <CardHeader className="p-4 border-b border-border/60 bg-muted/30 dark:bg-muted/15">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs">
                <Wallet className="w-4 h-4" />
              </div>
              <CardTitle className="text-sm sm:text-base font-bold text-foreground leading-tight">
                Catatan Pembiayaan / SPP
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            <Label className="text-xs text-muted-foreground">
              Informasi cakupan fasilitas SPP bulanan sekolah
            </Label>
            <Textarea
              rows={8}
              value={sppCatatan}
              onChange={(e) => setSppCatatan(e.target.value)}
              className="text-sm sm:text-xs leading-relaxed"
              placeholder="SPP bulanan sudah mencakup seluruh program unggulan (Tahfidz, Klinik Belajar, makan siang...)"
            />
          </CardContent>
        </Card>
      </div>

      {/* 3. SEKSI ALUR PENDAFTARAN ONLINE & OFFLINE */}
      <Card className="border-border/80 bg-card shadow-xs rounded-2xl overflow-hidden">
        <CardHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/30 dark:bg-muted/15">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <GitFork className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg font-bold text-foreground leading-snug">
                Tahapan Alur Pendaftaran (Online & Offline)
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Panduan langkah demi langkah proses pendaftaran yang tampil di halaman PPDB.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-8">
          {/* Alur Online */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-600 text-white text-xs">Jalur Online</Badge>
                <span className="text-xs text-muted-foreground">
                  ({flow.alur_online.length} Tahapan)
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOnlineStep}
                className="h-7 text-xs border-border/80 hover:bg-muted/50"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Tambah Tahap Online
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {flow.alur_online.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-border/80 bg-card/60 dark:bg-muted/10 shadow-xs space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Tahap #{idx + 1}</span>
                    {flow.alur_online.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOnlineStep(idx)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <Input
                    value={step.title}
                    onChange={(e) => handleUpdateOnlineStep(idx, "title", e.target.value)}
                    placeholder="Judul Tahap"
                    className="h-8 text-xs font-medium"
                  />
                  <Textarea
                    rows={2}
                    value={step.desc}
                    onChange={(e) => handleUpdateOnlineStep(idx, "desc", e.target.value)}
                    placeholder="Deskripsi langkah"
                    className="text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Alur Offline */}
          <div className="space-y-4 pt-4 border-t border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-600 text-white text-xs">Jalur Offline / Langsung</Badge>
                <span className="text-xs text-muted-foreground">
                  ({flow.alur_offline.length} Tahapan)
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOfflineStep}
                className="h-7 text-xs border-border/80 hover:bg-muted/50"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Tambah Tahap Offline
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {flow.alur_offline.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-border/80 bg-card/60 dark:bg-muted/10 shadow-xs space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Tahap #{idx + 1}</span>
                    {flow.alur_offline.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOfflineStep(idx)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <Input
                    value={step.title}
                    onChange={(e) => handleUpdateOfflineStep(idx, "title", e.target.value)}
                    placeholder="Judul Tahap"
                    className="h-8 text-xs font-medium"
                  />
                  <Textarea
                    rows={2}
                    value={step.desc}
                    onChange={(e) => handleUpdateOfflineStep(idx, "desc", e.target.value)}
                    placeholder="Deskripsi langkah"
                    className="text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desktop Save Bar */}
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
          Simpan Seluruh Pengaturan PPDB
        </Button>
      </div>
    </div>
  );
}
