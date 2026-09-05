// app/admin/pesan/__tests__/actions.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updatePesanStatusAction, deletePesanAction, markAllAsReadAction } from '../actions';

// Mock Supabase Server Client
const mockEq = vi.fn();
const mockUpdate = vi.fn(() => ({ eq: mockEq }));
const mockDelete = vi.fn(() => ({ eq: mockEq }));
const mockSelect = vi.fn();
const mockFrom = vi.fn(() => ({
  update: mockUpdate,
  delete: mockDelete,
  select: mockSelect,
}));

const mockGetUser = vi.fn();
const mockCreateClient = vi.fn(() => ({
  auth: { getUser: mockGetUser },
  from: mockFrom,
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => mockCreateClient(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Admin Pesan Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updatePesanStatusAction', () => {
    it('returns error if user is unauthenticated', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null }, error: null });
      const result = await updatePesanStatusAction(1, 'dibaca');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Unauthorized');
    });

    it('updates status and revalidates path for authenticated admin', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'admin-123' } }, error: null });
      mockEq.mockResolvedValueOnce({ error: null });

      const result = await updatePesanStatusAction(1, 'dibaca');
      expect(result.success).toBe(true);
      expect(mockFrom).toHaveBeenCalledWith('pesan_masuk');
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'dibaca',
        })
      );
      expect(mockEq).toHaveBeenCalledWith('id', 1);
    });

    it('handles database update errors gracefully', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'admin-123' } }, error: null });
      mockEq.mockResolvedValueOnce({ error: { message: 'Database connection failed' } });

      const result = await updatePesanStatusAction(1, 'dibaca');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database connection failed');
    });
  });

  describe('deletePesanAction', () => {
    it('returns error if user is unauthenticated', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null }, error: null });
      const result = await deletePesanAction(1);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Unauthorized');
    });

    it('deletes message by id for authenticated admin', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'admin-123' } }, error: null });
      mockEq.mockResolvedValueOnce({ error: null });

      const result = await deletePesanAction(1);
      expect(result.success).toBe(true);
      expect(mockFrom).toHaveBeenCalledWith('pesan_masuk');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', 1);
    });

    it('handles delete errors gracefully', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'admin-123' } }, error: null });
      mockEq.mockResolvedValueOnce({ error: { message: 'Delete constraint failed' } });

      const result = await deletePesanAction(1);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Delete constraint failed');
    });
  });

  describe('markAllAsReadAction', () => {
    it('returns error if user is unauthenticated', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null }, error: null });
      const result = await markAllAsReadAction();
      expect(result.success).toBe(false);
      expect(result.error).toContain('Unauthorized');
    });

    it('updates all unread messages to read for authenticated admin', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'admin-123' } }, error: null });
      mockEq.mockResolvedValueOnce({ error: null });

      const result = await markAllAsReadAction();
      expect(result.success).toBe(true);
      expect(mockFrom).toHaveBeenCalledWith('pesan_masuk');
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'dibaca',
        })
      );
      expect(mockEq).toHaveBeenCalledWith('status', 'belum_dibaca');
    });
  });
});
