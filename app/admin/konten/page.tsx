import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getHeroContent,
  getBerandaKeunggulanContent,
  getMainStats,
  getHeadmasterContent,
  getVisionMissionContent,
  getSchoolIdentityContent,
  getProgramContent,
  getExtracurriculars,
  getPPDBFlowContent,
  getPublicFAQ,
} from "@/lib/services/public-content";
import { AdminKontenHub } from "@/components/admin/konten/AdminKontenHub";

export const metadata = {
  title: "Manajemen Konten Publik - Admin MIM PK Dimoro",
  description: "Pusat pengelolaan konten statis, aset gambar, dan informasi publik madrasah.",
};

export default async function AdminKontenPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  // Fetch semua seksi data konten secara paralel dengan defensive fallback
  const [
    hero,
    keunggulan,
    stats,
    headmaster,
    visionMission,
    identity,
    program,
    eskul,
    ppdbFlow,
    faqList,
    syaratRes,
    jadwalRes,
    sppRes,
    kontakRes,
  ] = await Promise.all([
    getHeroContent(),
    getBerandaKeunggulanContent(),
    getMainStats(),
    getHeadmasterContent(),
    getVisionMissionContent(),
    getSchoolIdentityContent(),
    getProgramContent(),
    getExtracurriculars(),
    getPPDBFlowContent(),
    getPublicFAQ(),
    supabase.from("konten_halaman").select("isi").eq("slug", "persyaratan-pendaftaran").maybeSingle(),
    supabase.from("konten_halaman").select("isi").eq("slug", "jadwal-pendaftaran").maybeSingle(),
    supabase.from("konten_halaman").select("isi").eq("slug", "catatan-spp").maybeSingle(),
    supabase.from("kontak_sekolah").select("*").maybeSingle(),
  ]);

  // Helper parser block text
  const extractBlockText = (isi: any, fallback: string) => {
    if (!isi) return fallback;
    if (typeof isi === "string") return isi;
    if (Array.isArray(isi.blocks) && isi.blocks[0]?.text) {
      return isi.blocks[0].text;
    }
    return fallback;
  };

  const defaultSyarat =
    "1. Mengisi formulir pendaftaran online\n2. Fotokopi Akta Kelahiran\n3. Fotokopi Kartu Keluarga\n4. Pas foto 3x4 berwarna (2 lembar)\n5. Surat keterangan dari TK/RA asal (bila ada)";
  const defaultJadwal =
    "Gelombang 1: Januari - Maret 2026\nGelombang 2: April - Juni 2026\nTes Observasi: Setiap hari Sabtu pada akhir bulan";
  const defaultSpp =
    "SPP bulanan sudah mencakup seluruh program unggulan (Tahfidz, Klinik Belajar, makan siang, dan ekstrakurikuler wajib).";

  const persyaratanText = extractBlockText(syaratRes.data?.isi, defaultSyarat);
  const jadwalText = extractBlockText(jadwalRes.data?.isi, defaultJadwal);
  const sppText = extractBlockText(sppRes.data?.isi, defaultSpp);

  const defaultKontak = {
    id: 1,
    alamat: "Sudimoro, RT.003/RW.X, Parangjoro, Kec. Grogol, Kab. Sukoharjo, Jawa Tengah",
    whatsapp: "6281234567890",
    email_utama: "info@mimpkdimoro.sch.id",
    email_admin: "admin@mimpkdimoro.sch.id",
    jam_operasional: "Senin - Kamis: 07:00 - 14:00 WIB | Jumat: 07:00 - 11:00 WIB",
    maps_embed_url: "",
    facebook_url: "",
    instagram_url: "",
    youtube_url: "",
  };

  const kontak = kontakRes.data ? { ...defaultKontak, ...kontakRes.data } : defaultKontak;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
      <AdminKontenHub
        hero={hero}
        keunggulan={keunggulan}
        stats={stats}
        headmaster={headmaster}
        visionMission={visionMission}
        identity={identity}
        program={program}
        eskul={eskul}
        ppdbFlow={ppdbFlow}
        persyaratanText={persyaratanText}
        jadwalText={jadwalText}
        sppText={sppText}
        kontak={kontak}
        faqList={faqList}
      />
    </div>
  );
}