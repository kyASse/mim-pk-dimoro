import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TambahKegiatanForm from '../TambahKegiatanForm';

// Mock ResizeObserver for Radix UI components in JSDOM
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock server actions
vi.mock('../../actions', () => ({
  createKegiatanAction: vi.fn(),
}));

describe('TambahKegiatanForm Component (app/admin/kalender/tambah/TambahKegiatanForm.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders input fields, sections, and live preview card', () => {
    render(<TambahKegiatanForm />);

    expect(screen.getByLabelText(/Judul Kegiatan/i)).toBeDefined();
    expect(screen.getByLabelText(/Tanggal Mulai/i)).toBeDefined();
    expect(screen.getByLabelText(/Tanggal Berakhir/i)).toBeDefined();
    expect(screen.getByText(/Pratinjau Langsung \(Live\)/i)).toBeDefined();
    expect(screen.getByText(/Judul Kegiatan Belum Diisi/i)).toBeDefined();
  });

  it('updates live preview title dynamically as user types', () => {
    render(<TambahKegiatanForm />);

    const judulInput = screen.getByPlaceholderText(/Contoh: Penilaian Tengah Semester/i);
    fireEvent.change(judulInput, { target: { value: 'Kemah Santri 2026' } });

    expect(screen.getByText('Kemah Santri 2026')).toBeDefined();
  });

  it('toggles waktu input when switching all-day switch', () => {
    render(<TambahKegiatanForm />);

    const switchToggle = screen.getByRole('switch');
    expect(switchToggle).toBeDefined();

    // Default is all day (isAllDay = true) -> Waktu input is hidden
    expect(screen.queryByPlaceholderText(/07:30 - 12:00 WIB/i)).toBeNull();

    // Switch off all-day
    fireEvent.click(switchToggle);

    // Waktu input should appear
    const waktuInput = screen.getByPlaceholderText(/07:30 - 12:00 WIB/i);
    expect(waktuInput).toBeDefined();

    // Type in waktu
    fireEvent.change(waktuInput, { target: { value: '08:00 - 11:00 WIB' } });
    expect(screen.getByText('08:00 - 11:00 WIB')).toBeDefined();
  });
});
