import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AboutIKWMPage, { metadata } from "../page";
import { SCHOOL_NAME } from "@/lib/school-config";

// Setup IntersectionObserver mock for tests in jsdom
beforeEach(() => {
  class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
  global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
});

vi.mock("@/lib/services/public-content", () => ({
  getIKWMContent: vi.fn().mockResolvedValue({
    hero: {
      badge: "Sinergi Madrasah & Keluarga",
      judul: "Ikatan Wali Murid (IKWM) MIM PK Dimoro",
      subjudul: "Membangun karakter mulia bersama madrasah.",
      periode: "Masa Bakti 2025 - 2027",
    },
    kata_pengantar: {
      judul: "Sambutan Ketua IKWM",
      nama_ketua: "H. Joko Santoso, M.Pd.",
      jabatan: "Ketua IKWM",
      foto_url: "/images/mim_hero_main.jpg",
      sambutan: ["Selamat datang di portal IKWM."],
      kutipan_kunci: "Bersama kita bisa.",
    },
    video: {
      display_mode: "placeholder",
      youtube_url: "",
      judul: "Video Profil IKWM",
      deskripsi: "Video dokumentasi sinergi madrasah",
      placeholder_title: "Segera Hadir: Video Profil",
      placeholder_desc: "Dalam tahap penyuntingan dan kurasi.",
    },
    struktural: {
      pembina: [
        {
          nama: "Drs. H. Ahmad Dahlan",
          jabatan: "Ketua Komite Madrasah",
          foto_url: "/images/avatar.jpg",
        },
      ],
      pengurus_inti: [
        {
          id: "pengurus-1",
          nama: "Hj. Siti Aminah, S.Pd.",
          jabatan: "Ketua Umum",
          divisi: "Pimpinan Inti",
          foto_url: "/images/avatar.jpg",
        },
      ],
      bidang: [
        {
          id: "bidang-1",
          nama_bidang: "Bidang Pendidikan & Dakwah",
          koordinator: "Ustadz Mansur",
          anggota: ["Ibu Fatimah", "Bapak Rudi"],
        },
      ],
    },
    kegiatan: [
      {
        id: "keg-1",
        kategori: "parenting",
        badge_label: "Program Unggulan",
        judul: "Seminar Parenting Islami",
        deskripsi: "Pentingnya keteladanan orang tua dalam mendidik anak.",
        jadwal: "12 Oktober 2025",
        foto_url: "/images/parenting.jpg",
        highlight_tag: "Wajib Wali Murid",
      },
    ],
  }),
}));

describe("Public IKWM Page (app/ikatan-wali-murid/page.tsx)", () => {
  it("harus merender halaman publik IKWM dengan data lengkap", async () => {
    const Component = await AboutIKWMPage();
    render(Component);

    // Hero verification
    expect(screen.getByRole("heading", { level: 1, name: "Ikatan Wali Murid (IKWM) MIM PK Dimoro" })).toBeDefined();
    expect(screen.getByText("Sinergi Madrasah & Keluarga")).toBeDefined();
    expect(screen.getByText("Masa Bakti 2025 - 2027")).toBeDefined();

    // Kata Pengantar verification
    expect(screen.getByText("H. Joko Santoso, M.Pd.")).toBeDefined();
    expect(screen.getByText(/Bersama kita bisa/i)).toBeDefined();

    // Video Section verification (placeholder mode)
    expect(screen.getByText("Segera Hadir: Video Profil")).toBeDefined();

    // Struktural Section verification
    expect(screen.getByText("Drs. H. Ahmad Dahlan")).toBeDefined();
    expect(screen.getByText("Hj. Siti Aminah, S.Pd.")).toBeDefined();
    expect(screen.getByText("Bidang Pendidikan & Dakwah")).toBeDefined();

    // Kegiatan Bento verification
    expect(screen.getByText("Seminar Parenting Islami")).toBeDefined();
  });

  it("harus memiliki metadata SEO yang terdefinisi dengan baik", () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toContain(SCHOOL_NAME);
    expect(metadata.description).toBeDefined();
    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph?.title).toContain(SCHOOL_NAME);
  });
});
