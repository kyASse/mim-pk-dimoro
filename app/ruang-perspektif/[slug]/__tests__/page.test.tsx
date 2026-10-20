import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import OpiniDetailPage, { generateMetadata } from "../page";
import { notFound } from "next/navigation";

vi.mock("@/lib/services/ruang-perspektif", () => ({
  getPublicOpinionBySlug: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn().mockImplementation(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

describe("Ruang Perspektif Detail Page (app/ruang-perspektif/[slug]/page.tsx)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockOpinion = {
    id: "1",
    slug: "refleksi-pendidikan",
    judul: "Refleksi Pendidikan Islam",
    ringkasan: "Sebuah ringkasan penting tentang pendidikan.",
    isi_lengkap: "Ini adalah isi artikel opini yang lengkap dan mendalam.",
    kategori: "Pendidikan & Karakter" as const,
    nama_penulis: "Ustadz Mansur",
    peran_penulis: "guru" as const,
    keterangan_peran: "Guru Fiqih",
    foto_penulis_url: "https://example.com/foto.jpg",
    gambar_sampul_url: "https://example.com/sampul.jpg",
    is_featured: false,
    waktu_terbit: "2026-10-18T00:00:00Z",
    waktu_baca_menit: 2,
    dibaca_count: 10,
  };

  it("renders opinion article content and metadata", async () => {
    const { getPublicOpinionBySlug } = await import("@/lib/services/ruang-perspektif");
    vi.mocked(getPublicOpinionBySlug).mockResolvedValue(mockOpinion);

    const jsx = await OpiniDetailPage({ params: Promise.resolve({ slug: "refleksi-pendidikan" }) });
    render(jsx);

    expect(screen.getByText("Refleksi Pendidikan Islam")).toBeDefined();
    expect(screen.getByText("Ustadz Mansur")).toBeDefined();
    expect(screen.getByText("Guru Fiqih")).toBeDefined();
    expect(screen.getByText("Pendidikan & Karakter")).toBeDefined();
    expect(screen.getByText("Sebuah ringkasan penting tentang pendidikan.")).toBeDefined();
    expect(screen.getByText("Ini adalah isi artikel opini yang lengkap dan mendalam.")).toBeDefined();
    expect(screen.getByText(/2 mnt baca/i)).toBeDefined();
  });

  it("renders rich HTML article content with prose formatting", async () => {
    const { getPublicOpinionBySlug } = await import("@/lib/services/ruang-perspektif");
    const htmlOpinion = {
      ...mockOpinion,
      isi_lengkap: "<h2>Subjudul Opini</h2><blockquote>Kutipan mendalam guru</blockquote><p>Paragraf isi terformat.</p>",
    };
    vi.mocked(getPublicOpinionBySlug).mockResolvedValue(htmlOpinion);

    const jsx = await OpiniDetailPage({ params: Promise.resolve({ slug: "refleksi-pendidikan" }) });
    const { container } = render(jsx);

    expect(screen.getByText("Subjudul Opini")).toBeDefined();
    expect(screen.getByText("Kutipan mendalam guru")).toBeDefined();
    expect(screen.getByText("Paragraf isi terformat.")).toBeDefined();
    expect(container.querySelector(".prose")).toBeDefined();
  });

  it("calls notFound() when opinion is null", async () => {
    const { getPublicOpinionBySlug } = await import("@/lib/services/ruang-perspektif");
    vi.mocked(getPublicOpinionBySlug).mockResolvedValue(null);

    const params = Promise.resolve({ slug: "non-existent" });
    await expect(OpiniDetailPage({ params })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });

  describe("generateMetadata", () => {
    it("generates correct metadata when opinion is found", async () => {
      const { getPublicOpinionBySlug } = await import("@/lib/services/ruang-perspektif");
      vi.mocked(getPublicOpinionBySlug).mockResolvedValue(mockOpinion);

      const params = Promise.resolve({ slug: "refleksi-pendidikan" });
      const meta = await generateMetadata({ params });

      expect(meta.title).toBe("Refleksi Pendidikan Islam | Ruang Perspektif MIM PK Dimoro");
      expect(meta.description).toBe(mockOpinion.ringkasan);
      expect(meta.openGraph?.title).toBe(mockOpinion.judul);
      expect(meta.openGraph?.images).toEqual([mockOpinion.gambar_sampul_url]);
    });

    it("generates fallback title when opinion is not found", async () => {
      const { getPublicOpinionBySlug } = await import("@/lib/services/ruang-perspektif");
      vi.mocked(getPublicOpinionBySlug).mockResolvedValue(null);

      const params = Promise.resolve({ slug: "not-found-slug" });
      const meta = await generateMetadata({ params });

      expect(meta.title).toBe("Naskah Tidak Ditemukan | MIM PK Dimoro");
    });
  });
});
