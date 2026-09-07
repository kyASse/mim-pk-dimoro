import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminUnderDevelopment } from "@/components/admin/AdminUnderDevelopment";

export default async function KelolaAkademikPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/auth/login");

  return (
    <AdminUnderDevelopment
      title="Manajemen Nilai & E-Rapor Digital"
      description="Sistem penginputan capaian pembelajaran, penilaian formatif & sumatif (TP/LM), serta kalkulasi nilai rapor Kurikulum Merdeka."
      category="Akademik & E-Rapor"
      status="in_development"
      progress={65}
      estimatedRelease="Semester Ganjil 2026/2027"
      icon="graduation-cap"
      backUrl="/admin"
      plannedFeatures={[
        {
          title: "Input Nilai Formatif & Sumatif (TP/LM)",
          description: "Matriks input nilai per tujuan pembelajaran dengan kalkulasi rerata otomatis.",
          status: "in_progress",
          tags: ["Nilai", "Kurikulum Merdeka"],
        },
        {
          title: "Deskripsi Capaian Pembelajaran Otomatis",
          description: "Penyusunan narasi capaian tertinggi dan perlu bimbingan berbasis AI dan rumus baku.",
          status: "in_progress",
          tags: ["Otomatisasi", "Narasi"],
        },
        {
          title: "Ekspor & Cetak Rapor Digital PDF",
          description: "Cetak lembar rapor resmi per santri/kelas dengan watermark dan tanda tangan digital madrasah.",
          status: "planned",
          tags: ["PDF", "E-Rapor"],
        },
        {
          title: "Multi-Akses Guru Mata Pelajaran",
          description: "Hak akses penginputan nilai terisolasi sesuai jadwal dan pembagian mata pelajaran guru.",
          status: "completed",
          tags: ["Keamanan", "RBAC"],
        },
      ]}
      technicalNotes={[
        "Struktur relasi PostgreSQL antara tabel siswa, mata_pelajaran, tujuan_pembelajaran, dan nilai_akhir",
        "Query batching Server Actions untuk efisiensi kalkulasi ratusan siswa per jenjang kelas",
        "Validasi input nilai dengan batas rentang 0-100 dan pencegahan duplikasi entri",
      ]}
    />
  );
}