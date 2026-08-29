// components/admin/pesan/__tests__/PesanDetailSheet.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PesanDetailSheet from '../PesanDetailSheet';
import { PesanMasuk } from '@/types/pesan';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

const mockPesan: PesanMasuk = {
  id: 10,
  nama_pengirim: 'Bapak Hendra',
  email_pengirim: 'hendra@example.com',
  telepon: '081298765432',
  subjek: 'Pertanyaan Program Tahfidz',
  isi_pesan: 'Apakah ada kelas tahfidz khusus untuk anak usia 7 tahun?',
  status: 'belum_dibaca',
  created_at: '2026-08-25T08:30:00Z',
  updated_at: '2026-08-25T08:30:00Z',
};

const mockPesanNoPhone: PesanMasuk = {
  ...mockPesan,
  id: 11,
  telepon: null,
};

describe('PesanDetailSheet', () => {
  const mockOnClose = vi.fn();
  const mockOnStatusChange = vi.fn().mockResolvedValue(undefined);
  const mockOnDelete = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
    // mock window.open
    vi.spyOn(window, 'open').mockImplementation(() => null);
  });

  it('renders sender details and message body correctly', () => {
    render(
      <PesanDetailSheet
        pesan={mockPesan}
        isOpen={true}
        onClose={mockOnClose}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Bapak Hendra')).toBeDefined();
    expect(screen.getByText('hendra@example.com')).toBeDefined();
    expect(screen.getByText('081298765432')).toBeDefined();
    expect(screen.getByText('Pertanyaan Program Tahfidz')).toBeDefined();
    expect(
      screen.getByText('Apakah ada kelas tahfidz khusus untuk anak usia 7 tahun?')
    ).toBeDefined();
  });

  it('renders all quick reply template pills in active tab', () => {
    render(
      <PesanDetailSheet
        pesan={mockPesan}
        isOpen={true}
        onClose={mockOnClose}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByRole('button', { name: /^Standar$/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Informasi PPDB & Syarat/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Rincian Biaya & SPP/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Program Unggulan & Jadwal/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Undangan Kunjungan \/ Observasi/i })).toBeDefined();
  });

  it('updates WhatsApp textarea when clicking PPDB template pill', () => {
    render(
      <PesanDetailSheet
        pesan={mockPesan}
        isOpen={true}
        onClose={mockOnClose}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
      />
    );

    const ppdbButton = screen.getByRole('button', { name: /Informasi PPDB & Syarat/i });
    fireEvent.click(ppdbButton);

    const textarea = screen.getByPlaceholderText(/Tulis balasan WhatsApp/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain('Bapak Hendra');
    expect(textarea.value).toContain('PPDB');
    expect(textarea.value).toContain('Akta Kelahiran');
    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('PPDB'));
  });

  it('updates WhatsApp textarea when clicking Biaya template pill', () => {
    render(
      <PesanDetailSheet
        pesan={mockPesan}
        isOpen={true}
        onClose={mockOnClose}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
      />
    );

    const biayaButton = screen.getByRole('button', { name: /Rincian Biaya & SPP/i });
    fireEvent.click(biayaButton);

    const textarea = screen.getByPlaceholderText(/Tulis balasan WhatsApp/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain('Bapak Hendra');
    expect(textarea.value).toContain('SPP Bulanan');
    expect(textarea.value).toContain('beasiswa');
  });

  it('updates WhatsApp textarea when clicking Program template pill and resets with Reset Standar button', () => {
    render(
      <PesanDetailSheet
        pesan={mockPesan}
        isOpen={true}
        onClose={mockOnClose}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
      />
    );

    const programButton = screen.getByRole('button', { name: /Program Unggulan & Jadwal/i });
    fireEvent.click(programButton);

    let textarea = screen.getByPlaceholderText(/Tulis balasan WhatsApp/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain("Tahfidzul Qur'an");

    // Click Reset Standar button
    const resetButton = screen.getByRole('button', { name: /Reset Standar/i });
    fireEvent.click(resetButton);

    textarea = screen.getByPlaceholderText(/Tulis balasan WhatsApp/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain('[Tulis balasan pesan Anda di sini]');
    expect(toast.info).toHaveBeenCalledWith('Template standar diterapkan');
  });

  it('updates WhatsApp textarea when clicking Kunjungan template pill and resets with Standar pill', () => {
    render(
      <PesanDetailSheet
        pesan={mockPesan}
        isOpen={true}
        onClose={mockOnClose}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
      />
    );

    const kunjunganButton = screen.getByRole('button', { name: /Undangan Kunjungan \/ Observasi/i });
    fireEvent.click(kunjunganButton);

    let textarea = screen.getByPlaceholderText(/Tulis balasan WhatsApp/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain('Senin - Sabtu');
    expect(textarea.value).toContain('07.30');

    // Click Standar pill
    const standarPill = screen.getByRole('button', { name: /^Standar$/i });
    fireEvent.click(standarPill);

    textarea = screen.getByPlaceholderText(/Tulis balasan WhatsApp/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain('[Tulis balasan pesan Anda di sini]');
  });

  it('updates Email textarea when clicking template pills in Email tab', () => {
    render(
      <PesanDetailSheet
        pesan={mockPesan}
        isOpen={true}
        onClose={mockOnClose}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
        defaultTab="email"
      />
    );

    const ppdbButton = screen.getByRole('button', { name: /Informasi PPDB & Syarat/i });
    fireEvent.click(ppdbButton);

    const textarea = screen.getByPlaceholderText(/Tulis balasan Email/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain('PPDB');
  });

  it('sends WhatsApp reply and automatically updates status to dibalas', async () => {
    render(
      <PesanDetailSheet
        pesan={mockPesan}
        isOpen={true}
        onClose={mockOnClose}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
      />
    );

    const sendButton = screen.getByRole('button', { name: /Buka WhatsApp & Kirim/i });
    fireEvent.click(sendButton);

    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/6281298765432'),
      '_blank',
      'noopener,noreferrer'
    );

    await waitFor(() => {
      expect(mockOnStatusChange).toHaveBeenCalledWith(10, 'dibalas');
    });
  });

  it('shows no-phone message in WhatsApp tab if phone is null', () => {
    render(
      <PesanDetailSheet
        pesan={mockPesanNoPhone}
        isOpen={true}
        onClose={mockOnClose}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
        defaultTab="whatsapp"
      />
    );

    expect(
      screen.getByText(/Pengirim tidak mencantumkan nomor telepon/i)
    ).toBeDefined();
  });

  it('handles delete action through confirmation dialog', async () => {
    render(
      <PesanDetailSheet
        pesan={mockPesan}
        isOpen={true}
        onClose={mockOnClose}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
      />
    );

    const deleteTrigger = screen.getByRole('button', { name: /Hapus Pesan/i });
    fireEvent.click(deleteTrigger);

    const confirmButton = screen.getByRole('button', { name: /Hapus Permanen/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith(10);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
