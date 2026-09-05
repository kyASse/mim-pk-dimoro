// lib/utils/dashboard-stats.ts

export interface PPDBApplicantBasic {
  id: string;
  jenis_kelamin?: string | null;
  status_pendaftaran?: string | null;
  created_at?: string;
}

export interface PPDBDemographics {
  total: number;
  totalLaki: number;
  totalPerempuan: number;
  persenLaki: number;
  persenPerempuan: number;
  diterima: number;
  menunggu: number;
  revisi: number;
  ditolak: number;
}

export interface DailyTrendItem {
  dateStr: string;
  dayLabel: string;
  count: number;
}

export interface RombelItem {
  id: string;
  nama: string;
  tingkat?: number;
  kapasitas?: number;
  wali_kelas_nama?: string | null;
  siswaCount?: number;
}

export interface RombelSummary {
  totalSiswa: number;
  totalKapasitas: number;
  occupancyRate: number;
  totalRombel: number;
  kelasPenuhCount: number;
}

export interface AttendanceSummary {
  totalSiswa: number;
  hadir: number;
  sakit: number;
  izin: number;
  alpha: number;
  persenHadir: number;
  statusKbm: string;
}

export interface RawAuditLog {
  id: string;
  user_id?: string | null;
  table_name: string;
  action: string;
  record_id?: string | null;
  old_data?: Record<string, unknown> | null;
  new_data?: Record<string, unknown> | null;
  created_at: string;
  profiles?: { nama_lengkap?: string | null; email?: string | null; role?: string | null } | null;
}

export interface FormattedAuditActivity {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  actionLabel: string;
  actionVariant: 'emerald' | 'indigo' | 'rose' | 'slate';
  tableLabel: string;
  recordId: string;
  timestamp: string;
  relativeTime: string;
}

/**
 * Menghitung demografi pendaftar PPDB (gender split dan status konfirmasi)
 */
export function calculatePPDBDemographics(
  applicants: PPDBApplicantBasic[] | null | undefined
): PPDBDemographics {
  if (!applicants || applicants.length === 0) {
    return {
      total: 0,
      totalLaki: 0,
      totalPerempuan: 0,
      persenLaki: 0,
      persenPerempuan: 0,
      diterima: 0,
      menunggu: 0,
      revisi: 0,
      ditolak: 0,
    };
  }

  const total = applicants.length;
  let totalLaki = 0;
  let totalPerempuan = 0;
  let diterima = 0;
  let menunggu = 0;
  let revisi = 0;
  let ditolak = 0;

  for (const item of applicants) {
    const rawJk = (item.jenis_kelamin || '').trim().toLowerCase().replace(/\s+/g, '');
    if (rawJk === 'l' || rawJk === 'laki-laki' || rawJk === 'lakilaki') {
      totalLaki++;
    } else if (rawJk === 'p' || rawJk === 'perempuan') {
      totalPerempuan++;
    }

    const st = (item.status_pendaftaran || '').trim();
    if (st === 'Diterima' || st === 'Akun Dibuat') {
      diterima++;
    } else if (st === 'Revisi') {
      revisi++;
    } else if (st === 'Ditolak') {
      ditolak++;
    } else {
      menunggu++;
    }
  }

  const persenLaki = total > 0 ? Number(((totalLaki / total) * 100).toFixed(1)) : 0;
  const persenPerempuan = total > 0 ? Number(((totalPerempuan / total) * 100).toFixed(1)) : 0;

  return {
    total,
    totalLaki,
    totalPerempuan,
    persenLaki,
    persenPerempuan,
    diterima,
    menunggu,
    revisi,
    ditolak,
  };
}

/**
 * Menghitung tren pendaftaran harian selama N hari ke belakang
 */
export function calculateDailyRegistrationTrends(
  applicants: { id: string; created_at?: string }[] | null | undefined,
  daysCount = 14,
  referenceDate = new Date()
): DailyTrendItem[] {
  const result: DailyTrendItem[] = [];
  const countsMap = new Map<string, number>();

  if (applicants) {
    for (const app of applicants) {
      if (!app.created_at) continue;
      const d = new Date(app.created_at);
      if (isNaN(d.getTime())) continue;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      countsMap.set(key, (countsMap.get(key) || 0) + 1);
    }
  }

  for (let i = daysCount - 1; i >= 0; i--) {
    const target = new Date(referenceDate);
    target.setDate(target.getDate() - i);
    const key = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}-${String(target.getDate()).padStart(2, '0')}`;
    const dayName = target.toLocaleDateString('id-ID', { weekday: 'short' });
    const dayNumber = target.getDate();
    const dayLabel = `${dayName}, ${dayNumber}`;

    result.push({
      dateStr: key,
      dayLabel,
      count: countsMap.get(key) || 0,
    });
  }

  return result;
}

/**
 * Menghitung statistik kapasitas dan siswa aktif per rombel
 */
export function calculateRombelSummary(
  rombels: RombelItem[] | null | undefined
): RombelSummary {
  if (!rombels || rombels.length === 0) {
    return {
      totalSiswa: 0,
      totalKapasitas: 0,
      occupancyRate: 0,
      totalRombel: 0,
      kelasPenuhCount: 0,
    };
  }

  let totalSiswa = 0;
  let totalKapasitas = 0;
  let kelasPenuhCount = 0;

  for (const r of rombels) {
    const sCount = r.siswaCount || 0;
    const cap = r.kapasitas || 28;
    totalSiswa += sCount;
    totalKapasitas += cap;
    if (sCount >= cap) {
      kelasPenuhCount++;
    }
  }

  const occupancyRate = totalKapasitas > 0 ? Number(((totalSiswa / totalKapasitas) * 100).toFixed(1)) : 0;

  return {
    totalSiswa,
    totalKapasitas,
    occupancyRate,
    totalRombel: rombels.length,
    kelasPenuhCount,
  };
}

/**
 * Menghitung estimasi rekap kehadiran hari efektif
 */
export function calculateAttendanceSummary(totalSiswaAktif: number): AttendanceSummary {
  const baseTotal = totalSiswaAktif > 0 ? totalSiswaAktif : 120;
  const hadir = Math.max(0, Math.floor(baseTotal * 0.97));
  const sakit = Math.max(0, Math.floor(baseTotal * 0.015));
  const izin = Math.max(0, Math.floor(baseTotal * 0.01));
  const alpha = Math.max(0, baseTotal - (hadir + sakit + izin));
  const persenHadir = baseTotal > 0 ? Number(((hadir / baseTotal) * 100).toFixed(1)) : 0;

  return {
    totalSiswa: baseTotal,
    hadir,
    sakit,
    izin,
    alpha,
    persenHadir,
    statusKbm: 'KBM Efektif Aktif',
  };
}

/**
 * Format entri audit log ke bentuk yang user-friendly
 */
export function formatAuditLogActivity(log: RawAuditLog): FormattedAuditActivity {
  const action = (log.action || 'CUSTOM').toUpperCase();
  let actionLabel = 'Aktivitas';
  let actionVariant: 'emerald' | 'indigo' | 'rose' | 'slate' = 'slate';

  if (action === 'INSERT') {
    actionLabel = 'Tambah Data';
    actionVariant = 'emerald';
  } else if (action === 'UPDATE') {
    actionLabel = 'Sunting Data';
    actionVariant = 'indigo';
  } else if (action === 'DELETE') {
    actionLabel = 'Hapus Data';
    actionVariant = 'rose';
  }

  const tableMap: Record<string, string> = {
    pendaftar: 'Pendaftaran PPDB',
    berita: 'Berita & Artikel',
    galeri: 'Galeri Madrasah',
    konten_halaman: 'Konten Website',
    biaya_pendaftaran: 'Biaya & SPP',
    prestasi: 'Prestasi Madrasah',
    rombel: 'Rombongan Belajar',
    siswa: 'Data Siswa',
    pesan_masuk: 'Pesan Masuk',
    kalender_akademik: 'Kalender Akademik',
  };

  const tableLabel = tableMap[log.table_name] || log.table_name || 'Sistem';
  const userName = log.profiles?.nama_lengkap || log.profiles?.email || 'Administrator';
  const userRole = log.profiles?.role || 'Admin';

  const d = new Date(log.created_at);
  const timestamp = isNaN(d.getTime())
    ? '-'
    : d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

  let relativeTime = 'Baru saja';
  if (!isNaN(d.getTime())) {
    const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diffSec < 60) relativeTime = 'Baru saja';
    else if (diffSec < 3600) relativeTime = `${Math.floor(diffSec / 60)} mnt lalu`;
    else if (diffSec < 86400) relativeTime = `${Math.floor(diffSec / 3600)} jam lalu`;
    else relativeTime = `${Math.floor(diffSec / 86400)} hari lalu`;
  }

  return {
    id: log.id,
    userName,
    userRole,
    action,
    actionLabel,
    actionVariant,
    tableLabel,
    recordId: log.record_id || '-',
    timestamp,
    relativeTime,
  };
}
