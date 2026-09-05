"use client";

import { CheckSquare, MessageCircle, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PendaftarBulkToolbarProps {
  selectedCount: number;
  totalCount: number;
  onOpenBulkStatus: () => void;
  onOpenBulkWhatsApp: () => void;
  onClearSelection: () => void;
}

export default function PendaftarBulkToolbar({
  selectedCount,
  totalCount,
  onOpenBulkStatus,
  onOpenBulkWhatsApp,
  onClearSelection,
}: PendaftarBulkToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      data-testid="bulk-action-toolbar"
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] sm:w-auto max-w-md bg-foreground text-background shadow-xl rounded-2xl p-2.5 sm:px-4 sm:py-2.5 flex items-center justify-between sm:justify-start gap-2 sm:gap-4 border border-border/20 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="flex items-center gap-2 pr-2 border-r border-background/20 text-xs sm:text-sm font-semibold shrink-0">
        <CheckSquare className="h-4 w-4 text-emerald-400" />
        <span>
          {selectedCount}{" "}
          <span className="font-normal opacity-80 text-xs hidden sm:inline">
            dari {totalCount}
          </span>
        </span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-none justify-end">
        <Button
          size="sm"
          variant="secondary"
          onClick={onOpenBulkStatus}
          aria-label="Ubah Status Massal"
          className="h-8 text-xs font-semibold gap-1 px-2.5 sm:px-3 shadow-xs"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Status</span>
        </Button>

        <Button
          size="sm"
          onClick={onOpenBulkWhatsApp}
          aria-label="Kirim WA Massal"
          className="h-8 text-xs font-semibold gap-1 px-2.5 sm:px-3 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
        >
          <MessageCircle className="h-3 w-3" />
          <span>WhatsApp</span>
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={onClearSelection}
          className="h-7 w-7 text-background/80 hover:text-background hover:bg-background/20 rounded-lg shrink-0"
          title="Batal Pilih"
          aria-label="Batal Pilih"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
