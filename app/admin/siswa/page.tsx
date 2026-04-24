// app/admin/siswa/page.tsx
import { createClient } from "@/lib/supabase/server";
export const dynamic = 'force-dynamic';
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSiswaAction, updateSiswaKelompokAction, deleteSiswaAction, importSiswaFromPendaftarAction } from "./actions";
import LinkParentForm from "@/components/admin/LinkParentForm";

export default async function KelolaSiswaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/auth/login');

  const { data: siswa, error } = await supabase
    .from('siswa')
    .select('id, nama_lengkap, kelompok, profile_orang_tua_id, pendaftar_asli_id');
  if (error) {
    return <div className="p-6">Gagal memuat data siswa: {error.message}</div>;
  }

  // Ambil pendaftar yang sudah diterima tapi belum masuk tabel siswa
  const { data: acceptedApplicants } = await supabase
    .from('pendaftar')
  .select('id, nama_lengkap, status_pendaftaran, created_at')
    .in('status_pendaftaran', ['Diterima', 'Akun Dibuat'])
    .order('created_at', { ascending: false });
  const acceptedApplicantsToImport = (acceptedApplicants || []).filter((p: any) => !siswa?.some((s: any) => s.pendaftar_asli_id === p.id));

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kelola Siswa</h1>
          <p className="text-muted-foreground">Tambah, ubah, hubungkan akun orang tua</p>
        </div>
        <Link href="/admin">
          <Button variant="outline">Kembali</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Siswa</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createSiswaAction} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
              <Input name="nama_lengkap" id="nama_lengkap" required />
            </div>
            <div>
              <Label htmlFor="kelompok">Kelompok</Label>
              <Input name="kelompok" id="kelompok" placeholder="TK A / TK B / dst" />
            </div>
            <div className="flex items-end">
              <Button type="submit">Tambah</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tambah dari Daftar Pendaftar Diterima</CardTitle>
        </CardHeader>
        <CardContent>
      {acceptedApplicantsToImport && acceptedApplicantsToImport.length > 0 ? (
            <div className="space-y-3">
        {acceptedApplicantsToImport.map((p: any) => (
                <form key={p.id} action={importSiswaFromPendaftarAction} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end border-b pb-3">
                  <div>
                    <Label>Pendaftar</Label>
                    <div className="font-medium">{p.nama_lengkap}</div>
                    <input type="hidden" name="pendaftar_id" value={p.id} />
                  </div>
                  <div>
                    <Label htmlFor={`kelompok-import-${p.id}`}>Kelompok</Label>
                    <Input id={`kelompok-import-${p.id}`} name="kelompok" placeholder="TK A / TK B / dst" />
                  </div>
                  <div className="md:justify-self-end">
                    <Button type="submit">Tambah sebagai Siswa</Button>
                  </div>
                </form>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground">Tidak ada pendaftar diterima yang perlu diimport.</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Siswa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {siswa && siswa.length > 0 ? (
            siswa.map((s: any) => (
              <div key={s.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end border-b pb-4">
                <div>
                  <Label>Nama</Label>
                  <div className="font-medium">{s.nama_lengkap}</div>
                </div>
                <form action={updateSiswaKelompokAction.bind(null, s.id)} className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`kelompok-${s.id}`}>Kelompok</Label>
                    <Input id={`kelompok-${s.id}`} name="kelompok" defaultValue={s.kelompok ?? ''} />
                  </div>
                  <div className="self-end">
                    <Button type="submit" variant="secondary">Simpan</Button>
                  </div>
                </form>
                <LinkParentForm siswaId={s.id} />
                <form action={deleteSiswaAction.bind(null, s.id)} className="justify-self-end">
                  <Button type="submit" variant="destructive">Hapus</Button>
                </form>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">Belum ada data siswa.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
