"use client";

import { Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PendaftarDateFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onResetDates: () => void;
}

export default function PendaftarDateFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onResetDates,
}: PendaftarDateFilterProps) {
  const hasDateFilter = Boolean(startDate || endDate);

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <div className="flex items-center gap-1.5 bg-background border border-input rounded-md px-2.5 py-1 shadow-sm h-9">
        <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="text-muted-foreground font-medium hidden sm:inline">Dari:</span>
        <input
          type="date"
          aria-label="Tanggal Mulai"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="bg-transparent border-0 text-foreground text-xs focus:outline-none focus:ring-0 p-0"
        />
      </div>

      <div className="flex items-center gap-1.5 bg-background border border-input rounded-md px-2.5 py-1 shadow-sm h-9">
        <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="text-muted-foreground font-medium hidden sm:inline">Sampai:</span>
        <input
          type="date"
          aria-label="Tanggal Selesai"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="bg-transparent border-0 text-foreground text-xs focus:outline-none focus:ring-0 p-0"
        />
      </div>

      {hasDateFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetDates}
          className="h-8 px-2 text-muted-foreground hover:text-foreground text-xs gap-1"
          title="Hapus Filter Tanggal"
        >
          <X className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset Tanggal</span>
        </Button>
      )}
    </div>
  );
}
