import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import AboutSection from '@/components/home/AboutSection';
import ProgramSection from '@/components/home/ProgramSection';
import { HEADMASTER_WELCOME, EXCELLENT_PROGRAMS } from '@/lib/school-data';

// Setup IntersectionObserver mock for Vitest test environment
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock framer-motion & motion/react to avoid IntersectionObserver errors in test environment
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => true,
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => true,
}));

describe('Home Page Components Integration', () => {
  describe('AboutSection', () => {
    it('renders Headmaster Welcome title, name, summary, and link to /tentang-kami', () => {
      render(<AboutSection />);

      expect(screen.getByText(HEADMASTER_WELCOME.name)).toBeDefined();
      expect(screen.getByText(HEADMASTER_WELCOME.title)).toBeDefined();
      expect(screen.getByText(new RegExp(HEADMASTER_WELCOME.summary, 'i'))).toBeDefined();

      const link = screen.getByRole('link', { name: /baca sambutan selengkapnya/i });
      expect(link).toBeDefined();
      expect(link.getAttribute('href')).toBe('/tentang-kami');
    });
  });

  describe('ProgramSection', () => {
    it('renders Tahfidz Al-Qur\'an and Klinik Belajar details accurately from school-data', () => {
      render(<ProgramSection />);

      expect(screen.getByText(EXCELLENT_PROGRAMS.tahfidz.title)).toBeDefined();
      expect(screen.getByText(EXCELLENT_PROGRAMS.tahfidz.target)).toBeDefined();
      expect(screen.getByText(EXCELLENT_PROGRAMS.klinikBelajar.title)).toBeDefined();
      expect(screen.getByText(EXCELLENT_PROGRAMS.klinikBelajar.description)).toBeDefined();
    });
  });
});
