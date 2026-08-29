import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import "@testing-library/jest-dom"
import React from "react"
import { AdminNavigationWrapper } from "../AdminNavigationWrapper"

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

describe("AdminNavigationWrapper", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPathname.mockReturnValue("/admin")
  })

  it("renders AdminMobileNav with all navigation items", () => {
    render(<AdminNavigationWrapper />)

    expect(screen.getByRole("navigation", { name: "Admin Mobile Navigation" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /ppdb/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /siswa/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /pesan/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /lainnya/i })).toBeInTheDocument()
  })

  it("opens AdminMoreSheet when Lainnya button is clicked", () => {
    render(<AdminNavigationWrapper />)

    const moreButton = screen.getByRole("button", { name: /lainnya/i })
    expect(moreButton).toHaveAttribute("data-active", "false")

    // Click Lainnya button
    fireEvent.click(moreButton)

    // Lainnya button is now active
    expect(moreButton).toHaveAttribute("data-active", "true")

    // AdminMoreSheet contents should now be visible in document
    expect(screen.getByText("Menu Lengkap")).toBeInTheDocument()
    expect(screen.getByText("Akademik & Agenda")).toBeInTheDocument()
    expect(screen.getByText("Publikasi & Media")).toBeInTheDocument()
    expect(screen.getByText("Pengaturan & Tools")).toBeInTheDocument()
  })

  it("closes AdminMoreSheet when a module link inside the sheet is clicked", () => {
    render(<AdminNavigationWrapper />)

    // Open the sheet
    const moreButton = screen.getByRole("button", { name: /lainnya/i })
    fireEvent.click(moreButton)

    const beritaLink = screen.getByRole("link", { name: /berita & artikel/i })
    expect(beritaLink).toBeInTheDocument()

    // Click link inside sheet
    fireEvent.click(beritaLink)

    // State is closed: Lainnya button is no longer active
    expect(moreButton).toHaveAttribute("data-active", "false")
  })

  it("passes className to AdminMobileNav component", () => {
    const { container } = render(<AdminNavigationWrapper className="test-wrapper-class" />)
    const nav = container.querySelector("nav")
    expect(nav).toHaveClass("test-wrapper-class")
  })
})
