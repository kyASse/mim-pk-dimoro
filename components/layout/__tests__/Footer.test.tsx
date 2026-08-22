import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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
    div: ({ children, whileHover, whileTap, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('Footer Component', () => {
  const mockMaybeSingle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });
    (createClient as any).mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          maybeSingle: mockMaybeSingle,
        }),
      }),
    });
  });

  it('renders "Tentang Kami" link with href "/tentang-kami"', () => {
    render(<Footer />);

    const tentangLink = screen.getByRole('link', { name: /tentang kami/i });
    expect(tentangLink).toBeDefined();
    expect(tentangLink.getAttribute('href')).toBe('/tentang-kami');
  });

  it('renders navigation links properly', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: /beranda/i }).getAttribute('href')).toBe('/');
    expect(screen.getByRole('link', { name: /program & kurikulum/i }).getAttribute('href')).toBe('/program');
    expect(screen.getByRole('link', { name: /kalender akademik/i }).getAttribute('href')).toBe('/kalender-akademik');
    expect(screen.getByRole('link', { name: /galeri/i }).getAttribute('href')).toBe('/galeri');
    expect(screen.getByRole('link', { name: /pendaftaran/i }).getAttribute('href')).toBe('/pendaftaran');
    expect(screen.getByRole('link', { name: /kontak/i }).getAttribute('href')).toBe('/kontak');
  });

  it('renders school full name in footer', () => {
    render(<Footer />);

    const elements = screen.getAllByText(new RegExp(SCHOOL_FULL_NAME, 'i'));
    expect(elements.length).toBeGreaterThan(0);
  });

  it('renders default fallback social media links when kontak is null', () => {
    render(<Footer />);

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

  it('renders dynamic social media links from kontak_sekolah with target="_blank" and rel="noopener noreferrer"', async () => {
    mockMaybeSingle.mockResolvedValue({
      data: {
        alamat: 'Jl. Test No. 123',
        whatsapp: '08123456789',
        email_utama: 'info@test.com',
        jam_operasional: '07:00 - 13:00 WIB',
        facebook_url: 'https://facebook.com/mimpkdimoro',
        instagram_url: 'https://instagram.com/mimpkdimoro',
        youtube_url: 'https://youtube.com/@mimpkdimoro',
      },
      error: null,
    });

    render(<Footer />);

    await waitFor(() => {
      const fbLink = screen.getByRole('link', { name: /facebook/i });
      expect(fbLink.getAttribute('href')).toBe('https://facebook.com/mimpkdimoro');
      expect(fbLink.getAttribute('target')).toBe('_blank');
      expect(fbLink.getAttribute('rel')).toBe('noopener noreferrer');

      const igLink = screen.getByRole('link', { name: /instagram/i });
      expect(igLink.getAttribute('href')).toBe('https://instagram.com/mimpkdimoro');
      expect(igLink.getAttribute('target')).toBe('_blank');
      expect(igLink.getAttribute('rel')).toBe('noopener noreferrer');

      const ytLink = screen.getByRole('link', { name: /youtube/i });
      expect(ytLink.getAttribute('href')).toBe('https://youtube.com/@mimpkdimoro');
      expect(ytLink.getAttribute('target')).toBe('_blank');
      expect(ytLink.getAttribute('rel')).toBe('noopener noreferrer');
    });
  });
});
