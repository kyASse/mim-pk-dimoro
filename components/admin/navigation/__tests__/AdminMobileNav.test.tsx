import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import "@testing-library/jest-dom"
import React from "react"
import { AdminMobileNav } from "../AdminMobileNav"

const mockPathname = vi.fn(() => "/admin")
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}))

describe("AdminMobileNav", () => {
  it("renders all 5 core navigation tabs with proper labels", () => {
    mockPathname.mockReturnValue("/admin")
    render(<AdminMobileNav onOpenMore={vi.fn()} isMoreOpen={false} />)

    expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /ppdb/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /siswa/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /pesan/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /lainnya/i })).toBeInTheDocument()
  })

  it("applies active styles when current route matches tab", () => {
    mockPathname.mockReturnValue("/admin/pendaftar")
    render(<AdminMobileNav onOpenMore={vi.fn()} isMoreOpen={false} />)

    const ppdbLink = screen.getByRole("link", { name: /ppdb/i })
    expect(ppdbLink).toHaveAttribute("data-active", "true")

    const dashboardLink = screen.getByRole("link", { name: /dashboard/i })
    expect(dashboardLink).toHaveAttribute("data-active", "false")
  })

  it("applies active styles on nested subroutes", () => {
    mockPathname.mockReturnValue("/admin/siswa/rombel")
    render(<AdminMobileNav onOpenMore={vi.fn()} isMoreOpen={false} />)

    const siswaLink = screen.getByRole("link", { name: /siswa/i })
    expect(siswaLink).toHaveAttribute("data-active", "true")
  })

  it("highlights Lainnya button and deactivates links when isMoreOpen is true", () => {
    mockPathname.mockReturnValue("/admin/pendaftar")
    render(<AdminMobileNav onOpenMore={vi.fn()} isMoreOpen={true} />)

    const ppdbLink = screen.getByRole("link", { name: /ppdb/i })
    expect(ppdbLink).toHaveAttribute("data-active", "false")

    const moreButton = screen.getByRole("button", { name: /lainnya/i })
    expect(moreButton).toHaveAttribute("data-active", "true")
  })

  it("calls onOpenMore when the Lainnya button is tapped", () => {
    const handleOpenMore = vi.fn()
    render(<AdminMobileNav onOpenMore={handleOpenMore} isMoreOpen={false} />)

    const moreButton = screen.getByRole("button", { name: /lainnya/i })
    fireEvent.click(moreButton)
    expect(handleOpenMore).toHaveBeenCalledTimes(1)
  })

  it("applies custom className if provided", () => {
    const { container } = render(<AdminMobileNav onOpenMore={vi.fn()} isMoreOpen={false} className="custom-test-class" />)
    const nav = container.querySelector("nav")
    expect(nav).toHaveClass("custom-test-class")
  })
})
