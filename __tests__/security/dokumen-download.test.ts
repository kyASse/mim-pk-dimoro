import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import * as serverSupabase from '@/lib/supabase/server';
import * as adminSupabase from '@/lib/supabase/admin';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(),
}));

describe('Security Route: /api/dokumen/download', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 when user is not authenticated', async () => {
    const { GET } = await import('@/app/api/dokumen/download/route');
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    };
    (serverSupabase.createClient as any).mockResolvedValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/dokumen/download?path=test.pdf');
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it('should return 400 when path parameter is missing', async () => {
    const { GET } = await import('@/app/api/dokumen/download/route');
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'admin-1' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { role: 'admin' }, error: null }),
          }),
        }),
      }),
    };
    (serverSupabase.createClient as any).mockResolvedValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/dokumen/download');
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it('should return 400 when path contains path traversal sequences', async () => {
    const { GET } = await import('@/app/api/dokumen/download/route');
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'admin-1' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { role: 'admin' }, error: null }),
          }),
        }),
      }),
    };
    (serverSupabase.createClient as any).mockResolvedValue(mockSupabase);

    const reqTraversal1 = new NextRequest('http://localhost:3000/api/dokumen/download?path=../etc/passwd');
    const res1 = await GET(reqTraversal1);
    expect(res1.status).toBe(400);

    const reqTraversal2 = new NextRequest('http://localhost:3000/api/dokumen/download?path=/absolute/path');
    const res2 = await GET(reqTraversal2);
    expect(res2.status).toBe(400);

    const reqTraversal3 = new NextRequest('http://localhost:3000/api/dokumen/download?path=folder\\file.pdf');
    const res3 = await GET(reqTraversal3);
    expect(res3.status).toBe(400);
  });

  it('should redirect to signed URL when user is admin', async () => {
    const { GET } = await import('@/app/api/dokumen/download/route');
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'admin-1' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { role: 'admin' }, error: null }),
          }),
        }),
      }),
    };
    (serverSupabase.createClient as any).mockResolvedValue(mockSupabase);

    const mockAdmin = {
      storage: {
        from: vi.fn().mockReturnValue({
          createSignedUrl: vi.fn().mockResolvedValue({ data: { signedUrl: 'https://storage/signed-url' }, error: null }),
        }),
      },
    };
    (adminSupabase.createAdminClient as any).mockResolvedValue(mockAdmin);

    const req = new NextRequest('http://localhost:3000/api/dokumen/download?path=test.pdf');
    const res = await GET(req);
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('https://storage/signed-url');
  });

  it('should return 403 when non-admin user is not the document owner', async () => {
    const { GET } = await import('@/app/api/dokumen/download/route');
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-2', email: 'parent@example.com' } }, error: null }),
      },
      from: vi.fn((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: { role: 'orang_tua' }, error: null }),
              }),
            }),
          };
        }
        if (table === 'pendaftar') {
          return {
            select: vi.fn().mockReturnValue({
              or: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue({ data: [], error: null }),
              }),
            }),
          };
        }
        return {};
      }),
    };
    (serverSupabase.createClient as any).mockResolvedValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/dokumen/download?path=other-kid.pdf');
    const res = await GET(req);
    expect(res.status).toBe(403);
  });

  it('should redirect to signed URL when non-admin user owns the document', async () => {
    const { GET } = await import('@/app/api/dokumen/download/route');
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-2', email: 'parent@example.com' } }, error: null }),
      },
      from: vi.fn((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: { role: 'orang_tua' }, error: null }),
              }),
            }),
          };
        }
        if (table === 'pendaftar') {
          return {
            select: vi.fn().mockReturnValue({
              or: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue({
                  data: [{ id: 'reg-1', email: 'parent@example.com', dokumen_pendukung_url: 'my-kid.pdf' }],
                  error: null,
                }),
              }),
            }),
          };
        }
        return {};
      }),
    };
    (serverSupabase.createClient as any).mockResolvedValue(mockSupabase);

    const mockAdmin = {
      storage: {
        from: vi.fn().mockReturnValue({
          createSignedUrl: vi.fn().mockResolvedValue({ data: { signedUrl: 'https://storage/signed-url-parent' }, error: null }),
        }),
      },
    };
    (adminSupabase.createAdminClient as any).mockResolvedValue(mockAdmin);

    const req = new NextRequest('http://localhost:3000/api/dokumen/download?path=my-kid.pdf');
    const res = await GET(req);
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('https://storage/signed-url-parent');
  });
});
