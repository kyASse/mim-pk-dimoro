import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BeritaTable, { BeritaItem } from '../BeritaTable';

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ fill, ...props }: any) => <img {...props} />,
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock DeleteButton
vi.mock('@/app/admin/berita/DeleteButton', () => ({
  default: ({ beritaId }: { beritaId: number }) => (
    <button data-testid={`delete-btn-${beritaId}`}>Hapus</button>
  ),
}));

const mockBerita: BeritaItem[] = [
  {
    id: 1,
    judul: 'Kegiatan Pondok Ramadhan 1447 H',
    ringkasan: 'Seluruh siswa antusias mengikuti kegiatan pondok ramadhan.',
    tanggal_terbit: '2026-03-15T08:00:00Z',
    image_url: 'https://test.com/ramadhan.jpg',
    status: 'terbit',
  },
  {
    id: 2,
    judul: 'Prestasi Juara 1 Robotik Tingkat Provinsi',
    ringkasan: 'Tim robotik MIM PK Dimoro menjuarai ajang kompetisi.',
    tanggal_terbit: '2026-03-20T10:00:00Z',
    image_url: 'https://test.com/robotik.jpg',
    status: 'published',
  },
  {
    id: 3,
    judul: 'Rencana Pelaksanaan Outing Class 2026',
    ringkasan: 'Informasi rencana kegiatan outing class semester genap.',
    tanggal_terbit: '2026-04-01T07:30:00Z',
    image_url: 'https://test.com/outing.jpg',
    status: 'draft',
  },
];

describe('BeritaTable component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders metric cards with correct counts', () => {
    render(<BeritaTable berita={mockBerita} />);

    // Total: 3, Diterbitkan: 2, Draft: 1
    expect(screen.getByText('Total Berita')).toBeDefined();
    expect(screen.getAllByText('Diterbitkan').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Draft').length).toBeGreaterThan(0);

    // Verify stats numbers
    const totalCount = screen.getByTestId('stat-total-count');
    const publishedCount = screen.getByTestId('stat-published-count');
    const draftCount = screen.getByTestId('stat-draft-count');

    expect(totalCount.textContent).toBe('3');
    expect(publishedCount.textContent).toBe('2');
    expect(draftCount.textContent).toBe('1');
  });

  it('filters data when status pill tabs are clicked', () => {
    render(<BeritaTable berita={mockBerita} />);

    // Click Draft tab
    const draftTab = screen.getByRole('button', { name: /^draft/i });
    fireEvent.click(draftTab);

    // Only "Rencana Pelaksanaan Outing Class 2026" should remain visible in both desktop and mobile
    expect(screen.queryByText('Kegiatan Pondok Ramadhan 1447 H')).toBeNull();
    expect(screen.queryByText('Prestasi Juara 1 Robotik Tingkat Provinsi')).toBeNull();
    expect(screen.getAllByText('Rencana Pelaksanaan Outing Class 2026').length).toBeGreaterThan(0);
  });

  it('filters data by search query matching title or summary', () => {
    render(<BeritaTable berita={mockBerita} />);

    const searchInput = screen.getByPlaceholderText(/Cari berita berdasarkan judul/i);
    fireEvent.change(searchInput, { target: { value: 'Robotik' } });

    expect(screen.queryByText('Kegiatan Pondok Ramadhan 1447 H')).toBeNull();
    expect(screen.getAllByText('Prestasi Juara 1 Robotik Tingkat Provinsi').length).toBeGreaterThan(0);
  });

  it('shows empty state when no news matches query or list is empty', () => {
    render(<BeritaTable berita={[]} />);

    expect(screen.getByText('Belum Ada Berita')).toBeDefined();
    expect(screen.getByText(/Mulai publikasikan artikel/i)).toBeDefined();
    expect(screen.getByRole('link', { name: /Tambah Berita/i })).toBeDefined();
  });
});
