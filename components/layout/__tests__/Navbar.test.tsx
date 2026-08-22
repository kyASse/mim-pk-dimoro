import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Navbar from '../Navbar';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Mock motion/react
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, whileHover, whileTap, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock ThemeSwitcher
vi.mock('../theme-switcher', () => ({
  ThemeSwitcher: () => <div data-testid="theme-switcher">ThemeSwitcher</div>,
}));

describe('Navbar Component', () => {
  it('renders "Kalender" link with href "/kalender-akademik"', () => {
    render(<Navbar />);

    const kalenderLinks = screen.getAllByRole('link', { name: /kalender/i });
    expect(kalenderLinks.length).toBeGreaterThan(0);
    expect(kalenderLinks[0].getAttribute('href')).toBe('/kalender-akademik');
  });

  it('renders standard navigation links', () => {
    render(<Navbar />);

    expect(screen.getAllByRole('link', { name: /beranda/i })[0].getAttribute('href')).toBe('/');
    expect(screen.getAllByRole('link', { name: /tentang kami/i })[0].getAttribute('href')).toBe('/tentang-kami');
    expect(screen.getAllByRole('link', { name: /program & kurikulum/i })[0].getAttribute('href')).toBe('/program');
    expect(screen.getAllByRole('link', { name: /galeri/i })[0].getAttribute('href')).toBe('/galeri');
    expect(screen.getAllByRole('link', { name: /pendaftaran/i })[0].getAttribute('href')).toBe('/pendaftaran');
    expect(screen.getAllByRole('link', { name: /kontak/i })[0].getAttribute('href')).toBe('/kontak');
  });
});
