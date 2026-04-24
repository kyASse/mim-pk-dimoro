import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Naive in-memory rate limit (per instance). For production, use Redis (e.g., Upstash).
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_REQ = 20; // per window
const rateMap = new Map<string, { count: number; windowStart: number }>();

function rateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(key);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    rateMap.set(key, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= MAX_REQ) return false;
  entry.count += 1;
  return true;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

  const { id } = await params;
  const idNum = Number(id);
    if (isNaN(idNum) || idNum <= 0) {
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }

    // Rate limiting by user + IP
  const xff = req.headers.get('x-forwarded-for');
  const ip = xff ? xff.split(',')[0].trim() : (req.headers.get('x-real-ip') || 'unknown');
    const key = `${user.id}:${ip}`;
    if (!rateLimit(key)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const admin = await createAdminClient();
    // Fetch laporan with storage path and siswa_id
    const { data: laporan, error: lapErr } = await admin
      .from('laporan_perkembangan')
      .select('id, siswa_id, dokumen_rapor_url, semester, tahun_ajaran')
      .eq('id', idNum)
      .single();
    if (lapErr || !laporan) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Verify ownership: siswa.profile_orang_tua_id === user.id
    const { data: siswa, error: sisErr } = await admin
      .from('siswa')
      .select('id, nama_lengkap, profile_orang_tua_id')
      .eq('id', laporan.siswa_id)
      .single();
    if (sisErr || !siswa || siswa.profile_orang_tua_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Back-compat: extract path if old data has public URL
    let path: string | null = laporan.dokumen_rapor_url;
    if (path && path.includes('/dokumen-rapor/')) {
      try {
        path = new URL(path).pathname.split('/dokumen-rapor/')[1] || path;
      } catch {}
    }
    if (!path) {
      return NextResponse.json({ error: 'File is missing' }, { status: 410 });
    }

    // Create signed URL (short TTL) with download filename
    const filename = `Rapor-${siswa.nama_lengkap}-${laporan.semester}-${laporan.tahun_ajaran}.pdf`;
    const { data: signed, error: signErr } = await admin.storage
      .from('dokumen-rapor')
      .createSignedUrl(path, 120, { download: filename });
    if (signErr || !signed?.signedUrl) {
      return NextResponse.json({ error: 'Unable to sign URL' }, { status: 500 });
    }

    // Log access (best-effort)
    const userAgent = req.headers.get('user-agent') || null;
    const ref = req.headers.get('referer') || null;
    try {
      await admin.from('rapor_access_logs').insert({
        user_id: user.id,
        siswa_id: siswa.id,
        laporan_id: laporan.id,
        ip: typeof ip === 'string' ? ip : null,
        user_agent: userAgent,
        referrer: ref,
      });
    } catch {}

    // Redirect to signed URL
    return NextResponse.redirect(signed.signedUrl, 302);
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
