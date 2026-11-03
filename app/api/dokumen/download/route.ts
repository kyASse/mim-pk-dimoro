import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ADMIN_ROLES, UserRole } from "@/lib/auth/types";

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
    const isAdmin = role && ADMIN_ROLES.includes(role as UserRole);

    const admin = await createAdminClient();

    if (!isAdmin) {
      if (!user.email) {
        return NextResponse.json({ error: 'Forbidden: Insufficient privileges to access document' }, { status: 403 });
      }

      // If parent user, verify ownership: document must belong to their child's registration record
      const { data: pendaftar, error: pendErr } = await admin
        .from('pendaftar')
        .select('id')
        .eq('dokumen_pendukung_url', path)
        .eq('email', user.email)
        .limit(1);

      if (pendErr || !pendaftar || pendaftar.length === 0) {
        return NextResponse.json({ error: 'Forbidden: Insufficient privileges to access document' }, { status: 403 });
      }
    }

    const { data, error } = await admin.storage
      .from('dokumen-pendukung')
      .createSignedUrl(path, 60); // valid 60s

    if (error || !data?.signedUrl) {
      return NextResponse.json({ error: error?.message || 'Failed to sign URL' }, { status: 500 });
    }

    return NextResponse.redirect(data.signedUrl, 302);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
