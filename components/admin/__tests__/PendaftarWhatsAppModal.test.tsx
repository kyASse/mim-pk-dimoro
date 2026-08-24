import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import PendaftarWhatsAppModal from '../PendaftarWhatsAppModal';

const mockRecipients = [
  {
    id: 'p-1',
    nama_lengkap: 'Muhammad Al-Fatih',
    nama_ayah_kandung: 'Sultan Murad',
    nomor_telepon: '081234567890',
    status_pendaftaran: 'Menunggu Persetujuan',
    regId: 'MIM-2026-001',
  },
  {
    id: 'p-2',
    nama_lengkap: 'Aisyah Humaira',
    nama_ayah_kandung: 'Abu Bakar',
    nomor_telepon: '089876543210',
    status_pendaftaran: 'Diterima',
    regId: 'MIM-2026-002',
  },
];

describe('PendaftarWhatsAppModal', () => {
  it('renders modal with template options when open is true', () => {
    render(
      <PendaftarWhatsAppModal
        open={true}
        onOpenChange={vi.fn()}
        recipients={mockRecipients}
      />
    );

    expect(screen.getByText(/Kirim Pesan WhatsApp/i)).toBeDefined();
    expect(screen.getByText(/Jadwal Tes Observasi/i)).toBeDefined();
    expect(screen.getByText(/Konfirmasi Berkas/i)).toBeDefined();
    expect(screen.getByText(/Pengumuman Kelulusan/i)).toBeDefined();
  });

  it('switches template and updates message preview dynamically', () => {
    render(
      <PendaftarWhatsAppModal
        open={true}
        onOpenChange={vi.fn()}
        recipients={mockRecipients}
      />
    );

    // Click on Pengumuman Kelulusan template button
    const kelulusanBtn = screen.getByText(/Pengumuman Kelulusan/i);
    fireEvent.click(kelulusanBtn);

    expect(screen.getByText(/Alhamdulillah/i)).toBeDefined();
  });

  it('marks contact as sent in queue when Send WA is clicked', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(
      <PendaftarWhatsAppModal
        open={true}
        onOpenChange={vi.fn()}
        recipients={mockRecipients}
      />
    );

    const sendButtons = screen.getAllByRole('button', { name: /kirim wa/i });
    expect(sendButtons.length).toBeGreaterThan(0);

    fireEvent.click(sendButtons[0]);
    expect(openSpy).toHaveBeenCalled();
    expect(screen.getAllByText(/Terkirim/i).length).toBeGreaterThan(0);

    openSpy.mockRestore();
  });

  it('copies message template text to clipboard', async () => {
    const writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextSpy,
      },
    });

    render(
      <PendaftarWhatsAppModal
        open={true}
        onOpenChange={vi.fn()}
        recipients={mockRecipients}
      />
    );

    const copyBtn = screen.getByRole('button', { name: /salin teks pesan/i });
    fireEvent.click(copyBtn);

    expect(writeTextSpy).toHaveBeenCalled();
  });
});
