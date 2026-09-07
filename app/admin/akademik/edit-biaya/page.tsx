import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { parseCatatanSpp } from "../../konten/edit/[slug]/utils";
import EditBiayaClient from "./EditBiayaClient";

export default async function EditBiayaPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/auth/login");

  const biayaPromise = supabase
    .from("biaya_pendaftaran")
    .select("*")
    .order("id");
  const sppPromise = supabase
    .from("konten_halaman")
    .select("isi")
    .eq("slug", "catatan-spp")
    .single();

  const [{ data: biaya, error: biayaError }, { data: catatanSpp }] =
    await Promise.all([biayaPromise, sppPromise]);

  if (biayaError || !biaya) {
    console.error("Gagal mengambil data biaya_pendaftaran:", biayaError);
    return redirect("/admin/akademik");
  }

  const defaultSppText = parseCatatanSpp(catatanSpp?.isi).catatan || "";

  return (
    <EditBiayaClient
      initialBiaya={biaya}
      initialCatatanSpp={defaultSppText}
    />
  );
}