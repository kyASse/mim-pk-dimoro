import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { PlannedFeaturesGrid } from "../under-development/PlannedFeaturesGrid";
import { QuickFeedbackDialog } from "../under-development/QuickFeedbackDialog";
import type { UnderDevFeature } from "../under-development/types";
import { Layers, ShieldCheck } from "lucide-react";

describe("PlannedFeaturesGrid Component", () => {
  const customFeatures: UnderDevFeature[] = [
    {
      title: "Integrasi E-Rapor",
      description: "Sinkronisasi nilai otomatis dengan kurikulum nasional.",
      status: "in_progress",
      eta: "Q4 2026",
      tags: ["Akademik", "Rapor"],
      technicalNotes: "Menggunakan Server Actions dan batching PostgreSQL.",
      highlights: ["Export PDF Cepat", "Validasi Multi-Guru"],
      featured: true,
      icon: Layers,
    },
    {
      title: "Audit Keamanan Dokumen",
      description: "Pemeriksaan integritas dan enkripsi berkas pendaftaran.",
      status: "completed",
      tags: ["Keamanan", "RLS"],
      technicalNotes: "Row Level Security terisolasi per role pengguna.",
      icon: ShieldCheck,
    },
    {
      title: "Notifikasi Presensi WhatsApp",
      description: "Kirim pesan otomatis saat siswa hadir atau izin.",
      status: "planned",
      eta: "Q1 2027",
      tags: ["Presensi", "WhatsApp"],
    },
  ];

  it("renders default planned features when no features prop is provided", () => {
    render(<PlannedFeaturesGrid />);
    expect(screen.getByText(/Rencana Kemampuan & Fitur/i)).toBeDefined();
    // Verify default features are shown
    expect(screen.getByText(/Integrasi Nilai & E-Rapor/i)).toBeDefined();
    expect(screen.getByText(/Manajemen SPP & Gerbang Pembayaran/i)).toBeDefined();
  });

  it("renders custom features with appropriate status badges", () => {
    render(<PlannedFeaturesGrid features={customFeatures} />);

    expect(screen.getByText("Integrasi E-Rapor")).toBeDefined();
    expect(screen.getByText("Audit Keamanan Dokumen")).toBeDefined();
    expect(screen.getByText("Notifikasi Presensi WhatsApp")).toBeDefined();

    // Badges requirement: completed = Siap, in_progress = Sedang Dikerjakan, planned = Direncanakan
    expect(screen.getByText("Sedang Dikerjakan")).toBeDefined();
    expect(screen.getByText("Siap")).toBeDefined();
    expect(screen.getByText("Direncanakan")).toBeDefined();
  });

  it("renders technical notes and architectural highlights", () => {
    render(<PlannedFeaturesGrid features={customFeatures} showArchitecturalNotes={true} />);

    // Verify technical notes inside feature cards
    expect(screen.getByText(/Server Actions dan batching PostgreSQL/i)).toBeDefined();
    expect(screen.getByText(/Row Level Security terisolasi/i)).toBeDefined();

    // Verify highlights
    expect(screen.getByText("Export PDF Cepat")).toBeDefined();
    expect(screen.getByText("Validasi Multi-Guru")).toBeDefined();

    // Verify Architectural Highlights section
    expect(screen.getByText(/Sorotan Arsitektur & Keamanan/i)).toBeDefined();
  });

  it("hides architectural highlights section when showArchitecturalNotes is false", () => {
    render(<PlannedFeaturesGrid features={customFeatures} showArchitecturalNotes={false} />);
    expect(screen.queryByText(/Sorotan Arsitektur & Keamanan/i)).toBeNull();
  });

  it("handles string features gracefully", () => {
    const stringFeatures = [
      "Fitur Notifikasi SMS Gateway",
      "Export Data Excel Multi-Sheet",
    ];
    render(<PlannedFeaturesGrid features={stringFeatures} />);
    expect(screen.getByText("Fitur Notifikasi SMS Gateway")).toBeDefined();
    expect(screen.getByText("Export Data Excel Multi-Sheet")).toBeDefined();
  });

  it("applies asymmetrical 2+1 grid classes on desktop", () => {
    const { container } = render(<PlannedFeaturesGrid features={customFeatures} />);
    const grid = container.querySelector(".lg\\:grid-cols-3, [class*='lg:grid-cols-3']");
    expect(grid).toBeDefined();
    expect(grid).not.toBeNull();
  });

  it("renders custom title and subtitle when provided", () => {
    render(
      <PlannedFeaturesGrid
        title="Roadmap Modul Keuangan"
        subtitle="Daftar kemampuan yang sedang dipersiapkan untuk bendahara"
      />
    );
    expect(screen.getByText("Roadmap Modul Keuangan")).toBeDefined();
    expect(
      screen.getByText("Daftar kemampuan yang sedang dipersiapkan untuk bendahara")
    ).toBeDefined();
  });
});

describe("QuickFeedbackDialog Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders trigger button and opens dialog on click", () => {
    render(<QuickFeedbackDialog moduleName="Modul Akademik" />);

    const triggerBtn = screen.getByRole("button", {
      name: /Beri Masukan|Usulan Fitur/i,
    });
    expect(triggerBtn).toBeDefined();

    fireEvent.click(triggerBtn);
    expect(screen.getByText(/Beri Masukan & Usulan Fitur/i)).toBeDefined();
    expect(screen.getByText(/Modul Akademik/i)).toBeDefined();
  });

  it("renders controlled dialog when open is true", () => {
    render(
      <QuickFeedbackDialog
        open={true}
        onOpenChange={vi.fn()}
        moduleName="Modul Keuangan"
      />
    );

    expect(screen.getByText(/Beri Masukan & Usulan Fitur/i)).toBeDefined();
    expect(screen.getByText(/Modul Keuangan/i)).toBeDefined();
  });

  it("validates empty notes and prevents submission without input", async () => {
    const mockSubmit = vi.fn();
    render(<QuickFeedbackDialog open={true} onSubmit={mockSubmit} />);

    const submitBtn = screen.getByRole("button", { name: /Kirim Masukan/i });
    fireEvent.click(submitBtn);

    // Should show validation error and not call mockSubmit
    expect(mockSubmit).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Mohon tuliskan rincian masukan/i)
    ).toBeDefined();
  });

  it("submits feedback with role, priority, category, and notes correctly", async () => {
    const mockSubmit = vi.fn().mockResolvedValue(true);
    const mockSuccess = vi.fn();

    render(
      <QuickFeedbackDialog
        open={true}
        moduleName="Modul E-Rapor"
        onSubmit={mockSubmit}
        onSuccess={mockSuccess}
      />
    );

    // Fill notes
    const textarea = screen.getByPlaceholderText(
      /Tuliskan saran, ide perbaikan alur kerja/i
    );
    fireEvent.change(textarea, {
      target: {
        value: "Mohon sediakan fitur cetak rapor massal dalam satu file ZIP.",
      },
    });

    // Change role
    const roleSelect = screen.getByLabelText(/Peran Pengguna/i);
    fireEvent.change(roleSelect, { target: { value: "Guru / Wali Kelas" } });

    // Change priority
    const prioritySelect = screen.getByLabelText(/Prioritas Usulan/i);
    fireEvent.change(prioritySelect, { target: { value: "high" } });

    // Submit form
    const submitBtn = screen.getByRole("button", { name: /Kirim Masukan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(1);
    });

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        notes: "Mohon sediakan fitur cetak rapor massal dalam satu file ZIP.",
        role: "Guru / Wali Kelas",
        priority: "high",
        moduleName: "Modul E-Rapor",
      })
    );

    // Verify success state appears
    await waitFor(() => {
      expect(screen.getByText(/Masukan Berhasil Terkirim/i)).toBeDefined();
    });

    expect(mockSuccess).toHaveBeenCalledTimes(1);
  });

  it("allows submitting another feedback after success", async () => {
    const mockSubmit = vi.fn().mockResolvedValue(true);

    render(<QuickFeedbackDialog open={true} onSubmit={mockSubmit} />);

    const textarea = screen.getByPlaceholderText(
      /Tuliskan saran, ide perbaikan alur kerja/i
    );
    fireEvent.change(textarea, {
      target: { value: "Saran pertama untuk optimalisasi tabel." },
    });

    const submitBtn = screen.getByRole("button", { name: /Kirim Masukan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Masukan Berhasil Terkirim/i)).toBeDefined();
    });

    // Click "Kirim Masukan Lain"
    const anotherBtn = screen.getByRole("button", {
      name: /Kirim Masukan Lain/i,
    });
    fireEvent.click(anotherBtn);

    // Form is back
    expect(screen.getByPlaceholderText(/Tuliskan saran, ide perbaikan alur kerja/i)).toBeDefined();
  });

  it("handles submission failure gracefully", async () => {
    const mockSubmit = vi.fn().mockRejectedValue(new Error("Network Error"));

    render(<QuickFeedbackDialog open={true} onSubmit={mockSubmit} />);

    const textarea = screen.getByPlaceholderText(
      /Tuliskan saran, ide perbaikan alur kerja/i
    );
    fireEvent.change(textarea, {
      target: { value: "Test masukan gagal kirim" },
    });

    const submitBtn = screen.getByRole("button", { name: /Kirim Masukan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Terjadi kendala saat mengirim masukan/i)).toBeDefined();
    });
  });

  it("respects custom trigger prop", () => {
    render(
      <QuickFeedbackDialog
        trigger={<button>Kustom Tombol Masukan</button>}
      />
    );

    expect(screen.getByText("Kustom Tombol Masukan")).toBeDefined();
  });
});
