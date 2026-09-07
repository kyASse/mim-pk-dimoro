import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'
import MobileMenuOverlay from '../MobileMenuOverlay'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('MobileMenuOverlay', () => {
  it('renders all public navigation links including Berita & Kalender', () => {
    render(<MobileMenuOverlay isOpen={true} onClose={vi.fn()} />)

    expect(screen.getByRole('link', { name: /beranda/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /tentang kami/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /program & kurikulum/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /berita & artikel/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /kalender akademik/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /galeri foto/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /kontak & lokasi/i })).toBeInTheDocument()
  })

  it('renders WhatsApp consultation link, PPDB CTA button, and Portal login link', () => {
    render(<MobileMenuOverlay isOpen={true} onClose={vi.fn()} />)

    expect(screen.getByRole('link', { name: /daftar ppdb online/i })).toHaveAttribute('href', '/pendaftaran')
    expect(screen.getByRole('link', { name: /tanya via whatsapp/i })).toHaveAttribute('href', expect.stringContaining('https://wa.me/'))
    expect(screen.getByRole('link', { name: /masuk portal siswa & wali murid/i })).toHaveAttribute('href', '/auth/login')
  })

  it('calls onClose when a navigation link is clicked', () => {
    const handleClose = vi.fn()
    render(<MobileMenuOverlay isOpen={true} onClose={handleClose} />)

    const beritaLink = screen.getByRole('link', { name: /berita & artikel/i })
    fireEvent.click(beritaLink)

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when PPDB CTA or Portal login link is clicked', () => {
    const handleClose = vi.fn()
    render(<MobileMenuOverlay isOpen={true} onClose={handleClose} />)

    const ppdbLink = screen.getByRole('link', { name: /daftar ppdb online/i })
    fireEvent.click(ppdbLink)

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('does not render content when isOpen is false', () => {
    render(<MobileMenuOverlay isOpen={false} onClose={vi.fn()} />)

    expect(screen.queryByRole('link', { name: /beranda/i })).not.toBeInTheDocument()
  })
})
