import { describe, it, expect } from 'vitest';
import { isRoleAuthorized } from '@/lib/auth/guards';
import { ADMIN_ROLES, type UserRole } from '@/lib/auth/types';

describe('Middleware RBAC Access Logic', () => {
  it('allows all admin and school staff roles into /admin', () => {
    expect(isRoleAuthorized('super_admin', ADMIN_ROLES)).toBe(true);
    expect(isRoleAuthorized('admin_tu', ADMIN_ROLES)).toBe(true);
    expect(isRoleAuthorized('kepala_madrasah', ADMIN_ROLES)).toBe(true);
    expect(isRoleAuthorized('bendahara', ADMIN_ROLES)).toBe(true);
    expect(isRoleAuthorized('wali_kelas', ADMIN_ROLES)).toBe(true);
    expect(isRoleAuthorized('guru_mapel', ADMIN_ROLES)).toBe(true);
    expect(isRoleAuthorized('admin', ADMIN_ROLES)).toBe(true);
  });

  it('rejects orang_tua from /admin routes', () => {
    expect(isRoleAuthorized('orang_tua', ADMIN_ROLES)).toBe(false);
  });

  it('rejects undefined/null roles from /admin routes', () => {
    expect(isRoleAuthorized(undefined, ADMIN_ROLES)).toBe(false);
    expect(isRoleAuthorized(null, ADMIN_ROLES)).toBe(false);
  });

  it('correctly categorizes role redirection rules', () => {
    const shouldRedirectToPortal = (role: UserRole | string, pathname: string) => {
      return role === 'orang_tua' && pathname.startsWith('/admin');
    };

    const shouldRedirectToLogin = (isLoggedIn: boolean, pathname: string) => {
      return !isLoggedIn && (pathname.startsWith('/admin') || pathname.startsWith('/portal'));
    };

    expect(shouldRedirectToPortal('orang_tua', '/admin')).toBe(true);
    expect(shouldRedirectToPortal('orang_tua', '/admin/pendaftar')).toBe(true);
    expect(shouldRedirectToPortal('super_admin', '/admin')).toBe(false);
    expect(shouldRedirectToPortal('admin_tu', '/admin/berita')).toBe(false);

    expect(shouldRedirectToLogin(false, '/admin')).toBe(true);
    expect(shouldRedirectToLogin(false, '/portal')).toBe(true);
    expect(shouldRedirectToLogin(false, '/berita')).toBe(false);
    expect(shouldRedirectToLogin(true, '/admin')).toBe(false);
  });
});
