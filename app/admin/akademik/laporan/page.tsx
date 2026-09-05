import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminUnderDevelopment } from "@/components/admin/AdminUnderDevelopment";

export default async function KelolaLaporanPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/auth/login");

  return (
    <AdminUnderDevelopment
      title="Laporan Perkembangan Siswa & Tahfidz"
      description="Pusat rekapitulasi evaluasi komprehensif: perkembangan karakter Islami, capaian hafalan Al-Qur'an (Tahfidz/Tahsin), dan catatan ekstrakurikuler."
      category="Akademik & E-Rapor"
      status="in_development"
      progress={50}
      estimatedRelease="Q3 2026"
      icon="book-open"
      backUrl="/admin"
      plannedFeatures={[
        {
          title: "Buku Mutaba'ah & Tracking Tahfidz",
          description: "Pencatatan ziyadah dan muraja'ah hafalan surat & juz santri harian oleh ustadz/ustadzah.",
          status: "in_progress",
          tags: ["Tahfidz", "Mutaba'ah"],
        },
        {
          title: "Evaluasi Karakter & Pembiasaan Ibadah",
          description: "Monitoring shalat dhuha, shalat berjamaah, dan adab santri di lingkungan madrasah.",
          status: "completed",
          tags: ["Karakter", "Ibadah"],
        },
        {
          title: "Catatan Naratif Wali Kelas",
          description: "Form masukan personal dari wali kelas untuk evaluasi perkembangan sosial-emosional siswa.",
          status: "planned",
          tags: ["Wali Kelas", "Evaluasi"],
        },
        {
          title: "Portal Laporan Digital untuk Wali Murid",
          description: "Akses langsung bagi orang tua untuk memantau grafik hafalan dan riwayat capaian putra/putri.",
          status: "planned",
          tags: ["Portal Wali", "Realtime"],
        },
      ]}
      technicalNotes={[
        "Integrasi dengan portal akun orang tua (tabel profiles & portal_sessions)",
        "Visualisasi grafik progres hafalan per semester menggunakan charting modular",
        "Ekspor ringkasan perkembangan format PDF siap kirim via WhatsApp ke nomor wali santri",
      ]}
    />
  );
}
