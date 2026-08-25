import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import MasterRombelGrid from '@/components/admin/siswa/MasterRombelGrid';

// Mock server actions
vi.mock('@/app/admin/siswa/actions', () => ({
  updateRombelWaliKelasAction: vi.fn(() => Promise.resolve({ success: true })),
}));

// Mock router
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

const mockRombels = [
  {
    id: 'rombel-1a',
    nama: 'Kelas 1A',
    tingkat: 1,
    tahun_ajaran: '2026/2027',
    wali_kelas_nama: 'Ustz. Siti Rahmawati, S.Pd.I',
    kapasitas: 28,
    siswaCount: 20,
  },
  {
    id: 'rombel-1b',
    nama: 'Kelas 1B',
    tingkat: 1,
    tahun_ajaran: '2026/2027',
    wali_kelas_nama: 'Ustz. Nur Hidayah, S.Pd.',
    kapasitas: 28,
    siswaCount: 15,
  },
];

describe('MasterRombelGrid Component', () => {
  it('renders rombel cards with class name, homeroom teacher, and capacity', () => {
    render(<MasterRombelGrid rombels={mockRombels} />);

    expect(screen.getByText('Kelas 1A')).toBeDefined();
    expect(screen.getByText('Ustz. Siti Rahmawati, S.Pd.I')).toBeDefined();
    expect(screen.getByText('Kelas 1B')).toBeDefined();
    expect(screen.getByText('Ustz. Nur Hidayah, S.Pd.')).toBeDefined();
    expect(screen.getByText(/20 \/ 28/)).toBeDefined();
  });

  it('opens edit dialog when edit button is clicked', async () => {
    render(<MasterRombelGrid rombels={mockRombels} />);

    const editButtons = screen.getAllByRole('button', { name: /atur rombel/i });
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Atur Wali Kelas & Kapasitas/i)).toBeDefined();
      expect(screen.getByDisplayValue('Ustz. Siti Rahmawati, S.Pd.I')).toBeDefined();
    });
  });
});
