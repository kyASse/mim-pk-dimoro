/**
 * lib/services/public-content.ts
 * Server-side data access layer untuk konten halaman publik MIM PK Dimoro.
 * Mengambil data terkini dari Supabase (konten_halaman, statistik_utama, ekstrakurikuler)
 * dengan lapisan pelindung Defensive Graceful Fallback jika DB kosong, error, atau null.
 */

import { createClient } from "@/lib/supabase/server";
import {
  parseHeroContent,
  parseBerandaKeunggulanContent,
  parseHeadmasterContent,
  parseVisionMissionContent,
  parseSchoolIdentityContent,
  parseProgramKurikulumContent,
  parseFAQContent,
  parsePPDBFlowContent,
} from "@/lib/utils/content-parsers";
import {
  HeroContent,
  BerandaKeunggulanContent,
  HeadmasterContent,
  VisionMissionContent,
  SchoolIdentityContent,
  ProgramKurikulumContent,
  FAQItem,
  PPDBFlowContent,
  MainStatItem,
  EkstrakurikulerItem,
} from "@/lib/types/content";
import { EXCELLENT_PROGRAMS } from "@/lib/school-data";

// Fallback default untuk statistik utama jika database kosong
const DEFAULT_MAIN_STATS: MainStatItem[] = [
  { kunci: "siswa_aktif", nilai: "150+", deskripsi: "Siswa Aktif Belajar" },
  { kunci: "guru_staf", nilai: "15", deskripsi: "Tenaga Pendidik & Staf" },
  { kunci: "kelulusan", nilai: "100%", deskripsi: "Tingkat Kelulusan" },
  { kunci: "akreditasi", nilai: "A", deskripsi: "Predikat Unggul" },
];

// Fallback default untuk ekstrakurikuler jika tabel ekstrakurikuler kosong
const DEFAULT_EXTRACURRICULARS: EkstrakurikulerItem[] = EXCELLENT_PROGRAMS.extracurriculars.map(
  (nama: string, idx: number) => ({
    id: idx + 1,
    nama_eskul: nama,
    deskripsi: `Kegiatan pengembangan bakat dan minat ${nama} bagi siswa MIM PK Dimoro.`,
    jadwal: "Setiap Sabtu, 14:00 - 16:00 WIB",
    image_url:
      idx === 0
        ? "/images/mim_tapak_suci.jpg"
        : idx === 1
        ? "/images/mim_pramuka_hw.jpg"
        : "/images/mim_hero_main.jpg",
  })
);

/**
 * Mengambil konten Hero Banner Beranda
 */
export async function getHeroContent(): Promise<HeroContent> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("konten_halaman")
      .select("isi")
      .eq("slug", "beranda-hero")
      .maybeSingle();

    if (error || !data) {
      return parseHeroContent(null);
    }
    return parseHeroContent(data.isi);
  } catch (err) {
    console.error("[public-content] Error fetching hero content:", err);
    return parseHeroContent(null);
  }
}

/**
 * Mengambil konten Bento Keunggulan Beranda
 */
export async function getBerandaKeunggulanContent(): Promise<BerandaKeunggulanContent> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("konten_halaman")
      .select("isi")
      .eq("slug", "beranda-keunggulan")
      .maybeSingle();

    if (error || !data) {
      return parseBerandaKeunggulanContent(null);
    }
    return parseBerandaKeunggulanContent(data.isi);
  } catch (err) {
    console.error("[public-content] Error fetching keunggulan content:", err);
    return parseBerandaKeunggulanContent(null);
  }
}

/**
 * Mengambil konten Sambutan Kepala Madrasah
 */
export async function getHeadmasterContent(): Promise<HeadmasterContent> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("konten_halaman")
      .select("isi")
      .eq("slug", "tentang-sambutan")
      .maybeSingle();

    if (error || !data) {
      return parseHeadmasterContent(null);
    }
    return parseHeadmasterContent(data.isi);
  } catch (err) {
    console.error("[public-content] Error fetching headmaster content:", err);
    return parseHeadmasterContent(null);
  }
}

/**
 * Mengambil konten Visi, Misi & Motto Madrasah
 */
export async function getVisionMissionContent(): Promise<VisionMissionContent> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("konten_halaman")
      .select("isi")
      .eq("slug", "tentang-visi-misi")
      .maybeSingle();

    if (error || !data) {
      return parseVisionMissionContent(null);
    }
    return parseVisionMissionContent(data.isi);
  } catch (err) {
    console.error("[public-content] Error fetching vision mission content:", err);
    return parseVisionMissionContent(null);
  }
}

/**
 * Mengambil data Identitas Resmi Madrasah
 */
export async function getSchoolIdentityContent(): Promise<SchoolIdentityContent> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("konten_halaman")
      .select("isi")
      .eq("slug", "tentang-identitas")
      .maybeSingle();

    if (error || !data) {
      return parseSchoolIdentityContent(null);
    }
    return parseSchoolIdentityContent(data.isi);
  } catch (err) {
    console.error("[public-content] Error fetching school identity:", err);
    return parseSchoolIdentityContent(null);
  }
}

/**
 * Mengambil konten Program Kurikulum & Fase Jam KBM
 */
export async function getProgramContent(): Promise<ProgramKurikulumContent> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("konten_halaman")
      .select("isi")
      .eq("slug", "program-kurikulum")
      .maybeSingle();

    if (error || !data) {
      return parseProgramKurikulumContent(null);
    }
    return parseProgramKurikulumContent(data.isi);
  } catch (err) {
    console.error("[public-content] Error fetching program content:", err);
    return parseProgramKurikulumContent(null);
  }
}

/**
 * Mengambil daftar FAQ Publik
 */
export async function getPublicFAQ(): Promise<FAQItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("konten_halaman")
      .select("isi")
      .eq("slug", "faq-list")
      .maybeSingle();

    if (error || !data) {
      return parseFAQContent(null).items;
    }
    return parseFAQContent(data.isi).items;
  } catch (err) {
    console.error("[public-content] Error fetching FAQ list:", err);
    return parseFAQContent(null).items;
  }
}

/**
 * Mengambil konten Alur PPDB & Tautan Formulir PDF
 */
export async function getPPDBFlowContent(): Promise<PPDBFlowContent> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("konten_halaman")
      .select("isi")
      .eq("slug", "ppdb-alur-berkas")
      .maybeSingle();

    if (error || !data) {
      return parsePPDBFlowContent(null);
    }
    return parsePPDBFlowContent(data.isi);
  } catch (err) {
    console.error("[public-content] Error fetching PPDB flow:", err);
    return parsePPDBFlowContent(null);
  }
}

/**
 * Mengambil 4 Angka Statistik Utama dari tabel statistik_utama
 */
export async function getMainStats(): Promise<MainStatItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("statistik_utama")
      .select("id, kunci, nilai, deskripsi")
      .order("id", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_MAIN_STATS;
    }
    return data as MainStatItem[];
  } catch (err) {
    console.error("[public-content] Error fetching main stats:", err);
    return DEFAULT_MAIN_STATS;
  }
}

/**
 * Mengambil daftar Ekstrakurikuler dari tabel ekstrakurikuler
 */
export async function getExtracurriculars(): Promise<EkstrakurikulerItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ekstrakurikuler")
      .select("id, nama_eskul, deskripsi, jadwal, image_url, created_at")
      .order("id", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_EXTRACURRICULARS;
    }
    return data as EkstrakurikulerItem[];
  } catch (err) {
    console.error("[public-content] Error fetching extracurriculars:", err);
    return DEFAULT_EXTRACURRICULARS;
  }
}
