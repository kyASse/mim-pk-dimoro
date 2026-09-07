import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import "@testing-library/jest-dom"
import React from "react"
import { AdminMoreSheet } from "../AdminMoreSheet"

const mockPathname = vi.fn(() => "/admin")
const mockPush = vi.fn()
const mockRefresh = vi.fn()
const mockSignOut = vi.fn(() => Promise.resolve({ error: null }))

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}))

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signOut: mockSignOut,
    },
  }),
}))

describe("AdminMoreSheet", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPathname.mockReturnValue("/admin")
  })

  it("renders all category sections when open", () => {
    render(<AdminMoreSheet open={true} onOpenChange={vi.fn()} />)

    expect(screen.getByText("Akademik & Agenda")).toBeInTheDocument()
    expect(screen.getByText("Publikasi & Media")).toBeInTheDocument()
    expect(screen.getByText("Pengaturan & Tools")).toBeInTheDocument()
  })

  it("renders all individual module links with correct URLs", () => {
    render(<AdminMoreSheet open={true} onOpenChange={vi.fn()} />)

    // Akademik & Agenda
    const eRapor = screen.getByRole("link", { name: /e-rapor & nilai/i })
    expect(eRapor).toHaveAttribute("href", "/admin/akademik")

    const biaya = screen.getByRole("link", { name: /biaya & spp/i })
    expect(biaya).toHaveAttribute("href", "/admin/akademik/edit-biaya")

    const kalender = screen.getByRole("link", { name: /kalender akademik/i })
    expect(kalender).toHaveAttribute("href", "/admin/kalender")

    const prestasi = screen.getByRole("link", { name: /prestasi siswa/i })
    expect(prestasi).toHaveAttribute("href", "/admin/akademik/prestasi")

    // Publikasi & Media
    const berita = screen.getByRole("link", { name: /berita & artikel/i })
    expect(berita).toHaveAttribute("href", "/admin/berita")

    const galeri = screen.getByRole("link", { name: /galeri foto/i })
    expect(galeri).toHaveAttribute("href", "/admin/galeri")

    const testimoni = screen.getByRole("link", { name: /testimoni wali/i })
    expect(testimoni).toHaveAttribute("href", "/admin/testimoni")

    // Pengaturan & Tools
    const konten = screen.getByRole("link", { name: /konten halaman/i })
    expect(konten).toHaveAttribute("href", "/admin/konten")

    const kontak = screen.getByRole("link", { name: /kontak sekolah/i })
    expect(kontak).toHaveAttribute("href", "/admin/konten/edit-kontak")

    const tools = screen.getByRole("link", { name: /generator akun \/ tools/i })
    expect(tools).toHaveAttribute("href", "/admin/tools")
  })

  it("renders Public Web shortcut and Logout button", () => {
    render(<AdminMoreSheet open={true} onOpenChange={vi.fn()} />)

    const publicWebLink = screen.getByRole("link", { name: /web publik/i })
    expect(publicWebLink).toHaveAttribute("href", "/")

    const logoutButton = screen.getByRole("button", { name: /keluar dari admin/i })
    expect(logoutButton).toBeInTheDocument()
  })

  it("calls onOpenChange(false) when a module link is clicked", () => {
    const handleOpenChange = vi.fn()
    render(<AdminMoreSheet open={true} onOpenChange={handleOpenChange} />)

    const beritaLink = screen.getByRole("link", { name: /berita & artikel/i })
    fireEvent.click(beritaLink)

    expect(handleOpenChange).toHaveBeenCalledWith(false)
  })

  it("calls onOpenChange(false) when the public web link is clicked", () => {
    const handleOpenChange = vi.fn()
    render(<AdminMoreSheet open={true} onOpenChange={handleOpenChange} />)

    const publicWebLink = screen.getByRole("link", { name: /web publik/i })
    fireEvent.click(publicWebLink)

    expect(handleOpenChange).toHaveBeenCalledWith(false)
  })

  it("highlights active route inside sheet cards", () => {
    mockPathname.mockReturnValue("/admin/berita")
    render(<AdminMoreSheet open={true} onOpenChange={vi.fn()} />)

    const beritaLink = screen.getByRole("link", { name: /berita & artikel/i })
    expect(beritaLink.className).toContain("bg-primary/10")

    const galeriLink = screen.getByRole("link", { name: /galeri foto/i })
    expect(galeriLink.className).not.toContain("bg-primary/10")
  })

  it("highlights active route for nested paths", () => {
    mockPathname.mockReturnValue("/admin/akademik/prestasi/tambah")
    render(<AdminMoreSheet open={true} onOpenChange={vi.fn()} />)

    const prestasiLink = screen.getByRole("link", { name: /prestasi siswa/i })
    expect(prestasiLink.className).toContain("bg-primary/10")
  })

  it("handles logout action properly", async () => {
    const handleOpenChange = vi.fn()
    render(<AdminMoreSheet open={true} onOpenChange={handleOpenChange} />)

    const logoutButton = screen.getByRole("button", { name: /keluar dari admin/i })
    fireEvent.click(logoutButton)

    expect(handleOpenChange).toHaveBeenCalledWith(false)
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith("/auth/login")
      expect(mockRefresh).toHaveBeenCalled()
    })
  })
})
