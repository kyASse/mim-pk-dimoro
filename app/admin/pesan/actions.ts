// app/admin/pesan/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { StatusPesan } from '@/types/pesan';

/**
 * Updates the status of a specific incoming contact message
 */
export async function updatePesanStatusAction(
  id: number,
  status: StatusPesan
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized: Harap login terlebih dahulu' };
    }

    const { error } = await supabase
      .from('pesan_masuk')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/pesan');
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
    return { success: false, error: errorMsg };
  }
}

/**
 * Permanently deletes a contact message from the database
 */
export async function deletePesanAction(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized: Harap login terlebih dahulu' };
    }

    const { error } = await supabase
      .from('pesan_masuk')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/pesan');
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
    return { success: false, error: errorMsg };
  }
}

/**
 * Marks all 'belum_dibaca' messages as 'dibaca'
 */
export async function markAllAsReadAction(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized: Harap login terlebih dahulu' };
    }

    const { error } = await supabase
      .from('pesan_masuk')
      .update({
        status: 'dibaca',
        updated_at: new Date().toISOString(),
      })
      .eq('status', 'belum_dibaca');

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/pesan');
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
    return { success: false, error: errorMsg };
  }
}
