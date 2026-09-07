import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPrestasiAction, updateBiayaAction, updateBiayaAndSppAction } from '../actions';
import { revalidatePath } from 'next/cache';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';

describe('Akademik Actions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('createPrestasiAction', () => {
    it('should return error when required fields are missing or invalid year', async () => {
      const formData = new FormData();
      formData.append('tahun', 'invalid-year');
      formData.append('nama_prestasi', 'Juara 1 OSN');
      formData.append('tingkat', 'Kabupaten');
      formData.append('nama_siswa', 'Budi');

      const result = await createPrestasiAction({}, formData);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Harap isi semua kolom wajib dengan benar.');
    });

    it('should insert prestasi successfully when valid data is provided', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      const mockSupabase = {
        from: vi.fn().mockReturnValue({ insert: mockInsert }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const formData = new FormData();
      formData.append('tahun', '2026');
      formData.append('nama_prestasi', 'Juara 1 Sains');
      formData.append('tingkat', 'Provinsi');
      formData.append('deskripsi', 'Kompetisi Sains SD');
      formData.append('nama_siswa', 'Siti');

      const result = await createPrestasiAction({}, formData);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Prestasi berhasil ditambahkan.');
      expect(mockInsert).toHaveBeenCalledWith({
        tahun: 2026,
        nama_prestasi: 'Juara 1 Sains',
        tingkat: 'Provinsi',
        deskripsi: 'Kompetisi Sains SD',
        nama_siswa: 'Siti',
      });
    });
  });

  describe('updateBiayaAction', () => {
    it('should update biaya successfully with BiayaInput interface structure', async () => {
      const mockEq = vi.fn().mockResolvedValue({ error: null });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
      const mockSupabase = {
        from: vi.fn().mockReturnValue({ update: mockUpdate }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const formData = new FormData();
      formData.append('biaya[0][id]', '1');
      formData.append('biaya[0][putra]', '500000');
      formData.append('biaya[0][putri]', '550000');

      const result = await updateBiayaAction(formData);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Biaya pendaftaran berhasil diperbarui.');
      expect(mockUpdate).toHaveBeenCalledWith({
        biaya_putra: 500000,
        biaya_putri: 550000,
      });
    });
  });

  describe('updateBiayaAndSppAction', () => {
    it('should update both biaya items and catatan SPP successfully', async () => {
      const mockEqBiaya = vi.fn().mockResolvedValue({ error: null });
      const mockUpdateBiaya = vi.fn().mockReturnValue({ eq: mockEqBiaya });

      const mockEqSpp = vi.fn().mockResolvedValue({ error: null });
      const mockUpdateSpp = vi.fn().mockReturnValue({ eq: mockEqSpp });

      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === 'biaya_pendaftaran') {
            return { update: mockUpdateBiaya };
          }
          if (table === 'konten_halaman') {
            return { update: mockUpdateSpp };
          }
          return {};
        }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const payload = {
        biaya: [
          { id: 1, biaya_putra: 600000, biaya_putri: 650000 },
          { id: 2, biaya_putra: 100000, biaya_putri: 100000 },
        ],
        catatanSpp: 'SPP sudah termasuk seragam dan ekstrakurikuler wajib.',
      };

      const result = await updateBiayaAndSppAction(payload);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Data rincian biaya dan catatan SPP berhasil diperbarui.');
      expect(mockUpdateBiaya).toHaveBeenCalledTimes(2);
      expect(mockUpdateSpp).toHaveBeenCalledWith({
        isi: { catatan: 'SPP sudah termasuk seragam dan ekstrakurikuler wajib.' },
      });
      expect(mockEqSpp).toHaveBeenCalledWith('slug', 'catatan-spp');
      expect(revalidatePath).toHaveBeenCalledWith('/admin/akademik');
      expect(revalidatePath).toHaveBeenCalledWith('/pendaftaran');
    });

    it('should return error when updating biaya fails', async () => {
      const mockEqBiaya = vi.fn().mockResolvedValue({ error: { message: 'Database error' } });
      const mockUpdateBiaya = vi.fn().mockReturnValue({ eq: mockEqBiaya });

      const mockSupabase = {
        from: vi.fn().mockReturnValue({ update: mockUpdateBiaya }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const payload = {
        biaya: [{ id: 1, biaya_putra: 600000, biaya_putri: 650000 }],
        catatanSpp: 'Catatan SPP',
      };

      const result = await updateBiayaAndSppAction(payload);
      expect(result.success).toBe(false);
      expect(result.message).toContain('Gagal memperbarui data biaya');
    });

    it('should return error when updating catatan SPP fails', async () => {
      const mockEqBiaya = vi.fn().mockResolvedValue({ error: null });
      const mockUpdateBiaya = vi.fn().mockReturnValue({ eq: mockEqBiaya });

      const mockEqSpp = vi.fn().mockResolvedValue({ error: { message: 'SPP table error' } });
      const mockUpdateSpp = vi.fn().mockReturnValue({ eq: mockEqSpp });

      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === 'biaya_pendaftaran') return { update: mockUpdateBiaya };
          if (table === 'konten_halaman') return { update: mockUpdateSpp };
          return {};
        }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const payload = {
        biaya: [{ id: 1, biaya_putra: 600000, biaya_putri: 650000 }],
        catatanSpp: 'Catatan SPP',
      };

      const result = await updateBiayaAndSppAction(payload);
      expect(result.success).toBe(false);
      expect(result.message).toContain('Gagal memperbarui catatan SPP');
    });
  });
});

