import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GaleriUploadForm from '../GaleriUploadForm';

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ fill, ...props }: any) => <img {...props} />,
}));

// Mock next/navigation
const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

// Mock Supabase client
const mockUpload = vi.fn().mockResolvedValue({ error: null });
const mockGetPublicUrl = vi.fn().mockReturnValue({
  data: { publicUrl: 'https://example.com/storage/v1/object/public/konten-publik/galeri/test.jpg' },
});
const mockInsert = vi.fn().mockResolvedValue({ error: null });

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      }),
    },
    from: () => ({
      insert: mockInsert,
    }),
  }),
}));

describe('GaleriUploadForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form inputs, category selector, dropzone, and tips card', () => {
    render(<GaleriUploadForm />);

    expect(screen.getByText(/Keterangan \/ Judul Foto/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/Tuliskan keterangan foto/i)).toBeDefined();
    expect(screen.getAllByText(/Kategori/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Pilih foto atau drag & drop/i)).toBeDefined();
    expect(screen.getByText(/Panduan Unggah Foto/i)).toBeDefined();
  });

  it('displays image preview when a file is selected', () => {
    render(<GaleriUploadForm />);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeDefined();

    const file = new File(['dummy-image'], 'kegiatan-sekolah.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 1024 * 500 }); // 500 KB

    // Mock URL.createObjectURL
    const mockCreateObjectURL = vi.fn().mockReturnValue('blob:http://localhost/test-preview');
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = vi.fn();

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
    expect(screen.getByText(/kegiatan-sekolah\.jpg/i)).toBeDefined();
  });
});
