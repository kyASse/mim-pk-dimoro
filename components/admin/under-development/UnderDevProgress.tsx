import * as React from "react";
import { cn } from "@/lib/utils";
import type { UnderDevProgressProps, UnderDevStatus } from "./types";

const sizeTrackHeights = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

const statusIndicatorColors: Record<UnderDevStatus, string> = {
  planned: "bg-slate-500 dark:bg-slate-400",
  in_progress: "bg-amber-500 dark:bg-amber-400",
  beta: "bg-purple-500 dark:bg-purple-400",
  testing: "bg-blue-500 dark:bg-blue-400",
  completed: "bg-emerald-500 dark:bg-emerald-400",
  maintenance: "bg-rose-500 dark:bg-rose-400",
  coming_soon: "bg-sky-500 dark:bg-sky-400",
};

const defaultIndicatorColor = "bg-emerald-600 dark:bg-emerald-500";

export function UnderDevProgress({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = "md",
  status,
  animated = false,
  barClassName,
  className,
  ...props
}: UnderDevProgressProps) {
  const safeMax = max > 0 ? max : 100;
  const rawPercentage = max > 0 ? (value / safeMax) * 100 : 0;
  const clampedPercentage = Math.min(
    100,
    Math.max(0, isNaN(rawPercentage) ? 0 : rawPercentage)
  );
  const roundedPercentage = Math.round(clampedPercentage);

  const statusColor =
    status && status in statusIndicatorColors
      ? statusIndicatorColors[status as UnderDevStatus]
      : defaultIndicatorColor;

  return (
    <div className={cn("w-full space-y-1.5", className)} {...props}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs sm:text-sm">
          {label ? (
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {label}
            </span>
          ) : (
            <span />
          )}
          {showPercentage && (
            <span className="font-semibold text-slate-600 dark:text-slate-400 tabular-nums">
              {roundedPercentage}%
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || "Progress pengembangan"}
        className={cn(
          "w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60",
          sizeTrackHeights[size] || sizeTrackHeights.md
        )}
      >
        <div
          data-testid="progress-indicator"
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            statusColor,
            animated && "animate-pulse",
            barClassName
          )}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
}

export default UnderDevProgress;
