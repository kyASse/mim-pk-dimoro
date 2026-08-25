"use client";

import { Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PendaftarDateFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onResetDates: () => void;
  className?: string;
}

export default function PendaftarDateFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onResetDates,
  className = "",
}: PendaftarDateFilterProps) {
  const hasDateFilter = Boolean(startDate || endDate);

  return (
    <div
      className={`flex items-center bg-background border border-input rounded-md shadow-2xs h-10 sm:h-9 divide-x divide-border/60 transition-colors focus-within:ring-1 focus-within:ring-ring focus-within:border-ring ${className}`}
    >
      {/* Segment 1: Dari */}
      <div className="flex-1 sm:flex-none flex items-center gap-1.5 px-2.5 min-w-0">
        <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="text-[11px] font-semibold text-muted-foreground shrink-0 hidden sm:inline">
          Dari:
        </span>
        <input
          type="date"
          aria-label="Tanggal Mulai"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="bg-transparent border-0 text-foreground text-xs focus:outline-none focus:ring-0 p-0 w-full cursor-pointer"
        />
      </div>

      {/* Segment 2: Sampai */}
      <div className="flex-1 sm:flex-none flex items-center gap-1.5 px-2.5 min-w-0">
        <span className="text-[11px] font-semibold text-muted-foreground shrink-0 hidden sm:inline">
          Sampai:
        </span>
        <input
          type="date"
          aria-label="Tanggal Selesai"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="bg-transparent border-0 text-foreground text-xs focus:outline-none focus:ring-0 p-0 w-full cursor-pointer"
        />
      </div>

      {/* Clear Button inside capsule */}
      {hasDateFilter && (
        <button
          type="button"
          onClick={onResetDates}
          className="px-2 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          title="Reset rentang tanggal"
          aria-label="Reset rentang tanggal"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
