import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  updateRombelWaliKelasAction,
  assignSiswaRombelAction,
  searchParentProfilesAction,
  linkExistingParentAccountAction,
  unlinkParentAccountAction,
  createSiswaAction,
  deleteSiswaAction,
  importSiswaFromPendaftarAction,
  linkOrCreateParentAccountAction,
} from '../actions';

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Mock Supabase clients
const mockSupabase = {
  from: vi.fn(),
  auth: {
    getUser: vi.fn(),
  },
};

const mockAdminSupabase = {
  from: vi.fn(),
  auth: {
    admin: {
      listUsers: vi.fn(),
      createUser: vi.fn(),
      updateUserById: vi.fn(),
    },
  },
};

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabase)),
}));

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(() => Promise.resolve(mockAdminSupabase)),
}));

describe('Admin Siswa & Master Rombel Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateRombelWaliKelasAction', () => {
    it('updates wali_kelas_nama, tahun_ajaran, and kapasitas for a rombel', async () => {
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });
      mockSupabase.from.mockReturnValue({ update: mockUpdate });

      const formData = new FormData();
      formData.append('wali_kelas_nama', 'Ust. Budi, M.Pd.');
      formData.append('tahun_ajaran', '2026/2027');
      formData.append('kapasitas', '30');

      const res = await updateRombelWaliKelasAction('rombel-1', formData);
      expect(res.success).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('rombel');
      expect(mockUpdate).toHaveBeenCalledWith({
        wali_kelas_nama: 'Ust. Budi, M.Pd.',
        tahun_ajaran: '2026/2027',
        kapasitas: 30,
      });
    });
  });

  describe('assignSiswaRombelAction', () => {
    it('assigns a student to a rombel and updates kelompok name', async () => {
      // 1. Fetch rombel name
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'rombel') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'rombel-1', nama: 'Kelas 1A' },
                  error: null,
                }),
              }),
            }),
          };
        }
        if (table === 'siswa') {
          return {
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          };
        }
        return {};
      });

      const res = await assignSiswaRombelAction('siswa-1', 'rombel-1');
      expect(res.success).toBe(true);
    });
  });

  describe('searchParentProfilesAction', () => {
    it('searches parent profiles by name or email with linked children count', async () => {
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            or: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({
                data: [
                  {
                    id: 'parent-1',
                    nama_lengkap: 'Bambang Sutrisno',
                    role: 'orang_tua',
                    siswa: [{ id: 'siswa-1', nama_lengkap: 'Fatimah' }],
                  },
                ],
                error: null,
              }),
            }),
          }),
        }),
      });

      const res = await searchParentProfilesAction('Bambang');
      expect(res.success).toBe(true);
      expect(res.data).toHaveLength(1);
      expect(res.data[0].nama_lengkap).toBe('Bambang Sutrisno');
    });
  });

  describe('linkExistingParentAccountAction', () => {
    it('links an existing parent profile to a student (supporting multi-child)', async () => {
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });
      mockAdminSupabase.from.mockReturnValue({ update: mockUpdate });

      const res = await linkExistingParentAccountAction('siswa-2', 'parent-1');
      expect(res.success).toBe(true);
      expect(mockAdminSupabase.from).toHaveBeenCalledWith('siswa');
      expect(mockUpdate).toHaveBeenCalledWith({ profile_orang_tua_id: 'parent-1' });
    });
  });

  describe('unlinkParentAccountAction', () => {
    it('removes parent profile association from a student', async () => {
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });
      mockAdminSupabase.from.mockReturnValue({ update: mockUpdate });

      const res = await unlinkParentAccountAction('siswa-2');
      expect(res.success).toBe(true);
      expect(mockAdminSupabase.from).toHaveBeenCalledWith('siswa');
      expect(mockUpdate).toHaveBeenCalledWith({ profile_orang_tua_id: null });
    });
  });
});
