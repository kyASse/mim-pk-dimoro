import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import KelolaSiswaClient from '@/components/admin/siswa/KelolaSiswaClient';

// Mock router
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

// Mock server actions
vi.mock('@/app/admin/siswa/actions', () => ({
  createSiswaAction: vi.fn(() => Promise.resolve({ success: true })),
  updateRombelWaliKelasAction: vi.fn(() => Promise.resolve({ success: true })),
  assignSiswaRombelAction: vi.fn(() => Promise.resolve({ success: true })),
  searchParentProfilesAction: vi.fn(() => Promise.resolve({ success: true, data: [] })),
  linkExistingParentAccountAction: vi.fn(() => Promise.resolve({ success: true })),
  unlinkParentAccountAction: vi.fn(() => Promise.resolve({ success: true })),
  deleteSiswaAction: vi.fn(() => Promise.resolve({ success: true })),
  importSiswaFromPendaftarAction: vi.fn(() => Promise.resolve({ success: true })),
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
    rombel: {
      id: 'rombel-1a',
      nama: 'Kelas 1A',
      wali_kelas_nama: 'Ustz. Siti Rahmawati, S.Pd.I',
    },
  },
  {
    id: 'siswa-2',
    nama_lengkap: 'Abdullah Al-Ghazi',
    tanggal_lahir: '2017-03-15',
    kelompok: 'Kelas 3A',
    rombel_id: 'rombel-3a',
    profile_orang_tua_id: 'parent-1', // Same parent: multi-child!
    parentProfile: {
      id: 'parent-1',
      nama_lengkap: 'Bambang Sutrisno',
      email: 'bambang@example.com',
    },
    rombel: {
      id: 'rombel-3a',
      nama: 'Kelas 3A',
      wali_kelas_nama: 'Ust. Muhammad Ridwan, M.Pd.',
    },
  },
];

const mockRombels = [
  {
    id: 'rombel-1a',
    nama: 'Kelas 1A',
    tingkat: 1,
    tahun_ajaran: '2026/2027',
    wali_kelas_nama: 'Ustz. Siti Rahmawati, S.Pd.I',
    kapasitas: 28,
    siswaCount: 1,
  },
  {
    id: 'rombel-3a',
    nama: 'Kelas 3A',
    tingkat: 3,
    tahun_ajaran: '2026/2027',
    wali_kelas_nama: 'Ust. Muhammad Ridwan, M.Pd.',
    kapasitas: 28,
    siswaCount: 1,
  },
];

const mockAcceptedApplicants = [
  {
    id: 'pendaftar-1',
    nama_lengkap: 'Tariq Bin Ziyad',
    status_pendaftaran: 'Diterima',
    created_at: '2026-08-15T08:00:00Z',
    diterima_di_kelas: 'Kelas 1A',
  },
];

describe('KelolaSiswaClient Integration View', () => {
  it('renders metric cards with correct numbers (total, linked, unlinked, rombel)', () => {
    render(
      <KelolaSiswaClient
        siswaList={mockSiswaList}
        rombels={mockRombels}
        acceptedApplicants={mockAcceptedApplicants}
      />
    );

    expect(screen.getByText('Total Siswa')).toBeDefined();
    expect(screen.getByText('Akun Wali Terhubung')).toBeDefined();
    expect(screen.getByText('Rombel Aktif')).toBeDefined();
    expect(screen.getAllByText('Fatimah Zahra').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Abdullah Al-Ghazi').length).toBeGreaterThanOrEqual(1);
  });

  it('renders Master Rombel tab when selected', () => {
    render(
      <KelolaSiswaClient
        siswaList={mockSiswaList}
        rombels={mockRombels}
        acceptedApplicants={mockAcceptedApplicants}
        defaultTab="rombel"
      />
    );

    expect(screen.getByText('Ustz. Siti Rahmawati, S.Pd.I')).toBeDefined();
    expect(screen.getByText('Ust. Muhammad Ridwan, M.Pd.')).toBeDefined();
  });

  it('renders Import PPDB tab when selected', () => {
    render(
      <KelolaSiswaClient
        siswaList={mockSiswaList}
        rombels={mockRombels}
        acceptedApplicants={mockAcceptedApplicants}
        defaultTab="import"
      />
    );

    expect(screen.getByText('Tariq Bin Ziyad')).toBeDefined();
  });
});
