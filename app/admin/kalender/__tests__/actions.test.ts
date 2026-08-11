import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createKegiatanAction, updateKegiatanAction, deleteKegiatanAction } from '../actions';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';

describe('Kalender Actions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('createKegiatanAction', () => {
    it('should return error when required fields are missing', async () => {
      const formData = new FormData();
      formData.append('judul', '');
      formData.append('tanggal', '2026-08-10');
      formData.append('kategori', 'Akademik');

      const result = await createKegiatanAction({}, formData);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Judul, tanggal, dan kategori wajib diisi.');
    });

    it('should insert kegiatan successfully when valid data is provided', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      const mockSupabase = {
        from: vi.fn().mockReturnValue({ insert: mockInsert }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const formData = new FormData();
      formData.append('judul', 'Upacara Bendera');
      formData.append('tanggal', '2026-08-17');
      formData.append('kategori', 'Nasional');

      const result = await createKegiatanAction({}, formData);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Kegiatan berhasil ditambahkan.');
      expect(mockSupabase.from).toHaveBeenCalledWith('kalender_akademik');
    });
  });

  describe('updateKegiatanAction', () => {
    it('should return error when required fields are missing', async () => {
      const formData = new FormData();
      formData.append('judul', 'Lomba');

      const result = await updateKegiatanAction(1, {}, formData);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Judul, tanggal, dan kategori wajib diisi.');
    });
  });

  describe('deleteKegiatanAction', () => {
    it('should delete kegiatan successfully', async () => {
      const mockEq = vi.fn().mockResolvedValue({ error: null });
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
      const mockSupabase = {
        from: vi.fn().mockReturnValue({ delete: mockDelete }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const result = await deleteKegiatanAction(1);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Kegiatan berhasil dihapus.');
      expect(mockDelete).toHaveBeenCalled();
    });
  });
});
