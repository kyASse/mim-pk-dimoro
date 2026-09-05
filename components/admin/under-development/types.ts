import type { ComponentType, ReactNode } from "react";

/**
 * Status of a module or feature currently under development
 */
export type UnderDevStatus =
  | "planned"
  | "in_progress"
  | "beta"
  | "testing"
  | "completed"
  | "maintenance"
  | "coming_soon";

/**
 * Priority level for upcoming features
 */
export type UnderDevPriority = "low" | "medium" | "high" | "urgent";

/**
 * Development roadmap phase/milestone definition
 */
export interface UnderDevPhase {
  id?: string;
  title: string;
  description?: string;
  status: UnderDevStatus;
  progress?: number;
  estimatedCompletion?: string;
}

/**
 * Supported icon identifier names for safe serializable passing across Server/Client boundary
 */
export type UnderDevIconName =
  | "graduation-cap"
  | "book-open"
  | "layers"
  | "sparkles"
  | "shield"
  | "shield-check"
  | "wrench"
  | "hammer"
  | "file-text"
  | "file-spreadsheet"
  | "calendar"
  | "credit-card"
  | "trophy"
  | "user"
  | "users"
  | "lock"
  | "cpu"
  | "zap"
  | "qr-code"
  | "bar-chart"
  | "dollar-sign"
  | (string & {});

/**
 * Specific feature item planned or in development
 */
export interface UnderDevFeature {
  title: string;
  description?: string;
  icon?: ComponentType<{ className?: string }> | UnderDevIconName | ReactNode;
  status?: UnderDevStatus;
  eta?: string;
  tags?: string[];
  technicalNotes?: string | string[];
  highlights?: string[];
  category?: string;
  featured?: boolean;
  colSpan?: 1 | 2 | 3 | "1" | "2" | "3";
}

/**
 * Main configuration structure for the Under Development template
 */
export interface UnderDevConfig {
  title: string;
  description?: string;
  category?: string;
  status?: UnderDevStatus;
  progress?: number;
  estimatedRelease?: string;
  targetAudience?: string;
  features?: (string | UnderDevFeature)[];
  phases?: UnderDevPhase[];
  backUrl?: string;
  backLabel?: string;
  contactEmail?: string;
  className?: string;
  children?: ReactNode;
}

/**
 * Props for the UnderDevBadge component
 */
export interface UnderDevBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: UnderDevStatus | string;
  label?: string;
  variant?: "default" | "outline" | "secondary" | "subtle";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

/**
 * Props for the UnderDevProgress component
 */
export interface UnderDevProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  status?: UnderDevStatus;
  animated?: boolean;
  barClassName?: string;
}

/**
 * Architectural highlight item structure
 */
export interface ArchitecturalHighlight {
  title: string;
  description: string;
  tag?: string;
  badge?: string;
}

/**
 * Props for the PlannedFeaturesGrid component
 */
export interface PlannedFeaturesGridProps {
  features?: (string | UnderDevFeature)[];
  title?: string;
  subtitle?: string;
  showArchitecturalNotes?: boolean;
  architecturalNotes?: (string | ArchitecturalHighlight)[];
  className?: string;
}

/**
 * Payload submitted via QuickFeedbackDialog
 */
export interface FeedbackPayload {
  role: string;
  category: string;
  notes: string;
  priority: UnderDevPriority | string;
  moduleName?: string;
  userEmail?: string;
  timestamp?: string;
}

/**
 * Props for the QuickFeedbackDialog component
 */
export interface QuickFeedbackDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  moduleName?: string;
  defaultRole?: string;
  onSubmit?: (data: FeedbackPayload) => Promise<boolean | void> | void;
  onSuccess?: () => void;
  className?: string;
}

/**
 * Status aliases and planned feature types for compatibility
 */
export type DevelopmentStatus =
  | "planning"
  | "in_development"
  | "testing"
  | "polishing"
  | UnderDevStatus;

export type PlannedFeature = UnderDevFeature;

/**
 * Props for the AdminUnderDevelopment component
 */
export interface AdminUnderDevelopmentProps {
  title: string;
  description?: string;
  category?: string;
  status?: UnderDevStatus | DevelopmentStatus;
  progress?: number;
  estimatedRelease?: string;
  icon?: ComponentType<{ className?: string }> | UnderDevIconName | ReactNode;
  iconName?: UnderDevIconName;
  features?: (string | UnderDevFeature)[];
  plannedFeatures?: (string | UnderDevFeature)[];
  technicalNotes?: string[];
  architecturalNotes?: (string | ArchitecturalHighlight)[];
  showArchitecturalNotes?: boolean;
  backUrl?: string;
  backLabel?: string;
  showFeedbackDialog?: boolean;
  onFeedbackSubmit?: (data: FeedbackPayload) => Promise<boolean | void> | void;
  className?: string;
  children?: ReactNode;
}

