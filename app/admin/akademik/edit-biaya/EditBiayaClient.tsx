"use client";

import React, { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Save, RotateCcw, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { updateBiayaAndSppAction } from "../actions";
import { calculateTotals, type BiayaItemRow } from "./utils";
import { BiayaMobileCardList } from "./components/BiayaMobileCardList";
import { BiayaDesktopTable } from "./components/BiayaDesktopTable";
import { SppEditorWithPreview } from "./components/SppEditorWithPreview";
import { BiayaStickyMobileDock } from "./components/BiayaStickyMobileDock";

interface EditBiayaClientProps {
  initialBiaya: BiayaItemRow[];
  initialCatatanSpp: string;
}

export default function EditBiayaClient({
  initialBiaya,
  initialCatatanSpp,
}: EditBiayaClientProps) {
  const [biayaItems, setBiayaItems] = useState<BiayaItemRow[]>(initialBiaya);
  const [catatanSpp, setCatatanSpp] = useState<string>(initialCatatanSpp || "");
  const [isPending, startTransition] = useTransition();

  // Snapshot for dirty tracking & reset
  const [savedSnapshot, setSavedSnapshot] = useState<{
    biaya: BiayaItemRow[];
    spp: string;
  }>({
    biaya: initialBiaya,
    spp: initialCatatanSpp || "",
  });

  // Calculate if form has unsaved changes
  const isDirty = useMemo(() => {
    if (catatanSpp !== savedSnapshot.spp) return true;
    if (biayaItems.length !== savedSnapshot.biaya.length) return true;

    for (let i = 0; i < biayaItems.length; i++) {
      const current = biayaItems[i];
      const saved = savedSnapshot.biaya[i];
      if (
        current.id !== saved.id ||
        (current.biaya_putra || 0) !== (saved.biaya_putra || 0) ||
        (current.biaya_putri || 0) !== (saved.biaya_putri || 0)
      ) {
        return true;
      }
    }
    return false;
  }, [biayaItems, catatanSpp, savedSnapshot]);

  // Live Totals
  const totals = useMemo(() => calculateTotals(biayaItems), [biayaItems]);

  const handleItemChange = (
    id: number,
    field: "biaya_putra" | "biaya_putri",
    value: number
  ) => {
    setBiayaItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleCopyPutraToPutri = (id: number) => {
    setBiayaItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, biaya_putri: item.biaya_putra || 0 }
          : item
      )
    );
    toast.info("Nominal putra disalin ke putri", { duration: 1500 });
  };

  const handleReset = () => {
    setBiayaItems(savedSnapshot.biaya);
    setCatatanSpp(savedSnapshot.spp);
    toast.info("Perubahan dibatalkan.");
  };

  const handleSave = () => {
    if (!isDirty) {
      toast.info("Tidak ada perubahan untuk disimpan.");
      return;
    }

    startTransition(async () => {
      const payload = {
        biaya: biayaItems.map((item) => ({
          id: item.id,
          biaya_putra: item.biaya_putra || 0,
          biaya_putri: item.biaya_putri || 0,
        })),
        catatanSpp,
      };

      const result = await updateBiayaAndSppAction(payload);
      if (result.success) {
        setSavedSnapshot({
          biaya: biayaItems,
          spp: catatanSpp,
        });
        toast.success(result.message);
      } else {
        toast.error(result.message || "Gagal menyimpan perubahan.");
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-28 lg:pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/akademik"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors -ml-1 py-1 px-1.5 rounded"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Akademik</span>
            </Link>
          </div>
          <div className="flex items-center gap-3 pt-0.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Edit Rincian Keuangan
            </h1>
            {isDirty ? (
              <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 text-[11px] font-medium"
              >
                Belum Disimpan
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 text-[11px] font-medium inline-flex items-center gap-1"
              >
                <Check className="h-3 w-3" />
                Tersimpan
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Perbarui tabel nominal biaya pendaftaran santri baru dan catatan SPP bulanan.
          </p>
        </div>

        {/* Desktop Primary Save Actions */}
        <div className="hidden lg:flex items-center gap-2.5">
          {isDirty && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isPending}
              className="h-8 px-3 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Batalkan
            </Button>
          )}
          <Button
            type="button"
            onClick={handleSave}
            disabled={isPending || !isDirty}
            size="sm"
            className="h-8 px-4 text-xs font-semibold gap-1.5"
          >
            {isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Section (8 Cols): Fee Components */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Tabel Biaya Pendaftaran
                </h2>
                <p className="text-xs text-muted-foreground">
                  Nominal berlaku untuk pendaftar tahun ajaran aktif.
                </p>
              </div>
            </div>

            {/* Mobile View: Clean Card Stream (< lg) */}
            <div className="block lg:hidden">
              <BiayaMobileCardList
                items={biayaItems}
                onChange={handleItemChange}
                onCopyPutraToPutri={handleCopyPutraToPutri}
              />
            </div>

            {/* Desktop View: Clean Financial Table (≥ lg) */}
            <div className="hidden lg:block">
              <BiayaDesktopTable
                items={biayaItems}
                onChange={handleItemChange}
                onCopyPutraToPutri={handleCopyPutraToPutri}
              />
            </div>
          </div>

          {/* SPP Editor Section on Mobile (< lg) */}
          <div className="block lg:hidden pt-2 border-t border-border/60">
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-foreground">
                Catatan SPP Bulanan
              </h2>
              <p className="text-xs text-muted-foreground">
                Penjelasan tambahan mengenai pembiayaan SPP yang tampil di portal pendaftaran.
              </p>
            </div>
            <SppEditorWithPreview
              value={catatanSpp}
              onChange={setCatatanSpp}
            />
          </div>
        </div>

        {/* Right Section (4 Cols): Sticky Inspector on Desktop (≥ lg) */}
        <div className="hidden lg:block lg:col-span-4 space-y-5 sticky top-6">
          {/* Summary Panel */}
          <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Total Akumulasi
              </h3>
              {totals.diff !== 0 && (
                <span className="text-[11px] font-medium text-muted-foreground">
                  Selisih: {totals.formattedDiff}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-muted/40 text-xs">
                <span className="font-medium text-muted-foreground">Total Putra</span>
                <span className="font-semibold text-foreground tabular-nums">
                  {totals.formattedTotalPutra}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-muted/40 text-xs">
                <span className="font-medium text-muted-foreground">Total Putri</span>
                <span className="font-semibold text-foreground tabular-nums">
                  {totals.formattedTotalPutri}
                </span>
              </div>
            </div>
          </div>

          {/* SPP Editor Panel for Desktop */}
          <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3.5 shadow-2xs">
            <div className="border-b border-border/40 pb-2.5">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Catatan SPP Bulanan
              </h3>
            </div>
            <SppEditorWithPreview
              value={catatanSpp}
              onChange={setCatatanSpp}
            />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Dock on Mobile (< lg) */}
      <BiayaStickyMobileDock
        totals={totals}
        isDirty={isDirty}
        isPending={isPending}
        onSave={handleSave}
      />
    </div>
  );
}
