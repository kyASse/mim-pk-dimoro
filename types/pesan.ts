// types/pesan.ts

export type StatusPesan = 'belum_dibaca' | 'dibaca' | 'dibalas';

export interface PesanMasuk {
  id: number;
  nama_pengirim: string;
  email_pengirim: string;
  telepon: string | null;
  subjek: string | null;
  isi_pesan: string;
  status: StatusPesan;
  created_at: string;
  updated_at: string;
}

export interface PesanStats {
  total: number;
  belumDibaca: number;
  dibaca: number;
  dibalas: number;
}
