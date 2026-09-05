import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateStatusPendaftaran, updatePendaftarData, acceptAndCreatePortalAccountAction, bulkUpdateStatusPendaftaran } from '../actions';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/auth/recovery', () => ({
  sendCustomRecoveryEmail: vi.fn().mockResolvedValue({ success: true }),
}));

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendCustomRecoveryEmail } from '@/lib/auth/recovery';

describe('Admin Pendaftar Actions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('updateStatusPendaftaran', () => {
    it('should update status pendaftaran successfully', async () => {
      const mockEq = vi.fn().mockResolvedValue({ error: null });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
      const mockSupabase = {
        from: vi.fn().mockReturnValue({ update: mockUpdate }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const result = await updateStatusPendaftaran('123', 'Diterima');
      expect(result.success).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('pendaftar');
      expect(mockUpdate).toHaveBeenCalledWith({ status_pendaftaran: 'Diterima' });
      expect(mockEq).toHaveBeenCalledWith('id', '123');
    });
  });

  describe('updatePendaftarData', () => {
    it('should update pendaftar data successfully with 27 fields including administrative fields', async () => {
      const mockEq = vi.fn().mockResolvedValue({ error: null });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
      const mockSupabase = {
        from: vi.fn().mockReturnValue({ update: mockUpdate }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const updatePayload = {
        nama_lengkap: 'Ahmad Baru',
        tk_asal: 'TK Aisyiyah 1',
        hobi: 'Membaca',
        transportasi: 'Sepeda Motor',
        alamat_orang_tua: 'Jl. Melati No. 5',
        gaji_orang_tua: '3.000.000 - 5.000.000',
        wali_alamat: 'Jl. Mawar No. 10',
        wali_telepon: '08123456789',
        nomor_induk: '1234567890',
        diterima_di_kelas: 'Kelas 1B',
        diterima_pada_tanggal: '2026-08-20',
      };

      const result = await updatePendaftarData('123', updatePayload);
      expect(result.success).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('pendaftar');
      expect(mockUpdate).toHaveBeenCalledWith(updatePayload);
      expect(mockEq).toHaveBeenCalledWith('id', '123');
    });
  });

  describe('acceptAndCreatePortalAccountAction', () => {
    it('should return error when pendaftar email is missing', async () => {
      const result = await acceptAndCreatePortalAccountAction({
        id: '123',
        nama_lengkap: 'Ahmad',
        email: null,
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Gagal: Pendaftar tidak memiliki alamat email.');
    });

    it('should create auth user, upsert profile, insert siswa, set default class and date, and send recovery email', async () => {
      const mockUpdateEqClient = vi.fn().mockReturnValue({
        throwOnError: vi.fn().mockResolvedValue({ error: null }),
      });
      const mockUpdateClient = vi.fn().mockReturnValue({ eq: mockUpdateEqClient });
      const mockInsertClient = vi.fn().mockReturnValue({
        throwOnError: vi.fn().mockResolvedValue({ error: null }),
      });

      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === 'pendaftar') {
            return { update: mockUpdateClient };
          }
          if (table === 'siswa') {
            return { insert: mockInsertClient };
          }
          return {};
        }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const mockProfilesUpsert = vi.fn().mockReturnValue({
        throwOnError: vi.fn().mockResolvedValue({ error: null }),
      });
      const mockListUsers = vi.fn().mockResolvedValue({ data: { users: [] }, error: null });
      const mockCreateUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user-456', email: 'orangtua@example.com' } },
        error: null,
      });

      const mockSupabaseAdmin = {
        auth: {
          admin: {
            listUsers: mockListUsers,
            createUser: mockCreateUser,
          },
        },
        from: vi.fn((table: string) => {
          if (table === 'profiles') {
            return { upsert: mockProfilesUpsert };
          }
          return {};
        }),
      };
      vi.mocked(createAdminClient).mockResolvedValue(mockSupabaseAdmin as any);

      const pendaftar = {
        id: 'pendaftar-123',
        nama_lengkap: 'Budi Santoso',
        email: 'orangtua@example.com',
      };

      const today = new Date().toISOString().split('T')[0];
      const result = await acceptAndCreatePortalAccountAction(pendaftar);

      expect(result.success).toBe(true);
      expect(result.message).toContain('berhasil dibuat');

      // Verify acceptance update set status, default class 'Kelas 1' and today's date
      expect(mockUpdateClient).toHaveBeenCalledWith({
        status_pendaftaran: 'Diterima',
        diterima_di_kelas: 'Kelas 1',
        diterima_pada_tanggal: today,
      });

      // Verify profiles upsert was called with correct data BEFORE inserting into siswa
      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith('profiles');
      expect(mockProfilesUpsert).toHaveBeenCalledWith(
        {
          id: 'user-456',
          role: 'orang_tua',
          nama_lengkap: 'Budi Santoso',
        },
        { onConflict: 'id' }
      );

      // Verify siswa insert was called with profile_orang_tua_id
      expect(mockSupabase.from).toHaveBeenCalledWith('siswa');
      expect(mockInsertClient).toHaveBeenCalledWith({
        profile_orang_tua_id: 'user-456',
        nama_lengkap: 'Budi Santoso',
        pendaftar_asli_id: 'pendaftar-123',
      });

      expect(sendCustomRecoveryEmail).toHaveBeenCalledWith('orangtua@example.com');
    });

    it('should preserve provided diterima_di_kelas and diterima_pada_tanggal when accepting', async () => {
      const mockUpdateEqClient = vi.fn().mockReturnValue({
        throwOnError: vi.fn().mockResolvedValue({ error: null }),
      });
      const mockUpdateClient = vi.fn().mockReturnValue({ eq: mockUpdateEqClient });
      const mockInsertClient = vi.fn().mockReturnValue({
        throwOnError: vi.fn().mockResolvedValue({ error: null }),
      });

      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === 'pendaftar') {
            return { update: mockUpdateClient };
          }
          if (table === 'siswa') {
            return { insert: mockInsertClient };
          }
          return {};
        }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const mockProfilesUpsert = vi.fn().mockReturnValue({
        throwOnError: vi.fn().mockResolvedValue({ error: null }),
      });
      const mockListUsers = vi.fn().mockResolvedValue({ data: { users: [] }, error: null });
      const mockCreateUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user-456', email: 'custom@example.com' } },
        error: null,
      });

      const mockSupabaseAdmin = {
        auth: {
          admin: {
            listUsers: mockListUsers,
            createUser: mockCreateUser,
          },
        },
        from: vi.fn((table: string) => {
          if (table === 'profiles') {
            return { upsert: mockProfilesUpsert };
          }
          return {};
        }),
      };
      vi.mocked(createAdminClient).mockResolvedValue(mockSupabaseAdmin as any);

      const pendaftar = {
        id: 'pendaftar-custom',
        nama_lengkap: 'Ani Wijaya',
        email: 'custom@example.com',
        diterima_di_kelas: 'Kelas 1A',
        diterima_pada_tanggal: '2026-07-15',
      };

      const result = await acceptAndCreatePortalAccountAction(pendaftar);

      expect(result.success).toBe(true);
      expect(mockUpdateClient).toHaveBeenCalledWith({
        status_pendaftaran: 'Diterima',
        diterima_di_kelas: 'Kelas 1A',
        diterima_pada_tanggal: '2026-07-15',
      });
    });

    it('should rollback auth user if profiles/siswa insertion fails', async () => {
      const mockUpdateEqClient = vi.fn().mockReturnValue({
        throwOnError: vi.fn().mockResolvedValue({ error: null }),
      });
      const mockUpdateClient = vi.fn().mockReturnValue({ eq: mockUpdateEqClient });

      const mockSupabase = {
        from: vi.fn().mockReturnValue({ update: mockUpdateClient }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const mockProfilesUpsert = vi.fn().mockReturnValue({
        throwOnError: vi.fn().mockRejectedValue(new Error('FK constraint error')),
      });
      const mockDeleteUser = vi.fn().mockResolvedValue({ error: null });

      const mockSupabaseAdmin = {
        auth: {
          admin: {
            listUsers: vi.fn().mockResolvedValue({ data: { users: [] }, error: null }),
            createUser: vi.fn().mockResolvedValue({
              data: { user: { id: 'user-789', email: 'error@example.com' } },
              error: null,
            }),
            deleteUser: mockDeleteUser,
          },
        },
        from: vi.fn().mockReturnValue({ upsert: mockProfilesUpsert }),
      };
      vi.mocked(createAdminClient).mockResolvedValue(mockSupabaseAdmin as any);

      const pendaftar = {
        id: 'pendaftar-789',
        nama_lengkap: 'Siti',
        email: 'error@example.com',
      };

      const result = await acceptAndCreatePortalAccountAction(pendaftar);

      expect(result.success).toBe(false);
      expect(result.message).toBe('FK constraint error');
      expect(mockDeleteUser).toHaveBeenCalledWith('user-789');
    });
  });

  describe('bulkUpdateStatusPendaftaran', () => {
    it('should update status pendaftaran for multiple IDs successfully', async () => {
      const mockIn = vi.fn().mockResolvedValue({ error: null });
      const mockUpdate = vi.fn().mockReturnValue({ in: mockIn });
      const mockSupabase = {
        from: vi.fn().mockReturnValue({ update: mockUpdate }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const result = await bulkUpdateStatusPendaftaran(['id-1', 'id-2', 'id-3'], 'Diterima');

      expect(result.success).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('pendaftar');
      expect(mockUpdate).toHaveBeenCalledWith({ status_pendaftaran: 'Diterima' });
      expect(mockIn).toHaveBeenCalledWith('id', ['id-1', 'id-2', 'id-3']);
    });

    it('should return error if ids array is empty', async () => {
      const result = await bulkUpdateStatusPendaftaran([], 'Diterima');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Tidak ada pendaftar');
    });

    it('should handle supabase update error gracefully', async () => {
      const mockIn = vi.fn().mockResolvedValue({ error: { message: 'DB Connection Error' } });
      const mockUpdate = vi.fn().mockReturnValue({ in: mockIn });
      const mockSupabase = {
        from: vi.fn().mockReturnValue({ update: mockUpdate }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const result = await bulkUpdateStatusPendaftaran(['id-1'], 'Ditolak');

      expect(result.success).toBe(false);
      expect(result.message).toBe('DB Connection Error');
    });
  });
});
