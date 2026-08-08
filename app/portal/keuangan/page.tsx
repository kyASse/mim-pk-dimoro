import { createClient } from "@/lib/supabase/server";
export const dynamic = 'force-dynamic';
import { redirect } from "next/navigation";

export default async function PortalKeuanganPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/auth/login');

  const { data: biaya, error: biayaError } = await supabase
    .from('biaya_pendaftaran')
    .select('*')
    .order('id');

  const { data: catatan, error: catatanError } = await supabase
    .from('konten_halaman')
    .select('isi')
    .eq('slug', 'catatan-spp')
    .maybeSingle();

  const formatIdr = (v: unknown) => {
    const n = Number((v as any) ?? 0);
    const safe = Number.isFinite(n) ? n : 0;
    return new Intl.NumberFormat('id-ID').format(safe);
  };

  const safeBiaya = biayaError ? [] : (biaya || []);

  const catatanText = (() => {
    if (catatanError || !catatan) return '';
    const isi = catatan?.isi as any;
    if (!isi) return '';
    if (typeof isi === 'string') return isi;
    if (typeof isi === 'object' && typeof isi.catatan === 'string') return isi.catatan;
    try {
      // in case it is a JSON object but we want a readable fallback
      return JSON.stringify(isi);
    } catch {
      return '';
    }
  })();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Informasi Keuangan</h1>
      <section>
        <h2 className="font-semibold mb-2">Rincian Biaya</h2>
        <ul className="space-y-2">
          {biayaError ? (
            <li className="p-3 border rounded text-sm text-red-600">Gagal memuat rincian biaya.</li>
          ) : safeBiaya.length > 0 ? (
            safeBiaya.map((b) => (
              <li key={b.id} className="p-3 border rounded flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="font-medium">{b.komponen_biaya}</span>
                <span className="text-sm text-muted-foreground">
                  Putra: Rp {formatIdr((b as any).biaya_putra)}
                  <span className="mx-2">•</span>
                  Putri: Rp {formatIdr((b as any).biaya_putri)}
                </span>
              </li>
            ))
          ) : (
            <li className="p-3 border rounded text-sm text-muted-foreground">Tidak ada data biaya.</li>
          )}
        </ul>
      </section>
      <section>
        <h2 className="font-semibold mb-2">Catatan SPP</h2>
        <div className="p-3 border rounded bg-muted/30">
          <p className="text-sm whitespace-pre-wrap">
            {catatanError ? 'Gagal memuat catatan SPP.' : (catatanText || 'Belum ada catatan.')}
          </p>
        </div>
      </section>
      <section>
        <h2 className="font-semibold mb-2">Tagihan & Pembayaran</h2>
        <div className="p-3 border rounded text-sm text-muted-foreground">
          Fitur tagihan akan ditambahkan sesuai kebutuhan. (placeholder)
        </div>
      </section>
    </div>
  );
}
