// lib/utils/pendaftar-stats.ts

export type PendaftarData = {
  id: string;
  status_pendaftaran: string;
  // tambahkan field lain yang diperlukan
};

export type PendaftarStats = {
  totalPendaftar: number;
  menungguPersetujuan: number;
  pendaftarDisetujui: number;
  validasiUlang: number;
  pendaftarDitolak: number;
};

/**
 * Menghitung statistik pendaftar berdasarkan status pendaftaran
 * @param pendaftarData Array data pendaftar
 * @returns Object dengan statistik pendaftar
 */
export function calculatePendaftarStats(pendaftarData: PendaftarData[] | null): PendaftarStats {
  if (!pendaftarData) {
    return {
      totalPendaftar: 0,
      menungguPersetujuan: 0,
      pendaftarDisetujui: 0,
      validasiUlang: 0,
      pendaftarDitolak: 0,
    };
  }

  const totalPendaftar = pendaftarData.length;
  
  // Hitung berdasarkan status yang konsisten
  const pendaftarDisetujui = pendaftarData.filter(p => p.status_pendaftaran === 'Diterima').length;
  const validasiUlang = pendaftarData.filter(p => p.status_pendaftaran === 'Revisi').length;
  const pendaftarDitolak = pendaftarData.filter(p => p.status_pendaftaran === 'Ditolak').length;
  
  // Menunggu persetujuan: semua yang bukan Diterima, Revisi, atau Ditolak
  const menungguPersetujuan = pendaftarData.filter(p => 
    p.status_pendaftaran !== 'Diterima' && 
    p.status_pendaftaran !== 'Revisi' && 
    p.status_pendaftaran !== 'Ditolak'
  ).length;

  return {
    totalPendaftar,
    menungguPersetujuan,
    pendaftarDisetujui,
    validasiUlang,
    pendaftarDitolak,
  };
}

/**
 * Mendapatkan warna badge berdasarkan status pendaftaran
 * @param status Status pendaftaran
 * @returns Variant warna untuk badge
 */
export function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'Diterima':
      return 'default'; // hijau
    case 'Revisi':
      return 'outline'; // kuning/warning
    case 'Ditolak':
      return 'destructive'; // merah
    default:
      return 'secondary'; // abu-abu untuk status lainnya
  }
}

/**
 * Mendapatkan teks yang user-friendly untuk status
 * @param status Status pendaftaran
 * @returns Teks status yang mudah dibaca
 */
export function getStatusDisplayText(status: string): string {
  switch (status) {
    case 'Diterima':
      return 'Diterima';
    case 'Revisi':
      return 'Revisi';
    case 'Ditolak':
      return 'Ditolak';
    case 'Belum Divalidasi':
      return 'Belum Divalidasi';
    default:
      return status || 'Belum Divalidasi';
  }
}
