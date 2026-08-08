import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitPendaftaranAction } from '../actions';

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(),
}));

import { createAdminClient } from '@/lib/supabase/admin';

describe('submitPendaftaranAction', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return error when required fields are missing', async () => {
    const formData = new FormData();
    formData.append('nama_lengkap', '');

    const result = await submitPendaftaranAction(formData);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Nama lengkap wajib diisi');
  });

  it('should return error when file size exceeds 5MB', async () => {

    const mockAdmin = {
      storage: {
        from: vi.fn(),
      },
      from: vi.fn(),
    };
    vi.mocked(createAdminClient).mockResolvedValue(mockAdmin as any);

    const formData = new FormData();
    formData.append('nama_lengkap', 'Ahmad Fulan');
    formData.append('nama_panggilan', 'Ahmad');
    formData.append('jenis_kelamin', 'Laki-laki');
    formData.append('tempat_lahir', 'Karanganyar');
    formData.append('tanggal_lahir', '2018-01-01');
    formData.append('agama', 'Islam');
    formData.append('kewarganegaraan', 'WNI');
    formData.append('alamat_lengkap', 'Jl. Dimoro No. 1');
    formData.append('nomor_telepon', '08123456789');

    const oversizedBlob = new Blob(['a'.repeat(6 * 1024 * 1024)], { type: 'application/pdf' });
    const oversizedFile = new File([oversizedBlob], 'document.pdf', { type: 'application/pdf' });
    formData.append('dokumen_pendukung', oversizedFile);

    const result = await submitPendaftaranAction(formData);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Ukuran file dokumen maksimal 5MB.');
  });

  it('should insert pendaftar successfully when valid data is provided', async () => {
    const mockUpload = vi.fn().mockResolvedValue({ data: { path: '123_doc.pdf' }, error: null });
    const mockInsert = vi.fn().mockResolvedValue({ error: null });

    const mockAdmin = {
      storage: {
        from: vi.fn().mockReturnValue({ upload: mockUpload }),
      },
      from: vi.fn().mockReturnValue({ insert: mockInsert }),
    };
    vi.mocked(createAdminClient).mockResolvedValue(mockAdmin as any);

    const formData = new FormData();
    formData.append('nama_lengkap', 'Ahmad Fulan');
    formData.append('nama_panggilan', 'Ahmad');
    formData.append('jenis_kelamin', 'Laki-laki');
    formData.append('tempat_lahir', 'Karanganyar');
    formData.append('tanggal_lahir', '2018-01-01');
    formData.append('agama', 'Islam');
    formData.append('kewarganegaraan', 'WNI');
    formData.append('alamat_lengkap', 'Jl. Dimoro No. 1');
    formData.append('nomor_telepon', '08123456789');
    formData.append('memiliki_kebutuhan_khusus', 'true');
    formData.append('jenis_kebutuhan_khusus', JSON.stringify(['autisme']));

    const result = await submitPendaftaranAction(formData);
    expect(result.success).toBe(true);
    expect(result.message).toBe('Pendaftaran berhasil dikirim.');
    expect(mockAdmin.from).toHaveBeenCalledWith('pendaftar');
    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
      nama_lengkap: 'Ahmad Fulan',
      memiliki_kebutuhan_khusus: true,
      jenis_kebutuhan_khusus: ['autisme'],
      jalur_pendaftaran: 'Online',
      status_pendaftaran: 'Menunggu Konfirmasi',
    }));
  });
});
