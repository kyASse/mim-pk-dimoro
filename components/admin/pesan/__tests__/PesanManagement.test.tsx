// components/admin/pesan/__tests__/PesanManagement.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PesanManagement from '../PesanManagement';
import { PesanMasuk } from '@/types/pesan';

const mockPesanList: PesanMasuk[] = [
  {
    id: 1,
    nama_pengirim: 'Budi Santoso',
    email_pengirim: 'budi@test.com',
    telepon: '08123456789',
    subjek: 'Pertanyaan Biaya Masuk',
    isi_pesan: 'Mohon info rincian biaya pendaftaran tahun ini.',
    status: 'belum_dibaca',
    created_at: '2026-08-21T09:00:00Z',
    updated_at: '2026-08-21T09:00:00Z',
  },
  {
    id: 2,
    nama_pengirim: 'Siti Aminah',
    email_pengirim: 'siti@test.com',
    telepon: null,
    subjek: 'Jadwal Observasi',
    isi_pesan: 'Kapan jadwal observasi siswa baru dimulai?',
    status: 'dibalas',
    created_at: '2026-08-20T10:00:00Z',
    updated_at: '2026-08-20T11:00:00Z',
  },
];

vi.mock('@/app/admin/pesan/actions', () => ({
  updatePesanStatusAction: vi.fn().mockResolvedValue({ success: true }),
  deletePesanAction: vi.fn().mockResolvedValue({ success: true }),
  markAllAsReadAction: vi.fn().mockResolvedValue({ success: true }),
}));

describe('PesanManagement', () => {
  it('renders stats cards with correct numbers', () => {
    render(<PesanManagement initialPesan={mockPesanList} />);
    expect(screen.getByText('Total Pesan')).toBeDefined();
    expect(screen.getAllByText('Belum Dibaca').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Sudah Dibalas').length).toBeGreaterThan(0);
    expect(screen.getByText('2')).toBeDefined();
  });

  it('filters message list when searching', () => {
    render(<PesanManagement initialPesan={mockPesanList} />);
    const searchInput = screen.getByPlaceholderText(/Cari pengirim, subjek, email/i);
    fireEvent.change(searchInput, { target: { value: 'Budi' } });

    expect(screen.getByText('Budi Santoso')).toBeDefined();
    expect(screen.queryByText('Siti Aminah')).toBeNull();
  });

  it('filters message by searching subject', () => {
    render(<PesanManagement initialPesan={mockPesanList} />);
    const searchInput = screen.getByPlaceholderText(/Cari pengirim, subjek, email/i);
    fireEvent.change(searchInput, { target: { value: 'Observasi' } });

    expect(screen.getByText('Siti Aminah')).toBeDefined();
    expect(screen.queryByText('Budi Santoso')).toBeNull();
  });

  it('opens detail sheet when message row is clicked', () => {
    render(<PesanManagement initialPesan={mockPesanList} />);
    const row = screen.getByText('Budi Santoso');
    fireEvent.click(row);

    expect(screen.getAllByText('Mohon info rincian biaya pendaftaran tahun ini.').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Balas Pesan Cepat')).toBeDefined();
  });
});
