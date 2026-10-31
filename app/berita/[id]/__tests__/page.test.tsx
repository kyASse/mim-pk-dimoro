import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import BeritaDetailPage, { generateMetadata } from "../page";
import { SCHOOL_NAME } from "@/lib/school-config";
import { notFound } from "next/navigation";

// Mock Supabase Server Client
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  notFound: vi.fn().mockImplementation(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ fill: _fill, priority: _priority, ...props }: any) => <img alt="" {...props} />,
}));

import { createClient } from "@/lib/supabase/server";

describe("Public Berita Detail Page (app/berita/[id]/page.tsx)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockBeritaHtml = {
    id: "123",
    judul: "Prestasi Robotik Santri MIM PK Dimoro",
    ringkasan: "Santri MIM PK Dimoro berhasil memenangkan kejuaraan robotik.",
    isi_lengkap: "<p>Santri kami <strong>berhasil</strong> menjuarai kompetisi robotik tingkat nasional.</p><p>Acara berlangsung dengan meriah.</p>",
    image_url: "/images/berita/robotik.webp",
    status: "terbit",
    tanggal_terbit: "2026-08-20T08:00:00Z",
    penulis_id: "penulis-1",
  };

  const mockBeritaPlainText = {
    id: "124",
    judul: "Berita Format Teks Jadul",
    ringkasan: "Ringkasan berita legacy tanpa HTML.",
    isi_lengkap: "Paragraf pertama format legacy.\n\nParagraf kedua format legacy.",
    image_url: "/images/berita/legacy.jpg",
    status: "terbit",
    tanggal_terbit: "2026-08-20T08:00:00Z",
    penulis_id: "penulis-2",
  };

  const setupMockSupabase = (beritaData: any, penulisData: any = { id: "penulis-1", role: "admin" }) => {
    const mockSupabase = {
      from: vi.fn((table: string) => {
        if (table === "berita") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: beritaData,
                    error: beritaData ? null : new Error("Not found"),
                  }),
                }),
              }),
            }),
          };
        }
        if (table === "profiles") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: penulisData,
                  error: null,
                }),
              }),
            }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
        };
      }),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
    return mockSupabase;
  };

  it("renders rich HTML content when isi_lengkap contains HTML tags with dark mode styles", async () => {
    setupMockSupabase(mockBeritaHtml);

    const params = Promise.resolve({ id: "123" });
    const jsx = await BeritaDetailPage({ params });
    const { container } = render(jsx);

    expect(screen.getByText("Prestasi Robotik Santri MIM PK Dimoro")).toBeDefined();
    expect(screen.getByText("Santri MIM PK Dimoro berhasil memenangkan kejuaraan robotik.")).toBeDefined();
    expect(screen.getByText("Tim Redaksi")).toBeDefined();

    // Check root page container uses bg-background instead of hardcoded bg-gray-50
    const pageContainer = container.firstElementChild as HTMLElement;
    expect(pageContainer.className).toContain("bg-background");
    expect(pageContainer.className).not.toContain("bg-gray-50");

    // Check HTML container has dark:prose-invert
    const htmlContainer = container.querySelector(".prose-emerald");
    expect(htmlContainer).not.toBeNull();
    expect(htmlContainer?.className).toContain("dark:prose-invert");
    expect(htmlContainer?.innerHTML).toContain("<strong>berhasil</strong>");

    // Check back button has dark mode friendly classes (text-muted-foreground instead of hardcoded text-gray-600)
    const backLink = screen.getByRole("link", { name: /kembali ke/i });
    expect(backLink.className).toContain("text-muted-foreground");
    expect(backLink.className).not.toContain("text-gray-600");
  });

  it("renders fallback paragraph split with dark mode classes when isi_lengkap is plain text", async () => {
    setupMockSupabase(mockBeritaPlainText, { id: "penulis-2", role: "guru" });

    const params = Promise.resolve({ id: "124" });
    const jsx = await BeritaDetailPage({ params });
    const { container } = render(jsx);

    expect(screen.getByText("Berita Format Teks Jadul")).toBeDefined();
    expect(screen.getByText("Paragraf pertama format legacy.")).toBeDefined();
    expect(screen.getByText("Paragraf kedua format legacy.")).toBeDefined();

    // Plain text container should have dark mode prose and prose-emerald classes
    const proseContainer = container.querySelector(".prose");
    expect(proseContainer).not.toBeNull();
    expect(proseContainer?.className).toContain("dark:prose-invert");
    expect(proseContainer?.className).toContain("prose-emerald");
  });

  it("calls notFound() when berita is not found", async () => {
    setupMockSupabase(null);

    const params = Promise.resolve({ id: "non-existent" });
    await expect(BeritaDetailPage({ params })).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
  });

  describe("generateMetadata", () => {
    it("generates correct metadata for published berita", async () => {
      setupMockSupabase(mockBeritaHtml);

      const params = Promise.resolve({ id: "123" });
      const meta = await generateMetadata({ params });

      expect(meta.title).toBe(`Prestasi Robotik Santri MIM PK Dimoro - ${SCHOOL_NAME}`);
      expect(meta.description).toBe(mockBeritaHtml.ringkasan);
      expect(meta.openGraph?.title).toBe(mockBeritaHtml.judul);
      expect(meta.openGraph?.images).toEqual([mockBeritaHtml.image_url]);
    });

    it("generates fallback metadata when berita not found", async () => {
      setupMockSupabase(null);

      const params = Promise.resolve({ id: "non-existent" });
      const meta = await generateMetadata({ params });

      expect(meta.title).toBe(`Berita Tidak Ditemukan - ${SCHOOL_NAME}`);
    });
  });
});
