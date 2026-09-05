import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DetailPendaftarClient from "@/components/admin/pendaftar-detail/DetailPendaftarClient";

type DetailPageProps = { params: Promise<{ id: string }> };

export default async function DetailPendaftarPage({ params }: DetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: pendaftar, error } = await supabase
    .from("pendaftar")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !pendaftar) {
    console.error("Gagal menemukan pendaftar:", error);
    return redirect("/admin/pendaftar");
  }

  const regYear = pendaftar.created_at
    ? new Date(pendaftar.created_at).getFullYear()
    : new Date().getFullYear();

  const idSuffix = pendaftar.id ? pendaftar.id.slice(0, 4).toUpperCase() : "0001";
  const regId = `MIM-${regYear}-${idSuffix}`;

  return <DetailPendaftarClient pendaftar={pendaftar} regId={regId} />;
}