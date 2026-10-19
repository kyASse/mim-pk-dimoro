import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RuangPerspektifSection from "../RuangPerspektifSection";
import { OpiniPublicItem } from "@/lib/types/ruang-perspektif";

describe("RuangPerspektifSection", () => {
  const mockOpinions: OpiniPublicItem[] = [
    {
      id: "1",
      slug: "opini-satu",
      judul: "Opini Pertama di Beranda",
      ringkasan: "Ringkasan opini satu",
      kategori: "Pendidikan & Karakter",
      nama_penulis: "Ustadzah Fatimah",
      peran_penulis: "guru",
      keterangan_peran: "Guru Kelas 1",
      foto_penulis_url: null,
      gambar_sampul_url: null,
      is_featured: true,
      waktu_terbit: "2026-10-18T00:00:00Z",
      waktu_baca_menit: 2,
    },
    {
      id: "2",
      slug: "opini-dua",
      judul: "Opini Kedua di Beranda",
      ringkasan: "Ringkasan opini dua",
      kategori: "Pola Asuh & Parenting",
      nama_penulis: "Bapak Hendra",
      peran_penulis: "wali_murid",
      keterangan_peran: "Wali Murid Kelas 3",
      foto_penulis_url: null,
      gambar_sampul_url: null,
      is_featured: false,
      waktu_terbit: "2026-10-17T00:00:00Z",
      waktu_baca_menit: 3,
    },
    {
      id: "3",
      slug: "opini-tiga",
      judul: "Opini Ketiga di Beranda",
      ringkasan: "Ringkasan opini tiga",
      kategori: "Inovasi Pembelajaran",
      nama_penulis: "Ustadz Ahmad",
      peran_penulis: "guru",
      keterangan_peran: "Guru Tahfidz",
      foto_penulis_url: null,
      gambar_sampul_url: null,
      is_featured: false,
      waktu_terbit: "2026-10-16T00:00:00Z",
      waktu_baca_menit: 4,
    },
    {
      id: "4",
      slug: "opini-empat",
      judul: "Opini Keempat di Beranda",
      ringkasan: "Ringkasan opini empat",
      kategori: "Kisah Inspiratif",
      nama_penulis: "Ibu Rahma",
      peran_penulis: "umum",
      keterangan_peran: "Pemerhati Pendidikan",
      foto_penulis_url: null,
      gambar_sampul_url: null,
      is_featured: false,
      waktu_terbit: "2026-10-15T00:00:00Z",
      waktu_baca_menit: 5,
    },
  ];

  it("renders opinion section with cards", () => {
    render(<RuangPerspektifSection opinions={mockOpinions} />);
    expect(screen.getByText("Ruang Perspektif")).toBeDefined();
    expect(screen.getByText("Opini Pertama di Beranda")).toBeDefined();
    expect(screen.getByText("Opini Kedua di Beranda")).toBeDefined();
    expect(screen.getByText("Opini Ketiga di Beranda")).toBeDefined();
    // Only first 3 opinions should be rendered
    expect(screen.queryByText("Opini Keempat di Beranda")).toBeNull();

    const link = screen.getByRole("link", { name: /lihat semua opini/i });
    expect(link.getAttribute("href")).toBe("/ruang-perspektif");
  });

  it("returns null when opinions array is empty", () => {
    const { container } = render(<RuangPerspektifSection opinions={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when opinions is undefined or null", () => {
    // @ts-expect-error testing falsy opinions prop
    const { container } = render(<RuangPerspektifSection opinions={null} />);
    expect(container.firstChild).toBeNull();
  });
});
