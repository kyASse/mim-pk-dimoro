import React from "react";
import { AdminUnderDevelopment } from "@/components/admin/AdminUnderDevelopment";

export default function TemplateDevShowcasePage() {
  return (
    <AdminUnderDevelopment
      title="Template Halaman Admin (Under Development)"
      description="Halaman percontohan dan standar arsitektur visual untuk semua modul admin yang masih dalam tahap perancangan atau pengembangan di MIM PK Dimoro."
      category="Dokumentasi & Standar UI"
      status="in_development"
      progress={60}
      estimatedRelease="Q2 2026"
      icon="sparkles"
      plannedFeatures={[
        {
          title: "Doppelrand Double-Bezel Architecture",
          description: "Wadah luar ber-ring halus membungkus inner core dengan backdrop-blur dan glow emerald madrasah.",
          status: "completed",
          tags: ["UI/UX", "High-End"],
        },
        {
          title: "Dynamic Telemetry & Milestone Tracker",
          description: "Visualisasi persentase kesiapan modul dan fase rilis yang responsif.",
          status: "completed",
          tags: ["Telemetry", "Progress"],
        },
        {
          title: "Asymmetrical Bento Grid",
          description: "Kartu rencana kapabilitas modular dengan icon badge status yang tegas.",
          status: "completed",
          tags: ["Bento", "Layout"],
        },
        {
          title: "Quick Feedback & User Voice Modal",
          description: "Dialog pengusulan kebutuhan fitur langsung dari guru, staf, dan pengelola madrasah.",
          status: "completed",
          tags: ["Feedback", "Dialog"],
        },
        {
          title: "Mobile Action Ergonomics Dock",
          description: "Dock melayang di bagian bawah layar mobile (fixed bottom-0) dengan target sentuh aman.",
          status: "completed",
          tags: ["Mobile", "A11y"],
        },
        {
          title: "Preset Status Switcher",
          description: "Dukungan status fleksibel: planning, in_development, testing, polishing, dan completed.",
          status: "in_progress",
          tags: ["Props", "Customizable"],
        },
      ]}
      technicalNotes={[
        "Dibuat dengan Next.js 15 Client Component, strict TypeScript, dan zero 'any'",
        "Kompatibel penuh dengan Dark Mode dan Light Mode (Next-Themes + Tailwind)",
        "Mematuhi aturan GEMINI.md untuk touch target minimal 40px (h-10 text-sm sm:h-8 sm:text-xs)",
        "Dapat di-drop ke sub-rute admin manapun cukup dengan memanggil <AdminUnderDevelopment />",
      ]}
    />
  );
}
