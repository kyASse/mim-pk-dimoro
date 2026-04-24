// lib/constants/calendar.ts
// Definisikan warna untuk setiap kategori kalender akademik
export const categoryColors: { [key: string]: string } = {
    'Libur Umum': '#fecaca', // Merah muda
    'Masa Pengenalan Lingkungan Sekolah': '#fcd34d', //Kuning
    'Parenting': '#bbf7d0', // Hijau Muda
    'Lomba HUT RI': '#ff6b6b', // Merah cerah
    'Kegiatan Sekolah': '#8d4d44', // Coklat
    'Libur Khusus Hari Guru': '#96a090', // Cream
    'Market Day': '#1e3a8a', // Biru Dongker
    'Hari Raya Nasional': '#a855f7', // Ungu
    'Libur Semester': '#bfdbfe', // Biru Muda
    'Libur Ramadhan': '#f9a8d4', // Pink
    'Libur Hari Raya': '#d8b4fe', // Ungu Muda
    'Penyerahan Siswa': '#065f46', // Hijau Tua
    'Penerimaan LHB': '#f97316', // Orange Muda
};

// Daftar kategori untuk dropdown dan validasi
export const availableCategories = Object.keys(categoryColors);
