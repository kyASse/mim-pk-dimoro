import { describe, it, expect, vi, beforeEach } from 'vitest';
import { toggleFeaturedTestimoniAction } from '../actions';

const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockFrom = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('toggleFeaturedTestimoniAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockReturnValue({
      update: mockUpdate.mockReturnValue({
        eq: mockEq,
      }),
    });
  });

  it('toggles is_featured from false to true successfully', async () => {
    mockEq.mockResolvedValue({ error: null });

    const result = await toggleFeaturedTestimoniAction(10, false);

    expect(mockFrom).toHaveBeenCalledWith('testimoni');
    expect(mockUpdate).toHaveBeenCalledWith({ is_featured: true });
    expect(mockEq).toHaveBeenCalledWith('id', 10);
    expect(result.success).toBe(true);
    expect(result.is_featured).toBe(true);
  });

  it('handles database error gracefully', async () => {
    mockEq.mockResolvedValue({ error: { message: 'Database error' } });

    const result = await toggleFeaturedTestimoniAction(10, true);

    expect(result.success).toBe(false);
    expect(result.message).toContain('Database error');
  });
});
