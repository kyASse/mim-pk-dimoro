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

  it('should return 403 when non-admin user has no email', async () => {
    const { GET } = await import('@/app/api/dokumen/download/route');
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-no-email' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { role: 'orang_tua' }, error: null }),
          }),
        }),
      }),
    };
    (serverSupabase.createClient as any).mockResolvedValue(mockSupabase);

    const mockAdmin = {
      from: vi.fn(),
      storage: {
        from: vi.fn(),
      },
    };
    (adminSupabase.createAdminClient as any).mockResolvedValue(mockAdmin);

    const req = new NextRequest('http://localhost:3000/api/dokumen/download?path=test.pdf');
    const res = await GET(req);
    expect(res.status).toBe(403);
    expect(mockAdmin.from).not.toHaveBeenCalled();
  });

  it('should return 403 when non-admin user is not the document owner', async () => {
    const { GET } = await import('@/app/api/dokumen/download/route');
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-2', email: 'parent@example.com' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { role: 'orang_tua' }, error: null }),
          }),
        }),
      }),
    };
    (serverSupabase.createClient as any).mockResolvedValue(mockSupabase);

    const mockLimit = vi.fn().mockResolvedValue({ data: [], error: null });
    const mockEqEmail = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockEqPath = vi.fn().mockReturnValue({ eq: mockEqEmail });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEqPath });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

    const mockAdmin = {
      from: mockFrom,
      storage: {
        from: vi.fn(),
      },
    };
    (adminSupabase.createAdminClient as any).mockResolvedValue(mockAdmin);

    const req = new NextRequest('http://localhost:3000/api/dokumen/download?path=other-kid.pdf');
    const res = await GET(req);
    expect(res.status).toBe(403);

    expect(mockFrom).toHaveBeenCalledWith('pendaftar');
    expect(mockSelect).toHaveBeenCalledWith('id');
    expect(mockEqPath).toHaveBeenCalledWith('dokumen_pendukung_url', 'other-kid.pdf');
    expect(mockEqEmail).toHaveBeenCalledWith('email', 'parent@example.com');
  });

  it('should redirect to signed URL when non-admin user owns the document', async () => {
    const { GET } = await import('@/app/api/dokumen/download/route');
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-2', email: 'parent@example.com' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { role: 'orang_tua' }, error: null }),
          }),
        }),
      }),
    };
    (serverSupabase.createClient as any).mockResolvedValue(mockSupabase);

    const mockLimit = vi.fn().mockResolvedValue({ data: [{ id: 'reg-1' }], error: null });
    const mockEqEmail = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockEqPath = vi.fn().mockReturnValue({ eq: mockEqEmail });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEqPath });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

    const mockCreateSignedUrl = vi.fn().mockResolvedValue({ data: { signedUrl: 'https://storage/signed-url-parent' }, error: null });
    const mockStorageFrom = vi.fn().mockReturnValue({ createSignedUrl: mockCreateSignedUrl });

    const mockAdmin = {
      from: mockFrom,
      storage: {
        from: mockStorageFrom,
      },
    };
    (adminSupabase.createAdminClient as any).mockResolvedValue(mockAdmin);

    const req = new NextRequest('http://localhost:3000/api/dokumen/download?path=my-kid.pdf');
    const res = await GET(req);
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('https://storage/signed-url-parent');

    expect(mockFrom).toHaveBeenCalledWith('pendaftar');
    expect(mockSelect).toHaveBeenCalledWith('id');
    expect(mockEqPath).toHaveBeenCalledWith('dokumen_pendukung_url', 'my-kid.pdf');
    expect(mockEqEmail).toHaveBeenCalledWith('email', 'parent@example.com');
    expect(mockStorageFrom).toHaveBeenCalledWith('dokumen-pendukung');
    expect(mockCreateSignedUrl).toHaveBeenCalledWith('my-kid.pdf', 60);
  });
});
