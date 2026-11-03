import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GaleriAdminHub from '../GaleriAdminHub';
import { GaleriItem } from '../GaleriCard';

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

// Mock EditImageButton and DeleteImageButton
vi.mock('@/app/admin/galeri/EditImageButton', () => ({
  default: ({ galeriId }: { galeriId: number }) => (
    <button data-testid={`edit-btn-${galeriId}`}>Edit</button>
  ),
}));

vi.mock('@/app/admin/galeri/DeleteImageButton', () => ({
  default: ({ galeriId }: { galeriId: number }) => (
    <button data-testid={`delete-btn-${galeriId}`}>Hapus</button>
  ),
}));

const mockItems: GaleriItem[] = [
  {
    id: 1,
    image_url: 'https://example.com/kbm.jpg',
    keterangan: 'Praktik Sains di Laboratorium',
    kategori: 'Kegiatan Belajar',
    created_at: '2026-10-01T08:00:00Z',
  },
  {
    id: 2,
    image_url: 'https://example.com/sholat.jpg',
    keterangan: 'Sholat Dhuha Berjamaah',
    kategori: 'Ibadah',
    created_at: '2026-10-05T08:00:00Z',
  },
  {
    id: 3,
    image_url: 'https://example.com/lomba.jpg',
    keterangan: 'Juara Lomba Tahfidz Tingkat Kabupaten',
    kategori: 'Acara Khusus',
    created_at: '2026-10-10T08:00:00Z',
  },
  {
    id: 4,
    image_url: 'https://example.com/lukis.jpg',
    keterangan: 'Pameran Seni Kaligrafi',
    kategori: 'Seni & Kreativitas',
    created_at: '2026-10-12T08:00:00Z',
  },
];

describe('GaleriAdminHub', () => {
  it('renders 4 metric cards with correct counts', () => {
    render(<GaleriAdminHub items={mockItems} />);

    expect(screen.getByText('Total Foto')).toBeDefined();
    expect(screen.getAllByText('Kegiatan Belajar').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Ibadah & Karakter').length).toBeGreaterThan(0);

    const statTotal = screen.getByTestId('stat-total-count');
    const statBelajar = screen.getByTestId('stat-belajar-count');
    const statIbadah = screen.getByTestId('stat-ibadah-count');

    expect(statTotal.textContent).toBe('4');
    expect(statBelajar.textContent).toBe('1');
    expect(statIbadah.textContent).toBe('1');
  });

  it('filters photos by category pill tab', () => {
    render(<GaleriAdminHub items={mockItems} />);

    // Click "Kegiatan Belajar" tab
    const kbmTab = screen.getByRole('button', { name: /^kegiatan belajar/i });
    fireEvent.click(kbmTab);

    expect(screen.getByText('Praktik Sains di Laboratorium')).toBeDefined();
    expect(screen.queryByText('Sholat Dhuha Berjamaah')).toBeNull();
    expect(screen.queryByText('Juara Lomba Tahfidz Tingkat Kabupaten')).toBeNull();
  });

  it('filters photos by live search query', () => {
    render(<GaleriAdminHub items={mockItems} />);

    const searchInput = screen.getByPlaceholderText(/Cari foto berdasarkan keterangan/i);
    fireEvent.change(searchInput, { target: { value: 'Tahfidz' } });

    expect(screen.queryByText('Praktik Sains di Laboratorium')).toBeNull();
    expect(screen.getByText('Juara Lomba Tahfidz Tingkat Kabupaten')).toBeDefined();
  });

  it('shows empty state when no items match filter and resets on click', () => {
    render(<GaleriAdminHub items={mockItems} />);

    const searchInput = screen.getByPlaceholderText(/Cari foto berdasarkan keterangan/i);
    fireEvent.change(searchInput, { target: { value: 'KataKunciTidakAda' } });

    expect(screen.getByText(/Tidak ada foto yang cocok/i)).toBeDefined();

    const resetBtn = screen.getByRole('button', { name: /Reset Filter/i });
    fireEvent.click(resetBtn);

    expect(screen.getByText('Praktik Sains di Laboratorium')).toBeDefined();
  });
});
