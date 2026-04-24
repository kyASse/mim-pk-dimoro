'use server'

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { sendCustomRecoveryEmail } from "@/lib/auth/recovery";
import { buildInitialParentPasswordFromDOB } from "@/lib/utils/password";
// Admin notification via UI toast; no email notify here.

export async function createSiswaAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const nama_lengkap = (formData.get('nama_lengkap') as string)?.trim();
  const kelompok = (formData.get('kelompok') as string)?.trim() || null;

  if (!nama_lengkap) return;

  const { error } = await supabase
    .from('siswa')
    .insert({ nama_lengkap, kelompok });

  if (error) return;
  revalidatePath('/admin/siswa');
}

export async function importSiswaFromPendaftarAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const pendaftarId = (formData.get('pendaftar_id') as string)?.trim();
  const kelompok = (formData.get('kelompok') as string)?.trim() || null;

  if (!pendaftarId) return;

  // Ambil data pendaftar yang sudah diterima
  const { data: pendaftar, error: pErr } = await supabase
    .from('pendaftar')
    .select('id, nama_lengkap, tanggal_lahir, status_pendaftaran')
    .eq('id', pendaftarId)
    .single();
  if (pErr || !pendaftar) return;

  // Hanya izinkan import jika status sudah diterima/akun dibuat
  const allowed = ['Diterima', 'Akun Dibuat'];
  if (!allowed.includes(pendaftar.status_pendaftaran || '')) return;

  // Cegah duplikasi: jika sudah ada siswa dengan pendaftar_asli_id ini
  const { data: existing } = await supabase
    .from('siswa')
    .select('id')
    .eq('pendaftar_asli_id', pendaftar.id)
    .maybeSingle();
  if (existing) return;

  const insertPayload: any = {
    nama_lengkap: pendaftar.nama_lengkap,
    tanggal_lahir: pendaftar.tanggal_lahir,
    kelompok,
    pendaftar_asli_id: pendaftar.id,
  };

  const { error: iErr } = await supabase.from('siswa').insert(insertPayload);
  if (iErr) return;
  revalidatePath('/admin/siswa');
}

export async function updateSiswaKelompokAction(siswaId: string, formData: FormData): Promise<void> {
  const supabase = await createClient();
  const kelompok = (formData.get('kelompok') as string)?.trim() || null;

  const { error } = await supabase
    .from('siswa')
    .update({ kelompok })
    .eq('id', siswaId);

  if (error) return;
  revalidatePath('/admin/siswa');
}

export async function linkOrCreateParentAccountAction(siswaId: string, formData: FormData): Promise<{ success: boolean; message?: string }> {
  const admin = await createAdminClient();
  const email = (formData.get('email') as string)?.trim().toLowerCase();

  if (!email) return { success: false, message: 'Email orang tua wajib diisi' };

  try {
    // Baca data siswa untuk ambil tanggal lahir (password awal)
    const siswaRes = await admin
      .from('siswa')
      .select('id, nama_lengkap, tanggal_lahir')
      .eq('id', siswaId)
      .single();
    if (siswaRes.error || !siswaRes.data) throw siswaRes.error || new Error('Data siswa tidak ditemukan');

    const initialPassword = siswaRes.data.tanggal_lahir
      ? buildInitialParentPasswordFromDOB(siswaRes.data.tanggal_lahir)
      : undefined;

    // Cek apakah user sudah ada
    const { data: list, error: listErr } = await admin.auth.admin.listUsers();
    if (listErr) throw listErr;
  const existing = list.users.find(u => u.email?.toLowerCase() === email);

    let userId = existing?.id;

    // Jika belum ada, buat akun baru dan kirim email reset password
    if (!userId) {
      const { data, error: createErr } = await admin.auth.admin.createUser({
        email,
        email_confirm: true,
        // Set password awal jika tersedia dari tanggal lahir
        ...(initialPassword ? { password: initialPassword } : {}),
        user_metadata: { role: 'orang_tua', must_update_password: true },
      });
      if (createErr || !data.user) throw createErr || new Error('Gagal membuat akun orang tua.');
      userId = data.user.id;

  // Kirim email set password/recovery jika email sender terkonfigurasi; jika tidak, abaikan
  try { await sendCustomRecoveryEmail(email); } catch { /* noop */ }
    }
    else if (existing) {
      // Jika user sudah ada dan belum pernah login, set password awal dari tanggal lahir (jika tersedia)
      if (!existing.last_sign_in_at && initialPassword) {
        const upd = await admin.auth.admin.updateUserById(userId, {
          password: initialPassword,
          user_metadata: { role: 'orang_tua', must_update_password: true },
        });
        if (upd.error) throw upd.error;
        // Optional recovery email; ignore if not configured
        try { await sendCustomRecoveryEmail(email); } catch { /* noop */ }
      }
    }

    // Pastikan profile ada dan role orang_tua
    await admin
      .from('profiles')
      .upsert({ id: userId!, role: 'orang_tua', nama_lengkap: null }, { onConflict: 'id' });

  // Update siswa.profile_orang_tua_id
    const { error: updErr } = await admin
      .from('siswa')
      .update({ profile_orang_tua_id: userId })
      .eq('id', siswaId);
    if (updErr) throw updErr;

    revalidatePath('/admin/siswa');
  return { success: true };
  } catch (e: any) {
    console.error('linkOrCreateParentAccountAction failed:', e?.message);
  return { success: false, message: e?.message || 'Gagal menghubungkan/membuat akun orang tua' };
  }
}

export async function deleteSiswaAction(siswaId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('siswa').delete().eq('id', siswaId);
  if (error) return;
  revalidatePath('/admin/siswa');
}
