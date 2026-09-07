"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SppEditorWithPreviewProps {
  value: string;
  onChange: (val: string) => void;
}

export function SppEditorWithPreview({ value, onChange }: SppEditorWithPreviewProps) {
  return (
    <div className="space-y-3.5">
      {/* Editor Section */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="catatan-spp" className="text-xs font-medium text-foreground">
            Isi Catatan
          </Label>
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {value.length} karakter
          </span>
        </div>
        <Textarea
          id="catatan-spp"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Tuliskan keterangan mengenai SPP, makan siang, seragam, dll..."
          className="min-h-[110px] text-xs leading-relaxed resize-y font-normal"
        />
      </div>

      {/* Live Preview Card */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-medium text-muted-foreground">
          Pratinjau di Halaman Publik
        </span>
        <div className="rounded-lg border border-border/70 bg-muted/30 p-3 text-xs text-foreground/90 leading-relaxed shadow-2xs">
          <p className="whitespace-pre-wrap">
            {value.trim() || <span className="italic text-muted-foreground">(Belum ada catatan)</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
