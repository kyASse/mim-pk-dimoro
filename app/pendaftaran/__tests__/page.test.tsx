import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PendaftaranPage from "../page";

// Mock Supabase Server Client
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

// Mock public-content
vi.mock("@/lib/services/public-content", () => ({
  getPPDBFlowContent: vi.fn(),
}));

// Mock PendaftaranForm
vi.mock("@/components/Pendaftaran/PendaftaranForm", () => ({
  default: () => <div data-testid="mock-pendaftaran-form">Mock Form</div>,
}));

import { createClient } from "@/lib/supabase/server";
import { getPPDBFlowContent } from "@/lib/services/public-content";

describe("Pendaftaran Public Page (app/pendaftaran/page.tsx)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (getPPDBFlowContent as any).mockResolvedValue({
      formulir_pdf_url: "/test-formulir.pdf",
      alur_online: [{ title: "Alur Online 1", desc: "Langkah pertama online" }],
      alur_offline: [{ title: "Alur Offline 1", desc: "Langkah pertama offline" }],
    });
  });

  it("renders requirements, schedule, and SPP notes correctly when data is saved in TabPPDB block format", async () => {
    const mockFrom = vi.fn((table: string) => {
      if (table === "konten_halaman") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockImplementation((col: string, val: string) => {
            if (val === "persyaratan-pendaftaran") {
              return {
                single: vi.fn().mockResolvedValue({
                  data: {
                    judul: "Persyaratan Pendaftaran",
                    isi: {
                      blocks: [
                        {
                          text: "1. Lembar Formulir Pendaftaran\n2. Fotokopi Akta Kelahiran\n3. Fotokopi KTP Orang Tua\n4. Fotokopi Kartu Keluarga (KK)",
                        },
                      ],
                    },
                  },
                }),
              };
            }
            if (val === "jadwal-pendaftaran") {
              return {
                single: vi.fn().mockResolvedValue({
                  data: {
                    judul: "Jadwal Pendaftaran PPDB",
                    isi: {
                      blocks: [
                        {
                          text: "Tahap Indent: Oktober - Desember 2026\nTahap Pertama: Januari - Juli 2027",
                        },
                      ],
                    },
                  },
                }),
              };
            }
            if (val === "catatan-spp") {
              return {
                single: vi.fn().mockResolvedValue({
                  data: {
                    judul: "Catatan SPP",
                    isi: {
                      blocks: [
                        {
                          text: "SPESIAL PPDB TA 2027-2028: Bebas Uang Gedung dan Biaya Pendaftaran.",
                        },
                      ],
                    },
                  },
                }),
              };
            }
            return {
              single: vi.fn().mockResolvedValue({ data: null }),
            };
          }),
        };
      }
      if (table === "biaya_pendaftaran") {
        return {
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({
            data: [
              { id: 1, komponen_biaya: "Biaya Formulir", biaya_putra: 0, biaya_putri: 0 },
            ],
          }),
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [] }),
        single: vi.fn().mockResolvedValue({ data: null }),
      };
    });

    (createClient as any).mockResolvedValue({
      from: mockFrom,
    });

    const PageComponent = await PendaftaranPage();
    render(PageComponent);

    // Verify Requirements items are rendered
    expect(screen.getByText("Lembar Formulir Pendaftaran")).toBeInTheDocument();
    expect(screen.getByText("Fotokopi Akta Kelahiran")).toBeInTheDocument();
    expect(screen.getByText("Fotokopi KTP Orang Tua")).toBeInTheDocument();
    expect(screen.getByText("Fotokopi Kartu Keluarga (KK)")).toBeInTheDocument();

    // Verify Schedule items are rendered
    expect(screen.getByText("Tahap Indent")).toBeInTheDocument();
    expect(screen.getByText("Oktober - Desember 2026")).toBeInTheDocument();
    expect(screen.getByText("Tahap Pertama")).toBeInTheDocument();
    expect(screen.getByText("Januari - Juli 2027")).toBeInTheDocument();

    // Verify Catatan SPP is rendered
    expect(screen.getByText(/SPESIAL PPDB TA 2027-2028/i)).toBeInTheDocument();
  });

  it("renders structured JSON format from the slug editor gracefully", async () => {
    const mockFrom = vi.fn((table: string) => {
      if (table === "konten_halaman") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockImplementation((col: string, val: string) => {
            if (val === "persyaratan-pendaftaran") {
              return {
                single: vi.fn().mockResolvedValue({
                  data: {
                    judul: "Persyaratan Pendaftaran",
                    isi: {
                      persyaratan: {
                        judul: "Dokumen Persyaratan Khusus",
                        items: ["Syarat Khusus A", "Syarat Khusus B"],
                      },
                      jadwal: {
                        judul: "Jadwal Gelombang Khusus",
                        items: [{ tahap: "Gelombang A", periode: "Maret 2027" }],
                      },
                    },
                  },
                }),
              };
            }
            return {
              single: vi.fn().mockResolvedValue({ data: null }),
            };
          }),
        };
      }
      if (table === "biaya_pendaftaran") {
        return {
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: [] }),
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [] }),
        single: vi.fn().mockResolvedValue({ data: null }),
      };
    });

    (createClient as any).mockResolvedValue({
      from: mockFrom,
    });

    const PageComponent = await PendaftaranPage();
    render(PageComponent);

    expect(screen.getByText("Dokumen Persyaratan Khusus")).toBeInTheDocument();
    expect(screen.getByText("Syarat Khusus A")).toBeInTheDocument();
    expect(screen.getByText("Syarat Khusus B")).toBeInTheDocument();
    expect(screen.getByText("Gelombang A")).toBeInTheDocument();
    expect(screen.getByText("Maret 2027")).toBeInTheDocument();
  });

  it("renders defensive fallbacks when database returns null for all content records", async () => {
    const mockFrom = vi.fn((table: string) => {
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null }),
        }),
        order: vi.fn().mockResolvedValue({ data: [] }),
      };
    });

    (createClient as any).mockResolvedValue({
      from: mockFrom,
    });

    const PageComponent = await PendaftaranPage();
    render(PageComponent);

    // Should render default items instead of blank
    expect(screen.getByText("Persyaratan Dokumen")).toBeInTheDocument();
    expect(screen.getByText("Lembar Formulir Pendaftaran")).toBeInTheDocument();
    expect(screen.getByText("Tahap Indent")).toBeInTheDocument();
  });
});
