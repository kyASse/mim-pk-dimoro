import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteLaporanAction } from "./actions";
import CreateLaporanForm from "./CreateLaporanForm";

export default async function KelolaLaporanPage({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/auth/login');

  const { data: siswa } = await supabase
    .from('siswa')
    .select('id, nama_lengkap')
    .order('nama_lengkap');

  const { data: laporan } = await supabase
    .from('laporan_perkembangan')
    .select('id, siswa_id, semester, tahun_ajaran, catatan_guru, dokumen_rapor_url')
    .order('tahun_ajaran', { ascending: false });

  const params = (await searchParams) || ({} as Record<string, string>);
  const status = params.status;
  const msg = params.msg ? decodeURIComponent(params.msg) : '';

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold">Kelola Laporan Perkembangan</h1>

      {status === 'ok' && (
        <div className="p-3 rounded bg-green-50 border border-green-200 text-green-700 text-sm">Laporan berhasil disimpan.</div>
      )}
      {status === 'error' && (
        <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">{msg || 'Terjadi kesalahan.'}</div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Tambah Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateLaporanForm siswa={(siswa as any[]) || []} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Laporan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {laporan?.length ? (
            laporan.map((l: any) => (
              <div key={l.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center border-b pb-3">
                <div className="md:col-span-2">
                  <div className="font-medium">{l.semester} {l.tahun_ajaran}</div>
                  <div className="text-xs text-muted-foreground">Siswa ID: {l.siswa_id}</div>
                </div>
                <div className="md:col-span-3 text-sm">
                  {l.catatan_guru || '-'}
                </div>
                <form action={deleteLaporanAction.bind(null, l.id)} className="justify-self-end">
                  <Button type="submit" variant="destructive" size="sm">Hapus</Button>
                </form>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">Belum ada laporan.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
