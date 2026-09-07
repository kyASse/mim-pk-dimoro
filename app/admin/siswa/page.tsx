import { createClient } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import KelolaSiswaClient from "@/components/admin/siswa/KelolaSiswaClient";

export default async function KelolaSiswaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/auth/login");

  // 1. Fetch Master Rombel
  const { data: rombelData, error: rErr } = await supabase
    .from("rombel")
    .select("*")
    .order("tingkat", { ascending: true })
    .order("nama", { ascending: true });

  if (rErr) {
    console.error("Gagal memuat rombel:", rErr);
  }

  // 2. Fetch Siswa with parent profile & rombel relations
  const { data: siswaData, error: sErr } = await supabase
    .from("siswa")
    .select(
      `
      id, 
      nama_lengkap, 
      tanggal_lahir, 
      kelompok, 
      rombel_id, 
      profile_orang_tua_id, 
      pendaftar_asli_id,
      parentProfile:profiles!profile_orang_tua_id(id, nama_lengkap, email),
      rombel:rombel(id, nama, tingkat, wali_kelas_nama)
    `
    )
    .order("created_at", { ascending: false });

  if (sErr) {
    console.error("Gagal memuat siswa:", sErr);
  }

  const siswaList: any[] = (siswaData || []).map((s: any) => ({
    id: s.id,
    nama_lengkap: s.nama_lengkap,
    tanggal_lahir: s.tanggal_lahir,
    kelompok: s.kelompok,
    rombel_id: s.rombel_id,
    profile_orang_tua_id: s.profile_orang_tua_id,
    pendaftar_asli_id: s.pendaftar_asli_id,
    parentProfile: Array.isArray(s.parentProfile)
      ? s.parentProfile[0] || null
      : s.parentProfile || null,
    rombel: Array.isArray(s.rombel) ? s.rombel[0] || null : s.rombel || null,
  }));
  const rombels = (rombelData || []).map((r: any) => {
    const count = siswaList.filter(
      (s: any) => s.rombel_id === r.id || s.kelompok === r.nama
    ).length;
    return {
      ...r,
      siswaCount: count,
    };
  });

  // 3. Fetch Accepted Applicants not yet imported
  const { data: acceptedApplicants } = await supabase
    .from("pendaftar")
    .select("id, nama_lengkap, status_pendaftaran, created_at, diterima_di_kelas")
    .in("status_pendaftaran", ["Diterima", "Akun Dibuat"])
    .order("created_at", { ascending: false });

  const acceptedApplicantsToImport = (acceptedApplicants || []).filter(
    (p: any) => !siswaList.some((s: any) => s.pendaftar_asli_id === p.id)
  );

  return (
    <div className="p-4 sm:p-6">
      <KelolaSiswaClient
        siswaList={siswaList}
        rombels={rombels}
        acceptedApplicants={acceptedApplicantsToImport}
      />
    </div>
  );
}
