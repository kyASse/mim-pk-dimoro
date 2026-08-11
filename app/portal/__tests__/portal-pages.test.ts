import { describe, it, expect, vi, beforeEach } from 'vitest';
import PortalLaporanPage from '../laporan/page';
import PortalAkademikPage from '../akademik/page';
import PortalKeuanganPage from '../keuangan/page';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';

describe('Portal Data Fetching Resiliency', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('PortalLaporanPage', () => {
    it('should not query laporan_perkembangan when no students are linked', async () => {
      const mockGetUser = vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } });
      const mockIn = vi.fn().mockResolvedValue({ data: [] });
      const mockSelectLaporan = vi.fn().mockReturnValue({ in: mockIn });
      
      const mockSupabase = {
        auth: { getUser: mockGetUser },
        from: vi.fn((table: string) => {
          if (table === 'siswa') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [] }),
              }),
            };
          }
          if (table === 'laporan_perkembangan') {
            return { select: mockSelectLaporan };
          }
          return {};
        }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const component = await PortalLaporanPage();
      expect(component).toBeTruthy();
      expect(mockIn).not.toHaveBeenCalled();
    });
  });

  describe('PortalAkademikPage', () => {
    it('should handle error or empty siswa query gracefully', async () => {
      const mockGetUser = vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } });
      const mockSupabase = {
        auth: { getUser: mockGetUser },
        from: vi.fn((table: string) => {
          if (table === 'siswa') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: null, error: new Error('DB Error') }),
              }),
            };
          }
          if (table === 'kalender_akademik') {
            return {
              select: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: [] }),
              }),
            };
          }
          return {};
        }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const component = await PortalAkademikPage();
      expect(component).toBeTruthy();
    });
  });

  describe('PortalKeuanganPage', () => {
    it('should handle errors in biaya_pendaftaran and konten_halaman queries gracefully', async () => {
      const mockGetUser = vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } });
      const mockSupabase = {
        auth: { getUser: mockGetUser },
        from: vi.fn((table: string) => {
          if (table === 'biaya_pendaftaran') {
            return {
              select: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: null, error: new Error('Table error') }),
              }),
            };
          }
          if (table === 'konten_halaman') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({ data: null, error: new Error('Not found') }),
                }),
              }),
            };
          }
          return {};
        }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const component = await PortalKeuanganPage();
      expect(component).toBeTruthy();
    });
  });
});
