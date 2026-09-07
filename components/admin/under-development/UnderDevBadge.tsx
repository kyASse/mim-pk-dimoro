import * as React from "react";
import {
  Clock,
  Hammer,
  Sparkles,
  FlaskConical,
  CheckCircle2,
  Wrench,
  Rocket,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UnderDevBadgeProps, UnderDevStatus } from "./types";

interface StatusConfig {
  label: string;
  className: string;
  icon: React.ComponentType<{ className?: string }>;
}

const statusConfigurations: Record<UnderDevStatus, StatusConfig> = {
  planned: {
    label: "Direncanakan",
    className:
      "bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800/70 dark:text-slate-300 dark:border-slate-700",
    icon: Clock,
  },
  in_progress: {
    label: "Dalam Pengerjaan",
    className:
      "bg-amber-50 text-amber-800 border-amber-200/90 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/70",
    icon: Hammer,
  },
  beta: {
    label: "Versi Beta",
    className:
      "bg-purple-50 text-purple-800 border-purple-200/90 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/70",
    icon: Sparkles,
  },
  testing: {
    label: "Tahap Pengujian",
    className:
      "bg-blue-50 text-blue-800 border-blue-200/90 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/70",
    icon: FlaskConical,
  },
  completed: {
    label: "Selesai",
    className:
      "bg-emerald-50 text-emerald-800 border-emerald-200/90 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/70",
    icon: CheckCircle2,
  },
  maintenance: {
    label: "Pemeliharaan",
    className:
      "bg-rose-50 text-rose-800 border-rose-200/90 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/70",
    icon: Wrench,
  },
  coming_soon: {
    label: "Segera Hadir",
    className:
      "bg-sky-50 text-sky-800 border-sky-200/90 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/70",
    icon: Rocket,
  },
};

const fallbackConfig: StatusConfig = {
  label: "Pengembangan",
  className:
    "bg-muted text-muted-foreground border-border dark:bg-slate-800 dark:text-slate-300",
  icon: Info,
};

const sizeClasses = {
  sm: "text-xs px-2 py-0.5 gap-1 font-medium",
  md: "text-xs sm:text-sm px-2.5 py-1 gap-1.5 font-medium",
  lg: "text-sm px-3.5 py-1.5 gap-2 font-semibold",
};

const iconSizes = {
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
  lg: "h-4 w-4",
};

export function UnderDevBadge({
  status = "in_progress",
  label,
  size = "md",
  showIcon = true,
  className,
  ...props
}: UnderDevBadgeProps) {
  const config =
    (status in statusConfigurations
      ? statusConfigurations[status as UnderDevStatus]
      : null) || fallbackConfig;

  const displayLabel = label || config.label;
  const IconComponent = config.icon;

  return (
    <span
      role="status"
      className={cn(
        "inline-flex items-center rounded-full border transition-colors shadow-xs select-none",
        sizeClasses[size] || sizeClasses.md,
        config.className,
        className
      )}
      {...props}
    >
      {showIcon && (
        <IconComponent
          className={cn("shrink-0", iconSizes[size] || iconSizes.md)}
          aria-hidden="true"
        />
      )}
      <span>{displayLabel}</span>
    </span>
  );
}

export default UnderDevBadge;
