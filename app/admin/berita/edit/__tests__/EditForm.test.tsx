import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditForm from '../EditForm';
import { toast } from 'sonner';
import { updateBeritaAction } from '@/app/admin/berita/actions';

beforeAll(() => {
  class MockResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  global.ResizeObserver = MockResizeObserver as any;

  class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  global.IntersectionObserver = MockIntersectionObserver as any;

  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.releasePointerCapture = vi.fn();
});

// Mock useRouter
const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock actions (both relative to EditForm and alias)
vi.mock('../actions', () => ({
  updateBeritaAction: vi.fn(),
}));
vi.mock('@/app/admin/berita/actions', () => ({
  updateBeritaAction: vi.fn(),
}));

// Mock RichTextEditor
vi.mock('@/components/admin/berita/RichTextEditor', () => ({
  default: ({ value, onChange, placeholder, disabled }: any) => (
    <textarea
      data-testid="rich-text-editor"
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

describe('EditForm Component (app/admin/berita/edit/EditForm.tsx)', () => {
  const mockBerita = {
    id: 101,
    judul: 'Kegiatan Pondok Ramadhan 1447 H',
    ringkasan: 'Seluruh santri mengikuti kegiatan pondok ramadhan.',
    isi_lengkap: '<p>Kegiatan dimulai dengan <strong>sholat dhuha</strong> berjamaah.</p>',
    image_url: '/images/ramadhan.jpg',
    status: 'terbit',
    tanggal_terbit: '2026-03-15T08:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes form fields with existing berita data including isi_lengkap in RichTextEditor', () => {
    render(<EditForm berita={mockBerita} />);

    const judulInput = screen.getByPlaceholderText(/Masukkan judul berita yang menarik/i) as HTMLInputElement;
    const ringkasanInput = screen.getByPlaceholderText(/Tulis ringkasan singkat tentang berita ini/i) as HTMLTextAreaElement;
    const editor = screen.getByTestId('rich-text-editor') as HTMLTextAreaElement;

    expect(judulInput.value).toBe(mockBerita.judul);
    expect(ringkasanInput.value).toBe(mockBerita.ringkasan);
    expect(editor.value).toBe(mockBerita.isi_lengkap);
  });

  it('submits updated data to updateBeritaAction successfully', async () => {
    const updateActionMock = vi
      .mocked(updateBeritaAction)
      .mockResolvedValue({ success: true, message: 'Berhasil' } as any);

    render(<EditForm berita={mockBerita} />);

    // Edit judul and isiLengkap
    const judulInput = screen.getByPlaceholderText(/Masukkan judul berita yang menarik/i);
    fireEvent.change(judulInput, { target: { value: 'Judul Baru Ramadhan 1447 H' } });

    const editor = screen.getByTestId('rich-text-editor');
    fireEvent.change(editor, { target: { value: '<p>Konten yang diperbarui dengan RichTextEditor.</p>' } });

    const submitBtn = screen.getByRole('button', { name: /Simpan Perubahan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(updateActionMock).toHaveBeenCalledTimes(1);
      expect(updateActionMock).toHaveBeenCalledWith(101, {
        judul: 'Judul Baru Ramadhan 1447 H',
        ringkasan: mockBerita.ringkasan,
        isi_lengkap: '<p>Konten yang diperbarui dengan RichTextEditor.</p>',
        status: 'terbit',
        tanggal_terbit: '2026-03-15',
      });

      expect(toast.success).toHaveBeenCalledWith('Berita berhasil diperbarui!');
      expect(mockPush).toHaveBeenCalledWith('/admin/berita');
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('handles submission errors gracefully', async () => {
    vi.mocked(updateBeritaAction).mockResolvedValue({
      success: false,
      message: 'Gagal memperbarui berita',
    } as any);

    render(<EditForm berita={mockBerita} />);

    const submitBtn = screen.getByRole('button', { name: /Simpan Perubahan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Terjadi kesalahan saat memperbarui berita');
    });
  });
});
