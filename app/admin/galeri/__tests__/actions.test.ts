import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteGaleriAction, updateGaleriAction } from '../actions';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';

describe('Galeri Actions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('updateGaleriAction', () => {
    it('should return error if image size exceeds 5MB', async () => {
      const largeFile = new File(['a'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });

      const result = await updateGaleriAction(1, {
        keterangan: 'Foto Kegiatan',
        kategori: 'Kegiatan',
        image: largeFile,
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Ukuran file terlalu besar (maksimal 5MB).');
    });

    it('should query existing image, remove old image, upload new image and update database', async () => {
      const mockSingle = vi.fn().mockResolvedValue({ data: { image_url: 'http://example.com/storage/v1/object/public/konten-publik/galeri/old.jpg' } });
      const mockEqSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEqSelect });

      const mockRemove = vi.fn().mockResolvedValue({ data: [], error: null });
      const mockUpload = vi.fn().mockResolvedValue({ data: { path: 'galeri/new.jpg' }, error: null });
      const mockGetPublicUrl = vi.fn().mockReturnValue({ data: { publicUrl: 'http://example.com/storage/v1/object/public/konten-publik/galeri/new.jpg' } });

      const mockEqUpdate = vi.fn().mockResolvedValue({ error: null });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEqUpdate });

      const mockSupabase = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === 'galeri') {
            return {
              select: mockSelect,
              update: mockUpdate,
            };
          }
          return {};
        }),
        storage: {
          from: vi.fn().mockReturnValue({
            remove: mockRemove,
            upload: mockUpload,
            getPublicUrl: mockGetPublicUrl,
          }),
        },
      };

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const validFile = new File(['dummy'], 'new.jpg', { type: 'image/jpeg' });

      const result = await updateGaleriAction(1, {
        keterangan: 'Foto Barui',
        kategori: 'Kegiatan',
        image: validFile,
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe('Galeri berhasil diperbarui.');
      expect(mockSelect).toHaveBeenCalledWith('image_url');
      expect(mockRemove).toHaveBeenCalledWith(['galeri/old.jpg']);
      expect(mockUpload).toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalledWith({
        keterangan: 'Foto Barui',
        kategori: 'Kegiatan',
        image_url: 'http://example.com/storage/v1/object/public/konten-publik/galeri/new.jpg',
      });
    });
  });
});
