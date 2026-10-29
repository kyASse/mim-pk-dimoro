"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, Plus, Trash2 } from "lucide-react";
import { formatRupiah, parseRupiah, type BiayaItemRow } from "../utils";

interface BiayaMobileCardListProps {
  items: BiayaItemRow[];
  onChange: (id: number, field: "komponen_biaya" | "biaya_putra" | "biaya_putri", value: any) => void;
  onCopyPutraToPutri: (id: number) => void;
  onAddItem: () => void;
  onDeleteItem: (id: number) => void;
}

export function BiayaMobileCardList({
  items,
  onChange,
  onCopyPutraToPutri,
  onAddItem,
  onDeleteItem,
}: BiayaMobileCardListProps) {
  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 p-6 text-center text-xs text-muted-foreground bg-card">
          Belum ada komponen biaya pendaftaran.
        </div>
      ) : (
        items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-xl border border-border/70 bg-card p-3.5 space-y-3 shadow-2xs"
          >
            {/* Header Row: Number + Editable Component Name + Delete Button */}
            <div className="flex items-center gap-2 border-b border-border/40 pb-2.5">
              <span className="text-xs font-semibold text-muted-foreground tabular-nums w-4 shrink-0">
                {index + 1}.
              </span>
              <div className="flex-1 min-w-0">
                <Input
                  type="text"
                  value={item.komponen_biaya || ""}
                  onChange={(e) =>
                    onChange(item.id, "komponen_biaya", e.target.value)
                  }
                  className="h-8 text-xs font-semibold bg-muted/20"
                  placeholder="Nama komponen (contoh: Biaya Pendaftaran)"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onDeleteItem(item.id)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 shrink-0"
                title="Hapus komponen ini"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
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
                    className="h-10 text-sm sm:h-9 sm:text-xs pl-8 font-medium tabular-nums"
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
                    className="h-10 text-sm sm:h-9 sm:text-xs pl-8 font-medium tabular-nums"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Mobile Add Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAddItem}
        className="w-full h-9 text-xs gap-1.5 border-dashed border-border/80 text-foreground hover:bg-muted/50"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>Tambah Komponen Biaya</span>
      </Button>
    </div>
  );
}
