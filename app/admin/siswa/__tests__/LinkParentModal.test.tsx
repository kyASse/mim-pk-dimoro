import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import LinkParentModal from '@/components/admin/siswa/LinkParentModal';

// Mock server actions
vi.mock('@/app/admin/siswa/actions', () => ({
  searchParentProfilesAction: vi.fn(() =>
    Promise.resolve({
      success: true,
      data: [
        {
          id: 'parent-1',
          nama_lengkap: 'Bambang Sutrisno',
          email: 'bambang@example.com',
          siswa: [{ id: 'siswa-child-1', nama_lengkap: 'Fatimah' }],
        },
      ],
    })
  ),
  linkExistingParentAccountAction: vi.fn(() => Promise.resolve({ success: true })),
  linkOrCreateParentAccountAction: vi.fn(() => Promise.resolve({ success: true })),
  unlinkParentAccountAction: vi.fn(() => Promise.resolve({ success: true })),
}));

// Mock router
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

describe('LinkParentModal Component', () => {
  const mockSiswa = {
    id: 'siswa-1',
    nama_lengkap: 'Muhammad Al-Fatih',
    profile_orang_tua_id: null,
  };

  it('renders modal with search and create tabs when open', async () => {
    render(
      <LinkParentModal
        siswa={mockSiswa}
        open={true}
        onOpenChange={vi.fn()}
      />
    );

    expect(screen.getByText(/Hubungkan Akun Orang Tua/i)).toBeDefined();
    expect(screen.getByRole('tab', { name: /cari akun/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /buat akun baru/i })).toBeDefined();
  });

  it('searches existing parent profiles and displays results with multi-child indicators', async () => {
    render(
      <LinkParentModal
        siswa={mockSiswa}
        open={true}
        onOpenChange={vi.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText(/cari nama atau email orang tua/i);
    fireEvent.change(searchInput, { target: { value: 'Bambang' } });

    await waitFor(() => {
      expect(screen.getByText('Bambang Sutrisno')).toBeDefined();
      expect(screen.getByText('bambang@example.com')).toBeDefined();
      expect(screen.getByText(/1 anak terhubung/i)).toBeDefined();
    });
  });
});
