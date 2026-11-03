import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as guardModule from '@/lib/auth/guard';

vi.mock('@/lib/auth/guard', () => ({
  requireAdminSession: vi.fn(),
  requireAuthenticatedUser: vi.fn(),
}));

describe('Security Actions: Admin Server Actions Guard Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updateStatusPendaftaran should reject if requireAdminSession throws', async () => {
    (guardModule.requireAdminSession as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('FORBIDDEN'));
    const { updateStatusPendaftaran } = await import('@/app/admin/pendaftar/actions');

    const res = await updateStatusPendaftaran('p-1', 'Diterima');
    expect(res.success).toBe(false);
    expect(res.message).toContain('FORBIDDEN');
  });

  it('updateRombelWaliKelasAction should reject if requireAdminSession throws', async () => {
    (guardModule.requireAdminSession as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('UNAUTHORIZED'));
    const { updateRombelWaliKelasAction } = await import('@/app/admin/siswa/actions');

    const formData = new FormData();
    formData.append('wali_kelas_nama', 'Ust. Ahmad');
    const res = await updateRombelWaliKelasAction('rombel-1', formData);
    expect(res.success).toBe(false);
    expect(res.message).toContain('UNAUTHORIZED');
  });

  it('createTestimoniAction should reject if requireAdminSession throws', async () => {
    (guardModule.requireAdminSession as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('FORBIDDEN'));
    const { createTestimoniAction } = await import('@/app/admin/testimoni/actions');

    const formData = new FormData();
    formData.append('nama_orang_tua', 'Ahmad');
    formData.append('isi_testimoni', 'Bagus');
    const res = await createTestimoniAction(formData);
    expect(res.success).toBe(false);
    expect(res.message).toContain('FORBIDDEN');
  });
});
