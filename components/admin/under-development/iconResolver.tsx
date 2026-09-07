import * as React from "react";
import {
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
  Server,
  Smartphone,
  FileSpreadsheet,
  FileText,
  QrCode,
  CreditCard,
  GraduationCap,
  Lock,
  Cpu,
  Hammer,
  BookOpen,
  Wrench,
  User,
  Users,
  Calendar,
  DollarSign,
  Trophy,
  BarChart,
  Award,
  Clock,
  LucideIcon,
} from "lucide-react";

export const UNDER_DEV_ICON_MAP: Record<string, LucideIcon> = {
  "graduation-cap": GraduationCap,
  graduationcap: GraduationCap,
  "book-open": BookOpen,
  bookopen: BookOpen,
  book: BookOpen,
  layers: Layers,
  sparkles: Sparkles,
  "shield-check": ShieldCheck,
  shieldcheck: ShieldCheck,
  shield: ShieldCheck,
  zap: Zap,
  server: Server,
  smartphone: Smartphone,
  "file-spreadsheet": FileSpreadsheet,
  filespreadsheet: FileSpreadsheet,
  excel: FileSpreadsheet,
  "file-text": FileText,
  filetext: FileText,
  report: FileText,
  laporan: FileText,
  "qr-code": QrCode,
  qrcode: QrCode,
  "credit-card": CreditCard,
  creditcard: CreditCard,
  payment: CreditCard,
  "dollar-sign": DollarSign,
  dollarsign: DollarSign,
  biaya: DollarSign,
  spp: DollarSign,
  trophy: Trophy,
  prestasi: Trophy,
  award: Award,
  lock: Lock,
  security: Lock,
  cpu: Cpu,
  wrench: Wrench,
  tools: Wrench,
  tool: Wrench,
  hammer: Hammer,
  user: User,
  siswa: User,
  wali: User,
  users: Users,
  calendar: Calendar,
  jadwal: Calendar,
  "bar-chart": BarChart,
  barchart: BarChart,
  chart: BarChart,
  grafik: BarChart,
  clock: Clock,
};

/**
 * Resolves an icon prop safely across the React Server Component / Client Component boundary.
 * Accepts string names (e.g. "graduation-cap", "book-open"), React elements, or component functions.
 */
export function renderUnderDevIcon(
  icon?: React.ComponentType<{ className?: string }> | string | React.ReactNode,
  className = "size-6 sm:size-7",
  fallback: LucideIcon = Layers
): React.ReactNode {
  if (!icon) {
    const FallbackComp = fallback;
    return <FallbackComp className={className} />;
  }

  if (typeof icon === "string") {
    const normalized = icon.toLowerCase().trim().replace(/_/g, "-");
    const FoundIcon = UNDER_DEV_ICON_MAP[normalized] || fallback;
    return <FoundIcon className={className} />;
  }

  if (React.isValidElement(icon)) {
    return icon;
  }

  if (typeof icon === "function") {
    const CustomIcon = icon as React.ComponentType<{ className?: string }>;
    return <CustomIcon className={className} />;
  }

  // Handle ForwardRef exotic objects (Lucide icons in client-only context)
  if (typeof icon === "object" && icon !== null) {
    if ("$$typeof" in icon || "render" in icon) {
      const CustomIcon = icon as unknown as React.ComponentType<{ className?: string }>;
      return <CustomIcon className={className} />;
    }
  }

  const FallbackComp = fallback;
  return <FallbackComp className={className} />;
}
