/**
 * lib/utils/content-parsers.ts
 * Parser aman untuk payload JSONB tabel konten_halaman.
 * Dilengkapi Defensive Fallback ke nilai default sistem di lib/school-config dan lib/school-data
 * sehingga halaman publik dijamin Zero-Downtime & Zero-Regression.
 */

import {
  SCHOOL_NAME,
  SCHOOL_TAGLINE,
} from "@/lib/school-config";
import {
  HEADMASTER_WELCOME,
  VISION_MISSION,
  EXCELLENT_PROGRAMS,
} from "@/lib/school-data";
import { defaultFAQItems } from "@/components/kontak/ContactFAQ";
import {
  HeroContent,
  HeadmasterContent,
  VisionMissionContent,
  SchoolIdentityContent,
  ProgramKurikulumContent,
  FAQListContent,
  PPDBFlowContent,
  BerandaKeunggulanContent,
  IKWMContent,
} from "@/lib/types/content";

// 1. Parser Hero Beranda
export function parseHeroContent(data: unknown): HeroContent {
  const obj = (data && typeof data === "object" ? data : {}) as Partial<HeroContent>;

  return {
    eyebrow: obj.eyebrow || "Madrasah Ibtidaiyah Program Khusus",
    headline: obj.headline || SCHOOL_NAME,
    subheadline: obj.subheadline || SCHOOL_TAGLINE,
    hero_image_url: obj.hero_image_url || "/images/mim_hero_main.jpg",
    floating_stat_number: obj.floating_stat_number || "59",
    floating_stat_text: obj.floating_stat_text || "Pengalaman Berdiri Sejak 1967",
    trust_badges:
      Array.isArray(obj.trust_badges) && obj.trust_badges.length > 0
        ? obj.trust_badges
        : ["Akreditasi Unggul", "Kurikulum Terpadu Islami"],
  };
}

// 2. Parser Bento Keunggulan Beranda
export function parseBerandaKeunggulanContent(data: unknown): BerandaKeunggulanContent {
  const obj = (data && typeof data === "object" ? data : {}) as Partial<BerandaKeunggulanContent>;

  const defaultItems = [
    {
      id: "fondasi-utama",
      title: "Kurikulum Terpadu Islami",
      description:
        "Menggabungkan secara harmonis Kurikulum Merdeka Nasional dengan Kurikulum Al-Islam dan Kemuhammadiyahan untuk membentuk pemikiran kritis berwawasan Islami.",
      badge: "Fondasi Utama",
      category: "fondasi",
      linkText: "Lihat Kurikulum",
      linkHref: "/program",
    },
    {
      id: "target-hafalan",
      title: "Program Tahfidz Al-Qur'an",
      description:
        "Pembiasaan bimbingan hafalan Juz Amma dan surah pilihan dengan metode talaqqi yang ramah anak.",
      badge: "Target Hafalan",
      category: "tahfidz",
    },
    {
      id: "karakter-islami",
      title: "Pembinaan Pembentukan Karakter",
      description:
        "Pembiasaan shalat dhuha, dzikir harian, dan pembentukan karakter disiplin, jujur, serta mandiri.",
      badge: "Karakter Islami",
      category: "karakter",
    },
    {
      id: "talent-minat",
      title: "Ekstrakurikuler Variatif",
      description:
        "Pengembangan minat bakat melalui kegiatan Tapak Suci, Hizbul Wathan (HW), Seni Al-Qur'an, Pramuka, Olahraga, dan Seni Kaligrafi.",
      badge: "Talent & Minat",
      category: "ekskul",
    },
  ];

  return {
    judul: obj.judul || "Keunggulan Pendidikan MIM Dimoro",
    subjudul:
      obj.subjudul ||
      "Pendekatan holistik yang mengintegrasikan kecerdasan intelektual, emosional, dan spiritual anak.",
    items: Array.isArray(obj.items) && obj.items.length > 0 ? obj.items : defaultItems,
  };
}

// 3. Parser Sambutan Kepala Madrasah
export function parseHeadmasterContent(data: unknown): HeadmasterContent {
  const obj = (data && typeof data === "object" ? data : {}) as Partial<HeadmasterContent>;

  return {
    nama: obj.nama || HEADMASTER_WELCOME.name,
    gelar: obj.gelar !== undefined ? obj.gelar : "",
    jabatan: obj.jabatan || HEADMASTER_WELCOME.title,
    foto_url: obj.foto_url || HEADMASTER_WELCOME.photoUrl || "/images/headmaster.jpg",
    summary: obj.summary || HEADMASTER_WELCOME.summary,
    paragraphs:
      Array.isArray(obj.paragraphs) && obj.paragraphs.length > 0
        ? obj.paragraphs
        : HEADMASTER_WELCOME.paragraphs,
  };
}

// 4. Parser Visi, Misi & Motto
export function parseVisionMissionContent(data: unknown): VisionMissionContent {
  const obj = (data && typeof data === "object" ? data : {}) as Partial<VisionMissionContent>;

  return {
    motto: obj.motto || VISION_MISSION.motto,
    visi: obj.visi || VISION_MISSION.vision,
    indikator_visi:
      Array.isArray(obj.indikator_visi) && obj.indikator_visi.length > 0
        ? obj.indikator_visi
        : VISION_MISSION.visionIndicators,
    misi:
      Array.isArray(obj.misi) && obj.misi.length > 0
        ? obj.misi
        : VISION_MISSION.missions,
  };
}

// 5. Parser Identitas Resmi Madrasah
export function parseSchoolIdentityContent(data: unknown): SchoolIdentityContent {
  const obj = (data && typeof data === "object" ? data : {}) as Partial<SchoolIdentityContent>;

  return {
    npsn: obj.npsn || "60711720",
    nsm: obj.nsm || "111233110050",
    akreditasi: obj.akreditasi || "A",
    akreditasi_label: obj.akreditasi_label || "Unggul",
    tanggal_berdiri: obj.tanggal_berdiri || "1 September 1967",
    status_sekolah: obj.status_sekolah || "Swasta",
    bentuk_pendidikan: obj.bentuk_pendidikan || "Madrasah Ibtidaiyah",
    alamat_lengkap: obj.alamat_lengkap || "Sudimoro, RT.003/RW.X",
    desa_kelurahan: obj.desa_kelurahan || "Parangjoro",
    kecamatan: obj.kecamatan || "Grogol",
    kabupaten: obj.kabupaten || "Sukoharjo",
    provinsi: obj.provinsi || "Jawa Tengah",
  };
}

// 6. Parser Program Kurikulum & Fase
export function parseProgramKurikulumContent(data: unknown): ProgramKurikulumContent {
  const obj = (data && typeof data === "object" ? data : {}) as Partial<ProgramKurikulumContent>;

  const defaultFaseBawah = {
    judul: "Fase A & B (Kelas 1-3)",
    deskripsi:
      "Fokus pada penguatan literasi dasar, numerasi, dan pembiasaan adab serta ibadah harian.",
    image_url: "/images/mim_tahfidz_learning.jpg",
    jam_senin_kamis: "07:00 - 13:00 WIB",
    jam_jumat: "07:00 - 11:00 WIB",
    jam_kbm: [
      { hari: "Senin - Kamis", jam: "07:00 - 13:00 WIB" },
      { hari: "Jumat", jam: "07:00 - 11:00 WIB" },
    ],
    features: [
      "ISMUBA (Al-Qur'an Hadis, Akidah Akhlak, Fikih, Bahasa Arab)",
      "Pendidikan Pancasila & Bahasa Indonesia",
      "Matematika & Seni Budaya",
      "PJOK & Muatan Lokal",
      "Pembiasaan Sholat Dhuha & Dzuhur Berjamaah",
      "Tahfidz Juz 30",
    ],
  };

  const defaultFaseAtas = {
    judul: "Fase B & C (Kelas 4-6)",
    deskripsi:
      "Pengembangan kemampuan berpikir kritis, kemandirian, dan persiapan menuju jenjang pendidikan menengah.",
    image_url: "/images/mim_hero_main.jpg",
    jam_senin_kamis: "07:00 - 14:00 WIB",
    jam_jumat: "07:00 - 11:00 WIB",
    jam_kbm: [
      { hari: "Senin - Kamis", jam: "07:00 - 14:00 WIB" },
      { hari: "Jumat", jam: "07:00 - 11:00 WIB" },
    ],
    features: [
      "Mata Pelajaran Dasar + SKI (Sejarah Kebudayaan Islam)",
      "IPAS (Ilmu Pengetahuan Alam dan Sosial)",
      "Bahasa Inggris & Teknologi Informasi (Koding)",
      "Penyelesaian Target Tahfidz Al-Qur'an",
      "Latihan Kepemimpinan & Organisasi Dasar",
      "Bimbingan Persiapan Ujian Akhir",
    ],
  };

  return {
    pengantar_judul: obj.pengantar_judul || "Kurikulum & Program",
    pengantar_deskripsi:
      obj.pengantar_deskripsi ||
      "Madrasah Ibtidaiyah Muhammadiyah Dimoro menyelenggarakan pendidikan dasar dengan Kurikulum Merdeka yang diperkaya dengan muatan lokal Al-Islam, Kemuhammadiyahan, dan Bahasa Arab (ISMUBA).",
    showcase_image_url: obj.showcase_image_url || "/images/mim_hero_main.jpg",
    fase_bawah: obj.fase_bawah
      ? { ...defaultFaseBawah, ...obj.fase_bawah }
      : defaultFaseBawah,
    fase_atas: obj.fase_atas
      ? { ...defaultFaseAtas, ...obj.fase_atas }
      : defaultFaseAtas,
    tahfidz_target: obj.tahfidz_target || EXCELLENT_PROGRAMS.tahfidz.target,
    tahfidz_objective: obj.tahfidz_objective || EXCELLENT_PROGRAMS.tahfidz.objective,
    klinik_description: obj.klinik_description || EXCELLENT_PROGRAMS.klinikBelajar.objective,
  };
}

// 7. Parser FAQ Publik
export function parseFAQContent(data: unknown): FAQListContent {
  const obj = (data && typeof data === "object" ? data : {}) as Partial<FAQListContent>;

  return {
    items: Array.isArray(obj.items) && obj.items.length > 0 ? obj.items : defaultFAQItems,
  };
}

// 8. Parser Alur PPDB & Berkas Formulir
export function parsePPDBFlowContent(data: unknown): PPDBFlowContent {
  const obj = (data && typeof data === "object" ? data : {}) as Partial<PPDBFlowContent>;

  const defaultOnline = [
    { title: "Siapkan Dokumen", desc: "Siapkan semua dokumen yang diperlukan sesuai dengan persyaratan" },
    { title: "Isi Formulir Online", desc: "Lengkapi formulir pendaftaran dengan data yang benar dan lengkap" },
    { title: "Upload Dokumen", desc: "Upload scan atau foto dokumen dengan kualitas yang jelas" },
    { title: "Submit Pendaftaran", desc: "Periksa kembali data lalu klik tombol 'Daftar Sekarang'" },
    { title: "Konfirmasi & Bayar", desc: "Tunggu konfirmasi dan lakukan pembayaran sesuai instruksi" },
  ];

  const defaultOffline = [
    { title: "Siapkan Dokumen Asli", desc: "Bawa semua dokumen asli dan fotokopi sesuai persyaratan" },
    { title: "Download Formulir", desc: "Isi formulir dari rumah untuk mempercepat proses" },
    { title: "Kunjungi Sekolah", desc: "Datang ke MIM PK Dimoro pada jam kerja (07:30 - 11:30 WIB)" },
    { title: "Verifikasi Berkas", desc: "Petugas akan memverifikasi kelengkapan berkas Anda" },
  ];

  return {
    formulir_pdf_url: obj.formulir_pdf_url || "/Formulir Pendaftaran MIM PK Dimoro.pdf",
    alur_online: Array.isArray(obj.alur_online) && obj.alur_online.length > 0 ? obj.alur_online : defaultOnline,
    alur_offline: Array.isArray(obj.alur_offline) && obj.alur_offline.length > 0 ? obj.alur_offline : defaultOffline,
  };
}

/**
 * Helper untuk mengekstrak 11 karakter ID video YouTube dari berbagai format URL:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://www.youtube.com/embed/dQw4w9WgXcQ
 * - https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ
 */
export function extractYouTubeVideoId(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;
  const cleanUrl = url.trim();
  if (!cleanUrl) return null;

  const regExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = cleanUrl.match(regExp);
  return match ? match[1] : null;
}

// Fallback default untuk Ikatan Wali Murid (IKWM / IOM)
export const DEFAULT_IKWM_CONTENT: IKWMContent = {
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

// 9. Parser Ikatan Wali Murid (IKWM / IOM)
export function parseIKWMContent(data: unknown): IKWMContent {
  let parsed = data;
  if (typeof data === "string") {
    try {
      parsed = JSON.parse(data);
    } catch {
      parsed = null;
    }
  }
  const obj = (parsed && typeof parsed === "object" ? parsed : {}) as Partial<IKWMContent>;

  const hero = {
    badge: obj.hero?.badge || DEFAULT_IKWM_CONTENT.hero.badge,
    judul: obj.hero?.judul || DEFAULT_IKWM_CONTENT.hero.judul,
    subjudul: obj.hero?.subjudul || DEFAULT_IKWM_CONTENT.hero.subjudul,
    periode: obj.hero?.periode || DEFAULT_IKWM_CONTENT.hero.periode,
  };

  const kata_pengantar = {
    judul: obj.kata_pengantar?.judul || DEFAULT_IKWM_CONTENT.kata_pengantar.judul,
    nama_ketua: obj.kata_pengantar?.nama_ketua || DEFAULT_IKWM_CONTENT.kata_pengantar.nama_ketua,
    jabatan: obj.kata_pengantar?.jabatan || DEFAULT_IKWM_CONTENT.kata_pengantar.jabatan,
    foto_url: obj.kata_pengantar?.foto_url || DEFAULT_IKWM_CONTENT.kata_pengantar.foto_url,
    sambutan:
      Array.isArray(obj.kata_pengantar?.sambutan) && obj.kata_pengantar.sambutan.length > 0
        ? obj.kata_pengantar.sambutan
        : DEFAULT_IKWM_CONTENT.kata_pengantar.sambutan,
    kutipan_kunci:
      obj.kata_pengantar?.kutipan_kunci || DEFAULT_IKWM_CONTENT.kata_pengantar.kutipan_kunci,
  };

  const validDisplayModes = ["active", "placeholder", "hidden"] as const;
  const rawDisplayMode = obj.video?.display_mode;
  const display_mode: "active" | "placeholder" | "hidden" =
    rawDisplayMode && validDisplayModes.includes(rawDisplayMode as any)
      ? (rawDisplayMode as "active" | "placeholder" | "hidden")
      : DEFAULT_IKWM_CONTENT.video.display_mode;

  const video = {
    display_mode,
    youtube_url:
      typeof obj.video?.youtube_url === "string"
        ? obj.video.youtube_url
        : DEFAULT_IKWM_CONTENT.video.youtube_url,
    judul: obj.video?.judul || DEFAULT_IKWM_CONTENT.video.judul,
    deskripsi: obj.video?.deskripsi || DEFAULT_IKWM_CONTENT.video.deskripsi,
    placeholder_title:
      obj.video?.placeholder_title || DEFAULT_IKWM_CONTENT.video.placeholder_title,
    placeholder_desc:
      obj.video?.placeholder_desc || DEFAULT_IKWM_CONTENT.video.placeholder_desc,
  };

  const struktural = {
    pembina:
      Array.isArray(obj.struktural?.pembina) && obj.struktural.pembina.length > 0
        ? obj.struktural.pembina
        : DEFAULT_IKWM_CONTENT.struktural.pembina,
    pengurus_inti:
      Array.isArray(obj.struktural?.pengurus_inti) && obj.struktural.pengurus_inti.length > 0
        ? obj.struktural.pengurus_inti
        : DEFAULT_IKWM_CONTENT.struktural.pengurus_inti,
    bidang:
      Array.isArray(obj.struktural?.bidang) && obj.struktural.bidang.length > 0
        ? obj.struktural.bidang
        : DEFAULT_IKWM_CONTENT.struktural.bidang,
  };

  const kegiatan =
    Array.isArray(obj.kegiatan) && obj.kegiatan.length > 0
      ? obj.kegiatan
      : DEFAULT_IKWM_CONTENT.kegiatan;

  return {
    hero,
    kata_pengantar,
    video,
    struktural,
    kegiatan,
  };
}

