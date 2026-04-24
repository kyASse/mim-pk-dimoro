import { createClient } from "@/lib/supabase/server";
export const dynamic = 'force-dynamic';
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PortalTestimoniPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/auth/login');

  // Show testimonials from others: include legacy (created_by is null) and other parents (created_by != current user)
  const { data: testimoni } = await supabase
    .from('testimoni')
    .select('id, nama_orang_tua, status_orang_tua, isi_testimoni, is_featured, created_at')
    .or(`created_by.is.null,created_by.neq.${user.id}`)
  .order('is_featured', { ascending: false })
  .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Testimoni</h1>
      <div className="flex justify-end">
        <Button asChild size="sm">
          <Link href="/portal/testimoni/tambah">Tambah Testimoni</Link>
        </Button>
      </div>

      <ul className="space-y-4">
        {testimoni?.map((t) => (
          <li key={t.id} className="p-4 border rounded">
            <div className="flex items-center justify-between gap-2">
              <div className="font-medium">
                {t.nama_orang_tua} {t.status_orang_tua ? `• ${t.status_orang_tua}` : ''}
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(String(t.created_at)).toLocaleDateString('id-ID')}
              </div>
            </div>
            <p className="mt-1 text-sm whitespace-pre-wrap">{t.isi_testimoni}</p>
            {t.is_featured ? (
              <div className="mt-2 text-[10px] inline-block px-2 py-0.5 rounded bg-yellow-100 text-yellow-800">Ditampilkan</div>
            ) : null}
          </li>
        )) || <li>Tidak ada testimoni.</li>}
      </ul>
    </div>
  );
}
