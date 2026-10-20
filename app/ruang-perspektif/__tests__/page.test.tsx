import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import RuangPerspektifPage, { metadata } from "../page";
import { getPublicOpinions, getFeaturedPublicOpinion } from "@/lib/services/ruang-perspektif";
import { OpiniPublicItem } from "@/lib/types/ruang-perspektif";

vi.mock("@/lib/services/ruang-perspektif", () => ({
  getPublicOpinions: vi.fn(),
  getFeaturedPublicOpinion: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(null),
    toString: vi.fn().mockReturnValue(""),
  }),
  usePathname: () => "/ruang-perspektif",
}));

describe("RuangPerspektifPage", () => {
  const mockItem: OpiniPublicItem = {
    id: "item-1",
    slug: "artikel-satu",
    judul: "Artikel Menarik Pertama",
    ringkasan: "Ringkasan ringkas artikel pertama madrasah kita.",
    kategori: "Inovasi Pembelajaran",
    nama_penulis: "Budi Santoso",
    peran_penulis: "guru",
    keterangan_peran: "Guru Kelas 6",
    foto_penulis_url: null,
    gambar_sampul_url: null,
    is_featured: false,
    waktu_terbit: "2026-10-18T10:00:00Z",
    waktu_baca_menit: 3,
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should have correct metadata defined", () => {
    expect(metadata.title).toBe("Ruang Perspektif | MIM PK Dimoro");
    expect(metadata.description).toContain("Kolom pemikiran");
  });

  it("should render hero, featured spotlight, and list of opinions when available", async () => {
    vi.mocked(getPublicOpinions).mockResolvedValue([mockItem]);
    vi.mocked(getFeaturedPublicOpinion).mockResolvedValue({
      ...mockItem,
      id: "featured-1",
      slug: "artikel-sorotan",
      judul: "Artikel Sorotan Redaksi",
      is_featured: true,
    });

    const jsx = await RuangPerspektifPage({
      searchParams: Promise.resolve({ peran: "guru" }),
    });
    render(jsx);

    expect(screen.getByText("Ruang Perspektif Madrasah")).toBeDefined();
    expect(screen.getByText("Sorotan Redaksi")).toBeDefined();
    expect(screen.getByText("Artikel Sorotan Redaksi")).toBeDefined();
    expect(screen.getByText("Arsip Opini Komunitas")).toBeDefined();
    expect(screen.getByText("Menampilkan 1 gagasan terkurasi")).toBeDefined();
    expect(screen.getByText("Artikel Menarik Pertama")).toBeDefined();
  });

  it("should render empty state when opinions are empty and omit featured spotlight when null", async () => {
    vi.mocked(getPublicOpinions).mockResolvedValue([]);
    vi.mocked(getFeaturedPublicOpinion).mockResolvedValue(null);

    const jsx = await RuangPerspektifPage({
      searchParams: Promise.resolve({}),
    });
    render(jsx);

    expect(screen.queryByText("Sorotan Redaksi")).toBeNull();
    expect(screen.getByText("Belum ada artikel opini untuk kriteria filter ini.")).toBeDefined();
  });
});
