import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPortalTestimoniAction } from '../actions';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';

describe('createPortalTestimoniAction', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should fallback nama_orang_tua to "Orang Tua Siswa" when profile nama_lengkap is missing', async () => {
    const mockGetUser = vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } });
    const mockSingle = vi.fn().mockResolvedValue({ data: { role: 'orang_tua', nama_lengkap: null } });
    const mockSelect = vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ single: mockSingle }) });
    const mockInsert = vi.fn().mockResolvedValue({ error: null });

    const mockSupabase = {
      auth: { getUser: mockGetUser },
      from: vi.fn((table: string) => {
        if (table === 'profiles') return { select: mockSelect };
        if (table === 'testimoni') return { insert: mockInsert };
        return {};
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const formData = new FormData();
    formData.append('isi_testimoni', 'Sekolah yang sangat baik');

    const result = await createPortalTestimoniAction(formData);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Terima kasih, testimoni Anda telah dikirim.');
    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
      nama_orang_tua: 'Orang Tua Siswa',
      isi_testimoni: 'Sekolah yang sangat baik',
    }));
  });
});
