import { describe, it, expect } from 'vitest';
import { ADMIN_ROLES, type UserRole } from '@/lib/auth/types';
import nextConfig from '@/next.config';

function isAllowedAdmin(role: UserRole | undefined | null): boolean {
  if (!role) return false;
  return ADMIN_ROLES.includes(role);
}

describe('Security Middleware: Strict Allowlist Verification', () => {
  it('should reject orang_tua from admin routes', () => {
    expect(isAllowedAdmin('orang_tua')).toBe(false);
  });

  it('should reject undefined role from admin routes', () => {
    expect(isAllowedAdmin(undefined)).toBe(false);
  });

  it('should reject null or unknown role strings from admin routes', () => {
    expect(isAllowedAdmin(null)).toBe(false);
    expect(isAllowedAdmin('guest' as unknown as UserRole)).toBe(false);
    expect(isAllowedAdmin('' as unknown as UserRole)).toBe(false);
    expect(isAllowedAdmin('attacker' as unknown as UserRole)).toBe(false);
  });

  it('should allow admin_tu, super_admin, and all valid admin roles', () => {
    expect(isAllowedAdmin('super_admin')).toBe(true);
    expect(isAllowedAdmin('admin_tu')).toBe(true);
    expect(isAllowedAdmin('kepala_madrasah')).toBe(true);
    expect(isAllowedAdmin('bendahara')).toBe(true);
    expect(isAllowedAdmin('wali_kelas')).toBe(true);
    expect(isAllowedAdmin('guru_mapel')).toBe(true);
    expect(isAllowedAdmin('admin')).toBe(true);
  });

  it('ADMIN_ROLES should explicitly exclude orang_tua', () => {
    expect(ADMIN_ROLES).not.toContain('orang_tua');
  });
});

describe('Security Headers Verification (next.config.ts)', () => {
  it('should define required security headers', async () => {
    expect(nextConfig.headers).toBeDefined();
    const headersConfig = await nextConfig.headers!();
    expect(Array.isArray(headersConfig)).toBe(true);

    const rootPathHeaders = headersConfig.find((h) => h.source === '/:path*');
    expect(rootPathHeaders).toBeDefined();

    const headersMap = new Map(rootPathHeaders!.headers.map((h) => [h.key, h.value]));

    expect(headersMap.get('X-Frame-Options')).toBe('SAMEORIGIN');
    expect(headersMap.get('X-Content-Type-Options')).toBe('nosniff');
    expect(headersMap.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(headersMap.get('Permissions-Policy')).toContain('camera=()');
    expect(headersMap.get('Permissions-Policy')).toContain('microphone=()');
    expect(headersMap.get('Permissions-Policy')).toContain('geolocation=()');

    const csp = headersMap.get('Content-Security-Policy-Report-Only');
    expect(csp).toBeDefined();
    expect(csp).toContain("frame-ancestors 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
  });

  it('should secure SVG handling in nextConfig images', () => {
    expect(nextConfig.images).toBeDefined();
    expect(nextConfig.images?.dangerouslyAllowSVG).toBe(true);
    expect(nextConfig.images?.contentSecurityPolicy).toBe("default-src 'self'; script-src 'none'; sandbox;");
  });
});
