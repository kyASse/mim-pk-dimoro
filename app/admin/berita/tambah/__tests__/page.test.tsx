import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TambahBeritaPage from '../page';
import { toast } from 'sonner';
import * as beritaActions from '@/app/admin/berita/actions';
import * as imageCompression from '@/lib/utils/image-compression';

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

// Mock createBeritaAction
vi.mock('@/app/admin/berita/actions', () => ({
  createBeritaAction: vi.fn(),
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

describe('TambahBeritaPage (app/admin/berita/tambah/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields including RichTextEditor', () => {
    render(<TambahBeritaPage />);

    expect(screen.getByText('Tambah Berita Baru')).toBeDefined();
    expect(screen.getByPlaceholderText(/Masukkan judul berita yang menarik/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/Tulis ringkasan singkat tentang berita ini/i)).toBeDefined();
    expect(screen.getByTestId('rich-text-editor')).toBeDefined();
    expect(screen.getByText(/Tambahkan foto dan judul ke galeri/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Simpan Berita/i })).toBeDefined();
  });

  it('shows error toast if submitted without an image', async () => {
    render(<TambahBeritaPage />);

    fireEvent.change(screen.getByPlaceholderText(/Masukkan judul berita yang menarik/i), {
      target: { value: 'Judul Berita Test' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Tulis ringkasan singkat tentang berita ini/i), {
      target: { value: 'Ringkasan Berita Test' },
    });
    fireEvent.change(screen.getByTestId('rich-text-editor'), {
      target: { value: '<p>Konten berita lengkap</p>' },
    });

    const submitBtn = screen.getByRole('button', { name: /Simpan Berita/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Silakan pilih gambar untuk berita');
    });
  });

  it('compresses image and submits form data successfully', async () => {
    const rawFile = new File(['raw image data'], 'cover.png', { type: 'image/png' });
    const compressedFile = new File(['compressed webp data'], 'cover.webp', { type: 'image/webp' });

    const compressSpy = vi
      .spyOn(imageCompression, 'compressImageToWebP')
      .mockResolvedValue(compressedFile);

    const createActionMock = vi
      .mocked(beritaActions.createBeritaAction)
      .mockResolvedValue({ success: true, message: 'Berhasil' } as any);

    render(<TambahBeritaPage />);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText(/Masukkan judul berita yang menarik/i), {
      target: { value: 'Inovasi Pembelajaran MIM PK' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Tulis ringkasan singkat tentang berita ini/i), {
      target: { value: 'Ringkasan inovasi pembelajaran modern.' },
    });
    fireEvent.change(screen.getByTestId('rich-text-editor'), {
      target: { value: '<p>Isi artikel <strong>inovatif</strong></p>' },
    });

    // Upload image
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [rawFile] } });

    // Submit
    const submitBtn = screen.getByRole('button', { name: /Simpan Berita/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(compressSpy).toHaveBeenCalledWith(rawFile);
      expect(createActionMock).toHaveBeenCalledTimes(1);

      const passedFormData = createActionMock.mock.calls[0][0];
      expect(passedFormData.get('judul')).toBe('Inovasi Pembelajaran MIM PK');
      expect(passedFormData.get('ringkasan')).toBe('Ringkasan inovasi pembelajaran modern.');
      expect(passedFormData.get('isiLengkap')).toBe('<p>Isi artikel <strong>inovatif</strong></p>');
      expect(passedFormData.get('image')).toEqual(compressedFile);

      expect(toast.success).toHaveBeenCalledWith('Berita berhasil ditambahkan!');
      expect(mockPush).toHaveBeenCalledWith('/admin/berita');
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('handles server action errors gracefully', async () => {
    const rawFile = new File(['raw image data'], 'cover.png', { type: 'image/png' });
    vi.spyOn(imageCompression, 'compressImageToWebP').mockResolvedValue(rawFile);

    vi.mocked(beritaActions.createBeritaAction).mockResolvedValue({
      success: false,
      message: 'Gagal membuat berita',
    } as any);

    render(<TambahBeritaPage />);

    fireEvent.change(screen.getByPlaceholderText(/Masukkan judul berita yang menarik/i), {
      target: { value: 'Inovasi Pembelajaran' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Tulis ringkasan singkat tentang berita ini/i), {
      target: { value: 'Ringkasan' },
    });
    fireEvent.change(screen.getByTestId('rich-text-editor'), {
      target: { value: '<p>Isi</p>' },
    });

    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [rawFile] } });

    const submitBtn = screen.getByRole('button', { name: /Simpan Berita/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Gagal membuat berita');
    });
  });
});
