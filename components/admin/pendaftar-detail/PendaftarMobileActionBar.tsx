"use client";

import { MessageCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProcessRegistrationButton from "@/app/admin/pendaftar/detail/[id]/ProcessRegistrationButton";
import StatusSelect from "@/app/admin/pendaftar/detail/[id]/StatusSelect";

export interface PendaftarMobileActionBarProps {
  pendaftar: any;
  onOpenWhatsApp: () => void;
}

export default function PendaftarMobileActionBar({
  pendaftar,
  onOpenWhatsApp,
}: PendaftarMobileActionBarProps) {
  const isAccepted = ["Diterima", "Akun Dibuat"].includes(
    pendaftar.status_pendaftaran || ""
  );

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur-md border-t border-border/80 px-4 py-2.5 shadow-lg lg:hidden">
      <div className="max-w-md mx-auto flex items-center gap-2">
        {/* WhatsApp Fast Trigger Button */}
        <Button
          onClick={onOpenWhatsApp}
          disabled={!pendaftar.nomor_telepon}
          className="flex-1 h-10 gap-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-[0.98]"
          title="Kirim Pesan WhatsApp Cepat"
          aria-label="Kirim Pesan WhatsApp"
        >
          <MessageCircle className="h-4 w-4 shrink-0" />
          <span>Chat WhatsApp</span>
        </Button>

        {/* Primary Decision Action or Status */}
        {isAccepted ? (
          <div className="flex-1 flex items-center justify-center gap-1.5 h-10 px-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="truncate">Siswa Diterima</span>
          </div>
        ) : (
          <div className="flex-1">
            <ProcessRegistrationButton
              pendaftar={pendaftar}
              className="h-10 text-xs font-semibold w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
