import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import KelolaLaporanPage from "../page";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "admin-1" } } }),
    },
  }),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("Admin Laporan Perkembangan Page (app/admin/akademik/laporan/page.tsx)", () => {
  it("renders AdminUnderDevelopment template for Laporan Perkembangan Siswa", async () => {
    const Component = await KelolaLaporanPage();
    render(Component);

    // Title and category
    expect(
      screen.getByText(/Laporan Perkembangan Siswa & Tahfidz/i)
    ).toBeDefined();
    expect(screen.getByText(/Akademik & E-Rapor/i)).toBeDefined();

    // Target release
    expect(screen.getByText(/Q3 2026/i)).toBeDefined();

    // Planned capabilities
    expect(
      screen.getByText(/Buku Mutaba'ah & Tracking Tahfidz/i)
    ).toBeDefined();
    expect(
      screen.getByText(/Evaluasi Karakter & Pembiasaan Ibadah/i)
    ).toBeDefined();
    expect(
      screen.getByText(/Portal Laporan Digital untuk Wali Murid/i)
    ).toBeDefined();
  });
});
