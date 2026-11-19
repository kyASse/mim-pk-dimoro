import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Security Migration: RLS Hardening Verification', () => {
  const migrationPath = path.join(process.cwd(), 'supabase/migrations/20261103000000_security_audit_remediation.sql');

  it('migration file should exist and contain critical policy drops', () => {
    expect(fs.existsSync(migrationPath)).toBe(true);
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    // Verify critical legacy policies are dropped
    expect(sql).toContain('DROP POLICY IF EXISTS "Enable all access for all users" ON public.profiles');
    expect(sql).toContain('DROP POLICY IF EXISTS "Enable all access for all users" ON public.siswa');
    expect(sql).toContain('DROP POLICY IF EXISTS "All write kalender_akademik" ON public.kalender_akademik');
    expect(sql).toContain('DROP POLICY IF EXISTS "Enable all access for all users" ON public.testimoni');
    expect(sql).toContain('DROP POLICY IF EXISTS "Authenticated read laporan_perkembangan" ON public.laporan_perkembangan');

    // Verify role update lockdown on profiles
    expect(sql).toContain('CREATE POLICY "Users can update own profile non-role" ON public.profiles');
  });
});
