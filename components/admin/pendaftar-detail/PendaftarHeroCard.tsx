"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  MessageCircle, 
  Copy, 
  Check, 
  Calendar, 
  CreditCard,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import StatusSelect from "@/app/admin/pendaftar/detail/[id]/StatusSelect";
import EditPendaftarButton from "@/app/admin/pendaftar/detail/[id]/EditPendaftarButton";
import CetakFormulirButton from "@/components/admin/CetakFormulirButton";

export interface PendaftarHeroProps {
  pendaftar: any;
  regId: string;
  onOpenWhatsApp: () => void;
  onStatusChange?: (newStatus: string) => void;
}

export default function PendaftarHeroCard({
  pendaftar,
  regId,
  onOpenWhatsApp,
}: PendaftarHeroProps) {
  const [copiedNik, setCopiedNik] = useState(false);

  const studentInitials = (pendaftar.nama_lengkap || "S")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  const handleCopyNik = () => {
    if (!pendaftar.nomor_induk) return;
    navigator.clipboard.writeText(pendaftar.nomor_induk);
    setCopiedNik(true);
    setTimeout(() => setCopiedNik(false), 2000);
  };

  const renderStatusBadge = (status: string | null) => {
    switch (status) {
      case "Diterima":
      case "Akun Dibuat":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 font-medium">
            {status}
          </Badge>
        );
      case "Revisi":
      case "Validasi Ulang":
        return (
          <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 font-medium">
            Revisi
          </Badge>
        );
      case "Ditolak":
        return (
          <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 font-medium">
            Ditolak
          </Badge>
        );
      default:
        return (
          <Badge className="bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/30 hover:bg-sky-500/20 font-medium">
            Menunggu Persetujuan
          </Badge>
        );
    }
  };

  return (
    <Card className="border-border shadow-sm overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Avatar & Identity Details */}
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xl sm:text-2xl shrink-0 shadow-sm">
              {studentInitials || <User className="h-8 w-8" />}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-muted text-primary border border-border">
                  {regId}
                </span>
                {renderStatusBadge(pendaftar.status_pendaftaran)}
                {pendaftar.jenis_kelamin && (
                  <Badge variant="outline" className="text-[11px] font-normal">
                    {pendaftar.jenis_kelamin === "L" ? "Laki-laki (L)" : "Perempuan (P)"}
                  </Badge>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {pendaftar.nama_lengkap || "Nama tidak tersedia"}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-0.5">
                {pendaftar.nomor_induk && (
                  <div className="flex items-center gap-1.5 font-mono">
                    <CreditCard className="h-3.5 w-3.5" />
                    <span>NIK: {pendaftar.nomor_induk}</span>
                    <button
                      type="button"
                      onClick={handleCopyNik}
                      className="text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors"
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

                {pendaftar.created_at && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      Daftar:{" "}
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

          {/* Right: Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/60">
            <div className="flex items-center gap-1.5 bg-muted/30 p-1 rounded-lg border border-border/80">
              <span className="text-xs font-semibold px-2 text-muted-foreground">Status:</span>
              <StatusSelect id={pendaftar.id} value={pendaftar.status_pendaftaran} />
            </div>

            <Button
              size="sm"
              onClick={onOpenWhatsApp}
              disabled={!pendaftar.nomor_telepon}
              className="h-9 gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              title="Kirim Pesan WhatsApp Cepat"
              aria-label="Kirim Pesan WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>

            <EditPendaftarButton pendaftar={pendaftar} />

            <CetakFormulirButton pendaftar={pendaftar} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
