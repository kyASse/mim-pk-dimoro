import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OpiniMobileCard from '../OpiniMobileCard';
import { OpiniPerspektif } from '@/lib/types/ruang-perspektif';

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

const mockOpini: OpiniPerspektif = {
  id: 'opini-1',
  slug: 'membangun-karakter-anak',
  judul: 'Membangun Karakter Anak Melalui Kebiasaan Baik',
  ringkasan: 'Pentingnya menanamkan akhlak dan keteladanan sejak usia dini di sekolah dan rumah.',
  isi_lengkap: '<p>Konten lengkap artikel</p>',
  kategori: 'Pendidikan & Karakter',
  nama_penulis: 'Ahmad Dahlan',
  peran_penulis: 'guru',
  keterangan_peran: 'Guru Kelas 4',
  foto_penulis_url: 'https://test.com/foto.jpg',
  gambar_sampul_url: 'https://test.com/sampul.jpg',
  kontak_wa: '08123456789',
  email: 'ahmad@test.com',
  status: 'menunggu_kurasi',
  catatan_redaksi: null,
  is_featured: false,
  waktu_terbit: null,
  dibaca_count: 0,
  created_at: '2026-03-10T08:00:00Z',
  updated_at: '2026-03-10T08:00:00Z',
};

describe('OpiniMobileCard component', () => {
  const mockToggle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders metadata, title, author info, and review link', () => {
    render(<OpiniMobileCard item={mockOpini} onToggleFeatured={mockToggle} />);

    expect(screen.getByText('Pendidikan & Karakter')).toBeDefined();
    expect(screen.getByText('Menunggu Kurasi')).toBeDefined();
    expect(screen.getByText('Membangun Karakter Anak Melalui Kebiasaan Baik')).toBeDefined();
    expect(screen.getByText('Ahmad Dahlan')).toBeDefined();
    expect(screen.getByText(/Guru/i)).toBeDefined();
    expect(screen.getByRole('link', { name: /Tinjau Naskah/i })).toBeDefined();
  });

  it('calls onToggleFeatured when star button is clicked', () => {
    render(<OpiniMobileCard item={mockOpini} onToggleFeatured={mockToggle} />);

    const starBtn = screen.getByRole('button', { name: /Jadikan sorotan/i });
    fireEvent.click(starBtn);

    expect(mockToggle).toHaveBeenCalledWith('opini-1', false);
  });
});
