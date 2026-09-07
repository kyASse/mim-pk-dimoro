'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { z } from 'zod';

const pendaftaranActionSchema = z.object({
  nama_lengkap: z.string().min(1, 'Nama lengkap wajib diisi'),
  nama_panggilan: z.string().min(1, 'Nama panggilan wajib diisi'),
  jenis_kelamin: z.enum(['Laki-laki', 'Perempuan']),
  tempat_lahir: z.string().min(1, 'Tempat lahir wajib diisi'),
  tanggal_lahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
  agama: z.string().min(1, 'Agama wajib diisi'),
  kewarganegaraan: z.enum(['WNI', 'WNA']),
  alamat_lengkap: z.string().min(1, 'Alamat wajib diisi'),
  nomor_telepon: z.string().min(1, 'Nomor telepon wajib diisi'),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  tk_asal: z.string().optional(),
  hobi: z.string().optional(),
  transportasi: z.string().optional(),
  alamat_orang_tua: z.string().optional(),
  wali_alamat: z.string().optional(),
  wali_telepon: z.string().optional(),
  gaji_orang_tua: z.string().optional(),
});

export async function submitPendaftaranAction(
  formData: FormData
): Promise<{ success: boolean; message?: string }> {
  try {
    const admin = await createAdminClient();

    const getStr = (key: string) => (formData.get(key) as string) || '';
    const getNum = (key: string) => {
      const val = formData.get(key);
      return val ? parseInt(val as string, 10) : null;
    };

    const payload = {
      nama_lengkap: getStr('nama_lengkap'),
      nama_panggilan: getStr('nama_panggilan'),
      jenis_kelamin: getStr('jenis_kelamin'),
      tempat_lahir: getStr('tempat_lahir'),
      tanggal_lahir: getStr('tanggal_lahir'),
      agama: getStr('agama'),
      kewarganegaraan: getStr('kewarganegaraan'),
      alamat_lengkap: getStr('alamat_lengkap'),
      nomor_telepon: getStr('nomor_telepon'),
      email: getStr('email'),
      tk_asal: getStr('tk_asal'),
      hobi: getStr('hobi'),
      transportasi: getStr('transportasi'),
      alamat_orang_tua: getStr('alamat_orang_tua'),
      wali_alamat: getStr('wali_alamat'),
      wali_telepon: getStr('wali_telepon'),
      gaji_orang_tua: getStr('gaji_orang_tua'),
    };

    const parseResult = pendaftaranActionSchema.safeParse(payload);
    if (!parseResult.success) {
      const err = parseResult.error.issues[0]?.message || 'Data form tidak valid';
      return { success: false, message: err };
    }

    let dokumen_pendukung_url: string | null = null;
    const file = formData.get('dokumen_pendukung') as File | null;

    if (file && file.size > 0 && file.name) {
      if (file.size > 5 * 1024 * 1024) {
        return { success: false, message: 'Ukuran file dokumen maksimal 5MB.' };
      }

      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const { data: uploadData, error: uploadError } = await admin.storage
        .from('dokumen-pendukung')
        .upload(fileName, file);

      if (uploadError) {
        return { success: false, message: `Gagal mengunggah dokumen: ${uploadError.message}` };
      }
      dokumen_pendukung_url = uploadData.path;
    }

    const memKebutuhanKhusus = formData.get('memiliki_kebutuhan_khusus') === 'true';
    let jenisKhusus: string[] = [];
    try {
      const jk = formData.get('jenis_kebutuhan_khusus');
      if (typeof jk === 'string' && jk) jenisKhusus = JSON.parse(jk);
    } catch {}

    const dataToInsert = {
      nama_lengkap: parseResult.data.nama_lengkap,
      nama_panggilan: parseResult.data.nama_panggilan,
      jenis_kelamin: parseResult.data.jenis_kelamin,
      tempat_lahir: parseResult.data.tempat_lahir,
      tanggal_lahir: parseResult.data.tanggal_lahir,
      agama: parseResult.data.agama,
      kewarganegaraan: parseResult.data.kewarganegaraan,
      tk_asal: getStr('tk_asal') || null,
      anak_ke: getNum('anak_ke'),
      jumlah_saudara_kandung: getNum('jumlah_saudara_kandung'),
      status_anak: getStr('status_anak') || null,
      bahasa_sehari_hari: getStr('bahasa_sehari_hari') || null,
      berat_badan: getNum('berat_badan'),
      tinggi_badan: getNum('tinggi_badan'),
      golongan_darah: getStr('golongan_darah') || null,
      cita_cita: getStr('cita_cita') || null,
      hobi: getStr('hobi') || null,
      transportasi: getStr('transportasi') || null,
      alamat_lengkap: parseResult.data.alamat_lengkap,
      nomor_telepon: parseResult.data.nomor_telepon,
      jarak_tempat_tinggal: getStr('jarak_tempat_tinggal') || null,
      alamat_orang_tua: getStr('alamat_orang_tua') || null,
      nama_ayah_kandung: getStr('nama_ayah_kandung') || null,
      pendidikan_ayah: getStr('pendidikan_ayah') || null,
      pekerjaan_ayah: getStr('pekerjaan_ayah') || null,
      nama_ibu_kandung: getStr('nama_ibu_kandung') || null,
      pendidikan_ibu: getStr('pendidikan_ibu') || null,
      pekerjaan_ibu: getStr('pekerjaan_ibu') || null,
      gaji_orang_tua: getStr('gaji_orang_tua') || null,
      email: parseResult.data.email || null,
      wali_nama: getStr('wali_nama') || null,
      wali_hubungan: getStr('wali_hubungan') || null,
      wali_pendidikan: getStr('wali_pendidikan') || null,
      wali_pekerjaan: getStr('wali_pekerjaan') || null,
      wali_alamat: getStr('wali_alamat') || null,
      wali_telepon: getStr('wali_telepon') || null,
      memiliki_kebutuhan_khusus: memKebutuhanKhusus,
      jenis_kebutuhan_khusus: memKebutuhanKhusus ? jenisKhusus : [],
      deskripsi_kebutuhan_khusus: memKebutuhanKhusus ? getStr('deskripsi_kebutuhan_khusus') : null,
      dokumen_pendukung_url,
      jalur_pendaftaran: 'Online',
      status_pendaftaran: 'Menunggu Konfirmasi',
    };

    const { error: insertError } = await admin.from('pendaftar').insert(dataToInsert);
    if (insertError) {
      if (dokumen_pendukung_url) {
        try { await admin.storage.from('dokumen-pendukung').remove([dokumen_pendukung_url]); } catch {}
      }
      return { success: false, message: `Gagal menyimpan pendaftaran: ${insertError.message}` };
    }

    return { success: true, message: 'Pendaftaran berhasil dikirim.' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Terjadi kesalahan sistem saat mendaftar.' };
  }
}
