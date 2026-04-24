// lib/supabase/admin.ts
'use server'; // Hanya untuk server-side penggunaan service role

import { createClient } from '@supabase/supabase-js'

export async function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceRoleKey || !url) {
    throw new Error('FATAL: SUPABASE_SERVICE_ROLE_KEY atau NEXT_PUBLIC_SUPABASE_URL tidak terkonfigurasi.');
  }

  // Gunakan service role tanpa cookies/Authorization user agar benar-benar bypass RLS
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        // Pastikan menggunakan service role untuk otorisasi agar melewati RLS
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
      },
    }
  });
}