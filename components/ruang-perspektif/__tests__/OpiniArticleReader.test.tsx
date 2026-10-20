import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import OpiniArticleReader from "../OpiniArticleReader";
import { OpiniPublicDetail } from "@/lib/types/ruang-perspektif";

describe("OpiniArticleReader Component", () => {
  const baseItem: OpiniPublicDetail = {
    id: "test-1",
    slug: "uji-artikel-opini",
    judul: "Judul Pengujian Artikel",
    ringkasan: "Ini adalah ringkasan dari naskah opini.",
    isi_lengkap: `<p style="text-align: center;">Paragraf rata tengah</p><p style="text-align: right;">Paragraf rata kanan</p><p style="text-align: justify;">Paragraf rata kanan kiri</p>`,
    kategori: "Pendidikan & Karakter",
    nama_penulis: "Ustadz Penulis",
    peran_penulis: "guru",
    keterangan_peran: "Guru Kelas 6",
    foto_penulis_url: null,
    gambar_sampul_url: null,
    is_featured: false,
    waktu_terbit: "2026-10-19T08:00:00Z",
    waktu_baca_menit: 3,
    dibaca_count: 10,
  };

  it("renders html content with alignment styles intact", () => {
    const { container } = render(<OpiniArticleReader item={baseItem} />);
    
    const centerP = container.querySelector('p[style*="text-align: center"]');
    const rightP = container.querySelector('p[style*="text-align: right"]');
    const justifyP = container.querySelector('p[style*="text-align: justify"]');

    expect(centerP).not.toBeNull();
    expect(rightP).not.toBeNull();
    expect(justifyP).not.toBeNull();
  });

  it("renders plain text legacy content gracefully without crashing", () => {
    const legacyItem: OpiniPublicDetail = {
      ...baseItem,
      isi_lengkap: "Ini adalah teks opini lama yang disimpan tanpa tag HTML.",
    };

    const { container } = render(<OpiniArticleReader item={legacyItem} />);
    expect(container.textContent).toContain("Ini adalah teks opini lama yang disimpan tanpa tag HTML.");
  });
});
