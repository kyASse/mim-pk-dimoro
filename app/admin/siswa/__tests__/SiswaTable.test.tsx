import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import SiswaTable from '@/components/admin/siswa/SiswaTable';

// Mock server actions
vi.mock('@/app/admin/siswa/actions', () => ({
  assignSiswaRombelAction: vi.fn(() => Promise.resolve({ success: true })),
  deleteSiswaAction: vi.fn(() => Promise.resolve({ success: true })),
  searchParentProfilesAction: vi.fn(() => Promise.resolve({ success: true, data: [] })),
  linkExistingParentAccountAction: vi.fn(() => Promise.resolve({ success: true })),
  unlinkParentAccountAction: vi.fn(() => Promise.resolve({ success: true })),
}));

// Mock router
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

const mockSiswaList = [
  {
    id: 'siswa-1',
    nama_lengkap: 'Fatimah Zahra',
    tanggal_lahir: '2019-08-20',
    kelompok: 'Kelas 1A',
    rombel_id: 'rombel-1a',
    profile_orang_tua_id: 'parent-1',
    parentProfile: {
      id: 'parent-1',
      nama_lengkap: 'Bambang Sutrisno',
      email: 'bambang@example.com',
    },
  },
  {
    id: 'siswa-2',
    nama_lengkap: 'Abdullah Al-Ghazi',
    tanggal_lahir: '2017-03-15',
    kelompok: 'Kelas 3A',
    rombel_id: 'rombel-3a',
    profile_orang_tua_id: null,
  },
];

const mockRombels = [
  { id: 'rombel-1a', nama: 'Kelas 1A' },
  { id: 'rombel-3a', nama: 'Kelas 3A' },
];

describe('SiswaTable Component', () => {
  it('renders both desktop table and mobile cards seamlessly', () => {
    render(<SiswaTable siswaList={mockSiswaList} rombels={mockRombels} />);

    expect(screen.getAllByText('Fatimah Zahra').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Abdullah Al-Ghazi').length).toBeGreaterThanOrEqual(1);
  });

  it('filters students by search input', () => {
    render(<SiswaTable siswaList={mockSiswaList} rombels={mockRombels} />);

    const searchInput = screen.getByPlaceholderText(/cari nama siswa atau nama\/email wali/i);
    fireEvent.change(searchInput, { target: { value: 'Fatimah' } });

    expect(screen.getAllByText('Fatimah Zahra').length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText('Abdullah Al-Ghazi')).toBeNull();
  });
});
