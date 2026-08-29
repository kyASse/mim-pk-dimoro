import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'
import PublicMobileFloatingBar from '../PublicMobileFloatingBar'
import { SCHOOL_NAME } from '@/lib/school-config'

const mockUsePathname = vi.fn()

vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

describe('PublicMobileFloatingBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUsePathname.mockReturnValue('/')
  })

  it('renders WhatsApp consultation link and PPDB registration link on public routes', () => {
    mockUsePathname.mockReturnValue('/')
    render(<PublicMobileFloatingBar />)

    const whatsappLink = screen.getByRole('link', { name: /whatsapp|konsultasi|tanya/i })
    expect(whatsappLink).toBeInTheDocument()
    expect(whatsappLink).toHaveAttribute('href', expect.stringMatching(/^https:\/\/wa\.me\/6282133881991\?text=/))
    expect(whatsappLink.getAttribute('href')).toContain(encodeURIComponent(SCHOOL_NAME))
    expect(whatsappLink).toHaveAttribute('target', '_blank')
    expect(whatsappLink).toHaveAttribute('rel', 'noopener noreferrer')

    const ppdbLink = screen.getByRole('link', { name: /daftar|ppdb/i })
    expect(ppdbLink).toBeInTheDocument()
    expect(ppdbLink).toHaveAttribute('href', '/pendaftaran')
  })

  it('renders on other public routes like /tentang-kami and /berita', () => {
    mockUsePathname.mockReturnValue('/tentang-kami')
    const { unmount } = render(<PublicMobileFloatingBar />)
    expect(screen.getByRole('link', { name: /daftar|ppdb/i })).toBeInTheDocument()
    unmount()

    mockUsePathname.mockReturnValue('/berita')
    render(<PublicMobileFloatingBar />)
    expect(screen.getByRole('link', { name: /daftar|ppdb/i })).toBeInTheDocument()
  })

  it('suppresses rendering on /admin routes', () => {
    mockUsePathname.mockReturnValue('/admin')
    const { container: container1 } = render(<PublicMobileFloatingBar />)
    expect(container1.firstChild).toBeNull()

    mockUsePathname.mockReturnValue('/admin/dashboard')
    const { container: container2 } = render(<PublicMobileFloatingBar />)
    expect(container2.firstChild).toBeNull()
  })

  it('suppresses rendering on /portal routes', () => {
    mockUsePathname.mockReturnValue('/portal')
    const { container: container1 } = render(<PublicMobileFloatingBar />)
    expect(container1.firstChild).toBeNull()

    mockUsePathname.mockReturnValue('/portal/dashboard')
    const { container: container2 } = render(<PublicMobileFloatingBar />)
    expect(container2.firstChild).toBeNull()
  })

  it('suppresses rendering on /auth routes', () => {
    mockUsePathname.mockReturnValue('/auth')
    const { container: container1 } = render(<PublicMobileFloatingBar />)
    expect(container1.firstChild).toBeNull()

    mockUsePathname.mockReturnValue('/auth/login')
    const { container: container2 } = render(<PublicMobileFloatingBar />)
    expect(container2.firstChild).toBeNull()
  })
})
