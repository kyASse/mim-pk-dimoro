"use client";

import { useState } from "react";
import { OpiniPerspektif, KategoriOpini } from "@/lib/types/ruang-perspektif";
import { updateOpiniContentAction } from "@/app/admin/ruang-perspektif/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { KATEGORI_OPINI_LIST } from "@/lib/validations/ruang-perspektif";
import OpiniRichTextEditor from "@/components/ruang-perspektif/OpiniRichTextEditor";
import { toast } from "sonner";

export default function OpiniAdminEditor({ opini }: { opini: OpiniPerspektif }) {
  const [judul, setJudul] = useState(opini.judul);
  const [kategori, setKategori] = useState<KategoriOpini>(opini.kategori);
  const [ringkasan, setRingkasan] = useState(opini.ringkasan);
  const [isiLengkap, setIsiLengkap] = useState(opini.isi_lengkap);
  const [catatanRedaksi, setCatatanRedaksi] = useState(opini.catatan_redaksi || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const res = await updateOpiniContentAction(opini.id, {
      judul,
      kategori,
      ringkasan,
      isi_lengkap: isiLengkap,
      catatan_redaksi: catatanRedaksi || null,
    });
    setSaving(false);

    if (res.success) {
      toast.success("Perubahan naskah berhasil disimpan");
    } else {
      toast.error(res.error || "Gagal menyimpan");
    }
  };

  return (
    <div className="space-y-5 rounded-2xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="font-bold text-sm text-foreground">Editor Naskah & Proofreading</h3>
        <Button size="sm" onClick={handleSave} disabled={saving} className="h-8 text-xs">
          {saving ? "Menyimpan..." : "Simpan Draf"}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Judul Naskah</label>
          <Input value={judul} onChange={(e) => setJudul(e.target.value)} className="h-10 text-sm sm:h-8 sm:text-xs" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Kategori</label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value as KategoriOpini)}
            className="w-full rounded-md border border-input bg-background px-3 h-10 text-sm sm:h-8 sm:text-xs"
          >
            {KATEGORI_OPINI_LIST.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Ringkasan / Hook</label>
          <Textarea value={ringkasan} onChange={(e) => setRingkasan(e.target.value)} rows={3} className="text-sm sm:text-xs" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Isi Lengkap Naskah</label>
          <OpiniRichTextEditor
            value={isiLengkap}
            onChange={(html) => setIsiLengkap(html)}
            placeholder="Edit dan rapikan naskah opini di sini..."
            disabled={saving}
            minHeight="min-h-[350px]"
          />
        </div>

        <div className="space-y-1.5 pt-2 border-t">
          <label className="text-xs font-semibold text-foreground">Catatan Kurasi Redaksi (Alasan / Masukan Revisi)</label>
          <Textarea
            value={catatanRedaksi}
            onChange={(e) => setCatatanRedaksi(e.target.value)}
            rows={2}
            placeholder="Catatan untuk penulis jika ditolak atau perlu perbaikan..."
            className="text-sm sm:text-xs"
          />
        </div>
      </div>
    </div>
  );
}
