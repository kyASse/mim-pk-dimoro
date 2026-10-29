"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Plus, Trash2 } from "lucide-react";
import { formatRupiah, parseRupiah, calculateTotals, type BiayaItemRow } from "../utils";

interface BiayaDesktopTableProps {
  items: BiayaItemRow[];
  onChange: (id: number, field: "komponen_biaya" | "biaya_putra" | "biaya_putri", value: any) => void;
  onCopyPutraToPutri: (id: number) => void;
  onAddItem: () => void;
  onDeleteItem: (id: number) => void;
}

export function BiayaDesktopTable({
  items,
  onChange,
  onCopyPutraToPutri,
  onAddItem,
  onDeleteItem,
}: BiayaDesktopTableProps) {
  const totals = calculateTotals(items);

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border/80 overflow-hidden bg-card shadow-2xs">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent border-b border-border/60">
              <TableHead className="w-12 text-center text-xs font-medium text-muted-foreground">
                No
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground min-w-[220px]">
                Komponen Biaya
              </TableHead>
              <TableHead className="w-[180px] text-xs font-medium text-muted-foreground">
                Putra (Rp)
              </TableHead>
              <TableHead className="w-[210px] text-xs font-medium text-muted-foreground">
                Putri (Rp)
              </TableHead>
              <TableHead className="w-12 text-center text-xs font-medium text-muted-foreground">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs">
                  Belum ada komponen biaya pendaftaran. Klik tombol di bawah untuk menambahkan.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-muted/20 transition-colors border-b border-border/40"
                >
                  <TableCell className="text-center text-xs font-medium text-muted-foreground tabular-nums">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={item.komponen_biaya || ""}
                      onChange={(e) =>
                        onChange(item.id, "komponen_biaya", e.target.value)
                      }
                      className="h-8 text-xs font-medium"
                      placeholder="Nama komponen (contoh: Biaya Pendaftaran)"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground select-none pointer-events-none">
                        Rp
                      </span>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={formatRupiah(item.biaya_putra)}
                        onChange={(e) =>
                          onChange(item.id, "biaya_putra", parseRupiah(e.target.value))
                        }
                        className="h-8 text-xs pl-8 font-medium tabular-nums"
                        placeholder="0"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground select-none pointer-events-none">
                          Rp
                        </span>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={formatRupiah(item.biaya_putri)}
                          onChange={(e) =>
                            onChange(item.id, "biaya_putri", parseRupiah(e.target.value))
                          }
                          className="h-8 text-xs pl-8 font-medium tabular-nums"
                          placeholder="0"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onCopyPutraToPutri(item.id)}
                        className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground shrink-0 gap-1"
                        title="Salin nominal Putra ke Putri"
                      >
                        <Copy className="h-3 w-3" />
                        <span className="text-[11px]">Salin</span>
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteItem(item.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-500/10"
                      title="Hapus komponen ini"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter className="bg-muted/30 border-t border-border/70 font-semibold">
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={2} className="text-right text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Total Akumulasi
              </TableCell>
              <TableCell className="text-xs sm:text-sm font-semibold text-foreground tabular-nums">
                {totals.formattedTotalPutra}
              </TableCell>
              <TableCell colSpan={2} className="text-xs sm:text-sm font-semibold text-foreground tabular-nums">
                {totals.formattedTotalPutri}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <div className="flex justify-start">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddItem}
          className="h-8 px-3 text-xs gap-1.5 border-dashed border-border/80 text-foreground hover:bg-muted/50"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Tambah Komponen Biaya</span>
        </Button>
      </div>
    </div>
  );
}
