import { createClient } from "@/lib/supabase/server";
export const dynamic = 'force-dynamic';
import { redirect } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createPortalTestimoniAction } from "../actions";

export default async function TambahTestimoniPortalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/auth/login');

  // Wrap server action to satisfy type constraints
  async function submit(formData: FormData) {
    'use server';
    await createPortalTestimoniAction(formData);
    // after submit, stay on page or redirect could be done in action via revalidate
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tambah Testimoni</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/portal/testimoni">Kembali</Link>
        </Button>
      </div>

      <form action={submit} className="space-y-3 border rounded p-4">
        <label className="text-sm font-medium">Isi Testimoni</label>
        <Textarea name="isi_testimoni" placeholder="Tulis testimoni Anda di sini..." required rows={5} />
        <div className="flex items-center gap-2">
          <input name="status_orang_tua" className="border rounded px-2 py-1 text-sm flex-1" placeholder="Status (opsional), misal: Wali Siswa Kelas A" />
          <Button type="submit">Kirim</Button>
        </div>
        <p className="text-xs text-muted-foreground">Testimoni akan ditinjau admin sebelum ditampilkan.</p>
      </form>
    </div>
  );
}
