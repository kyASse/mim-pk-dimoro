import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import "@testing-library/jest-dom"
import React from "react"
import { AdminMobileHeader } from "../AdminMobileHeader"
import { SCHOOL_NAME, SCHOOL_LOGO_ALT } from "@/lib/school-config"

const mockPathname = vi.fn(() => "/admin")
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}))

vi.mock("@/components/theme-switcher", () => ({
  ThemeSwitcher: () => <div data-testid="theme-switcher">ThemeSwitcherMock</div>,
}))

describe("AdminMobileHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPathname.mockReturnValue("/admin")
  })

  it("displays Dashboard title on /admin", () => {
    mockPathname.mockReturnValue("/admin")
    render(<AdminMobileHeader />)

    expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeInTheDocument()
    expect(screen.getByText(SCHOOL_NAME)).toBeInTheDocument()
  })

  it("resolves dynamic page titles for various standard admin routes", () => {
    const routeTitleCases = [
      { path: "/admin/pendaftar", expected: "Pendaftar PPDB" },
      { path: "/admin/siswa", expected: "Data Siswa" },
      { path: "/admin/pesan", expected: "Pesan Masuk" },
      { path: "/admin/akademik", expected: "E-Rapor & Nilai" },
      { path: "/admin/akademik/edit-biaya", expected: "Biaya & SPP" },
      { path: "/admin/akademik/prestasi", expected: "Prestasi Siswa" },
      { path: "/admin/kalender", expected: "Kalender Akademik" },
      { path: "/admin/berita", expected: "Berita & Artikel" },
      { path: "/admin/galeri", expected: "Galeri Foto" },
      { path: "/admin/testimoni", expected: "Testimoni Wali" },
      { path: "/admin/konten", expected: "Konten Halaman" },
      { path: "/admin/konten/edit-kontak", expected: "Kontak Sekolah" },
      { path: "/admin/tools", expected: "Generator Akun / Tools" },
    ]

    for (const { path, expected } of routeTitleCases) {
      mockPathname.mockReturnValue(path)
      const { unmount } = render(<AdminMobileHeader />)
      expect(screen.getByRole("heading", { level: 1, name: expected })).toBeInTheDocument()
      unmount()
    }
  })

  it("resolves prefix page titles for nested subroutes", () => {
    mockPathname.mockReturnValue("/admin/berita/tambah")
    const { unmount } = render(<AdminMobileHeader />)
    expect(screen.getByRole("heading", { level: 1, name: "Berita & Artikel" })).toBeInTheDocument()
    unmount()

    mockPathname.mockReturnValue("/admin/pendaftar/reg-12345")
    render(<AdminMobileHeader />)
    expect(screen.getByRole("heading", { level: 1, name: "Pendaftar PPDB" })).toBeInTheDocument()
  })

  it("falls back to 'Admin Panel' for unknown routes", () => {
    mockPathname.mockReturnValue("/admin/custom-unknown-page")
    render(<AdminMobileHeader />)

    expect(screen.getByRole("heading", { level: 1, name: "Admin Panel" })).toBeInTheDocument()
  })

  it("renders school logo with appropriate alt text", () => {
    mockPathname.mockReturnValue("/admin")
    render(<AdminMobileHeader />)

    const logo = screen.getByAltText(SCHOOL_LOGO_ALT)
    expect(logo).toBeInTheDocument()
  })

  it("renders public website link and ThemeSwitcher", () => {
    mockPathname.mockReturnValue("/admin")
    render(<AdminMobileHeader />)

    const publicLink = screen.getByRole("link", { name: /lihat website publik/i })
    expect(publicLink).toBeInTheDocument()
    expect(publicLink).toHaveAttribute("href", "/")
    expect(screen.getByTestId("theme-switcher")).toBeInTheDocument()
  })

  it("applies custom className if provided", () => {
    const { container } = render(<AdminMobileHeader className="custom-header-class" />)
    const header = container.querySelector("header")
    expect(header).toHaveClass("custom-header-class")
  })
})
