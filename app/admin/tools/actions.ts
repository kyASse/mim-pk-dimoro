'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { buildInitialParentPasswordFromDOB } from '@/lib/utils/password';

type Result = { success: boolean; message?: string; email?: string; password?: string };

export async function createStaticParentRendieAction(_prev: any, _formData: FormData): Promise<Result> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'Unauthorized' };

  // Confirm admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') return { success: false, message: 'Forbidden' };

  const admin = await createAdminClient();

  const SISWA_ID = process.env.SISWA_ID || '93e73140-e9e0-4c80-8ee7-dc4cadd2c781';
  const EMAIL = process.env.PARENT_TEST_EMAIL || 'orangtua.rendie@example.com';
  const FALLBACK_PASSWORD = process.env.PARENT_TEST_PASSWORD || 'RendieTest123!';

  try {
    // Ensure siswa exists
    const { data: siswa, error: siswaErr } = await admin
      .from('siswa')
      .select('id, profile_orang_tua_id, tanggal_lahir')
      .eq('id', SISWA_ID)
      .single();
    if (siswaErr || !siswa) return { success: false, message: 'Data siswa tidak ditemukan.' };
    const initialPassword = siswa.tanggal_lahir ? buildInitialParentPasswordFromDOB(siswa.tanggal_lahir) : FALLBACK_PASSWORD;

    // Create or find user by email
    const list = await admin.auth.admin.listUsers();
    const existing = list.data.users.find(u => u.email?.toLowerCase() === EMAIL.toLowerCase());

    let parentId = existing?.id;
    if (!parentId) {
      const created = await admin.auth.admin.createUser({
        email: EMAIL,
        password: initialPassword,
        email_confirm: true,
        user_metadata: { role: 'orang_tua', must_update_password: true },
      });
      if (created.error || !created.data.user) return { success: false, message: created.error?.message || 'Gagal membuat user.' };
      parentId = created.data.user.id;
    }

    // Ensure profile role orang_tua
    await admin.from('profiles').upsert({ id: parentId!, role: 'orang_tua', nama_lengkap: 'Orang Tua Rendie' }, { onConflict: 'id' });

    // Link siswa to parent
    const upd = await admin.from('siswa').update({ profile_orang_tua_id: parentId }).eq('id', SISWA_ID);
    if (upd.error) return { success: false, message: upd.error.message };

  return { success: true, email: EMAIL, password: initialPassword };
  } catch (e: any) {
    return { success: false, message: e?.message || 'Gagal membuat akun statis.' };
  }
}
