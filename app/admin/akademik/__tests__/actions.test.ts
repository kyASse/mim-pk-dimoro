import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPrestasiAction, updateBiayaAction, updateBiayaAndSppAction } from '../actions';
import { revalidatePath } from 'next/cache';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(),
}));

vi.mock('@/lib/auth/guards', () => ({
  requireRole: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole } from '@/lib/auth/guards';

describe('Akademik Actions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (requireRole as any).mockResolvedValue({
      authorized: true,
      user: { id: 'user-admin-1', email: 'admin@mimpkdimoro.sch.id' },
      profile: { id: 'user-admin-1', role: 'admin_tu', nama_lengkap: 'Staf TU' },
    });
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
    it('should return error when user is not authorized', async () => {
      (requireRole as any).mockResolvedValue({
        authorized: false,
        message: 'Akses ditolak: role tidak memiliki izin.',
      });

      const payload = {
        biaya: [{ id: 1, komponen_biaya: 'Pendaftaran', biaya_putra: 0, biaya_putri: 0 }],
        catatanSpp: 'Catatan SPP',
      };

      const result = await updateBiayaAndSppAction(payload);
      expect(result.success).toBe(false);
      expect(result.message).toContain('Akses ditolak');
    });

    it('should update existing items, insert new items, delete removed items, and update SPP successfully', async () => {
      const mockEqBiaya = vi.fn().mockResolvedValue({ error: null });
      const mockUpdateBiaya = vi.fn().mockReturnValue({ eq: mockEqBiaya });
      const mockInsertBiaya = vi.fn().mockResolvedValue({ error: null });
      const mockInDelete = vi.fn().mockResolvedValue({ error: null });
      const mockDeleteBiaya = vi.fn().mockReturnValue({ in: mockInDelete });

      const mockEqSpp = vi.fn().mockResolvedValue({ error: null });
      const mockUpdateSpp = vi.fn().mockReturnValue({ eq: mockEqSpp });

      const mockAdminSupabase = {
        from: vi.fn((table: string) => {
          if (table === 'biaya_pendaftaran') {
            return {
              update: mockUpdateBiaya,
              insert: mockInsertBiaya,
              delete: mockDeleteBiaya,
            };
          }
          if (table === 'konten_halaman') {
            return { update: mockUpdateSpp };
          }
          return {};
        }),
      };
      vi.mocked(createAdminClient).mockResolvedValue(mockAdminSupabase as any);

      const payload = {
        biaya: [
          { id: 1, komponen_biaya: 'Biaya Pendaftaran (GRATIS)', biaya_putra: 0, biaya_putri: 0 },
          { id: -123, komponen_biaya: 'Infaq Gedung Baru', biaya_putra: 250000, biaya_putri: 250000 },
        ],
        catatanSpp: 'SPP sudah termasuk seragam dan ekstrakurikuler wajib.',
        deletedIds: [5, 6],
      };

      const result = await updateBiayaAndSppAction(payload);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Data rincian biaya dan catatan SPP berhasil diperbarui.');

      // Update existing item 1
      expect(mockUpdateBiaya).toHaveBeenCalledWith({
        komponen_biaya: 'Biaya Pendaftaran (GRATIS)',
        biaya_putra: 0,
        biaya_putri: 0,
      });
      expect(mockEqBiaya).toHaveBeenCalledWith('id', 1);

      // Insert new item
      expect(mockInsertBiaya).toHaveBeenCalledWith([
        {
          komponen_biaya: 'Infaq Gedung Baru',
          biaya_putra: 250000,
          biaya_putri: 250000,
        },
      ]);

      // Delete items
      expect(mockDeleteBiaya).toHaveBeenCalled();
      expect(mockInDelete).toHaveBeenCalledWith('id', [5, 6]);

      // SPP Update
      expect(mockUpdateSpp).toHaveBeenCalledWith({
        isi: {
          catatan: 'SPP sudah termasuk seragam dan ekstrakurikuler wajib.',
          blocks: [{ text: 'SPP sudah termasuk seragam dan ekstrakurikuler wajib.' }],
        },
      });
      expect(mockEqSpp).toHaveBeenCalledWith('slug', 'catatan-spp');

      // Revalidate paths
      expect(revalidatePath).toHaveBeenCalledWith('/admin/akademik');
      expect(revalidatePath).toHaveBeenCalledWith('/admin/akademik/edit-biaya');
      expect(revalidatePath).toHaveBeenCalledWith('/pendaftaran');
      expect(revalidatePath).toHaveBeenCalledWith('/portal/keuangan');
    });

    it('should return error when updating biaya fails', async () => {
      const mockEqBiaya = vi.fn().mockResolvedValue({ error: { message: 'Database error' } });
      const mockUpdateBiaya = vi.fn().mockReturnValue({ eq: mockEqBiaya });

      const mockAdminSupabase = {
        from: vi.fn().mockReturnValue({ update: mockUpdateBiaya }),
      };
      vi.mocked(createAdminClient).mockResolvedValue(mockAdminSupabase as any);

      const payload = {
        biaya: [{ id: 1, komponen_biaya: 'Pendaftaran', biaya_putra: 600000, biaya_putri: 650000 }],
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

      const mockAdminSupabase = {
        from: vi.fn((table: string) => {
          if (table === 'biaya_pendaftaran') return { update: mockUpdateBiaya };
          if (table === 'konten_halaman') return { update: mockUpdateSpp };
          return {};
        }),
      };
      vi.mocked(createAdminClient).mockResolvedValue(mockAdminSupabase as any);

      const payload = {
        biaya: [{ id: 1, komponen_biaya: 'Pendaftaran', biaya_putra: 600000, biaya_putri: 650000 }],
        catatanSpp: 'Catatan SPP',
      };

      const result = await updateBiayaAndSppAction(payload);
      expect(result.success).toBe(false);
      expect(result.message).toContain('Gagal memperbarui catatan SPP');
    });
  });
});
