'use server';

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { sendCustomRecoveryEmail } from "@/lib/auth/recovery";
import { buildInitialParentPasswordFromDOB } from "@/lib/utils/password";

/**
 * Update data rombel (Wali Kelas, Tahun Ajaran, Kapasitas)
 */
export async function updateRombelWaliKelasAction(
  rombelId: string,
  formData: FormData
): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = await createClient();
    const wali_kelas_nama = (formData.get('wali_kelas_nama') as string)?.trim() || null;
    const tahun_ajaran = (formData.get('tahun_ajaran') as string)?.trim() || '2026/2027';
    const kapasitasRaw = formData.get('kapasitas');
    const kapasitas = kapasitasRaw ? parseInt(kapasitasRaw as string, 10) : 28;

    const { error } = await supabase
      .from('rombel')
      .update({
        wali_kelas_nama,
        tahun_ajaran,
        kapasitas,
      })
      .eq('id', rombelId);

    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePath('/admin/siswa');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Gagal memperbarui rombel' };
  }
}

/**
 * Assign siswa ke rombel tertentu (dan sinkronkan kolom kelompok)
 */
export async function assignSiswaRombelAction(
  siswaId: string,
  rombelId: string | null
): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = await createClient();

    let kelompokName: string | null = null;
    if (rombelId) {
      const { data: rombel, error: rErr } = await supabase
        .from('rombel')
        .select('id, nama')
        .eq('id', rombelId)
        .single();
      if (!rErr && rombel) {
        kelompokName = rombel.nama;
      }
    }

    const { error } = await supabase
      .from('siswa')
      .update({
        rombel_id: rombelId,
        kelompok: kelompokName,
      })
      .eq('id', siswaId);

    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePath('/admin/siswa');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Gagal menetapkan rombel siswa' };
  }
}

/**
 * Cari profil orang tua untuk dihubungkan ke siswa (autocomplete / dialog search)
 */
export async function searchParentProfilesAction(
  query: string
): Promise<{ success: boolean; data: any[]; message?: string }> {
  try {
    const supabase = await createClient();
    const cleanQuery = query.trim();

    let q = supabase
      .from('profiles')
      .select('id, nama_lengkap, email, role, siswa:siswa(id, nama_lengkap, kelompok)')
      .eq('role', 'orang_tua');

    if (cleanQuery) {
      q = q.or(`nama_lengkap.ilike.%${cleanQuery}%,email.ilike.%${cleanQuery}%`);
    }

    const { data, error } = await q.limit(20);

    if (error) {
      return { success: false, data: [], message: error.message };
    }

    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, data: [], message: err?.message || 'Gagal mencari profil orang tua' };
  }
}

/**
 * Hubungkan akun orang tua yang sudah ada ke siswa (mendukung multi-anak)
 */
export async function linkExistingParentAccountAction(
  siswaId: string,
  parentProfileId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const admin = await createAdminClient();

    const { error } = await admin
      .from('siswa')
      .update({ profile_orang_tua_id: parentProfileId })
      .eq('id', siswaId);

    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePath('/admin/siswa');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Gagal menautkan akun orang tua' };
  }
}

/**
 * Putuskan tautan akun orang tua dari siswa
 */
export async function unlinkParentAccountAction(
  siswaId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const admin = await createAdminClient();

    const { error } = await admin
      .from('siswa')
      .update({ profile_orang_tua_id: null })
      .eq('id', siswaId);

    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePath('/admin/siswa');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Gagal memutuskan tautan akun orang tua' };
  }
}

/**
 * Buat akun baru atau tautkan email orang tua ke siswa
 */
export async function linkOrCreateParentAccountAction(
  siswaId: string,
  formData: FormData
): Promise<{ success: boolean; message?: string; userId?: string }> {
  const admin = await createAdminClient();
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const nama_lengkap = (formData.get('nama_lengkap') as string)?.trim() || null;

  if (!email) return { success: false, message: 'Email orang tua wajib diisi' };

  try {
    // Baca data siswa untuk ambil tanggal lahir (password awal)
    const siswaRes = await admin
      .from('siswa')
      .select('id, nama_lengkap, tanggal_lahir')
      .eq('id', siswaId)
      .single();
    if (siswaRes.error || !siswaRes.data) {
      throw siswaRes.error || new Error('Data siswa tidak ditemukan');
    }

    const initialPassword = siswaRes.data.tanggal_lahir
      ? buildInitialParentPasswordFromDOB(siswaRes.data.tanggal_lahir)
      : undefined;

    // Cek apakah user sudah ada di Auth
    const { data: list, error: listErr } = await admin.auth.admin.listUsers();
    if (listErr) throw listErr;
    const existing = list.users.find((u: any) => u.email?.toLowerCase() === email);

    let userId = existing?.id;

    if (!userId) {
      // Buat auth user baru
      const { data, error: createErr } = await admin.auth.admin.createUser({
        email,
        email_confirm: true,
        ...(initialPassword ? { password: initialPassword } : {}),
        user_metadata: { role: 'orang_tua', must_update_password: true, nama_lengkap },
      });
      if (createErr || !data.user) {
        throw createErr || new Error('Gagal membuat akun orang tua.');
      }
      userId = data.user.id;

      try {
        await sendCustomRecoveryEmail(email);
      } catch {
        /* noop */
      }
    } else if (existing) {
      if (!existing.last_sign_in_at && initialPassword) {
        await admin.auth.admin.updateUserById(userId, {
          password: initialPassword,
          user_metadata: { role: 'orang_tua', must_update_password: true },
        });
        try {
          await sendCustomRecoveryEmail(email);
        } catch {
          /* noop */
        }
      }
    }

    // Upsert profil orang tua
    await admin
      .from('profiles')
      .upsert(
        { id: userId!, role: 'orang_tua', nama_lengkap, email },
        { onConflict: 'id' }
      );

    // Update siswa.profile_orang_tua_id
    const { error: updErr } = await admin
      .from('siswa')
      .update({ profile_orang_tua_id: userId })
      .eq('id', siswaId);
    if (updErr) throw updErr;

    revalidatePath('/admin/siswa');
    return { success: true, userId };
  } catch (e: any) {
    console.error('linkOrCreateParentAccountAction failed:', e?.message);
    return {
      success: false,
      message: e?.message || 'Gagal menghubungkan/membuat akun orang tua',
    };
  }
}

/**
 * Tambah siswa baru manual
 */
export async function createSiswaAction(
  formData: FormData
): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = await createClient();
    const nama_lengkap = (formData.get('nama_lengkap') as string)?.trim();
    const rombel_id = (formData.get('rombel_id') as string)?.trim() || null;
    const tanggal_lahir = (formData.get('tanggal_lahir') as string)?.trim() || null;

    if (!nama_lengkap) return { success: false, message: 'Nama lengkap siswa wajib diisi' };

    let kelompokName: string | null = null;
    if (rombel_id) {
      const { data: rombel } = await supabase
        .from('rombel')
        .select('nama')
        .eq('id', rombel_id)
        .single();
      if (rombel) kelompokName = rombel.nama;
    }

    const { error } = await supabase.from('siswa').insert({
      nama_lengkap,
      tanggal_lahir,
      rombel_id,
      kelompok: kelompokName,
    });

    if (error) return { success: false, message: error.message };

    revalidatePath('/admin/siswa');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Gagal menambahkan siswa' };
  }
}

/**
 * Import siswa dari daftar pendaftar diterima
 */
export async function importSiswaFromPendaftarAction(
  formData: FormData
): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = await createClient();
    const pendaftarId = (formData.get('pendaftar_id') as string)?.trim();
    const rombel_id = (formData.get('rombel_id') as string)?.trim() || null;

    if (!pendaftarId) return { success: false, message: 'ID pendaftar tidak valid' };

    const { data: pendaftar, error: pErr } = await supabase
      .from('pendaftar')
      .select('id, nama_lengkap, tanggal_lahir, status_pendaftaran, diterima_di_kelas')
      .eq('id', pendaftarId)
      .single();

    if (pErr || !pendaftar) return { success: false, message: 'Pendaftar tidak ditemukan' };

    const allowed = ['Diterima', 'Akun Dibuat'];
    if (!allowed.includes(pendaftar.status_pendaftaran || '')) {
      return { success: false, message: 'Hanya pendaftar berstatus Diterima yang dapat diimpor' };
    }

    const { data: existing } = await supabase
      .from('siswa')
      .select('id')
      .eq('pendaftar_asli_id', pendaftar.id)
      .maybeSingle();

    if (existing) return { success: false, message: 'Siswa ini sudah diimpor sebelumnya' };

    let kelompokName = pendaftar.diterima_di_kelas || null;
    if (rombel_id) {
      const { data: rombel } = await supabase
        .from('rombel')
        .select('nama')
        .eq('id', rombel_id)
        .single();
      if (rombel) kelompokName = rombel.nama;
    }

    const insertPayload: any = {
      nama_lengkap: pendaftar.nama_lengkap,
      tanggal_lahir: pendaftar.tanggal_lahir,
      rombel_id,
      kelompok: kelompokName,
      pendaftar_asli_id: pendaftar.id,
    };

    const { error: iErr } = await supabase.from('siswa').insert(insertPayload);
    if (iErr) return { success: false, message: iErr.message };

    revalidatePath('/admin/siswa');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Gagal mengimpor pendaftar' };
  }
}

/**
 * Hapus siswa
 */
export async function deleteSiswaAction(
  siswaId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('siswa').delete().eq('id', siswaId);
    if (error) return { success: false, message: error.message };

    revalidatePath('/admin/siswa');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Gagal menghapus siswa' };
  }
}
