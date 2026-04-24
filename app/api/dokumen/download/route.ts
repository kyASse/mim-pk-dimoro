import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET /api/dokumen/download?path=<object_path>
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.searchParams.get('path');
  if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 });

  try {
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
