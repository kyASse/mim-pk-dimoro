import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  toggleFeaturedTestimoniAction,
  createTestimoniAction,
  updateTestimoniAction,
  deleteTestimoniAction,
} from '../actions';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
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

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('testimoni server actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockReturnValue({
      insert: mockInsert,
      update: mockUpdate.mockReturnValue({
        eq: mockEq,
      }),
      delete: mockDelete.mockReturnValue({
        eq: mockEq,
      }),
    });
  });

  describe('toggleFeaturedTestimoniAction', () => {
    it('toggles is_featured from false to true successfully and revalidates paths', async () => {
      mockEq.mockResolvedValue({ error: null });

      const result = await toggleFeaturedTestimoniAction(10, false);

      expect(mockFrom).toHaveBeenCalledWith('testimoni');
      expect(mockUpdate).toHaveBeenCalledWith({ is_featured: true });
      expect(mockEq).toHaveBeenCalledWith('id', 10);
      expect(revalidatePath).toHaveBeenCalledWith('/admin/testimoni');
      expect(revalidatePath).toHaveBeenCalledWith('/');
      expect(result.success).toBe(true);
      expect(result.is_featured).toBe(true);
    });

    it('handles database error gracefully', async () => {
      mockEq.mockResolvedValue({ error: { message: 'Database error' } });

      const result = await toggleFeaturedTestimoniAction(10, true);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Database error');
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });

  describe('createTestimoniAction', () => {
    it('creates testimoni and revalidates admin and home paths', async () => {
      mockInsert.mockResolvedValue({ error: null });
      const formData = new FormData();
      formData.append('nama_orang_tua', 'Ahmad');
      formData.append('status_orang_tua', 'Wali Murid');
      formData.append('isi_testimoni', 'Sangat baik');
      formData.append('is_featured', 'on');

      const result = await createTestimoniAction(formData);

      expect(mockFrom).toHaveBeenCalledWith('testimoni');
      expect(mockInsert).toHaveBeenCalledWith({
        nama_orang_tua: 'Ahmad',
        status_orang_tua: 'Wali Murid',
        isi_testimoni: 'Sangat baik',
        is_featured: true,
      });
      expect(revalidatePath).toHaveBeenCalledWith('/admin/testimoni');
      expect(revalidatePath).toHaveBeenCalledWith('/');
      expect(result.success).toBe(true);
    });
  });

  describe('updateTestimoniAction', () => {
    it('updates testimoni, revalidates paths, and redirects', async () => {
      mockEq.mockResolvedValue({ error: null });
      const formData = new FormData();
      formData.append('nama_orang_tua', 'Ahmad Updated');
      formData.append('status_orang_tua', 'Wali Murid');
      formData.append('isi_testimoni', 'Sangat memuaskan');

      await updateTestimoniAction(5, formData);

      expect(mockFrom).toHaveBeenCalledWith('testimoni');
      expect(mockUpdate).toHaveBeenCalledWith({
        nama_orang_tua: 'Ahmad Updated',
        status_orang_tua: 'Wali Murid',
        isi_testimoni: 'Sangat memuaskan',
        is_featured: false,
      });
      expect(mockEq).toHaveBeenCalledWith('id', 5);
      expect(revalidatePath).toHaveBeenCalledWith('/admin/testimoni');
      expect(revalidatePath).toHaveBeenCalledWith('/admin/testimoni/edit/5');
      expect(revalidatePath).toHaveBeenCalledWith('/');
      expect(redirect).toHaveBeenCalledWith('/admin/testimoni');
    });
  });

  describe('deleteTestimoniAction', () => {
    it('deletes testimoni and revalidates admin and home paths', async () => {
      mockEq.mockResolvedValue({ error: null });

      const result = await deleteTestimoniAction(5);

      expect(mockFrom).toHaveBeenCalledWith('testimoni');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', 5);
      expect(revalidatePath).toHaveBeenCalledWith('/admin/testimoni');
      expect(revalidatePath).toHaveBeenCalledWith('/');
      expect(result.success).toBe(true);
    });
  });
});
