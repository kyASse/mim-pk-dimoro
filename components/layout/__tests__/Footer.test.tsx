import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import Footer from '../Footer';
import { SCHOOL_FULL_NAME } from '@/lib/school-config';
import { createClient } from '@/lib/supabase/client';

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
}));

// Mock motion/react
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, whileHover, whileTap, initial, whileInView, viewport, transition, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, whileHover, whileTap, initial, whileInView, viewport, transition, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, whileHover, whileTap, initial, whileInView, viewport, transition, ...props }: any) => <a {...props}>{children}</a>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
}));

describe('Redesigned Footer Component', () => {
  const mockMaybeSingle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockMaybeSingle.mockResolvedValue({
      data: {
        alamat: 'Jl. Raya Dimoro No. 12, Sukoharjo',
        whatsapp: '081234567890',
        email_utama: 'info@mimpkdimoro.sch.id',
        jam_operasional: '07:00 - 13:30 WIB',
        facebook_url: 'https://facebook.com/mimpkdimoro',
        instagram_url: 'https://instagram.com/mimpkdimoro',
        youtube_url: 'https://youtube.com/@mimpkdimoro',
      },
      error: null,
    });
    (createClient as any).mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          maybeSingle: mockMaybeSingle,
        }),
      }),
    });
  });

  it('renders brand identity, school name, and program badge', async () => {
    render(<Footer />);
    await waitFor(() => {
      expect(screen.getAllByText(new RegExp(SCHOOL_FULL_NAME, 'i')).length).toBeGreaterThan(0);
      expect(screen.getByText(/Program Khusus/i)).toBeDefined();
    });
  });

  it('renders all key navigation links including explore and academic services', async () => {
    render(<Footer />);

    await waitFor(() => {
      // Core explore links
      expect(screen.getByRole('link', { name: /beranda/i }).getAttribute('href')).toBe('/');
      expect(screen.getByRole('link', { name: /tentang kami/i }).getAttribute('href')).toBe('/tentang-kami');
      expect(screen.getByRole('link', { name: /program & kurikulum/i }).getAttribute('href')).toBe('/program');
      expect(screen.getByRole('link', { name: /galeri/i }).getAttribute('href')).toBe('/galeri');
      expect(screen.getByRole('link', { name: /berita/i }).getAttribute('href')).toBe('/berita');

      // Service & Academic links
      expect(screen.getByRole('link', { name: /pendaftaran/i }).getAttribute('href')).toBe('/pendaftaran');
      expect(screen.getByRole('link', { name: /kalender akademik/i }).getAttribute('href')).toBe('/kalender-akademik');
      expect(screen.getByRole('link', { name: /portal wali murid/i }).getAttribute('href')).toBe('/auth/login');
      expect(screen.getByRole('link', { name: /kontak/i }).getAttribute('href')).toBe('/kontak');
    });
  });

  it('renders interactive contact links with proper hrefs', async () => {
    render(<Footer />);

    await waitFor(() => {
      // WhatsApp interactive link
      const waLinks = screen.getAllByRole('link', { name: /whatsapp|081234567890|konsultasi/i });
      expect(waLinks.some((link) => link.getAttribute('href')?.includes('wa.me'))).toBe(true);

      // Email mailto link
      const mailLinks = screen.getAllByRole('link', { name: /email|info@mimpkdimoro.sch.id/i });
      expect(mailLinks.some((link) => link.getAttribute('href')?.startsWith('mailto:'))).toBe(true);

      // Address maps link
      const mapLinks = screen.getAllByRole('link', { name: /alamat|dimoro|peta/i });
      expect(mapLinks.some((link) => link.getAttribute('href')?.includes('google.com/maps') || link.getAttribute('href')?.includes('maps.google.com'))).toBe(true);
    });
  });

  it('renders dynamic social media links with target="_blank" and rel="noopener noreferrer"', async () => {
    render(<Footer />);

    await waitFor(() => {
      const fbLink = screen.getByRole('link', { name: /facebook/i });
      const igLink = screen.getByRole('link', { name: /instagram/i });
      const ytLink = screen.getByRole('link', { name: /youtube/i });

      expect(fbLink.getAttribute('href')).toBe('https://facebook.com/mimpkdimoro');
      expect(fbLink.getAttribute('target')).toBe('_blank');
      expect(fbLink.getAttribute('rel')).toBe('noopener noreferrer');

      expect(igLink.getAttribute('href')).toBe('https://instagram.com/mimpkdimoro');
      expect(igLink.getAttribute('target')).toBe('_blank');
      expect(igLink.getAttribute('rel')).toBe('noopener noreferrer');

      expect(ytLink.getAttribute('href')).toBe('https://youtube.com/@mimpkdimoro');
      expect(ytLink.getAttribute('target')).toBe('_blank');
      expect(ytLink.getAttribute('rel')).toBe('noopener noreferrer');
    });
  });

  it('renders fallback links gracefully when kontak data is null', async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    render(<Footer />);

    await waitFor(() => {
      const fbLink = screen.getByRole('link', { name: /facebook/i });
      const igLink = screen.getByRole('link', { name: /instagram/i });
      const ytLink = screen.getByRole('link', { name: /youtube/i });

      expect(fbLink.getAttribute('href')).toBe('#');
      expect(fbLink.getAttribute('target')).toBeNull();
      expect(igLink.getAttribute('href')).toBe('#');
      expect(igLink.getAttribute('target')).toBeNull();
      expect(ytLink.getAttribute('href')).toBe('#');
      expect(ytLink.getAttribute('target')).toBeNull();
    });
  });

  it('handles back to top click smoothly', async () => {
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    render(<Footer />);
    await waitFor(() => {
      const topButton = screen.getByRole('button', { name: /kembali ke atas|ke atas/i });
      fireEvent.click(topButton);
      expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
  });
});
