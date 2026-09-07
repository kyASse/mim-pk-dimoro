import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { AdminUnderDevelopment } from "../AdminUnderDevelopment";
import { GraduationCap, BookOpen } from "lucide-react";
import type { PlannedFeature } from "../under-development/types";

describe("AdminUnderDevelopment Component", () => {
  it("renders with required props and default values", () => {
    render(
      <AdminUnderDevelopment
        title="Manajemen E-Rapor Digital"
        description="Fitur pengelolaan raport terpadu madrasah"
      />
    );

    // Title and description
    expect(screen.getByText("Manajemen E-Rapor Digital")).toBeDefined();
    expect(
      screen.getByText("Fitur pengelolaan raport terpadu madrasah")
    ).toBeDefined();

    // Default category
    expect(screen.getByText("Modul Administrasi")).toBeDefined();

    // Default status badge (in_progress -> Dalam Pengerjaan / Dalam Pengembangan)
    expect(
      screen.getAllByText(/Dalam Pengerjaan|Dalam Pengembangan/i).length
    ).toBeGreaterThan(0);

    // Default progress 45%
    expect(screen.getByText("45%")).toBeDefined();

    // Back buttons (Desktop and mobile dock)
    const backElements = screen.getAllByText(/Kembali/i);
    expect(backElements.length).toBeGreaterThanOrEqual(1);

    // Default back url link
    const backLinks = screen.getAllByRole("link");
    const adminLink = backLinks.find(
      (link) => link.getAttribute("href") === "/admin"
    );
    expect(adminLink).toBeDefined();
  });

  it("renders with custom props (category, status, progress, estimated release, icon)", () => {
    render(
      <AdminUnderDevelopment
        title="Modul Keuangan & SPP"
        description="Sistem pembayaran SPP online siswa"
        category="Keuangan & Kas"
        status="testing"
        progress={80}
        estimatedRelease="Mei 2026"
        icon={GraduationCap}
        backUrl="/admin/keuangan"
        backLabel="Kembali ke Keuangan"
      />
    );

    expect(screen.getByText("Modul Keuangan & SPP")).toBeDefined();
    expect(screen.getByText("Sistem pembayaran SPP online siswa")).toBeDefined();
    expect(screen.getByText("Keuangan & Kas")).toBeDefined();
    expect(screen.getByText("Tahap Pengujian")).toBeDefined();
    expect(screen.getByText("80%")).toBeDefined();
    expect(screen.getByText(/Mei 2026/i)).toBeDefined();

    // Custom back url
    const backLinks = screen.getAllByRole("link");
    const customLink = backLinks.find(
      (link) => link.getAttribute("href") === "/admin/keuangan"
    );
    expect(customLink).toBeDefined();
    expect(screen.getAllByText(/Kembali ke Keuangan/i).length).toBeGreaterThan(0);
  });

  it("renders custom planned features and technical notes", () => {
    const customFeatures: PlannedFeature[] = [
      {
        title: "Export Rekap Nilai PDF",
        description: "Generate berkas PDF rekap rapor siswa",
        status: "completed",
        tags: ["PDF", "Rapor"],
      },
      {
        title: "Kalkulator Nilai Akhir Otomatis",
        description: "Hitung otomatis bobot sumatif dan formatif",
        status: "in_progress",
        tags: ["Kurikulum Merdeka"],
      },
    ];

    render(
      <AdminUnderDevelopment
        title="Sistem Penilaian"
        description="Modul penilaian kurikulum terintegrasi"
        plannedFeatures={customFeatures}
        technicalNotes={[
          "Database PostgreSQL partitioned table",
          "Supabase storage S3 bucket configured",
        ]}
      />
    );

    expect(screen.getByText("Export Rekap Nilai PDF")).toBeDefined();
    expect(screen.getByText("Generate berkas PDF rekap rapor siswa")).toBeDefined();
    expect(screen.getByText("Kalkulator Nilai Akhir Otomatis")).toBeDefined();
    expect(
      screen.getByText("Database PostgreSQL partitioned table")
    ).toBeDefined();
    expect(
      screen.getByText("Supabase storage S3 bucket configured")
    ).toBeDefined();
  });

  it("renders Doppelrand (double-bezel) container architecture for hero", () => {
    const { container } = render(
      <AdminUnderDevelopment
        title="Modul Pembelajaran"
        description="Manajemen kurikulum madrasah"
        icon={BookOpen}
      />
    );

    // Outer shell should have double-bezel rounded styling
    const outerBezel = container.querySelector(".rounded-3xl");
    expect(outerBezel).not.toBeNull();

    // Inner core
    const innerCore = container.querySelector(".backdrop-blur-md, [class*='bg-card']");
    expect(innerCore).not.toBeNull();

    // Radial mesh accent
    const ambientMesh = container.querySelector(".blur-3xl");
    expect(ambientMesh).not.toBeNull();
  });

  it("renders mobile sticky floating bottom action dock", () => {
    const { container } = render(
      <AdminUnderDevelopment
        title="Presensi Siswa"
        description="Presensi digital harian"
      />
    );

    // Fixed bottom dock for mobile
    const bottomDock = container.querySelector(".fixed.bottom-0");
    expect(bottomDock).not.toBeNull();
    expect(bottomDock?.className).toContain("lg:hidden");
    expect(bottomDock?.className).toContain("z-40");
  });

  it("integrates QuickFeedbackDialog and handles user feedback interaction", async () => {
    const mockFeedbackSubmit = vi.fn().mockResolvedValue(true);

    render(
      <AdminUnderDevelopment
        title="Modul Tahfidz"
        description="Pencatatan hafalan Al-Quran"
        onFeedbackSubmit={mockFeedbackSubmit}
      />
    );

    // Open feedback dialog via trigger button
    const feedbackButtons = screen.getAllByRole("button", {
      name: /Masukan|Usulan Fitur/i,
    });
    expect(feedbackButtons.length).toBeGreaterThan(0);

    fireEvent.click(feedbackButtons[0]);

    expect(screen.getByText(/Beri Masukan & Usulan Fitur/i)).toBeDefined();
    expect(screen.getAllByText(/Modul Tahfidz/i).length).toBeGreaterThanOrEqual(1);

    // Fill notes
    const textarea = screen.getByPlaceholderText(
      /Tuliskan saran, ide perbaikan alur kerja/i
    );
    fireEvent.change(textarea, {
      target: { value: "Mohon sediakan rekap mutabaah harian santri" },
    });

    // Submit feedback
    const submitBtn = screen.getByRole("button", { name: /Kirim Masukan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockFeedbackSubmit).toHaveBeenCalledTimes(1);
    });

    expect(mockFeedbackSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        notes: "Mohon sediakan rekap mutabaah harian santri",
        moduleName: "Modul Tahfidz",
      })
    );
  });

  it("hides feedback dialog triggers when showFeedbackDialog is false", () => {
    render(
      <AdminUnderDevelopment
        title="Modul Keamanan"
        description="Konfigurasi audit keamanan"
        showFeedbackDialog={false}
      />
    );

    expect(
      screen.queryByRole("button", { name: /Masukan|Usulan Fitur/i })
    ).toBeNull();
  });

  it("renders custom children if provided", () => {
    render(
      <AdminUnderDevelopment
        title="Modul Kalender"
        description="Agenda tahunan madrasah"
      >
        <div data-testid="custom-child-section">
          Jadwal Ujian Semester Ganjil 2026/2027
        </div>
      </AdminUnderDevelopment>
    );

    expect(screen.getByTestId("custom-child-section")).toBeDefined();
    expect(
      screen.getByText("Jadwal Ujian Semester Ganjil 2026/2027")
    ).toBeDefined();
  });
});
