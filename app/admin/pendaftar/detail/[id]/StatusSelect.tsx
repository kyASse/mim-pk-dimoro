"use client";

import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { updateStatusPendaftaran } from "../../actions";

const statusOptions = [
  { value: "Menunggu Persetujuan", label: "Menunggu Persetujuan" },
  { value: "Diterima", label: "Diterima" },
  { value: "Akun Dibuat", label: "Akun Dibuat" },
  { value: "Revisi", label: "Revisi" },
  { value: "Ditolak", label: "Ditolak" },
];

export const getStatusBadgeStyle = (status: string | null) => {
  switch (status) {
    case "Akun Dibuat":
    case "Diterima":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/15";
    case "Revisi":
    case "Validasi Ulang":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/15";
    case "Ditolak":
      return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/15";
    default:
      return "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30 hover:bg-sky-500/15";
  }
};

export default function StatusSelect({
  id,
  value,
}: {
  id: string;
  value: string | null;
}) {
  const [isPending, startTransition] = useTransition();

  const handleValueChange = (newStatus: string) => {
    startTransition(async () => {
      await updateStatusPendaftaran(id, newStatus);
    });
  };

  const currentStatus = value || "Menunggu Persetujuan";

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentStatus}
        onValueChange={handleValueChange}
        disabled={isPending}
      >
        <SelectTrigger
          className={`h-8 px-2.5 text-xs font-semibold rounded-md border transition-colors ${getStatusBadgeStyle(
            currentStatus
          )}`}
          aria-label="Pilih status pendaftaran"
        >
          <div className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                currentStatus === "Diterima" || currentStatus === "Akun Dibuat"
                  ? "bg-emerald-500"
                  : currentStatus === "Revisi"
                  ? "bg-amber-500"
                  : currentStatus === "Ditolak"
                  ? "bg-rose-500"
                  : "bg-sky-500"
              }`}
            />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent align="end" className="text-xs">
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    option.value === "Diterima" || option.value === "Akun Dibuat"
                      ? "bg-emerald-500"
                      : option.value === "Revisi"
                      ? "bg-amber-500"
                      : option.value === "Ditolak"
                      ? "bg-rose-500"
                      : "bg-sky-500"
                  }`}
                />
                <span className="font-medium">{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isPending && (
        <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin shrink-0" />
      )}
    </div>
  );
}