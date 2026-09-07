import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import BeritaPage, { metadata } from "../page";
import { SCHOOL_NAME } from "@/lib/school-config";

// Mock Supabase Server Client
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

// Mock motion/react to avoid animation issues in test environment
vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, whileInView, initial, animate, viewport, transition, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
    h2: ({ children, whileInView, initial, animate, viewport, transition, ...props }: any) => (
      <h2 {...props}>{children}</h2>
    ),
    p: ({ children, whileInView, initial, animate, viewport, transition, ...props }: any) => (
      <p {...props}>{children}</p>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => true,
}));

import { createClient } from "@/lib/supabase/server";

describe("Public Berita Archive Page (app/berita/page.tsx)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const mockNewsItems = [
    {
      id: "1",
      judul: "Prestasi Juara 1 Tahfidz Tingkat Kabupaten",
      ringkasan: "Siswa MI Muhammadiyah Dimoro meraih juara 1 tahfidz tingkat kabupaten.",
      image_url: "/images/berita/prestasi-tahfidz.jpg",
      tanggal_terbit: "2025-01-15T08:00:00Z",
      penulis_id: "user-1",
      created_at: "2025-01-15T08:00:00Z",
    },
    {
      id: "2",
      judul: "Kegiatan Outbound dan Kemah Ceria",
      ringkasan: "Keseruan santri mengikuti kemah ceria di lereng Merapi.",
      image_url: "/images/berita/outbound.jpg",
      tanggal_terbit: "2025-02-10T09:30:00Z",
      penulis_id: "user-2",
      created_at: "2025-02-10T09:30:00Z",
    },
  ];

  const setupMockSupabase = (data: any[] | null, error: any = null) => {
    const queryBuilder: any = {
      eq: vi.fn(),
      order: vi.fn(),
      ilike: vi.fn(),
    };

    // Return self on chaining
    queryBuilder.eq.mockReturnValue(queryBuilder);
    queryBuilder.order.mockReturnValue(queryBuilder);
    queryBuilder.ilike.mockReturnValue(queryBuilder);

    // Make queryBuilder thenable / awaitable
    queryBuilder.then = (onfulfilled: any) =>
      Promise.resolve({ data, error }).then(onfulfilled);

    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue(queryBuilder),
      }),
      queryBuilder,
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
    return mockSupabase;
  };

  describe("Metadata", () => {
    it("exports correct SEO metadata including SCHOOL_NAME", () => {
      expect(metadata.title).toContain("Berita & Kegiatan");
      expect(metadata.title).toContain(SCHOOL_NAME);
      expect(metadata.description).toBeDefined();
      expect(metadata.openGraph?.title).toContain("Berita & Kegiatan");
      expect(metadata.openGraph?.siteName).toBe(SCHOOL_NAME);
    });
  });

  describe("Page Rendering & News List", () => {
    it("renders PageHeader with correct title and SCHOOL_NAME in description", async () => {
      setupMockSupabase(mockNewsItems);

      const searchParams = Promise.resolve({});
      const jsx = await BeritaPage({ searchParams });
      render(jsx);

      expect(screen.getByRole("heading", { name: "Berita & Kegiatan", level: 1 })).toBeDefined();
      expect(screen.getByText(new RegExp(SCHOOL_NAME, "i"))).toBeDefined();
    });

    it("renders search input and button", async () => {
      setupMockSupabase(mockNewsItems);

      const searchParams = Promise.resolve({});
      const jsx = await BeritaPage({ searchParams });
      render(jsx);

      const searchInput = screen.getByPlaceholderText(/Cari berita atau kegiatan/i);
      expect(searchInput).toBeDefined();
      expect(screen.getByRole("button", { name: /Cari/i })).toBeDefined();
    });

    it("renders news cards when articles are available", async () => {
      setupMockSupabase(mockNewsItems);

      const searchParams = Promise.resolve({});
      const jsx = await BeritaPage({ searchParams });
      render(jsx);

      expect(screen.getByText("Prestasi Juara 1 Tahfidz Tingkat Kabupaten")).toBeDefined();
      expect(screen.getByText("Kegiatan Outbound dan Kemah Ceria")).toBeDefined();
      expect(screen.getByText(/Siswa MI Muhammadiyah Dimoro/i)).toBeDefined();
      expect(screen.getByText(/Keseruan santri mengikuti kemah ceria/i)).toBeDefined();
    });
  });

  describe("Search Filtering", () => {
    it("applies ilike query filter when search parameter q is provided", async () => {
      const mockSupabase = setupMockSupabase([mockNewsItems[0]]);

      const searchParams = Promise.resolve({ q: "Tahfidz" });
      const jsx = await BeritaPage({ searchParams });
      render(jsx);

      expect(mockSupabase.from).toHaveBeenCalledWith("berita");
      expect(mockSupabase.queryBuilder.eq).toHaveBeenCalledWith("status", "terbit");
      expect(mockSupabase.queryBuilder.ilike).toHaveBeenCalledWith("judul", "%Tahfidz%");
      expect(screen.getByText("Prestasi Juara 1 Tahfidz Tingkat Kabupaten")).toBeDefined();
    });

    it("populates default input value with search query", async () => {
      setupMockSupabase([mockNewsItems[0]]);

      const searchParams = Promise.resolve({ q: "Tahfidz" });
      const jsx = await BeritaPage({ searchParams });
      render(jsx);

      const searchInput = screen.getByPlaceholderText(/Cari berita atau kegiatan/i) as HTMLInputElement;
      expect(searchInput.value).toBe("Tahfidz");
    });
  });

  describe("Empty State", () => {
    it("displays empty state when no published news exists", async () => {
      setupMockSupabase([]);

      const searchParams = Promise.resolve({});
      const jsx = await BeritaPage({ searchParams });
      render(jsx);

      expect(screen.getByText("Belum Ada Berita")).toBeDefined();
      expect(screen.getByText(/Belum ada artikel atau berita yang dipublikasikan saat ini/i)).toBeDefined();
    });

    it("displays clean not found empty state with reset button when search query has no match", async () => {
      setupMockSupabase([]);

      const searchParams = Promise.resolve({ q: "KataKunciTidakAda" });
      const jsx = await BeritaPage({ searchParams });
      render(jsx);

      expect(screen.getByText("Berita Tidak Ditemukan")).toBeDefined();
      expect(screen.getByText(/Tidak ditemukan berita dengan kata kunci "KataKunciTidakAda"/i)).toBeDefined();
      expect(screen.getByRole("link", { name: /Lihat Semua Berita/i })).toBeDefined();
    });
  });
});
