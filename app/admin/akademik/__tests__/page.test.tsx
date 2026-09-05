import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import KelolaAkademikPage from "../page";

// Mock Supabase server client & auth
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

describe("Admin Manajemen Nilai Page (app/admin/akademik/page.tsx)", () => {
  it("renders AdminUnderDevelopment template for Manajemen Nilai", async () => {
    const Component = await KelolaAkademikPage();
    render(Component);

    // Title and category
    expect(screen.getByText(/Manajemen Nilai & E-Rapor Digital/i)).toBeDefined();
    expect(screen.getByText(/Akademik & E-Rapor/i)).toBeDefined();

    // Progress percentage & estimated release
    expect(screen.getByText(/Semester Ganjil 2026\/2027/i)).toBeDefined();

    // Planned features
    expect(
      screen.getByText(/Input Nilai Formatif & Sumatif \(TP\/LM\)/i)
    ).toBeDefined();
    expect(
      screen.getByText(/Deskripsi Capaian Pembelajaran Otomatis/i)
    ).toBeDefined();
    expect(
      screen.getByText(/Ekspor & Cetak Rapor Digital PDF/i)
    ).toBeDefined();
  });
});
