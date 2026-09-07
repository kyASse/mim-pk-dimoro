import { describe, it, expect, vi } from 'vitest';
import { requireRole, isRoleAuthorized, recordAuditLog } from '../guards';

describe('RBAC Guards & Audit Logger', () => {
  describe('isRoleAuthorized', () => {
    it('returns true when user has matching role', () => {
      expect(isRoleAuthorized('super_admin', ['super_admin', 'admin_tu'])).toBe(true);
      expect(isRoleAuthorized('admin', ['super_admin', 'admin'])).toBe(true);
      expect(isRoleAuthorized('bendahara', ['bendahara'])).toBe(true);
    });

    it('returns false when user does not have matching role', () => {
      expect(isRoleAuthorized('orang_tua', ['super_admin', 'admin_tu'])).toBe(false);
      expect(isRoleAuthorized(undefined, ['super_admin'])).toBe(false);
      expect(isRoleAuthorized(null, ['super_admin'])).toBe(false);
    });
  });

  describe('requireRole', () => {
    it('returns unauthorized when no user is logged in', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
        },
      };

      const result = await requireRole(['super_admin', 'admin'], mockSupabase as any);
      expect(result.authorized).toBe(false);
      expect(result.message).toContain('Sesi telah berakhir');
    });

    it('returns unauthorized when user role is not permitted', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1', email: 'wali@test.com' } } }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 'user-1', role: 'orang_tua', nama_lengkap: 'Budi' } }),
            }),
          }),
        }),
      };

      const result = await requireRole(['super_admin', 'admin_tu'], mockSupabase as any);
      expect(result.authorized).toBe(false);
      expect(result.message).toContain('tidak memiliki hak akses');
    });

    it('returns authorized when user role is in allowedRoles', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-admin', email: 'admin@test.com' } } }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 'user-admin', role: 'super_admin', nama_lengkap: 'Super Admin' } }),
            }),
          }),
        }),
      };

      const result = await requireRole(['super_admin', 'admin'], mockSupabase as any);
      expect(result.authorized).toBe(true);
      expect(result.user?.id).toBe('user-admin');
      expect(result.profile?.role).toBe('super_admin');
    });
  });

  describe('recordAuditLog', () => {
    it('constructs correct audit entry object and logs successfully', async () => {
      const mockInsert = vi.fn().mockReturnValue({
        throwOnError: vi.fn().mockResolvedValue({}),
      });
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          insert: mockInsert,
        }),
      };

      const result = await recordAuditLog(mockSupabase as any, {
        userId: 'user-123',
        tableName: 'berita',
        action: 'UPDATE',
        recordId: '45',
        oldData: { judul: 'Lama' },
        newData: { judul: 'Baru' },
      });

      expect(result.success).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('audit_logs');
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: 'user-123',
        table_name: 'berita',
        action: 'UPDATE',
        record_id: '45',
        old_data: { judul: 'Lama' },
        new_data: { judul: 'Baru' },
        ip_address: null,
      });
    });

    it('handles insert error gracefully', async () => {
      const mockInsert = vi.fn().mockReturnValue({
        throwOnError: vi.fn().mockRejectedValue(new Error('DB Constraint Violation')),
      });
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          insert: mockInsert,
        }),
      };

      const result = await recordAuditLog(mockSupabase as any, {
        tableName: 'pendaftar',
        action: 'DELETE',
        recordId: 'p-1',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('DB Constraint Violation');
    });
  });
});
