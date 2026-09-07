/**
 * lib/types/content.ts
 * Definisi tipe data komprehensif untuk seluruh seksi konten halaman publik MIM PK Dimoro.
 * Digunakan oleh CMS Admin Hub, Server Actions, dan fungsi parser halaman publik.
 */

// 1. Beranda: Hero Banner
export interface HeroContent {
  eyebrow: string;
  headline: string;
  subheadline: string;
  hero_image_url: string;
  floating_stat_number: string;
  floating_stat_text: string;
  trust_badges: string[];
}

// 2. Beranda: Bento Keunggulan
export interface BentoKeunggulanItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  category: "fondasi" | "tahfidz" | "karakter" | "ekskul" | string;
  linkText?: string;
  linkHref?: string;
}

export interface BerandaKeunggulanContent {
  judul: string;
  subjudul: string;
  items: BentoKeunggulanItem[];
}

// 3. Tentang Kami: Sambutan Kepala Madrasah
export interface HeadmasterContent {
  nama: string;
  gelar: string;
  jabatan: string;
  foto_url: string;
  summary: string;
  paragraphs: string[];
}

// 4. Tentang Kami: Visi, Misi & Motto
export interface VisionMissionContent {
  motto: string;
  visi: string;
  indikator_visi: string[];
  misi: string[];
}

// 5. Tentang Kami: Karakter & Profil Lulusan
export interface GraduateProfilesContent {
  judul: string;
  deskripsi: string;
  profiles: string[];
}

// 6. Tentang Kami: Identitas Resmi Madrasah
export interface SchoolIdentityContent {
  npsn: string;
  nsm: string;
  akreditasi: string;
  akreditasi_label: string;
  tanggal_berdiri: string;
  status_sekolah: string;
  bentuk_pendidikan: string;
  alamat_lengkap: string;
  desa_kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
}

// 7. Program & Kurikulum: Fase Belajar & Showcase
export interface JamKBMItem {
  hari: string;
  jam: string;
}

export interface FaseBelajarContent {
  judul: string;
  deskripsi: string;
  image_url: string;
  jam_kbm: JamKBMItem[];
  features: string[];
}

export interface ProgramKurikulumContent {
  pengantar_judul: string;
  pengantar_deskripsi: string;
  showcase_image_url: string;
  fase_bawah: FaseBelajarContent;
  fase_atas: FaseBelajarContent;
  tahfidz_target: string;
  tahfidz_objective: string;
  klinik_description: string;
}

// 8. Ekstrakurikuler Item (Relasional & Form)
export interface EkstrakurikulerItem {
  id?: number;
  nama_eskul: string;
  deskripsi: string;
  jadwal: string;
  image_url: string;
  created_at?: string;
}

// 9. Kontak: FAQ (Tanya Jawab Publik)
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FAQListContent {
  items: FAQItem[];
}

// 10. PPDB: Alur & Berkas Unduhan
export interface RegistrationFlowStep {
  title: string;
  desc: string;
}

export interface PPDBFlowContent {
  formulir_pdf_url: string;
  alur_online: RegistrationFlowStep[];
  alur_offline: RegistrationFlowStep[];
}

// 11. Statistik Utama (Relasional di tabel statistik_utama)
export interface MainStatItem {
  id?: number;
  kunci: string;
  nilai: string;
  deskripsi?: string;
}

// Model Baris Database konten_halaman
export interface KontenHalamanRow {
  slug: string;
  judul: string;
  isi: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}
