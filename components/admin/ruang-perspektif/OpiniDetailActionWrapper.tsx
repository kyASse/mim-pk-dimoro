"use client";

import { useState } from "react";
import { updateOpiniStatusAction } from "@/app/admin/ruang-perspektif/actions";
import OpiniStickyBottomDock from "./OpiniStickyBottomDock";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

export default function OpiniDetailActionWrapper({
  opiniId,
  status,
  whatsappUrl,
}: {
  opiniId: string;
  status: string;
  whatsappUrl: string;
}) {
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    setLoading(true);
    const res = await updateOpiniStatusAction(opiniId, "terbit");
    setLoading(false);
    if (res.success) {
      toast.success("Naskah resmi diterbitkan!");
    } else {
      toast.error(res.error || "Gagal menerbitkan");
    }
  };

  const handleReject = async () => {
    const alasan = prompt("Masukkan catatan alasan penolakan untuk penulis:");
    if (alasan === null) return;

    setLoading(true);
    const res = await updateOpiniStatusAction(opiniId, "ditolak", alasan);
    setLoading(false);
    if (res.success) {
      toast.success("Status naskah diubah menjadi ditolak");
    } else {
      toast.error(res.error || "Gagal menolak");
    }
  };

  return (
    <>
      {/* Desktop action card */}
      <div className="hidden lg:block rounded-2xl border border-border/60 bg-card p-5 space-y-3">
        <h4 className="font-bold text-xs uppercase text-muted-foreground">Keputusan Redaksi</h4>
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePublish}
            disabled={loading}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-xs gap-1"
          >
            <Check className="size-4" /> {status === "terbit" ? "Perbarui" : "Terbitkan"}
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={loading}
            className="flex-1 h-9 text-xs gap-1"
          >
            <X className="size-4" /> Tolak
          </Button>
        </div>
      </div>

      {/* Mobile Sticky Floating Bottom Dock */}
      <OpiniStickyBottomDock
        status={status}
        whatsappUrl={whatsappUrl}
        onPublish={handlePublish}
        onReject={handleReject}
        loading={loading}
      />
    </>
  );
}
