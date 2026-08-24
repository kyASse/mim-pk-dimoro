// lib/auth/guards.ts
import { createClient } from '@/lib/supabase/server';
import type { UserRole, UserProfile, AuditLogEntry } from './types';
import type { SupabaseClient } from '@supabase/supabase-js';

export function isRoleAuthorized(
  userRole: UserRole | string | undefined | null,
  allowedRoles: UserRole[]
): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole as UserRole);
}

export async function getCurrentUserProfile(supabaseClient?: SupabaseClient): Promise<{
  user: { id: string; email?: string } | null;
  profile: UserProfile | null;
}> {
  const supabase = supabaseClient || (await createClient());
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, nama_lengkap, created_at')
    .eq('id', user.id)
    .single();

  return {
    user: { id: user.id, email: user.email },
    profile: profile as UserProfile | null,
  };
}

export async function requireRole(
  allowedRoles: UserRole[],
  supabaseClient?: SupabaseClient
): Promise<{
  authorized: boolean;
  user: { id: string; email?: string } | null;
  profile: UserProfile | null;
  message?: string;
}> {
  const { user, profile } = await getCurrentUserProfile(supabaseClient);

  if (!user) {
    return {
      authorized: false,
      user: null,
      profile: null,
      message: 'Sesi telah berakhir. Silakan login kembali.',
    };
  }

  if (!profile || !isRoleAuthorized(profile.role, allowedRoles)) {
    return {
      authorized: false,
      user,
      profile,
      message: 'Anda tidak memiliki hak akses untuk tindakan ini.',
    };
  }

  return {
    authorized: true,
    user,
    profile,
  };
}

export async function recordAuditLog(
  supabase: SupabaseClient,
  params: {
    userId?: string | null;
    tableName: string;
    action: 'INSERT' | 'UPDATE' | 'DELETE' | 'CUSTOM';
    recordId?: string | null;
    oldData?: Record<string, unknown> | null;
    newData?: Record<string, unknown> | null;
    ipAddress?: string | null;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload: AuditLogEntry = {
      user_id: params.userId || null,
      table_name: params.tableName,
      action: params.action,
      record_id: params.recordId || null,
      old_data: params.oldData || null,
      new_data: params.newData || null,
      ip_address: params.ipAddress || null,
    };

    await supabase.from('audit_logs').insert(payload).throwOnError();
    return { success: true };
  } catch (err: any) {
    console.error('Failed to record audit log:', err?.message);
    return { success: false, error: err?.message };
  }
}
