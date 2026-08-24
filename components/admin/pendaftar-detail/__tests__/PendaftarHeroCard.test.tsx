import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

import PendaftarHeroCard from '../PendaftarHeroCard';

const mockPendaftar = {
  id: 'pendaftar-1',
  nomor_induk: '3301123456780001',
  nama_lengkap: 'Muhammad Al-Fatih',
  nama_panggilan: 'Fatih',
  jenis_kelamin: 'L',
  status_pendaftaran: 'Menunggu Persetujuan',
  nomor_telepon: '081234567890',
  nama_ayah_kandung: 'Sultan Murad',
  nama_ibu_kandung: 'Huma Hatun',
  created_at: '2026-08-01T10:00:00Z',
};

describe('PendaftarHeroCard Component', () => {
  it('renders student name, initials, registration ID, and NIK', () => {
    render(
      <PendaftarHeroCard
        pendaftar={mockPendaftar}
        regId="MIM-2026-001"
        onOpenWhatsApp={vi.fn()}
        onStatusChange={vi.fn()}
      />
    );

    expect(screen.getByRole('heading', { name: 'Muhammad Al-Fatih' })).toBeDefined();
    expect(screen.getByText('MIM-2026-001')).toBeDefined();
    expect(screen.getAllByText(/3301123456780001/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Menunggu Persetujuan').length).toBeGreaterThanOrEqual(1);
  });

  it('triggers onOpenWhatsApp callback when WhatsApp button clicked', () => {
    const onOpenWhatsApp = vi.fn();
    render(
      <PendaftarHeroCard
        pendaftar={mockPendaftar}
        regId="MIM-2026-001"
        onOpenWhatsApp={onOpenWhatsApp}
        onStatusChange={vi.fn()}
      />
    );

    const waBtn = screen.getByRole('button', { name: /kirim pesan whatsapp/i });
    fireEvent.click(waBtn);
    expect(onOpenWhatsApp).toHaveBeenCalled();
  });
});
