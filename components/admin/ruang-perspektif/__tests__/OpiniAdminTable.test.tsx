import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OpiniAdminTable from '../OpiniAdminTable';
import { OpiniPerspektif } from '@/lib/types/ruang-perspektif';
import * as actions from '@/app/admin/ruang-perspektif/actions';
import { toast } from 'sonner';

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

// Mock actions
vi.mock('@/app/admin/ruang-perspektif/actions', () => ({
  toggleFeaturedOpiniAction: vi.fn(),
}));

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockOpinions: OpiniPerspektif[] = [
  {
    id: 'opini-1',
    slug: 'membangun-karakter-anak',
    judul: 'Membangun Karakter Anak',
    ringkasan: 'Pentingnya menanamkan akhlak mulia.',
    isi_lengkap: '<p>Konten</p>',
    kategori: 'Pendidikan & Karakter',
    nama_penulis: 'Ahmad Dahlan',
    peran_penulis: 'guru',
    keterangan_peran: 'Guru Kelas 4',
    foto_penulis_url: null,
    gambar_sampul_url: 'https://test.com/sampul1.jpg',
    kontak_wa: '08123456789',
    email: null,
    status: 'menunggu_kurasi',
    catatan_redaksi: null,
    is_featured: false,
    waktu_terbit: null,
    dibaca_count: 0,
    created_at: '2026-03-10T08:00:00Z',
    updated_at: '2026-03-10T08:00:00Z',
  },
  {
    id: 'opini-2',
    slug: 'parenting-era-digital',
    judul: 'Parenting di Era Digital',
    ringkasan: 'Menjaga batasan screen time untuk anak.',
    isi_lengkap: '<p>Konten parenting</p>',
    kategori: 'Pola Asuh & Parenting',
    nama_penulis: 'Siti Walidah',
    peran_penulis: 'wali_murid',
    keterangan_peran: 'Wali Murid Kelas 2',
    foto_penulis_url: null,
    gambar_sampul_url: null,
    kontak_wa: '08123456780',
    email: null,
    status: 'terbit',
    catatan_redaksi: null,
    is_featured: true,
    waktu_terbit: '2026-03-12T08:00:00Z',
    dibaca_count: 120,
    created_at: '2026-03-11T08:00:00Z',
    updated_at: '2026-03-12T08:00:00Z',
  },
  {
    id: 'opini-3',
    slug: 'refleksi-alumni',
    judul: 'Refleksi Perjalanan Menjadi Alumni',
    ringkasan: 'Kenangan berharga selama belajar di madrasah.',
    isi_lengkap: '<p>Konten alumni</p>',
    kategori: 'Opini Bebas',
    nama_penulis: 'Budi Santoso',
    peran_penulis: 'alumni',
    keterangan_peran: null,
    foto_penulis_url: null,
    gambar_sampul_url: null,
    kontak_wa: '08123456781',
    email: null,
    status: 'ditolak',
    catatan_redaksi: 'Kurang relevan',
    is_featured: false,
    waktu_terbit: null,
    dibaca_count: 0,
    created_at: '2026-03-12T08:00:00Z',
    updated_at: '2026-03-12T08:00:00Z',
  },
];

describe('OpiniAdminTable component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders 4 metric highlight cards with correct numbers', () => {
    render(<OpiniAdminTable items={mockOpinions} />);

    expect(screen.getByText('Perlu Kurasi')).toBeDefined();
    expect(screen.getByText('Naskah Terbit')).toBeDefined();
    expect(screen.getByText('Naskah Sorotan')).toBeDefined();
    expect(screen.getByText('Total Masuk')).toBeDefined();

    expect(screen.getByTestId('stat-menunggu-count').textContent).toBe('1');
    expect(screen.getByTestId('stat-terbit-count').textContent).toBe('1');
    expect(screen.getByTestId('stat-featured-count').textContent).toBe('1');
    expect(screen.getByTestId('stat-total-count').textContent).toBe('3');
  });

  it('filters data when status tabs are clicked', () => {
    render(<OpiniAdminTable items={mockOpinions} />);

    const terbitTab = screen.getByRole('button', { name: /^terbit/i });
    fireEvent.click(terbitTab);

    // Only 'Parenting di Era Digital' should be visible
    expect(screen.queryByText('Membangun Karakter Anak')).toBeNull();
    expect(screen.queryByText('Refleksi Perjalanan Menjadi Alumni')).toBeNull();
    expect(screen.getAllByText('Parenting di Era Digital').length).toBeGreaterThan(0);
  });

  it('filters data by search query matching title or author name', () => {
    render(<OpiniAdminTable items={mockOpinions} />);

    const searchInput = screen.getByPlaceholderText(/Cari naskah atau penulis/i);
    fireEvent.change(searchInput, { target: { value: 'Siti Walidah' } });

    expect(screen.queryByText('Membangun Karakter Anak')).toBeNull();
    expect(screen.getAllByText('Parenting di Era Digital').length).toBeGreaterThan(0);
  });

  it('toggles featured state when clicking star button in desktop table', async () => {
    vi.mocked(actions.toggleFeaturedOpiniAction).mockResolvedValueOnce({
      success: true,
      data: { id: 'opini-1', is_featured: true } as any,
    });

    render(<OpiniAdminTable items={mockOpinions} />);

    const starBtns = screen.getAllByRole('button', { name: /Jadikan sorotan/i });
    fireEvent.click(starBtns[0]);

    await waitFor(() => {
      expect(actions.toggleFeaturedOpiniAction).toHaveBeenCalledWith('opini-1', true);
      expect(toast.success).toHaveBeenCalledWith('Dijadikan naskah sorotan');
    });
  });

  it('shows empty state when no opinions match search', () => {
    render(<OpiniAdminTable items={mockOpinions} />);

    const searchInput = screen.getByPlaceholderText(/Cari naskah atau penulis/i);
    fireEvent.change(searchInput, { target: { value: 'TidakAdaNaskah123' } });

    expect(screen.getByText('Tidak Ada Naskah Opini')).toBeDefined();
    expect(screen.getByRole('button', { name: /Reset Filter/i })).toBeDefined();
  });
});
