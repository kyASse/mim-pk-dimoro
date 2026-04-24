'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

// Helper to ensure only pdf and limited size
function validatePdf(file: File | null, maxMB = 10) {
  if (!file) return { ok: false, message: 'File rapor (PDF) wajib diunggah.' };
  if (file.type !== 'application/pdf') return { ok: false, message: 'File harus berformat PDF.' };
  if (file.size > maxMB * 1024 * 1024) return { ok: false, message: `Ukuran file maksimal ${maxMB}MB.` };
  return { ok: true };
}

// Validasi payload (kecuali file) dengan Zod
const laporanSchema = z.object({
  siswa_id: z.string().min(1, "Siswa wajib dipilih"),
  semester: z.string().min(1, "Semester wajib diisi"),
  tahun_ajaran: z
    .string()
    .min(1, "Tahun ajaran wajib diisi")
    // contoh format fleksibel, cukup panjang minimal dan berisi angka/huruf
    .regex(/^[\w\s\-/]+$/i, "Format tahun ajaran tidak valid"),
  catatan_guru: z.string().optional().nullable(),
});

export async function createLaporanAction(prevState: any, formData: FormData): Promise<{ success: boolean; message?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'Unauthorized' };
  // Pastikan hanya admin yang boleh membuat laporan
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') return { success: false, message: 'Forbidden' };

  // Gunakan klien admin untuk melewati RLS pada operasi tulis
  const admin = await createAdminClient();

  const payload = {
    siswa_id: (formData.get('siswa_id') as string) || '',
    semester: (formData.get('semester') as string) || '',
    tahun_ajaran: (formData.get('tahun_ajaran') as string) || '',
    catatan_guru: ((formData.get('catatan_guru') as string) || '').trim() || null,
  };
  const parsed = laporanSchema.safeParse(payload);
  if (!parsed.success) {
    const firstErr = parsed.error.issues[0]?.message || 'Form tidak valid';
    return { success: false, message: firstErr };
  }

  const rapor = formData.get('rapor') as File | null;
  const { siswa_id, semester, tahun_ajaran, catatan_guru } = parsed.data;

  const v = validatePdf(rapor);
  if (!v.ok) {
    return { success: false, message: v.message };
  }

  try {
  const safeSemester = semester.replace(/\s+/g, '-').toLowerCase();
  const safeTA = tahun_ajaran.replace(/\s+/g, '-');
    const filePath = `${siswa_id}/${safeSemester}-${safeTA}-${Date.now()}.pdf`;
  const { error: uploadError, data: uploaded } = await admin.storage
      .from('dokumen-rapor')
      .upload(filePath, rapor as File);
    if (uploadError || !uploaded?.path) {
      return { success: false, message: uploadError?.message || 'Gagal mengunggah rapor' };
    }
  // Simpan HANYA path storage (bucket privat). Jangan public URL.
  const dokumen_rapor_url = uploaded.path;

  const { error } = await admin
      .from('laporan_perkembangan')
      .insert({ siswa_id, semester, tahun_ajaran, catatan_guru, dokumen_rapor_url });
    if (error) {
      // cleanup upload
      try {
    await admin.storage.from('dokumen-rapor').remove([uploaded.path]);
      } catch {}
      return { success: false, message: error.message };
    }
    revalidatePath('/admin/akademik/laporan');
    return { success: true };
  } catch (e: any) {
    return { success: false, message: e?.message || 'Terjadi kesalahan tak terduga' };
  }
}

export async function deleteLaporanAction(id: number, _formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') return;

  const admin = await createAdminClient();

  // Ambil dulu URL untuk hapus dari storage
  const { data: row } = await admin
    .from('laporan_perkembangan')
    .select('dokumen_rapor_url')
    .eq('id', id)
    .single();

  // Hapus data dari DB
  const { error } = await admin
    .from('laporan_perkembangan')
    .delete()
    .eq('id', id);
  if (error) return;

  // Coba hapus file dari storage (best-effort)
  try {
    const stored = row?.dokumen_rapor_url as string | undefined;
    if (stored) {
      let path = stored;
      // Back-compat: bila masih berupa public URL lama, ekstrak path-nya
      if (stored.includes('/dokumen-rapor/')) {
        try {
          path = new URL(stored).pathname.split('/dokumen-rapor/')[1] || stored;
        } catch {}
      }
      if (path) await admin.storage.from('dokumen-rapor').remove([path]);
    }
  } catch {}

  revalidatePath('/admin/akademik/laporan');
}
