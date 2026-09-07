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
