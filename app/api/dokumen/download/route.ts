import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ADMIN_ROLES } from "@/lib/auth/types";

// GET /api/dokumen/download?path=<object_path>
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.searchParams.get('path');
  if (!path) {
    return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
  }

  // Prevent path traversal
  if (path.includes('..') || path.startsWith('/') || path.includes('\\')) {
    return NextResponse.json({ error: 'Invalid path format' }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    // Verify user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role;
    const isAdmin = role && ADMIN_ROLES.includes(role as any);

    if (!isAdmin) {
      // If parent user, verify ownership: document must belong to their child's registration record
      const { data: pendaftar, error: pendErr } = await supabase
        .from('pendaftar')
        .select('id, email, dokumen_pendukung_url')
        .or(`dokumen_pendukung_url.eq.${path},email.eq.${user.email || ''}`)
        .limit(1);

      if (pendErr || !pendaftar || pendaftar.length === 0) {
        return NextResponse.json({ error: 'Forbidden: Insufficient privileges to access document' }, { status: 403 });
      }
    }

    const admin = await createAdminClient();
    const { data, error } = await admin.storage
      .from('dokumen-pendukung')
      .createSignedUrl(path, 60); // valid 60s

    if (error || !data?.signedUrl) {
      return NextResponse.json({ error: error?.message || 'Failed to sign URL' }, { status: 500 });
    }

    return NextResponse.redirect(data.signedUrl, 302);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 });
  }
}
