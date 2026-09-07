import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  parseTarget,
  detectTargetFromContent,
  getProfileFileName,
  switchEnv,
  getStatus,
} from '../../scripts/switch-env.mjs';

describe('switch-env helper logic', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'switch-env-test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe('parseTarget', () => {
    it('should parse local targets', () => {
      expect(parseTarget('local')).toBe('local');
      expect(parseTarget('LOCAL')).toBe('local');
      expect(parseTarget('l')).toBe('local');
    });

    it('should parse remote targets', () => {
      expect(parseTarget('remote')).toBe('remote');
      expect(parseTarget('REMOTE')).toBe('remote');
      expect(parseTarget('prod')).toBe('remote');
      expect(parseTarget('production')).toBe('remote');
    });

    it('should default empty or status arg to status', () => {
      expect(parseTarget('status')).toBe('status');
      expect(parseTarget('')).toBe('status');
      expect(parseTarget(undefined)).toBe('status');
    });

    it('should return null for invalid target', () => {
      expect(parseTarget('invalid')).toBeNull();
    });
  });

  describe('detectTargetFromContent', () => {
    it('should detect local Supabase URL', () => {
      const content = `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321\nNEXT_PUBLIC_SUPABASE_ANON_KEY=abc`;
      const result = detectTargetFromContent(content);
      expect(result.type).toBe('local');
      expect(result.url).toBe('http://127.0.0.1:54321');
    });

    it('should detect remote Supabase URL', () => {
      const content = `NEXT_PUBLIC_SUPABASE_URL=https://xyzabcdef.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=abc`;
      const result = detectTargetFromContent(content);
      expect(result.type).toBe('remote');
      expect(result.url).toBe('https://xyzabcdef.supabase.co');
    });

    it('should handle missing URL or empty content', () => {
      const result = detectTargetFromContent('');
      expect(result.type).toBe('unknown');
      expect(result.url).toBeNull();
    });
  });

  describe('getProfileFileName', () => {
    it('should return appropriate profile file names', () => {
      expect(getProfileFileName('local')).toBe('.env.local.supabase-local');
      expect(getProfileFileName('remote')).toBe('.env.local.supabase-remote');
    });
  });

  describe('switchEnv and getStatus file operations', () => {
    it('should switch to local and overwrite .env.local', () => {
      const localProfile = path.join(tempDir, '.env.local.supabase-local');
      fs.writeFileSync(
        localProfile,
        'NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321\nNEXT_PUBLIC_SUPABASE_ANON_KEY=localkey'
      );

      const result = switchEnv('local', tempDir);
      expect(result.success).toBe(true);
      expect(result.target).toBe('local');
      expect(result.url).toBe('http://127.0.0.1:54321');

      const envLocalContent = fs.readFileSync(path.join(tempDir, '.env.local'), 'utf-8');
      expect(envLocalContent).toContain('http://127.0.0.1:54321');

      const status = getStatus(tempDir);
      expect(status.exists).toBe(true);
      expect(status.target).toBe('local');
      expect(status.url).toBe('http://127.0.0.1:54321');
    });

    it('should switch to remote and overwrite .env.local', () => {
      const remoteProfile = path.join(tempDir, '.env.local.supabase-remote');
      fs.writeFileSync(
        remoteProfile,
        'NEXT_PUBLIC_SUPABASE_URL=https://mimpkdimoro.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=remotekey'
      );

      const result = switchEnv('remote', tempDir);
      expect(result.success).toBe(true);
      expect(result.target).toBe('remote');
      expect(result.url).toBe('https://mimpkdimoro.supabase.co');

      const status = getStatus(tempDir);
      expect(status.exists).toBe(true);
      expect(status.target).toBe('remote');
      expect(status.url).toBe('https://mimpkdimoro.supabase.co');
    });

    it('should auto-create template profile if source file does not exist', () => {
      const result = switchEnv('local', tempDir);
      expect(result.success).toBe(true);
      expect(fs.existsSync(path.join(tempDir, '.env.local.supabase-local'))).toBe(true);
      expect(fs.existsSync(path.join(tempDir, '.env.local'))).toBe(true);
    });
  });
});
