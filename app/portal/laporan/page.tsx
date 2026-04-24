import { createClient } from "@/lib/supabase/server";
export const dynamic = 'force-dynamic';
import { redirect } from "next/navigation";

export default async function PortalLaporanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/auth/login');

  const { data: siswa } = await supabase
    .from('siswa')
    .select('id, nama_lengkap')
    .eq('profile_orang_tua_id', user.id);

  const siswaIds = siswa?.map(s => s.id) || [];
  const siswaNameMap = new Map<string, string>();
  for (const s of siswa || []) siswaNameMap.set(String(s.id), s.nama_lengkap);
  const { data: laporan } = await supabase
    .from('laporan_perkembangan')
    .select('id, siswa_id, semester, tahun_ajaran, catatan_guru, dokumen_rapor_url')
    .in('siswa_id', siswaIds.length ? siswaIds : ['__none__']);

  // Link unduh dipusatkan ke endpoint API agar akses & logging terkendali

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Laporan Perkembangan Anak</h1>
      {laporan && laporan.length > 0 ? (
        <ul className="space-y-4">
          {laporan.map((l) => (
            <li key={l.id} className="border rounded p-4">
              <div className="font-medium">{l.semester} {l.tahun_ajaran}</div>
              <div className="text-xs text-muted-foreground">Nama Anak: {siswaNameMap.get(String(l.siswa_id)) || '-'}</div>
              {l.catatan_guru && <p className="text-sm mt-1">Catatan Guru: {l.catatan_guru}</p>}
              {l.dokumen_rapor_url && (
                <a className="text-blue-600 underline" href={`/api/rapor/${l.id}/download`} target="_blank" rel="noopener noreferrer">Unduh Rapor (PDF)</a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">Belum ada laporan.</p>
      )}
    </div>
  );
}
