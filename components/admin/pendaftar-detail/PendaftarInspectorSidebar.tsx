"use client";

import { useState } from "react";
import {
  MessageCircle,
  Phone,
  Mail,
  Copy,
  Check,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import StatusSelect from "@/app/admin/pendaftar/detail/[id]/StatusSelect";
import ProcessRegistrationButton from "@/app/admin/pendaftar/detail/[id]/ProcessRegistrationButton";
import EditPendaftarButton from "@/app/admin/pendaftar/detail/[id]/EditPendaftarButton";
import CetakFormulirButton from "@/components/admin/CetakFormulirButton";

export interface PendaftarInspectorSidebarProps {
  pendaftar: any;
  onOpenWhatsApp: () => void;
}

export default function PendaftarInspectorSidebar({
  pendaftar,
  onOpenWhatsApp,
}: PendaftarInspectorSidebarProps) {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const isAccepted = ["Diterima", "Akun Dibuat"].includes(
    pendaftar.status_pendaftaran || ""
  );
  const isRejected = pendaftar.status_pendaftaran === "Ditolak";
  const isRevision = ["Revisi", "Validasi Ulang"].includes(
    pendaftar.status_pendaftaran || ""
  );

  const handleCopy = async (text: string, type: "phone" | "email") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "phone") {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      } else {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      }
      toast.success(`${type === "phone" ? "Nomor HP" : "Email"} berhasil disalin`);
    } catch {
      toast.error("Gagal menyalin data");
    }
  };

  const parentName =
    pendaftar.nama_ayah_kandung ||
    pendaftar.nama_ibu_kandung ||
    pendaftar.wali_nama ||
    "Wali Murid";

  return (
    <aside className="space-y-4 sticky top-6">
      {/* SECTION 1: KEPUTUSAN & STATUS */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Keputusan & Status
          </span>
          <StatusSelect id={pendaftar.id} value={pendaftar.status_pendaftaran} />
        </div>

        {/* Primary Workflow CTA */}
        {isAccepted ? (
          <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5 min-w-0 text-xs">
              <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                Pendaftaran Diterima
              </p>
              <p className="text-[11px] text-emerald-700/90 dark:text-emerald-400 leading-normal">
                Siswa terverifikasi. Akun portal wali murid aktif.
              </p>
            </div>
          </div>
        ) : isRejected ? (
          <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5 min-w-0 text-xs">
              <p className="font-semibold text-rose-800 dark:text-rose-300">
                Pendaftaran Ditolak
              </p>
              <p className="text-[11px] text-rose-700/90 dark:text-rose-400 leading-normal">
                Calon peserta didik ini tidak lolos seleksi berkas/observasi.
              </p>
            </div>
          </div>
        ) : isRevision ? (
          <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5 min-w-0 text-xs">
              <p className="font-semibold text-amber-800 dark:text-amber-300">
                Perlu Revisi Dokumen
              </p>
              <p className="text-[11px] text-amber-700/90 dark:text-amber-400 leading-normal">
                Kirim catatan revisi ke wali murid melalui WhatsApp.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <ProcessRegistrationButton pendaftar={pendaftar} />
          </div>
        )}

        {/* Direct WhatsApp Trigger */}
        <Button
          onClick={onOpenWhatsApp}
          disabled={!pendaftar.nomor_telepon}
          className="w-full h-9 gap-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-[0.98]"
          title="Kirim Pesan WhatsApp Cepat"
          aria-label="Kirim Pesan WhatsApp"
        >
          <MessageCircle className="h-4 w-4 shrink-0" />
          <span>Kirim Pesan WhatsApp</span>
        </Button>
      </div>

      {/* SECTION 2: KONTAK CEPAT WALI MURID */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Kontak Utama
          </span>
          <span className="text-[11px] text-muted-foreground truncate max-w-[140px]">
            {parentName}
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          {/* Phone */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border/50">
            <div className="flex items-center gap-2 min-w-0">
              <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="font-mono truncate">
                {pendaftar.nomor_telepon || "Belum ada nomor telepon"}
              </span>
            </div>
            {pendaftar.nomor_telepon && (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(pendaftar.nomor_telepon, "phone")}
                  className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                  title="Salin Nomor HP"
                  aria-label="Salin Nomor Telepon"
                >
                  {copiedPhone ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border/50">
            <div className="flex items-center gap-2 min-w-0">
              <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">
                {pendaftar.email || "Belum ada email"}
              </span>
            </div>
            {pendaftar.email && (
              <button
                type="button"
                onClick={() => handleCopy(pendaftar.email, "email")}
                className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
                title="Salin Email"
                aria-label="Salin Email"
              >
                {copiedEmail ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: AKSI DOKUMEN & FORMULIR */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-3">
        <span className="block text-xs font-semibold text-foreground uppercase tracking-wider border-b border-border/50 pb-2.5">
          Aksi Data & Formulir
        </span>

        <div className="grid grid-cols-1 gap-2">
          <EditPendaftarButton pendaftar={pendaftar} />
          <CetakFormulirButton pendaftar={pendaftar} />
        </div>
      </div>
    </aside>
  );
}
