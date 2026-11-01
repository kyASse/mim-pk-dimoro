import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import KalenderManagement, { KegiatanAkademik } from '../KalenderManagement';

// Mock child components
vi.mock('@/app/admin/kalender/DeleteKegiatanButton', () => ({
  default: ({ kegiatanId }: { kegiatanId: number }) => (
    <button data-testid={`delete-btn-${kegiatanId}`}>Hapus</button>
  ),
}));

describe('KalenderManagement Component (components/admin/kalender/KalenderManagement.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockEvents: KegiatanAkademik[] = [
    {
      id: 1,
      judul: 'Penilaian Tengah Semester (PTS)',
      tanggal: '2026-10-15',
      tanggal_berakhir: '2026-10-20',
      waktu: '07:30 - 11:30',
      kategori: 'Kegiatan Sekolah',
      deskripsi: 'Pelaksanaan ujian tengah semester ganjil untuk seluruh kelas.',
    },
    {
      id: 2,
      judul: 'Libur Hari Santri Nasional',
      tanggal: '2026-10-22',
      tanggal_berakhir: null,
      waktu: null,
      kategori: 'Libur Umum',
      deskripsi: 'Libur peringatan Hari Santri Nasional.',
    },
    {
      id: 3,
      judul: 'Workshop Parenting Madrasah',
      tanggal: '2026-11-05',
      tanggal_berakhir: null,
      waktu: '08:00 - 12:00',
      kategori: 'Parenting',
      deskripsi: 'Sosialisasi sinergi madrasah dan wali murid.',
    },
  ];

  it('renders metric cards with calculated numbers correctly', () => {
    render(<KalenderManagement initialKegiatan={mockEvents} />);

    // Total kegiatan card
    const totalLabel = screen.getByText('Total Kegiatan');
    const totalCard = totalLabel.closest('div')!;
    expect(within(totalCard).getByText('3')).toBeDefined();

    // Summary text
    expect(screen.getByText(/Menampilkan 3 dari 3 agenda/i)).toBeDefined();
  });

  it('filters data in real time when typing in search input', () => {
    render(<KalenderManagement initialKegiatan={mockEvents} />);

    const searchInput = screen.getByPlaceholderText(/Cari judul atau deskripsi/i);
    fireEvent.change(searchInput, { target: { value: 'Santri' } });

    // Should show delete button for item 2, but not 1 or 3
    expect(screen.getAllByTestId('delete-btn-2').length).toBeGreaterThan(0);
    expect(screen.queryByTestId('delete-btn-1')).toBeNull();
    expect(screen.queryByTestId('delete-btn-3')).toBeNull();
    expect(screen.getByText(/Menampilkan 1 dari 3 agenda/i)).toBeDefined();
  });

  it('filters data when selecting category pill tabs', () => {
    render(<KalenderManagement initialKegiatan={mockEvents} />);

    // Click 'Parenting' category pill tab
    const parentingTab = screen.getByRole('button', { name: /Parenting/i });
    fireEvent.click(parentingTab);

    expect(screen.getAllByTestId('delete-btn-3').length).toBeGreaterThan(0);
    expect(screen.queryByTestId('delete-btn-1')).toBeNull();
    expect(screen.queryByTestId('delete-btn-2')).toBeNull();
  });

  it('displays empty state when search returns no matching events', () => {
    render(<KalenderManagement initialKegiatan={mockEvents} />);

    const searchInput = screen.getByPlaceholderText(/Cari judul atau deskripsi/i);
    fireEvent.change(searchInput, { target: { value: 'Kata Kunci Tidak Ada' } });

    expect(screen.getAllByText('Tidak Ada Kegiatan').length).toBeGreaterThan(0);
    expect(screen.getByText(/Menampilkan 0 dari 3 agenda/i)).toBeDefined();
  });

  it('resets filter when clicking Reset Filter button', () => {
    render(<KalenderManagement initialKegiatan={mockEvents} />);

    const searchInput = screen.getByPlaceholderText(/Cari judul atau deskripsi/i);
    fireEvent.change(searchInput, { target: { value: 'Santri' } });

    const resetBtn = screen.getByRole('button', { name: /Reset Filter/i });
    fireEvent.click(resetBtn);

    expect(screen.getByText(/Menampilkan 3 dari 3 agenda/i)).toBeDefined();
  });
});
