import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import SiswaMobileCard from '../SiswaMobileCard';

describe('SiswaMobileCard Component', () => {
  const mockSiswa = {
    id: 'siswa-1',
    nama_lengkap: 'Muhammad Al-Fatih',
    tanggal_lahir: '2019-08-20',
    kelompok: 'Kelas 1A',
    rombel_id: 'rombel-1a',
    profile_orang_tua_id: 'parent-1',
    parentProfile: {
      id: 'parent-1',
      nama_lengkap: 'Sultan Murad',
      email: 'murad@example.com',
    },
  };

  const mockRombels = [
    { id: 'rombel-1a', nama: 'Kelas 1A' },
    { id: 'rombel-1b', nama: 'Kelas 1B' },
  ];

  it('renders student name, avatar initials, and parent account status', () => {
    render(
      <SiswaMobileCard
        siswa={mockSiswa}
        rombels={mockRombels}
        onOpenLinkModal={vi.fn()}
        onRombelChange={vi.fn()}
        onDelete={vi.fn()}
        isPending={false}
      />
    );

    expect(screen.getByText('Muhammad Al-Fatih')).toBeDefined();
    expect(screen.getByText('MA')).toBeDefined();
    expect(screen.getByText(/Sultan Murad/)).toBeDefined();
  });

  it('triggers onOpenLinkModal when Kelola Akun Wali button is clicked', () => {
    const handleOpenLinkModal = vi.fn();
    render(
      <SiswaMobileCard
        siswa={mockSiswa}
        rombels={mockRombels}
        onOpenLinkModal={handleOpenLinkModal}
        onRombelChange={vi.fn()}
        onDelete={vi.fn()}
        isPending={false}
      />
    );

    const linkBtn = screen.getByRole('button', { name: /kelola akun wali/i });
    fireEvent.click(linkBtn);
    expect(handleOpenLinkModal).toHaveBeenCalledWith(mockSiswa);
  });
});
