import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  deleteBeritaAction,
  updateBeritaAction,
  createBeritaAction,
  uploadBeritaInlineImageAction,
} from '../actions';

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Mock Supabase clients
const mockSupabase = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(),
};

const mockAdminSupabase = {
  from: vi.fn(),
  storage: {
    from: vi.fn(),
  },
};

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabase)),
}));

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(() => Promise.resolve(mockAdminSupabase)),
}));

describe('Admin Berita Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadBeritaInlineImageAction', () => {
    it('returns error when user is unauthenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      const formData = new FormData();
      const file = new File(['dummy'], 'inline.png', { type: 'image/png' });
      formData.append('image', file);

      const result = await uploadBeritaInlineImageAction(formData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Sesi telah berakhir');
    });

    it('returns error when user role is not authorized', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { role: 'siswa' },
            }),
          }),
        }),
      });

      const formData = new FormData();
      const file = new File(['dummy'], 'inline.png', { type: 'image/png' });
      formData.append('image', file);

      const result = await uploadBeritaInlineImageAction(formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Anda tidak memiliki wewenang untuk tindakan ini.');
    });

    it('returns error when image file is missing or empty', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { role: 'admin' },
            }),
          }),
        }),
      });

      const formData = new FormData();
      // No image attached
      const resultNoImage = await uploadBeritaInlineImageAction(formData);
      expect(resultNoImage.success).toBe(false);
      expect(resultNoImage.message).toBe('File gambar tidak ditemukan atau kosong.');

      // Empty image file
      const emptyFile = new File([], 'empty.png', { type: 'image/png' });
      formData.append('image', emptyFile);
      const resultEmpty = await uploadBeritaInlineImageAction(formData);
      expect(resultEmpty.success).toBe(false);
      expect(resultEmpty.message).toBe('File gambar tidak ditemukan atau kosong.');
    });

    it('returns error when file size exceeds 10MB', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { role: 'admin' },
            }),
          }),
        }),
      });

      const largeFile = new File(['a'], 'huge.jpg', { type: 'image/jpeg' });
      Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 });

      const formData = new FormData();
      formData.append('image', largeFile);

      const result = await uploadBeritaInlineImageAction(formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Ukuran file gambar terlalu besar (maksimal 10MB).');
    });

    it('uploads file to storage and returns public URL on success', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { role: 'admin' },
            }),
          }),
        }),
      });

      const mockUpload = vi.fn().mockResolvedValue({ data: { path: 'berita/inline/123-test.png' }, error: null });
      const mockGetPublicUrl = vi.fn().mockReturnValue({
        data: { publicUrl: 'https://example.supabase.co/storage/v1/object/public/konten-publik/berita/inline/123-test.png' },
      });

      mockAdminSupabase.storage.from.mockReturnValue({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      });

      const validFile = new File(['valid-content'], 'test image.png', { type: 'image/png' });
      Object.defineProperty(validFile, 'size', { value: 1024 });

      const formData = new FormData();
      formData.append('image', validFile);

      const result = await uploadBeritaInlineImageAction(formData);

      expect(result.success).toBe(true);
      expect(result.url).toBe('https://example.supabase.co/storage/v1/object/public/konten-publik/berita/inline/123-test.png');
      expect(mockAdminSupabase.storage.from).toHaveBeenCalledWith('konten-publik');
      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringMatching(/^berita\/inline\/\d+-test_image\.png$/),
        validFile
      );
    });

    it('returns error when storage upload fails', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { role: 'admin_tu' },
            }),
          }),
        }),
      });

      const mockUpload = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Bucket quota exceeded' },
      });

      mockAdminSupabase.storage.from.mockReturnValue({
        upload: mockUpload,
      });

      const validFile = new File(['valid-content'], 'inline.jpg', { type: 'image/jpeg' });
      Object.defineProperty(validFile, 'size', { value: 2048 });

      const formData = new FormData();
      formData.append('image', validFile);

      const result = await uploadBeritaInlineImageAction(formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Gagal mengunggah gambar: Bucket quota exceeded');
    });
  });

  describe('deleteBeritaAction', () => {
    it('returns error if unauthenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      const result = await deleteBeritaAction(1, 'http://example.com/storage/v1/object/public/konten-publik/berita/sample.jpg');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Sesi telah berakhir');
    });

    it('successfully removes image and deletes database record', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { role: 'super_admin' },
            }),
          }),
        }),
      });

      const mockRemove = vi.fn().mockResolvedValue({ error: null });
      mockAdminSupabase.storage.from.mockReturnValue({
        remove: mockRemove,
      });

      const mockDeleteEq = vi.fn().mockResolvedValue({ error: null });
      mockAdminSupabase.from.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: mockDeleteEq,
        }),
      });

      const result = await deleteBeritaAction(1, 'http://example.com/storage/v1/object/public/konten-publik/berita/sample.jpg');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Berita berhasil dihapus.');
      expect(mockAdminSupabase.storage.from).toHaveBeenCalledWith('konten-publik');
      expect(mockRemove).toHaveBeenCalledWith(['berita/sample.jpg']);
      expect(mockDeleteEq).toHaveBeenCalledWith('id', 1);
    });
  });

  describe('updateBeritaAction', () => {
    it('returns error if unauthenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      const result = await updateBeritaAction(1, {
        judul: 'Test',
        ringkasan: 'Summary',
        isi_lengkap: 'Content',
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('Sesi telah berakhir');
    });

    it('successfully updates berita in database', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { role: 'admin' },
            }),
          }),
        }),
      });

      const mockUpdateEq = vi.fn().mockResolvedValue({ error: null });
      mockAdminSupabase.from.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: mockUpdateEq,
        }),
      });

      const result = await updateBeritaAction(1, {
        judul: 'Updated Title',
        ringkasan: 'Updated Summary',
        isi_lengkap: '<p>Updated Content</p>',
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe('Berita berhasil diperbarui.');
      expect(mockUpdateEq).toHaveBeenCalledWith('id', 1);
    });
  });

  describe('createBeritaAction', () => {
    it('validates required fields', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { role: 'admin' },
            }),
          }),
        }),
      });

      const formData = new FormData();
      formData.append('judul', '');
      formData.append('ringkasan', 'Ringkasan');
      formData.append('isiLengkap', 'Isi');

      const result = await createBeritaAction(formData);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Judul, ringkasan, dan isi berita wajib diisi.');
    });

    it('successfully creates berita and uploads header image', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { role: 'admin' },
            }),
          }),
        }),
      });

      const mockUpload = vi.fn().mockResolvedValue({ data: { path: 'berita/header.png' }, error: null });
      const mockGetPublicUrl = vi.fn().mockReturnValue({
        data: { publicUrl: 'https://example.supabase.co/storage/v1/object/public/konten-publik/berita/header.png' },
      });

      mockAdminSupabase.storage.from.mockReturnValue({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      });

      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      mockAdminSupabase.from.mockImplementation((table: string) => {
        if (table === 'berita') {
          return { insert: mockInsert };
        }
        if (table === 'galeri') {
          return { insert: vi.fn().mockResolvedValue({ error: null }) };
        }
        return {};
      });

      const file = new File(['header'], 'header.png', { type: 'image/png' });
      Object.defineProperty(file, 'size', { value: 1024 });

      const formData = new FormData();
      formData.append('judul', 'Berita Utama');
      formData.append('ringkasan', 'Ringkasan Utama');
      formData.append('isiLengkap', '<p>Isi Berita</p>');
      formData.append('image', file);
      formData.append('tambahkanKeGaleri', 'true');

      const result = await createBeritaAction(formData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Berita berhasil ditambahkan.');
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          judul: 'Berita Utama',
          ringkasan: 'Ringkasan Utama',
          isi_lengkap: '<p>Isi Berita</p>',
          image_url: 'https://example.supabase.co/storage/v1/object/public/konten-publik/berita/header.png',
          penulis_id: 'user-1',
        })
      );
    });
  });
});
