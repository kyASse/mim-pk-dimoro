import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, within, cleanup } from "@testing-library/react";
import StrukturOrganisasiClient from "@/components/struktur-organisasi/StrukturOrganisasiClient";
import OrgNodeCard from "@/components/struktur-organisasi/OrgNodeCard";
import { DEFAULT_STRUKTUR_ORGANISASI } from "@/lib/utils/content-parsers";
import type { StrukturOrganisasiContent } from "@/lib/types/content";

const mockUseReducedMotion = vi.fn(() => false);

vi.mock("motion/react", () => {
  const createMock = (Tag: "div" | "section") => {
    const MockComponent = ({
      children,
      initial: _initial,
      animate: _animate,
      exit: _exit,
      whileInView: _whileInView,
      viewport: _viewport,
      transition: _transition,
      layout: _layout,
      ...props
    }: React.HTMLAttributes<HTMLElement> & Record<string, unknown>) =>
      React.createElement(Tag, props, children);
    MockComponent.displayName = `MockMotion_${Tag}`;
    return MockComponent;
  };

  return {
    motion: {
      div: createMock("div"),
      section: createMock("section"),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useReducedMotion: () => mockUseReducedMotion(),
  };
});

describe("OrgNodeCard", () => {
  afterEach(() => {
    cleanup();
  });

  it("merender foto img, jabatan, dan nama+gelar untuk personil terdaftar", () => {
    render(
      <OrgNodeCard
        slot={DEFAULT_STRUKTUR_ORGANISASI.kamad}
        personil={DEFAULT_STRUKTUR_ORGANISASI.personil}
        variant="spotlight"
      />
    );

    const img = screen.getByRole("img");
    expect(img).toBeDefined();
    expect(decodeURIComponent(img.getAttribute("src") || "")).toContain(
      "/avatar-women-placeholder.png"
    );
    expect(screen.getByText("Kepala Madrasah (Kamad)")).toBeDefined();
    expect(screen.getByText("Anik Sulistyowati, S.Ag.")).toBeDefined();
  });

  it("menampilkan 'Belum Ditentukan' dengan avatar fallback ketika personil_id kosong atau tidak ditemukan", () => {
    const { rerender } = render(
      <OrgNodeCard
        slot={{ id: "kosong-1", jabatan: "Waka Humas", personil_id: "" }}
        personil={DEFAULT_STRUKTUR_ORGANISASI.personil}
      />
    );

    expect(screen.getByText("Waka Humas")).toBeDefined();
    expect(screen.getByText("Belum Ditentukan")).toBeDefined();
    expect(decodeURIComponent(screen.getByRole("img").getAttribute("src") || "")).toContain(
      "/avatar-women-placeholder.png"
    );

    rerender(
      <OrgNodeCard
        slot={{ id: "invalid-1", jabatan: "Bendahara", personil_id: "id-tidak-ada" }}
        personil={DEFAULT_STRUKTUR_ORGANISASI.personil}
      />
    );

    expect(screen.getByText("Bendahara")).toBeDefined();
    expect(screen.getByText("Belum Ditentukan")).toBeDefined();
    expect(decodeURIComponent(screen.getByRole("img").getAttribute("src") || "")).toContain(
      "/avatar-women-placeholder.png"
    );
  });

  it("memilih placeholder pria ketika gender personil adalah 'L' tanpa foto_url", () => {
    render(
      <OrgNodeCard
        slot={DEFAULT_STRUKTUR_ORGANISASI.komite}
        personil={DEFAULT_STRUKTUR_ORGANISASI.personil}
        variant="partner"
      />
    );

    const img = screen.getByRole("img");
    expect(decodeURIComponent(img.getAttribute("src") || "")).toContain(
      "/avatar-man-placeholder.png"
    );
    expect(screen.getByText("Bandowi")).toBeDefined();
  });
});

describe("StrukturOrganisasiClient", () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("merender header, seluruh tingkatan struktur default, 10 wali kelas, simpul Dewan Guru, 5 guru mapel, dan simpul Siswa", () => {
    render(<StrukturOrganisasiClient content={DEFAULT_STRUKTUR_ORGANISASI} />);

    expect(mockUseReducedMotion).toHaveBeenCalled();

    // 1. Header
    expect(
      screen.getByRole("heading", { level: 1, name: DEFAULT_STRUKTUR_ORGANISASI.hero.judul })
    ).toBeDefined();
    expect(screen.getByText(DEFAULT_STRUKTUR_ORGANISASI.hero.subjudul)).toBeDefined();
    expect(screen.getByText(DEFAULT_STRUKTUR_ORGANISASI.hero.badge)).toBeDefined();
    expect(screen.getByText(DEFAULT_STRUKTUR_ORGANISASI.hero.tahun_ajaran)).toBeDefined();

    // 2. Desktop full tree verification
    const desktopTree = screen.getByTestId("org-tree-desktop");
    expect(desktopTree.className).toContain("hidden");
    expect(desktopTree.className).toContain("lg:block");

    const desktopScope = within(desktopTree);

    // Komite & Kamad
    expect(desktopScope.getByText("Komite Madrasah")).toBeDefined();
    expect(desktopScope.getByText("Bandowi")).toBeDefined();
    expect(desktopScope.getByText("Kepala Madrasah (Kamad)")).toBeDefined();
    expect(desktopScope.getByText("Anik Sulistyowati, S.Ag.")).toBeDefined();

    // Administrasi
    expect(desktopScope.getByText("Tata Usaha")).toBeDefined();
    expect(desktopScope.getByText("Bendahara")).toBeDefined();

    // 4 Waka + sub_unit (Koord. Perpus & Guru BP)
    expect(desktopScope.getByText("Waka Kurikulum")).toBeDefined();
    expect(desktopScope.getByText("Koord. Perpus")).toBeDefined();
    expect(desktopScope.getByText("Waka Sarpras")).toBeDefined();
    expect(desktopScope.getByText("Waka Humas")).toBeDefined();
    expect(desktopScope.getByText("Waka Ur. Kesiswaan")).toBeDefined();
    expect(desktopScope.getByText("Guru BP")).toBeDefined();

    // Penunjang
    expect(desktopScope.getByText("Koor. Kop. Siswa")).toBeDefined();
    expect(desktopScope.getByText("Penjaga Sekolah")).toBeDefined();
    expect(desktopScope.getByText("Darminah")).toBeDefined();

    // 10 Wali Kelas (I A .. VI B)
    const expectedWaliJabatan = [
      "Wali Kelas I A",
      "Wali Kelas II A",
      "Wali Kelas II B",
      "Wali Kelas III A",
      "Wali Kelas III B",
      "Wali Kelas IV A",
      "Wali Kelas IV B",
      "Wali Kelas V",
      "Wali Kelas VI A",
      "Wali Kelas VI B",
    ];
    for (const jabatan of expectedWaliJabatan) {
      expect(desktopScope.getByText(jabatan)).toBeDefined();
    }

    // Simpul Dewan Guru
    expect(desktopScope.getByText("Dewan Guru")).toBeDefined();

    // 5 Guru Mapel
    expect(desktopScope.getAllByText("Guru Mapel")).toHaveLength(5);
    expect(desktopScope.getByText("Ervan Adi Saputro, S.Pd")).toBeDefined();
    expect(desktopScope.getByText("Moh Heri Wibowo, S.Pd")).toBeDefined();
    expect(desktopScope.getByText("Surani, S.Pd.I")).toBeDefined();
    expect(desktopScope.getByText("Sahrul BM.")).toBeDefined();

    // Simpul Siswa
    expect(desktopScope.getByText("Siswa")).toBeDefined();

    // Every node card inside desktop tree renders an <img>
    const desktopCards = desktopTree.querySelectorAll("[data-slot-id]");
    expect(desktopCards.length).toBe(27);
    desktopCards.forEach((card) => {
      expect(card.querySelector("img")).not.toBeNull();
    });

    // 3. Mobile hierarchical view renders lg:hidden with left connector guide and all 27 cards
    const mobileTree = screen.getByTestId("org-tree-mobile");
    expect(mobileTree.className).toContain("lg:hidden");
    expect(mobileTree.innerHTML).toContain("border-l-2 border-primary/25 pl-4");
    const mobileCards = mobileTree.querySelectorAll("[data-slot-id]");
    expect(mobileCards.length).toBe(27);
    mobileCards.forEach((card) => {
      expect(card.querySelector("img")).not.toBeNull();
    });
  });

  it("kartu OrgNodeCard hanya menampilkan foto, jabatan, dan nama tanpa field tambahan", () => {
    const { container } = render(
      <OrgNodeCard
        slot={DEFAULT_STRUKTUR_ORGANISASI.kamad}
        personil={DEFAULT_STRUKTUR_ORGANISASI.personil}
        variant="spotlight"
      />
    );

    const card = container.querySelector("[data-slot-id='kamad']");
    expect(card).not.toBeNull();
    expect(card?.textContent).toBe("Kepala Madrasah (Kamad)Anik Sulistyowati, S.Ag.");
  });

  it("menangani slot dengan personil_id kosong di dalam bagan dengan menampilkan 'Belum Ditentukan' dan avatar fallback", () => {
    const contentWithEmptySlot: StrukturOrganisasiContent = {
      ...DEFAULT_STRUKTUR_ORGANISASI,
      penunjang: [
        { id: "koor-kop-siswa", jabatan: "Koor. Kop. Siswa", personil_id: "" },
        { id: "penjaga-sekolah", jabatan: "Penjaga Sekolah", personil_id: "tidak-ada" },
      ],
    };

    render(<StrukturOrganisasiClient content={contentWithEmptySlot} />);

    const desktopScope = within(screen.getByTestId("org-tree-desktop"));
    const unassignedLabels = desktopScope.getAllByText("Belum Ditentukan");
    expect(unassignedLabels).toHaveLength(2);
  });

  it("merender pill filter dengan class mobile safeguard dan menyaring seksi saat pill diklik", () => {
    render(<StrukturOrganisasiClient content={DEFAULT_STRUKTUR_ORGANISASI} />);

    const filterLabels = ["Semua", "Pimpinan & Staf", "Wali Kelas", "Guru Mapel"];
    for (const label of filterLabels) {
      const btn = screen.getByRole("button", { name: label });
      expect(btn.className).toContain("shrink-0");
      expect(btn.className).toContain("whitespace-nowrap");
      expect(btn.className).toContain("min-w-max");
      expect(btn.className).toContain("px-4");
    }

    // Klik filter Wali Kelas -> sembunyikan Komite & Guru Mapel, tampilkan 10 Wali Kelas
    fireEvent.click(screen.getByRole("button", { name: "Wali Kelas" }));
    expect(screen.getByRole("button", { name: "Wali Kelas" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.queryByTestId("org-tree-desktop")).toBeNull();

    const waliFilteredScope = within(screen.getByTestId("org-filtered-view"));
    expect(waliFilteredScope.queryByText("Komite Madrasah")).toBeNull();
    expect(waliFilteredScope.queryByText("Guru Mapel")).toBeNull();
    expect(waliFilteredScope.queryByText("Ervan Adi Saputro, S.Pd")).toBeNull();
    expect(waliFilteredScope.queryByText("Dewan Guru")).toBeNull();
    expect(waliFilteredScope.queryByText("Siswa")).toBeNull();
    expect(waliFilteredScope.getByText("Wali Kelas I A")).toBeDefined();
    expect(waliFilteredScope.getByText("Wali Kelas II A")).toBeDefined();
    expect(waliFilteredScope.getByText("Wali Kelas II B")).toBeDefined();
    expect(waliFilteredScope.getByText("Wali Kelas III A")).toBeDefined();
    expect(waliFilteredScope.getByText("Wali Kelas III B")).toBeDefined();
    expect(waliFilteredScope.getByText("Wali Kelas IV A")).toBeDefined();
    expect(waliFilteredScope.getByText("Wali Kelas IV B")).toBeDefined();
    expect(waliFilteredScope.getByText("Wali Kelas V")).toBeDefined();
    expect(waliFilteredScope.getByText("Wali Kelas VI A")).toBeDefined();
    expect(waliFilteredScope.getByText("Wali Kelas VI B")).toBeDefined();

    // Klik filter Guru Mapel -> tampilkan 5 Guru Mapel, sembunyikan Wali Kelas & Komite
    fireEvent.click(screen.getByRole("button", { name: "Guru Mapel" }));
    expect(screen.getByRole("button", { name: "Guru Mapel" }).getAttribute("aria-pressed")).toBe("true");
    const mapelFilteredScope = within(screen.getByTestId("org-filtered-view"));
    expect(mapelFilteredScope.queryByText("Komite Madrasah")).toBeNull();
    expect(mapelFilteredScope.queryByText("Wali Kelas I A")).toBeNull();
    expect(mapelFilteredScope.getAllByText("Guru Mapel")).toHaveLength(5);

    // Klik filter Pimpinan & Staf -> tampilkan Komite, Kamad, Waka, Administrasi, Penunjang
    fireEvent.click(screen.getByRole("button", { name: "Pimpinan & Staf" }));
    expect(screen.getByRole("button", { name: "Pimpinan & Staf" }).getAttribute("aria-pressed")).toBe("true");
    const pimpinanFilteredScope = within(screen.getByTestId("org-filtered-view"));
    expect(pimpinanFilteredScope.getByText("Komite Madrasah")).toBeDefined();
    expect(pimpinanFilteredScope.getByText("Kepala Madrasah (Kamad)")).toBeDefined();
    expect(pimpinanFilteredScope.getByText("Waka Kurikulum")).toBeDefined();
    expect(pimpinanFilteredScope.getByText("Koord. Perpus")).toBeDefined();
    expect(pimpinanFilteredScope.queryByText("Wali Kelas I A")).toBeNull();
    expect(pimpinanFilteredScope.queryByText("Guru Mapel")).toBeNull();

    // Klik Semua -> kembali menampilkan desktop tree lengkap
    fireEvent.click(screen.getByRole("button", { name: "Semua" }));
    expect(screen.getByRole("button", { name: "Semua" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByTestId("org-tree-desktop")).toBeDefined();
  });

  it("resilient secara dinamis dengan > 5 guru_mapel dan waka tanpa sub_unit, serta menghormati prefers-reduced-motion", () => {
    mockUseReducedMotion.mockReturnValue(true);

    const dynamicContent: StrukturOrganisasiContent = {
      ...DEFAULT_STRUKTUR_ORGANISASI,
      personil: [
        ...DEFAULT_STRUKTUR_ORGANISASI.personil,
        { id: "guru-ekstra-6", nama: "Ustadzah Zahra, S.Pd", foto_url: "", gender: "P" },
        { id: "guru-ekstra-7", nama: "Ustadz Ridwan, M.Pd", foto_url: "", gender: "L" },
      ],
      waka: [
        { id: "waka-1", jabatan: "Waka Kurikulum", personil_id: "warih-agung-sumiwi", sub_unit: null },
        { id: "waka-2", jabatan: "Waka Kesiswaan", personil_id: "sri-asih" },
      ],
      guru_mapel: [
        ...DEFAULT_STRUKTUR_ORGANISASI.guru_mapel,
        { id: "guru-mapel-6", jabatan: "Guru Mapel", personil_id: "guru-ekstra-6" },
        { id: "guru-mapel-7", jabatan: "Guru Mapel", personil_id: "guru-ekstra-7" },
      ],
    };

    render(<StrukturOrganisasiClient content={dynamicContent} />);

    const desktopScope = within(screen.getByTestId("org-tree-desktop"));
    expect(desktopScope.getAllByText("Guru Mapel")).toHaveLength(7);
    expect(desktopScope.getByText("Ustadzah Zahra, S.Pd")).toBeDefined();
    expect(desktopScope.getByText("Ustadz Ridwan, M.Pd")).toBeDefined();
    expect(desktopScope.getByText("Waka Kurikulum")).toBeDefined();
    expect(desktopScope.getByText("Waka Kesiswaan")).toBeDefined();
    expect(desktopScope.queryByText("Koord. Perpus")).toBeNull();
    expect(desktopScope.queryByText("Guru BP")).toBeNull();
  });
});
