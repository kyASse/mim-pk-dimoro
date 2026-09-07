"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { bulkUpdateStatusPendaftaran } from "@/app/admin/pendaftar/actions";
import { toast } from "sonner";

interface PendaftarBulkStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  onSuccess: (newStatus: string) => void;
}

const statusOptions = [
  { value: "Diterima", label: "Diterima", color: "text-emerald-600 dark:text-emerald-400" },
  { value: "Menunggu Persetujuan", label: "Menunggu Persetujuan", color: "text-sky-600 dark:text-sky-400" },
  { value: "Revisi", label: "Validasi Ulang / Revisi", color: "text-amber-600 dark:text-amber-400" },
  { value: "Ditolak", label: "Ditolak", color: "text-rose-600 dark:text-rose-400" },
];

export default function PendaftarBulkStatusDialog({
  open,
  onOpenChange,
  selectedIds,
  onSuccess,
}: PendaftarBulkStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState("Diterima");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (selectedIds.length === 0) return;

    setLoading(true);
    try {
      const res = await bulkUpdateStatusPendaftaran(selectedIds, selectedStatus);
      if (res.success) {
        toast.success(res.message || "Status pendaftar berhasil diperbarui.");
        onSuccess(selectedStatus);
        onOpenChange(false);
      } else {
        toast.error(res.message || "Gagal memperbarui status pendaftar.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan sistem saat memperbarui status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <RefreshCw className="h-5 w-5" />
            <DialogTitle className="text-lg font-bold">Ubah Status Massal</DialogTitle>
          </div>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Perbarui status pendaftaran untuk <span className="font-semibold text-foreground">{selectedIds.length}</span> pendaftar terpilih secara bersamaan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground">Pilih Status Baru</Label>
            <div className="grid grid-cols-1 gap-2">
              {statusOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedStatus === opt.value
                      ? "border-primary bg-primary/5 font-semibold text-foreground ring-1 ring-primary"
                      : "border-border hover:bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <input
                      type="radio"
                      name="bulk-status"
                      value={opt.value}
                      checked={selectedStatus === opt.value}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className={selectedStatus === opt.value ? opt.color : ""}>{opt.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:justify-end border-t pt-3">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Batal
          </Button>
          <Button
            type="button"
            disabled={loading || selectedIds.length === 0}
            onClick={handleSubmit}
            className="text-xs font-semibold"
          >
            {loading ? "Menyimpan..." : `Terapkan ke ${selectedIds.length} Data`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
