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
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-foreground/95 text-background shadow-xl rounded-xl px-4 py-2.5 flex items-center gap-3 sm:gap-4 border border-border/20 backdrop-blur animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="flex items-center gap-2 pr-2 border-r border-background/20 text-xs sm:text-sm font-semibold">
        <CheckSquare className="h-4 w-4 text-emerald-400" />
        <span>
          {selectedCount} <span className="font-normal opacity-80 text-xs hidden sm:inline">dari {totalCount} dipilih</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={onOpenBulkStatus}
          className="h-8 text-xs font-semibold gap-1.5 shadow-sm"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Ubah Status Massal
        </Button>

        <Button
          size="sm"
          onClick={onOpenBulkWhatsApp}
          className="h-8 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Kirim WA Massal
        </Button>
      </div>

      <Button
        size="icon"
        variant="ghost"
        onClick={onClearSelection}
        className="h-7 w-7 text-background/70 hover:text-background hover:bg-background/10 ml-1"
        title="Batal Pilih"
        aria-label="Batal Pilih"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
