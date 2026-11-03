import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requireAuthenticatedUser, requireAdminSession } from '@/lib/auth/guard';
import * as serverSupabase from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('Security Guard: requireAuthenticatedUser & requireAdminSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw UNAUTHORIZED when no user session exists', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: new Error('No session') }),
      },
    };
    (serverSupabase.createClient as any).mockResolvedValue(mockSupabase);

    await expect(requireAuthenticatedUser()).rejects.toThrow('UNAUTHORIZED');
  });

  it('should throw UNAUTHORIZED when user profile is missing', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u-1', email: 'user@test.com' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: new Error('Profile not found') }),
          }),
        }),
      }),
    };
    (serverSupabase.createClient as any).mockResolvedValue(mockSupabase);

    await expect(requireAuthenticatedUser()).rejects.toThrow('UNAUTHORIZED');
  });

  it('should throw FORBIDDEN when user role is not in allowed roles', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u-1', email: 'parent@test.com' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'u-1', role: 'orang_tua', nama_lengkap: 'Budi' },
              error: null,
            }),
          }),
        }),
      }),
    };
    (serverSupabase.createClient as any).mockResolvedValue(mockSupabase);

    await expect(requireAdminSession()).rejects.toThrow('FORBIDDEN');
  });

  it('should succeed and return context when user has an admin role', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'admin-1', email: 'admin@mim.sch.id' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'admin-1', role: 'admin_tu', nama_lengkap: 'Staf TU' },
              error: null,
            }),
          }),
        }),
      }),
    };
    (serverSupabase.createClient as any).mockResolvedValue(mockSupabase);

    const ctx = await requireAdminSession();
    expect(ctx.user.id).toBe('admin-1');
    expect(ctx.role).toBe('admin_tu');
    expect(ctx.profile.nama_lengkap).toBe('Staf TU');
  });
});
