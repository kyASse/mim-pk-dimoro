import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import OpiniHero from "../OpiniHero";
import OpiniFeaturedSpotlight from "../OpiniFeaturedSpotlight";
import OpiniFilterTabs, { PERAN_FILTER_OPTIONS } from "../OpiniFilterTabs";
import OpiniSubmissionCTA from "../OpiniSubmissionCTA";
import { OpiniPublicItem } from "@/lib/types/ruang-perspektif";

const mockPush = vi.fn();
let mockSearchParamPeran: string | null = null;

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: (key: string) => (key === "peran" ? mockSearchParamPeran : null),
    toString: () => (mockSearchParamPeran ? `peran=${mockSearchParamPeran}` : ""),
  }),
  usePathname: () => "/ruang-perspektif",
}));

describe("Ruang Perspektif Components", () => {
  const mockItem: OpiniPublicItem = {
    id: "feat-1",
    slug: "pentingnya-adab-sebelum-ilmu",
    judul: "Pentingnya Adab Sebelum Ilmu dalam Pendidikan Dasar",
    ringkasan: "Penanaman akhlak mulia sejak dini menjadi fondasi kokoh bagi keberhasilan masa depan anak.",
    kategori: "Pendidikan & Karakter",
    nama_penulis: "Ustadz Ahmad Fauzi",
    peran_penulis: "guru",
    keterangan_peran: "Guru Kelas 5 MIM PK Dimoro",
    foto_penulis_url: null,
    gambar_sampul_url: null,
    is_featured: true,
    waktu_terbit: "2026-10-18T10:00:00Z",
    waktu_baca_menit: 4,
  };

  describe("OpiniHero", () => {
    it("should render main headings and navigation CTA buttons", () => {
      render(<OpiniHero />);
      expect(screen.getByText("Ruang Perspektif Madrasah")).toBeDefined();
      expect(screen.getByText("Dialog Gagasan & Suara Komunitas")).toBeDefined();
      expect(screen.getByRole("link", { name: /Kirim Tulisan Opini/i }).getAttribute("href")).toBe(
        "/ruang-perspektif/kirim"
      );
      expect(screen.getByRole("link", { name: /Jelajahi Gagasan/i }).getAttribute("href")).toBe(
        "#koleksi-opini"
      );
    });
  });

  describe("OpiniFeaturedSpotlight", () => {
    it("should render spotlight item details and initial fallback when author has no photo", () => {
      render(<OpiniFeaturedSpotlight item={mockItem} />);
      expect(screen.getByText("Sorotan Redaksi")).toBeDefined();
      expect(screen.getByText(mockItem.judul)).toBeDefined();
      expect(screen.getByText(/4 mnt baca/)).toBeDefined();
      expect(screen.getByText(mockItem.nama_penulis)).toBeDefined();
      expect(screen.getByText(mockItem.keterangan_peran!)).toBeDefined();
      expect(screen.getByText("U")).toBeDefined(); // First letter of "Ustadz Ahmad Fauzi"
    });

    it("should render author photo when foto_penulis_url is present", () => {
      const itemWithPhoto: OpiniPublicItem = {
        ...mockItem,
        foto_penulis_url: "https://example.com/ahmad.jpg",
      };
      render(<OpiniFeaturedSpotlight item={itemWithPhoto} />);
      const img = screen.getByRole("img", { name: itemWithPhoto.nama_penulis });
      expect(img.getAttribute("src")).toBe("https://example.com/ahmad.jpg");
    });
  });

  describe("OpiniFilterTabs", () => {
    it("should render all peran filter tabs with mobile-safe classes", () => {
      mockSearchParamPeran = null;
      render(<OpiniFilterTabs />);
      
      PERAN_FILTER_OPTIONS.forEach((opt) => {
        const button = screen.getByRole("button", { name: opt.label });
        expect(button).toBeDefined();
        // Check mobile tab safeguard class invariants
        expect(button.className).toContain("shrink-0");
        expect(button.className).toContain("whitespace-nowrap");
        expect(button.className).toContain("min-w-max");
        expect(button.className).toContain("px-4");
      });
    });

    it("should highlight active filter tab and push query params on click", () => {
      mockSearchParamPeran = "guru";
      const { rerender } = render(<OpiniFilterTabs />);
      
      const guruBtn = screen.getByRole("button", { name: "Guru & Tendik" });
      expect(guruBtn.className).toContain("bg-primary text-primary-foreground");

      const waliBtn = screen.getByRole("button", { name: "Wali Murid" });
      fireEvent.click(waliBtn);
      expect(mockPush).toHaveBeenCalledWith("/ruang-perspektif?peran=wali_murid#koleksi-opini");

      // Select 'semua' to delete filter param
      const semuaBtn = screen.getByRole("button", { name: "Semua Peran" });
      fireEvent.click(semuaBtn);
      expect(mockPush).toHaveBeenCalledWith("/ruang-perspektif?#koleksi-opini");
    });
  });

  describe("OpiniSubmissionCTA", () => {
    it("should render CTA title, description, and link to submission page", () => {
      render(<OpiniSubmissionCTA />);
      expect(screen.getByText("Punya Pengalaman atau Ide Edukatif?")).toBeDefined();
      const link = screen.getByRole("link", { name: /Kirim Gagasan Sekarang/i });
      expect(link.getAttribute("href")).toBe("/ruang-perspektif/kirim");
    });
  });
});
