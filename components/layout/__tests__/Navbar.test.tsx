import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import Navbar from '../Navbar'
import { SCHOOL_NAME } from '@/lib/school-config'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Mock motion/react
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, whileHover: _whileHover, whileTap: _whileTap, ...props }: any) => <div {...props}>{children}</div>,
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock ThemeSwitcher
vi.mock('@/components/theme-switcher', () => ({
  ThemeSwitcher: () => <div data-testid="theme-switcher">ThemeSwitcher</div>,
}))

// Mock MobileMenuOverlay
vi.mock('../MobileMenuOverlay', () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    <div data-testid="mobile-menu-overlay" data-open={isOpen ? 'true' : 'false'}>
      {isOpen && <span>Mobile Menu Open</span>}
      <button onClick={onClose} data-testid="mock-close-menu">Close Mock</button>
    </div>
  ),
  publicNavLinks: [
    { name: "Beranda", href: "/" },
    { name: "Tentang Kami", href: "/tentang-kami" },
    { name: "Program & Kurikulum", href: "/program" },
    { name: "Berita & Artikel", href: "/berita" },
    { name: "Kalender Akademik", href: "/kalender-akademik" },
    { name: "Galeri Foto", href: "/galeri" },
    { name: "Kontak & Lokasi", href: "/kontak" },
  ],
}))

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders school logo and brand name', () => {
    render(<Navbar />)

    const brandName = screen.getByText(SCHOOL_NAME)
    expect(brandName).toBeInTheDocument()

    const logo = screen.getByRole('img')
    expect(logo).toBeInTheDocument()
  })

  it('renders all desktop navigation links with correct hrefs', () => {
    render(<Navbar />)

    expect(screen.getByRole('link', { name: /^beranda$/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /^tentang kami$/i })).toHaveAttribute('href', '/tentang-kami')
    expect(screen.getByRole('link', { name: /^program & kurikulum$/i })).toHaveAttribute('href', '/program')
    expect(screen.getByRole('link', { name: /^berita & artikel$/i })).toHaveAttribute('href', '/berita')
    expect(screen.getByRole('link', { name: /^kalender akademik$/i })).toHaveAttribute('href', '/kalender-akademik')
    expect(screen.getByRole('link', { name: /^galeri foto$/i })).toHaveAttribute('href', '/galeri')
    expect(screen.getByRole('link', { name: /^kontak & lokasi$/i })).toHaveAttribute('href', '/kontak')
  })

  it('renders ThemeSwitcher and action buttons (Masuk and Daftar PPDB)', () => {
    render(<Navbar />)

    expect(screen.getAllByTestId('theme-switcher').length).toBeGreaterThan(0)

    const masukBtn = screen.getByRole('link', { name: /masuk/i })
    expect(masukBtn).toHaveAttribute('href', '/auth/login')

    const ppdbBtn = screen.getByRole('link', { name: /daftar ppdb/i })
    expect(ppdbBtn).toHaveAttribute('href', '/pendaftaran')
  })

  it('toggles mobile menu button and updates MobileMenuOverlay state', () => {
    render(<Navbar />)

    const toggleButton = screen.getByRole('button', { name: /toggle menu|menu/i })
    expect(toggleButton).toBeInTheDocument()

    const overlay = screen.getByTestId('mobile-menu-overlay')
    expect(overlay).toHaveAttribute('data-open', 'false')

    // Click toggle button to open
    fireEvent.click(toggleButton)
    expect(overlay).toHaveAttribute('data-open', 'true')

    // Click toggle button to close
    fireEvent.click(toggleButton)
    expect(overlay).toHaveAttribute('data-open', 'false')
  })
})
