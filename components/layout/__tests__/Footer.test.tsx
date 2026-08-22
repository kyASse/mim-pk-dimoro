import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Footer from '../Footer';
import { SCHOOL_FULL_NAME } from '@/lib/school-config';

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    }),
  }),
}));

// Mock motion/react
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, whileHover, whileTap, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('Footer Component', () => {
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
});
