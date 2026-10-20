export type PeranPenulis = 'guru' | 'wali_murid' | 'alumni' | 'umum';

export type KategoriOpini = 
  | 'Pola Asuh & Parenting'
  | 'Pendidikan & Karakter'
  | 'Inovasi Pembelajaran'
  | 'Kisah Inspiratif'
  | 'Opini Bebas';

export type StatusOpini = 'menunggu_kurasi' | 'terbit' | 'ditolak' | 'arsip';

export interface OpiniPerspektif {
  id: string;
  slug: string;
  judul: string;
  ringkasan: string;
  isi_lengkap: string;
  kategori: KategoriOpini;
  
  nama_penulis: string;
  peran_penulis: PeranPenulis;
  keterangan_peran: string | null;
  foto_penulis_url: string | null;
  gambar_sampul_url: string | null;
  
  kontak_wa: string;
  email: string | null;
  
  status: StatusOpini;
  catatan_redaksi: string | null;
  is_featured: boolean;
  waktu_terbit: string | null;
  dibaca_count: number;
  
  created_at: string;
  updated_at: string;
}

export interface OpiniPublicItem {
  id: string;
  slug: string;
  judul: string;
  ringkasan: string;
  kategori: KategoriOpini;
  nama_penulis: string;
  peran_penulis: PeranPenulis;
  keterangan_peran: string | null;
  foto_penulis_url: string | null;
  gambar_sampul_url: string | null;
  is_featured: boolean;
  waktu_terbit: string;
  waktu_baca_menit: number;
}

export interface OpiniPublicDetail extends OpiniPublicItem {
  isi_lengkap: string;
  dibaca_count: number;
}

export interface OpiniSubmissionPayload {
  nama_penulis: string;
  peran_penulis: PeranPenulis;
  keterangan_peran: string;
  kontak_wa: string;
  email?: string;
  judul: string;
  kategori: KategoriOpini;
  ringkasan: string;
  isi_lengkap: string;
  website_url?: string;
}
