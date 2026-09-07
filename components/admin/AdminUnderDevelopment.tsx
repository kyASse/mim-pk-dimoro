"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  AdminUnderDevelopmentProps,
  UnderDevStatus,
  UnderDevFeature,
} from "./under-development/types";
import { UnderDevBadge } from "./under-development/UnderDevBadge";
import { UnderDevProgress } from "./under-development/UnderDevProgress";
import { PlannedFeaturesGrid } from "./under-development/PlannedFeaturesGrid";
import { QuickFeedbackDialog } from "./under-development/QuickFeedbackDialog";

import { renderUnderDevIcon } from "./under-development/iconResolver";

// Re-export all under-development types for downstream consumers
export * from "./under-development/types";
export * from "./under-development/iconResolver";

export function AdminUnderDevelopment({
  title,
  description = "Fitur ini sedang dipersiapkan dan akan segera hadir untuk menyempurnakan sistem tata kelola madrasah MIM PK Dimoro.",
  category = "Modul Administrasi",
  status = "in_progress",
  progress = 45,
  estimatedRelease,
  icon,
  iconName,
  features,
  plannedFeatures,
  technicalNotes,
  architecturalNotes,
  showArchitecturalNotes = true,
  backUrl = "/admin",
  backLabel = "Kembali",
  showFeedbackDialog = true,
  onFeedbackSubmit,
  className,
  children,
}: AdminUnderDevelopmentProps) {
  // Support both `plannedFeatures` and `features` prop
  const resolvedFeatures: (string | UnderDevFeature)[] | undefined =
    plannedFeatures || features;

  // Support mapping technical notes to architectural highlight cards if needed
  const resolvedArchNotes = React.useMemo(() => {
    if (architecturalNotes && architecturalNotes.length > 0) {
      return architecturalNotes;
    }
    if (technicalNotes && technicalNotes.length > 0) {
      return technicalNotes.map((note) => ({
        title: note,
        description: "Spesifikasi arsitektur teknis dan kesiapan sistem madrasah.",
        tag: "Spesifikasi Teknis",
        badge: "Verified",
      }));
    }
    return undefined;
  }, [architecturalNotes, technicalNotes]);

  return (
    <div
      className={cn(
        "space-y-6 sm:space-y-8 max-w-6xl mx-auto pb-20 lg:pb-8",
        className
      )}
    >
      {/* Top Navigation & Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={backUrl}>
            <Button
              variant="outline"
              size="sm"
              className="h-10 text-sm sm:h-8 sm:text-xs gap-1.5 rounded-full px-3.5 border-border/80 hover:bg-muted font-medium transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{backLabel}</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-2xs sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2.5 py-1 rounded-md bg-muted/60 border border-border/40">
              {category}
            </span>
          </div>
        </div>

        {showFeedbackDialog && (
          <div className="hidden sm:block">
            <QuickFeedbackDialog
              moduleName={title}
              onSubmit={onFeedbackSubmit}
            />
          </div>
        )}
      </div>

      {/* Hero Container with Doppelrand (Double-Bezel Architecture) */}
      <div className="rounded-3xl p-1.5 sm:p-2 bg-gradient-to-b from-emerald-500/20 via-border/50 to-border/20 ring-1 ring-border/60 shadow-xs">
        <div className="rounded-[calc(1.5rem-0.25rem)] bg-card/95 backdrop-blur-md p-6 sm:p-8 border border-border/50 shadow-xs relative overflow-hidden space-y-6">
          {/* Subtle Ambient Radial Mesh Accent (School Emerald) */}
          <div className="absolute -right-24 -top-24 size-72 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl pointer-events-none" />

          {/* Header Row with Icon Island, Title, and Status Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="size-12 sm:size-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-xs">
                {renderUnderDevIcon(icon || iconName, "size-6 sm:size-7", Layers)}
              </div>
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {title}
                </h1>
                {description && (
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>

            <div className="shrink-0 self-start sm:self-center">
              <UnderDevBadge status={status as UnderDevStatus} size="md" />
            </div>
          </div>

          {/* Progress Telemetry */}
          <div className="pt-3 border-t border-border/40 relative z-10 space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
              <span className="text-muted-foreground">Kesiapan Modul</span>
              {estimatedRelease && (
                <span className="text-xs text-muted-foreground">
                  Target Rilis: <strong className="text-foreground font-semibold">{estimatedRelease}</strong>
                </span>
              )}
            </div>
            <UnderDevProgress
              value={progress}
              status={status as UnderDevStatus}
              showPercentage={true}
            />
          </div>
        </div>
      </div>

      {/* Planned Capabilities & System Information (Asymmetrical Bento) */}
      <PlannedFeaturesGrid
        features={resolvedFeatures}
        architecturalNotes={resolvedArchNotes}
        showArchitecturalNotes={showArchitecturalNotes}
      />

      {/* Optional Children Extensions */}
      {children && <div className="pt-2">{children}</div>}

      {/* Mobile Sticky Floating Bottom Action Dock (GEMINI.md Mobile Action Ergonomics) */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-background/90 backdrop-blur-lg border-t border-border lg:hidden z-40 flex items-center gap-2 shadow-lg">
        <Link href={backUrl} className="flex-1">
          <Button
            variant="outline"
            className="w-full h-10 text-sm sm:h-8 sm:text-xs gap-1.5 rounded-xl border-border font-medium"
          >
            <ArrowLeft className="size-4" />
            <span>{backLabel}</span>
          </Button>
        </Link>
        {showFeedbackDialog && (
          <div className="flex-1">
            <QuickFeedbackDialog
              moduleName={title}
              onSubmit={onFeedbackSubmit}
              trigger={
                <Button className="w-full h-10 text-sm sm:h-8 sm:text-xs gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-xs">
                  <Sparkles className="size-4" />
                  <span>Usulkan Fitur</span>
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUnderDevelopment;
