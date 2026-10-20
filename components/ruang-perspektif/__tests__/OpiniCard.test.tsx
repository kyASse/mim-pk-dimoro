import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import OpiniCard from "../OpiniCard";
import { OpiniPublicItem } from "@/lib/types/ruang-perspektif";

describe("OpiniCard", () => {
  const mockItem: OpiniPublicItem = {
    id: "1",
    slug: "menumbuhkan-kejujuran-anak",
    judul: "Menumbuhkan Kejujuran Anak di Rumah",
    ringkasan: "Refleksi pentingnya keteladanan orang tua dalam mendidik karakter anak sehari-hari.",
    kategori: "Pola Asuh & Parenting",
    nama_penulis: "Hj. Siti Aminah",
    peran_penulis: "wali_murid",
    keterangan_peran: "Wali dari Yusuf - Kelas 4",
    foto_penulis_url: null,
    gambar_sampul_url: null,
    is_featured: false,
    waktu_terbit: "2026-10-15T08:00:00Z",
    waktu_baca_menit: 3,
  };

  it("should render title, category, author name, and read time", () => {
    render(<OpiniCard item={mockItem} />);
    expect(screen.getByText("Menumbuhkan Kejujuran Anak di Rumah")).toBeDefined();
    expect(screen.getByText("Pola Asuh & Parenting")).toBeDefined();
    expect(screen.getByText("Hj. Siti Aminah")).toBeDefined();
    expect(screen.getByText(/3 mnt baca/)).toBeDefined();
  });

  it("should render author image when foto_penulis_url is provided", () => {
    const itemWithPhoto: OpiniPublicItem = {
      ...mockItem,
      foto_penulis_url: "https://example.com/avatar.jpg",
    };
    render(<OpiniCard item={itemWithPhoto} />);
    const img = screen.getByRole("img", { name: "Hj. Siti Aminah" });
    expect(img).toBeDefined();
    expect(img.getAttribute("src")).toBe("https://example.com/avatar.jpg");
  });

  it("should fall back to peranLabelMap when keterangan_peran is null", () => {
    const itemWithoutKeterangan: OpiniPublicItem = {
      ...mockItem,
      keterangan_peran: null,
      peran_penulis: "guru",
    };
    render(<OpiniCard item={itemWithoutKeterangan} />);
    expect(screen.getByText("Guru & Tendik")).toBeDefined();
  });

  it("should render link pointing to the article detail slug", () => {
    render(<OpiniCard item={mockItem} />);
    const link = screen.getByRole("link", { name: /Menumbuhkan Kejujuran Anak di Rumah/i });
    expect(link.getAttribute("href")).toBe("/ruang-perspektif/menumbuhkan-kejujuran-anak");
  });
});
