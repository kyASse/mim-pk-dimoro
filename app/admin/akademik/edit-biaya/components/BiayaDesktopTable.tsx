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
import { Copy } from "lucide-react";
import { formatRupiah, parseRupiah, calculateTotals, type BiayaItemRow } from "../utils";

interface BiayaDesktopTableProps {
  items: BiayaItemRow[];
  onChange: (id: number, field: "biaya_putra" | "biaya_putri", value: number) => void;
  onCopyPutraToPutri: (id: number) => void;
}

export function BiayaDesktopTable({
  items,
  onChange,
  onCopyPutraToPutri,
}: BiayaDesktopTableProps) {
  const totals = calculateTotals(items);

  return (
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
            <TableHead className="w-[200px] text-xs font-medium text-muted-foreground">
              Putra (Rp)
            </TableHead>
            <TableHead className="w-[230px] text-xs font-medium text-muted-foreground">
              Putri (Rp)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow
              key={item.id}
              className="hover:bg-muted/20 transition-colors border-b border-border/40"
            >
              <TableCell className="text-center text-xs font-medium text-muted-foreground tabular-nums">
                {index + 1}
              </TableCell>
              <TableCell className="font-medium text-xs sm:text-sm text-foreground">
                {item.komponen_biaya || "Komponen Biaya"}
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
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="bg-muted/30 border-t border-border/70 font-semibold">
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={2} className="text-right text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Total Akumulasi
            </TableCell>
            <TableCell className="text-xs sm:text-sm font-semibold text-foreground tabular-nums">
              {totals.formattedTotalPutra}
            </TableCell>
            <TableCell className="text-xs sm:text-sm font-semibold text-foreground tabular-nums">
              {totals.formattedTotalPutri}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
