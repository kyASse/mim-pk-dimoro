"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { formatRupiah, parseRupiah, type BiayaItemRow } from "../utils";

interface BiayaMobileCardListProps {
  items: BiayaItemRow[];
  onChange: (id: number, field: "biaya_putra" | "biaya_putri", value: number) => void;
  onCopyPutraToPutri: (id: number) => void;
}

export function BiayaMobileCardList({
  items,
  onChange,
  onCopyPutraToPutri,
}: BiayaMobileCardListProps) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="rounded-xl border border-border/70 bg-card p-3.5 space-y-3 shadow-2xs"
        >
          {/* Header Row */}
          <div className="flex items-center gap-2 border-b border-border/40 pb-2">
            <span className="text-xs font-semibold text-muted-foreground tabular-nums w-4">
              {index + 1}.
            </span>
            <span className="text-xs font-semibold text-foreground leading-snug">
              {item.komponen_biaya || "Komponen Biaya"}
            </span>
          </div>

          {/* Input Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Putra */}
            <div className="space-y-1">
              <Label
                htmlFor={`m-putra-${item.id}`}
                className="text-[11px] font-medium text-muted-foreground"
              >
                Putra
              </Label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-muted-foreground/80 select-none pointer-events-none">
                  Rp
                </span>
                <Input
                  id={`m-putra-${item.id}`}
                  type="text"
                  inputMode="numeric"
                  value={formatRupiah(item.biaya_putra)}
                  onChange={(e) =>
                    onChange(item.id, "biaya_putra", parseRupiah(e.target.value))
                  }
                  className="h-9 text-xs pl-8 font-medium tabular-nums"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Putri */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor={`m-putri-${item.id}`}
                  className="text-[11px] font-medium text-muted-foreground"
                >
                  Putri
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onCopyPutraToPutri(item.id)}
                  className="h-5 px-1 text-[10px] text-muted-foreground hover:text-foreground gap-0.5"
                  title="Salin dari Putra"
                >
                  <Copy className="h-2.5 w-2.5" />
                  <span>Salin</span>
                </Button>
              </div>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-muted-foreground/80 select-none pointer-events-none">
                  Rp
                </span>
                <Input
                  id={`m-putri-${item.id}`}
                  type="text"
                  inputMode="numeric"
                  value={formatRupiah(item.biaya_putri)}
                  onChange={(e) =>
                    onChange(item.id, "biaya_putri", parseRupiah(e.target.value))
                  }
                  className="h-9 text-xs pl-8 font-medium tabular-nums"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
