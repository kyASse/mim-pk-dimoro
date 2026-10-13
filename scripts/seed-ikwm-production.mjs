import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    const urlMatch = envContent.match(/^NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)$/m);
    const keyMatch = envContent.match(/^SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.*)$/m);
    if (!supabaseUrl && urlMatch) supabaseUrl = urlMatch[1].trim();
    if (!serviceRoleKey && keyMatch) serviceRoleKey = keyMatch[1].trim();
  }
}

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY harus disetel.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export const IKWM_PRODUCTION_DATA = {
  hero: {
    badge: "Sinergi Madrasah & Keluarga",
    judul: "Ikatan Orang Tua Murid (IOM) MIM Dimoro",
    subjudul:
      "Wadah silaturahmi, kolaborasi, dan kemitraan strategis antara orang tua dan madrasah demi melahirkan generasi Qur'ani yang unggul, berprestasi, dan berakhlak mulia.",
    periode: "Periode 2026-2027",
  },
  kata_pengantar: {
    judul: "Sambutan Ketua IOM MIM Dimoro",
    nama_ketua: "Kardiyanto",
    jabatan: "Ketua IOM MIM Dimoro",
    foto_url: "/avatar-man-placeholder.png",
    sambutan: [
      "Assalamu’alaikum Warahmatullahi Wabarakatuh. Puji syukur kita panjatkan ke hadirat Allah SWT atas segala limpahan rahmat, taufik, dan hidayah-Nya kepada kita semua.",
      "Ikatan Orang Tua Murid (IOM) MIM Dimoro hadir sebagai jembatan kemitraan yang kokoh antara orang tua dan pihak madrasah. Pendidikan terbaik bagi putra-putri kita hanya dapat terwujud melalui keselarasan visi, keterbukaan komunikasi, dan gotong royong yang tulus.",
      "Kami mengajak seluruh bapak dan ibu wali murid untuk bersama-sama aktif berkontribusi, memberikan masukan konstruktif, serta menyukseskan setiap program madrasah demi melahirkan generasi yang sholeh, cerdas, dan mandiri.",
      "Wassalamu’alaikum Warahmatullahi Wabarakatuh.",
    ],
    kutipan_kunci:
      "Pendidikan terbaik anak lahir dari keharmonisan kolaborasi antara rumah dan madrasah.",
  },
  video: {
    display_mode: "placeholder",
    youtube_url: "",
    judul: "Profil & Kilas Balik Kegiatan IOM",
    deskripsi:
      "Dokumentasi kebersamaan dan sinergi orang tua siswa bersama madrasah dalam mendukung proses pendidikan anak.",
    placeholder_title: "Dokumentasi Profil Sedang Diproduksi",
    placeholder_desc:
      "Nantikan liputan kegiatan kami segera. Video dokumentasi kegiatan dan profil paguyuban IOM MIM Dimoro sedang dipersiapkan.",
  },
  struktural: {
    pembina: [
      {
        nama: "Kepala Madrasah MIM PK Dimoro",
        jabatan: "Penasihat & Pembina Utama",
        foto_url: "/avatar-man-placeholder.png",
      },
      {
        nama: "Ketua Komite Madrasah",
        jabatan: "Pembina Paguyuban",
        foto_url: "/avatar-man-placeholder.png",
      },
    ],
    pengurus_inti: [
      {
        id: "ketua-1",
        nama: "Kardiyanto",
        jabatan: "Ketua",
        divisi: "Pengurus Harian",
        foto_url: "/avatar-man-placeholder.png",
      },
      {
        id: "wakil-1",
        nama: "Pradnya Paramita",
        jabatan: "Wakil Ketua",
        divisi: "Pengurus Harian",
        foto_url: "/avatar-women-placeholder.png",
      },
      {
        id: "sekretaris-1",
        nama: "Retno Elandari",
        jabatan: "Sekretaris",
        divisi: "Pengurus Harian",
        foto_url: "/avatar-women-placeholder.png",
      },
      {
        id: "bendahara-1",
        nama: "Aprilia Hidayati",
        jabatan: "Bendahara",
        divisi: "Pengurus Harian",
        foto_url: "/avatar-women-placeholder.png",
      },
    ],
    bidang: [
      {
        id: "bidang-pendidikan",
        nama_bidang: "Bidang Pendidikan dan Pengembangan Karakter",
        koordinator: "Bibit Lestari, S.Pd.",
        anggota: ["Yunita Dwi Astuti", "Tinuk", "Ajeng Riski Safitri"],
      },
      {
        id: "bidang-sosial",
        nama_bidang: "Bidang Sosial dan Keagamaan",
        koordinator: "Millatusori",
        anggota: ["Fitri Hastutik", "Bella Novita Putri", "Ima Pompi Oktaviano"],
      },
      {
        id: "bidang-dana-sarpras",
        nama_bidang: "Bidang Dana Usaha dan Sarana Lingkungan",
        koordinator: "Sri Untari",
        anggota: ["Siti Isnaniah", "Yati", "Leny"],
      },
      {
        id: "bidang-humas",
        nama_bidang: "Humas",
        koordinator: "Safitri",
        anggota: ["Fitri Wulandari", "Dyah Rahmayanti", "Puji Lestari"],
      },
    ],
  },
  kegiatan: [
    {
      id: "kegiatan-parenting-bulanan",
      kategori: "parenting",
      badge_label: "Program Bulanan",
      judul: "Kajian Parenting & Dialog Pendidikan Anak",
      deskripsi:
        "Seminar parenting rutin bersama pakar psikologi dan pendidikan Islam untuk menyelaraskan pola asuh di rumah dan madrasah.",
      jadwal: "Ahad Pekan ke-2 Setiap Bulan",
      foto_url: "/images/mim_hero_main.jpg",
      highlight_tag: "Rutin",
    },
    {
      id: "kegiatan-sosial-peduli",
      kategori: "sosial",
      badge_label: "Agenda Peduli",
      judul: "Bakti Sosial & Santunan Berkah",
      deskripsi:
        "Penyaluran bantuan sembako dan santunan pendidikan bagi masyarakat sekitar dan siswa yang membutuhkan.",
      jadwal: "Menjelang Ramadhan & Muharram",
      foto_url: "/images/mim_tahfidz_learning.jpg",
      highlight_tag: "Kolaborasi",
    },
    {
      id: "kegiatan-sarpras-gotong-royong",
      kategori: "sarpras",
      badge_label: "Aksi Lingkungan",
      judul: "Gotong Royong & Penghijauan Lingkungan Madrasah",
      deskripsi:
        "Kerja bakti bersama orang tua siswa untuk merawat taman madrasah, sarana kebersihan, dan kenyamanan lingkungan belajar.",
      jadwal: "Tiap Ahad Awal Semester",
      foto_url: "/images/mim_hero_main.jpg",
    },
    {
      id: "kegiatan-kemitraan-market-day",
      kategori: "kemitraan",
      badge_label: "Kemitraan",
      judul: "Pendampingan Market Day Siswa",
      deskripsi:
        "Kolaborasi orang tua dalam mendampingi praktek kewirausahaan mandiri siswa dan bazar produk kreasi keluarga madrasah.",
      jadwal: "Agenda Semesteran",
      foto_url: "/images/mim_tahfidz_learning.jpg",
    },
  ],
};

async function seed() {
  console.log("Upserting IKWM content into Supabase production (konten_halaman)...");
  const payload = {
    slug: "ikatan-wali-murid",
    judul: "Ikatan Wali Murid (IKWM)",
    isi: IKWM_PRODUCTION_DATA,
  };

  const { data, error } = await supabase
    .from("konten_halaman")
    .upsert(payload, { onConflict: "slug" })
    .select("slug, judul, created_at")
    .single();

  if (error) {
    console.error("Gagal melakukan seed IKWM ke production:", error);
    process.exit(1);
  }

  console.log("Berhasil memasukkan data IKWM ke production:", data);
}

seed();
