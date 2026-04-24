'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createPortalTestimoniAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'Unauthorized' };

  // Ensure role orang_tua
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, nama_lengkap')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'orang_tua') return { success: false, message: 'Forbidden' };

  const isi_testimoni = String(formData.get('isi_testimoni') ?? '').trim();
  const status_orang_tua = String(formData.get('status_orang_tua') ?? '').trim() || null;
  if (!isi_testimoni) return { success: false, message: 'Isi testimoni wajib diisi' };

  const payload = {
    nama_orang_tua: profile?.nama_lengkap ?? null,
    status_orang_tua,
    isi_testimoni,
    is_featured: false,
    created_by: user.id,
  };

  const { error } = await supabase.from('testimoni').insert(payload);
  if (error) return { success: false, message: error.message };

  revalidatePath('/portal/testimoni');
  // Admin list page can also be revalidated
  revalidatePath('/admin/testimoni');
  return { success: true, message: 'Terima kasih, testimoni Anda telah dikirim.' };
}
