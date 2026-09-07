"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { type BiayaTotals } from "../utils";

interface BiayaStickyMobileDockProps {
  totals: BiayaTotals;
  isDirty: boolean;
  isPending: boolean;
  onSave: () => void;
}

export function BiayaStickyMobileDock({
  totals,
  isDirty,
  isPending,
  onSave,
}: BiayaStickyMobileDockProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-lg border-t border-border/80 p-3 lg:hidden shadow-lg safe-area-pb">
      <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
        {/* Live Total Summary */}
        <div className="flex flex-col text-[11px] leading-snug">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span>Putra:</span>
            <span className="font-semibold text-foreground tabular-nums">
              {totals.formattedTotalPutra}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span>Putri:</span>
            <span className="font-semibold text-foreground tabular-nums">
              {totals.formattedTotalPutri}
            </span>
          </div>
        </div>

        {/* 1-Tap Save Action */}
        <Button
          type="button"
          onClick={onSave}
          disabled={isPending || !isDirty}
          size="sm"
          className="h-9 px-4 text-xs font-semibold gap-1.5 shrink-0"
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
  );
}
