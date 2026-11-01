// lib/constants/calendar.ts

export interface CategoryStyleConfig {
  label: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  dotColor: string; // solid color for indicator
  darkBgClass?: string;
  darkBorderClass?: string;
  darkTextClass?: string;
}

export const calendarCategoryConfigs: Record<string, CategoryStyleConfig> = {
  'Libur Umum': {
    label: 'Libur Umum',
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-200',
    textClass: 'text-rose-900',
    dotColor: '#e11d48',
    darkBgClass: 'dark:bg-rose-950/40',
    darkBorderClass: 'dark:border-rose-900/60',
    darkTextClass: 'dark:text-rose-200',
  },
  'Masa Pengenalan Lingkungan Sekolah': {
    label: 'Masa Pengenalan Lingkungan Sekolah',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-900',
    dotColor: '#d97706',
    darkBgClass: 'dark:bg-amber-950/40',
    darkBorderClass: 'dark:border-amber-900/60',
    darkTextClass: 'dark:text-amber-200',
  },
  'Parenting': {
    label: 'Parenting',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
    textClass: 'text-blue-900',
    dotColor: '#2563eb',
    darkBgClass: 'dark:bg-blue-950/40',
    darkBorderClass: 'dark:border-blue-900/60',
    darkTextClass: 'dark:text-blue-200',
  },
  'Lomba HUT RI': {
    label: 'Lomba HUT RI',
    bgClass: 'bg-red-50',
    borderClass: 'border-red-200',
    textClass: 'text-red-900',
    dotColor: '#dc2626',
    darkBgClass: 'dark:bg-red-950/40',
    darkBorderClass: 'dark:border-red-900/60',
    darkTextClass: 'dark:text-red-200',
  },
  'Kegiatan Sekolah': {
    label: 'Kegiatan Sekolah',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
    textClass: 'text-emerald-900',
    dotColor: '#16a34a',
    darkBgClass: 'dark:bg-emerald-950/40',
    darkBorderClass: 'dark:border-emerald-900/60',
    darkTextClass: 'dark:text-emerald-200',
  },
  'Libur Khusus Hari Guru': {
    label: 'Libur Khusus Hari Guru',
    bgClass: 'bg-teal-50',
    borderClass: 'border-teal-200',
    textClass: 'text-teal-900',
    dotColor: '#0d9488',
    darkBgClass: 'dark:bg-teal-950/40',
    darkBorderClass: 'dark:border-teal-900/60',
    darkTextClass: 'dark:text-teal-200',
  },
  'Market Day': {
    label: 'Market Day',
    bgClass: 'bg-indigo-50',
    borderClass: 'border-indigo-200',
    textClass: 'text-indigo-900',
    dotColor: '#4f46e5',
    darkBgClass: 'dark:bg-indigo-950/40',
    darkBorderClass: 'dark:border-indigo-900/60',
    darkTextClass: 'dark:text-indigo-200',
  },
  'Hari Raya Nasional': {
    label: 'Hari Raya Nasional',
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-200',
    textClass: 'text-purple-900',
    dotColor: '#9333ea',
    darkBgClass: 'dark:bg-purple-950/40',
    darkBorderClass: 'dark:border-purple-900/60',
    darkTextClass: 'dark:text-purple-200',
  },
  'Libur Semester': {
    label: 'Libur Semester',
    bgClass: 'bg-sky-50',
    borderClass: 'border-sky-200',
    textClass: 'text-sky-900',
    dotColor: '#0284c7',
    darkBgClass: 'dark:bg-sky-950/40',
    darkBorderClass: 'dark:border-sky-900/60',
    darkTextClass: 'dark:text-sky-200',
  },
  'Libur Ramadhan': {
    label: 'Libur Ramadhan',
    bgClass: 'bg-pink-50',
    borderClass: 'border-pink-200',
    textClass: 'text-pink-900',
    dotColor: '#db2777',
    darkBgClass: 'dark:bg-pink-950/40',
    darkBorderClass: 'dark:border-pink-900/60',
    darkTextClass: 'dark:text-pink-200',
  },
  'Libur Hari Raya': {
    label: 'Libur Hari Raya',
    bgClass: 'bg-fuchsia-50',
    borderClass: 'border-fuchsia-200',
    textClass: 'text-fuchsia-900',
    dotColor: '#c026d3',
    darkBgClass: 'dark:bg-fuchsia-950/40',
    darkBorderClass: 'dark:border-fuchsia-900/60',
    darkTextClass: 'dark:text-fuchsia-200',
  },
  'Penyerahan Siswa': {
    label: 'Penyerahan Siswa',
    bgClass: 'bg-cyan-50',
    borderClass: 'border-cyan-200',
    textClass: 'text-cyan-900',
    dotColor: '#0891b2',
    darkBgClass: 'dark:bg-cyan-950/40',
    darkBorderClass: 'dark:border-cyan-900/60',
    darkTextClass: 'dark:text-cyan-200',
  },
  'Penerimaan LHB': {
    label: 'Penerimaan LHB',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-900',
    dotColor: '#d97706',
    darkBgClass: 'dark:bg-amber-950/40',
    darkBorderClass: 'dark:border-amber-900/60',
    darkTextClass: 'dark:text-amber-200',
  },
};

export const defaultCategoryConfig: CategoryStyleConfig = {
  label: 'Lainnya',
  bgClass: 'bg-slate-50',
  borderClass: 'border-slate-200',
  textClass: 'text-slate-900',
  dotColor: '#64748b',
  darkBgClass: 'dark:bg-slate-950/40',
  darkBorderClass: 'dark:border-slate-800/60',
  darkTextClass: 'dark:text-slate-200',
};

/**
 * Mendapatkan konfigurasi gaya semantic WCAG AA untuk suatu kategori
 */
export function getCategoryConfig(kategori?: string | null): CategoryStyleConfig {
  if (!kategori) return defaultCategoryConfig;
  return (
    calendarCategoryConfigs[kategori] || {
      ...defaultCategoryConfig,
      label: kategori,
    }
  );
}

/**
 * Helper untuk merangkum seluruh kelas styling badge kategori yang aman untuk light & dark mode
 */
export function getCategoryBadgeClasses(kategori?: string | null): string {
  const config = getCategoryConfig(kategori);
  return `${config.bgClass} ${config.borderClass} ${config.textClass} ${config.darkBgClass || 'dark:bg-muted/40'} ${config.darkBorderClass || 'dark:border-border/60'} ${config.darkTextClass || 'dark:text-foreground/90'}`;
}

// Backward compatibility: Definisikan warna untuk setiap kategori kalender akademik
export const categoryColors: { [key: string]: string } = {
  'Libur Umum': '#fecaca', // Merah muda
  'Masa Pengenalan Lingkungan Sekolah': '#fcd34d', // Kuning
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
