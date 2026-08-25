"use client";

import { useState } from "react";
import { Copy, Check, Calendar, CreditCard, School, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import StatusSelect from "@/app/admin/pendaftar/detail/[id]/StatusSelect";

export interface PendaftarDossierHeaderProps {
  pendaftar: any;
  regId: string;
}

export default function PendaftarDossierHeader({
  pendaftar,
  regId,
}: PendaftarDossierHeaderProps) {
  const [copiedNik, setCopiedNik] = useState(false);

  const studentInitials = (pendaftar.nama_lengkap || "S")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  const handleCopyNik = async () => {
    if (!pendaftar.nomor_induk) return;
    try {
      await navigator.clipboard.writeText(pendaftar.nomor_induk);
      setCopiedNik(true);
      toast.success("NIK Berhasil Disalin", {
        description: pendaftar.nomor_induk,
        duration: 2500,
      });
      setTimeout(() => setCopiedNik(false), 2000);
    } catch {
      toast.error("Gagal menyalin NIK");
    }
  };

  const calculateAge = (dateString?: string) => {
    if (!dateString) return null;
    const birthDate = new Date(dateString);
    if (isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      years--;
    }
    return years > 0 ? `${years} Tahun` : null;
  };

  const ageText = calculateAge(pendaftar.tanggal_lahir);

  return (
    <div className="relative rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-xs overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Avatar & Identity Header */}
        <div className="flex items-start gap-3.5 sm:gap-5">
          <div className="relative h-12 w-12 sm:h-16 sm:w-16 rounded-xl bg-muted border border-border/60 flex items-center justify-center font-bold text-base sm:text-xl text-foreground/90 shrink-0 select-none shadow-2xs">
            {studentInitials}
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-md bg-muted text-foreground/90 border border-border/80 tracking-wide">
                {regId}
              </span>

              {pendaftar.jenis_kelamin && (
                <Badge
                  variant="outline"
                  className="text-[11px] font-medium text-muted-foreground border-border/70"
                >
                  {pendaftar.jenis_kelamin === "L" || pendaftar.jenis_kelamin === "Laki-laki"
                    ? "Laki-laki (L)"
                    : "Perempuan (P)"}
                </Badge>
              )}

              {ageText && (
                <Badge
                  variant="outline"
                  className="text-[11px] font-medium text-muted-foreground border-border/70"
                >
                  {ageText}
                </Badge>
              )}

              {pendaftar.memiliki_kebutuhan_khusus && (
                <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 text-[11px] font-medium">
                  <ShieldAlert className="w-3 h-3 mr-1" />
                  Kebutuhan Khusus
                </Badge>
              )}
            </div>

            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground break-words">
              {pendaftar.nama_lengkap || "Nama tidak tersedia"}
              {pendaftar.nama_panggilan && (
                <span className="text-muted-foreground text-sm sm:text-base font-normal ml-1.5">
                  ({pendaftar.nama_panggilan})
                </span>
              )}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground pt-0.5">
              {pendaftar.nomor_induk && (
                <div className="flex items-center gap-1.5 font-mono">
                  <CreditCard className="h-3.5 w-3.5 text-muted-foreground/70" />
                  <span>NIK: {pendaftar.nomor_induk}</span>
                  <button
                    type="button"
                    onClick={handleCopyNik}
                    className="text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors inline-flex items-center"
                    title="Salin NIK"
                    aria-label="Salin NIK"
                  >
                    {copiedNik ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              )}

              {pendaftar.tanggal_lahir && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
                  <span>
                    {pendaftar.tempat_lahir ? `${pendaftar.tempat_lahir}, ` : ""}
                    {new Date(pendaftar.tanggal_lahir).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}

              {pendaftar.tk_asal && (
                <div className="flex items-center gap-1.5">
                  <School className="h-3.5 w-3.5 text-muted-foreground/70" />
                  <span className="truncate max-w-[200px]">Asal: {pendaftar.tk_asal}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Status & Registration Date indicator */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-border/50 pt-2.5 sm:pt-0 gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground sm:hidden">
              Status:
            </span>
            <StatusSelect id={pendaftar.id} value={pendaftar.status_pendaftaran} />
          </div>

          {pendaftar.created_at && (
            <div className="text-right text-xs text-muted-foreground/80">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground/60 hidden sm:block">
                Tgl Pendaftaran
              </span>
              <span className="font-medium text-foreground/80 text-[11px] sm:text-xs">
                {new Date(pendaftar.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
