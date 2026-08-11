import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import AboutSection from '@/components/home/AboutSection';
import ProgramSection from '@/components/home/ProgramSection';
import { HEADMASTER_WELCOME, EXCELLENT_PROGRAMS } from '@/lib/school-data';

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

