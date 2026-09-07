"use client";

import * as React from "react";
import {
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
  Server,
  Smartphone,
  FileSpreadsheet,
  QrCode,
  CreditCard,
  GraduationCap,
  Lock,
  Cpu,
  CheckCircle2,
  Clock,
  Hammer,
  HelpCircle,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UnderDevBadge } from "./UnderDevBadge";
import type {
  PlannedFeaturesGridProps,
  UnderDevFeature,
  UnderDevStatus,
  ArchitecturalHighlight,
} from "./types";

import { renderUnderDevIcon } from "./iconResolver";

const defaultPlannedFeatures: UnderDevFeature[] = [
  {
    title: "Integrasi Nilai & E-Rapor Kurikulum Merdeka",
    description:
      "Perhitungan bobot nilai TP/LM otomatis, deskripsi capaian pembelajaran dinamis, dan cetak e-rapor siap edar format resmi.",
    status: "in_progress",
    eta: "Q4 2026",
    tags: ["Akademik", "Kurikulum Merdeka", "E-Rapor"],
    technicalNotes:
      "Arsitektur Server Action Next.js 15 dengan query batching Supabase Postgres untuk render ratusan halaman dalam hitungan detik.",
    highlights: ["Kalkulasi Otomatis TP/LM", "Export PDF Siap Cetak", "Multi-Akses Guru"],
    featured: true,
    colSpan: 2,
    icon: GraduationCap,
  },
  {
    title: "Manajemen SPP & Gerbang Pembayaran Otomatis",
    description:
      "Pencatatan tagihan SPP, infaq bulanan, tabungan siswa, dan rekonsiliasi arus kas bendahara terpadu.",
    status: "planned",
    eta: "Q1 2027",
    tags: ["Keuangan", "SPP", "Arus Kas"],
    technicalNotes:
      "Pencatatan transaksi dengan skema double-entry ledger dan pencegahan race condition saat verifikasi mutasi.",
    highlights: ["Rekap Harian Bendahara", "Kuitansi Digital"],
    featured: false,
    icon: CreditCard,
  },
  {
    title: "Presensi Digital Siswa & Notifikasi WhatsApp",
    description:
      "Pencatatan kehadiran harian berbasis QR code dengan notifikasi otomatis ke WhatsApp orang tua/wali murid.",
    status: "planned",
    eta: "Q2 2027",
    tags: ["Kesiswaan", "Presensi", "WhatsApp"],
    technicalNotes:
      "Antrian pengiriman pesan asinkronus (message queue) dengan rate-limiting untuk menjaga keandalan nomor WhatsApp sekolah.",
    highlights: ["Scan QR Cepat", "Notifikasi Orang Tua"],
    featured: false,
    icon: QrCode,
  },
  {
    title: "Audit Trail & Keamanan Berkas Dokumen",
    description:
      "Pencatatan riwayat setiap aksi administratif dan proteksi berkas sensitif pendaftar/siswa.",
    status: "completed",
    eta: "Siap Digunakan",
    tags: ["Keamanan", "RLS", "Audit Log"],
    technicalNotes:
      "Row Level Security (RLS) terisolasi per peran pengguna dengan verifikasi integritas berkas di Supabase Storage.",
    highlights: ["Logging Perubahan Status", "Enkripsi Metadata"],
    featured: false,
    icon: Lock,
  },
  {
    title: "Pusat Rekapitulasi Data & Cetak Laporan Eksekutif",
    description:
      "Dashboard analitik dengan export data multi-format (Excel/CSV/PDF) untuk rapat evaluasi komite dan pimpinan madrasah.",
    status: "completed",
    eta: "Siap Digunakan",
    tags: ["Laporan", "Eksekutif", "Excel"],
    technicalNotes:
      "Optimasi template cetak CSS Print Media Query (F4/A4) standar birokrasi madrasah bebas pergeseran margin.",
    highlights: ["Export Multi-Sheet", "Format Siap Cetak"],
    featured: false,
    icon: FileSpreadsheet,
  },
];

const defaultArchitecturalHighlights: ArchitecturalHighlight[] = [
  {
    title: "Next.js 15 Server-First Architecture",
    description:
      "Komponen data-heavy diolah di sisi server untuk waktu muat instan tanpa waterfall di jaringan internet lambat.",
    tag: "Next.js 15 App Router",
    badge: "High Performance",
  },
  {
    title: "Supabase Row-Level Security (RLS)",
    description:
      "Hak akses data diisolasi secara ketat pada level basis data Postgres sesuai peran (Kepala Madrasah, Guru, Admin TU, Bendahara).",
    tag: "PostgreSQL & RLS",
    badge: "Zero Trust Security",
  },
  {
    title: "Mobile-First Touch Ergonomics",
    description:
      "Semua tombol aksi dan kontrol input dirancang dengan standar target sentuh minimal 40px serta sticky action dock di perangkat smartphone.",
    tag: "Tailwind CSS & UX",
    badge: "Ergonomic Standard",
  },
];

function getStatusBadgeProps(status?: UnderDevStatus): {
  status: UnderDevStatus;
  label: string;
} {
  switch (status) {
    case "completed":
      return { status: "completed", label: "Siap" };
    case "in_progress":
      return { status: "in_progress", label: "Sedang Dikerjakan" };
    case "planned":
      return { status: "planned", label: "Direncanakan" };
    case "beta":
      return { status: "beta", label: "Versi Beta" };
    case "testing":
      return { status: "testing", label: "Tahap Pengujian" };
    case "maintenance":
      return { status: "maintenance", label: "Pemeliharaan" };
    case "coming_soon":
      return { status: "coming_soon", label: "Segera Hadir" };
    default:
      return { status: "planned", label: "Direncanakan" };
  }
}

export function PlannedFeaturesGrid({
  features,
  title = "Rencana Kemampuan & Fitur Mendatang",
  subtitle = "Peta jalan pengembangan fitur terencana untuk digitalisasi tata kelola madrasah MIM PK Dimoro",
  showArchitecturalNotes = true,
  architecturalNotes = defaultArchitecturalHighlights,
  className,
}: PlannedFeaturesGridProps) {
  const items: UnderDevFeature[] = React.useMemo(() => {
    if (!features || features.length === 0) {
      return defaultPlannedFeatures;
    }
    return features.map((item) => {
      if (typeof item === "string") {
        return {
          title: item,
          description: "Kemampuan tambahan yang dirancang dalam siklus pembaruan modul.",
          status: "planned",
          tags: ["Fitur Tambahan"],
        };
      }
      return item;
    });
  }, [features]);

  const archItems: ArchitecturalHighlight[] = React.useMemo(() => {
    return architecturalNotes.map((note) => {
      if (typeof note === "string") {
        return {
          title: note,
          description: "Standar arsitektur teknis sistem manajemen MIM PK Dimoro.",
          tag: "Arsitektur Sistem",
        };
      }
      return note;
    });
  }, [architecturalNotes]);

  return (
    <div className={cn("space-y-6 sm:space-y-8", className)}>
      {/* Header Section */}
      <div className="flex flex-col gap-1.5 sm:gap-2">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          <Sparkles className="h-4 w-4" />
          <span>Roadmap & Kemampuan Terencana</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Asymmetrical 2+1 Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {items.map((feature, idx) => {
          const isFeatured = feature.featured || feature.colSpan === 2 || feature.colSpan === "2";
          const badgeConfig = getStatusBadgeProps(feature.status);

          return (
            <div
              key={`${feature.title}-${idx}`}
              className={cn(
                "group relative flex flex-col justify-between rounded-xl border bg-card/90 p-5 sm:p-6 transition-all duration-200 hover:shadow-md hover:border-emerald-500/40 dark:hover:border-emerald-500/30",
                "border-border/80 dark:border-slate-800/90 dark:bg-slate-900/60 shadow-xs",
                isFeatured && "md:col-span-2 lg:col-span-2 bg-gradient-to-br from-card via-card to-emerald-500/[0.03] dark:to-emerald-950/[0.08]"
              )}
            >
              <div className="space-y-4">
                {/* Header with Icon, Title, and Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-500/20">
                      {renderUnderDevIcon(feature.icon, "h-5 w-5", Layers)}
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {feature.title}
                      </h4>
                      {feature.eta && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          <Clock className="h-3 w-3" />
                          <span>Target: {feature.eta}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <UnderDevBadge
                    status={badgeConfig.status}
                    label={badgeConfig.label}
                    size="sm"
                    className="shrink-0 font-medium"
                  />
                </div>

                {/* Description */}
                {feature.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                )}

                {/* Highlights List */}
                {feature.highlights && feature.highlights.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Keunggulan Utama:</span>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-1">
                      {feature.highlights.map((highlight, hIdx) => (
                        <li
                          key={hIdx}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technical Notes */}
                {feature.technicalNotes && (
                  <div className="rounded-lg border border-border/60 bg-muted/40 p-3 text-xs dark:bg-slate-800/40 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 font-semibold text-foreground/90 mb-1">
                      <Cpu className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Catatan Arsitektur & Teknis:</span>
                    </div>
                    <div className="text-muted-foreground leading-relaxed">
                      {Array.isArray(feature.technicalNotes) ? (
                        <ul className="list-disc list-inside space-y-0.5">
                          {feature.technicalNotes.map((note, nIdx) => (
                            <li key={nIdx}>{note}</li>
                          ))}
                        </ul>
                      ) : (
                        <span>{feature.technicalNotes}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Tags Footer */}
              {feature.tags && feature.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-4 mt-2 border-t border-border/50">
                  {feature.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="inline-flex items-center rounded-md bg-muted/60 px-2 py-0.5 text-2xs sm:text-xs font-medium text-muted-foreground border border-border/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Architectural Highlights Banner / Bento section */}
      {showArchitecturalNotes && archItems.length > 0 && (
        <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.02] dark:bg-emerald-950/[0.1] p-5 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-emerald-500/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-foreground">
                  Sorotan Arsitektur & Keamanan
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Fondasi rekayasa perangkat lunak untuk performa tinggi, keamanan data, dan kemudahan operasional madrasah.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {archItems.map((arch, aIdx) => (
              <div
                key={aIdx}
                className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 space-y-2 dark:bg-slate-900/80 shadow-2xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-2xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      {arch.tag || "Arsitektur"}
                    </span>
                    {arch.badge && (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-2xs font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50">
                        {arch.badge}
                      </span>
                    )}
                  </div>
                  <h5 className="text-sm font-bold text-foreground leading-snug">
                    {arch.title}
                  </h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {arch.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlannedFeaturesGrid;
