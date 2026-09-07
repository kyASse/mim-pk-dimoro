// components/admin/dashboard/DashboardMetricCards.tsx
import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  School, 
  CheckCircle2, 
  MessageSquare, 
  ArrowUpRight
} from 'lucide-react';
import { 
  PPDBDemographics, 
  RombelSummary, 
  AttendanceSummary 
} from '@/lib/utils/dashboard-stats';

interface DashboardMetricCardsProps {
  ppdbStats: PPDBDemographics;
  rombelSummary: RombelSummary;
  attendanceSummary: AttendanceSummary;
  pesanBelumDibalas: number;
  totalPesan: number;
}

export default function DashboardMetricCards({
  ppdbStats,
  rombelSummary,
  attendanceSummary,
  pesanBelumDibalas,
  totalPesan,
}: DashboardMetricCardsProps) {
  return (
    <section aria-label="Metrik Performa Utama" className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KARTU 1: PPDB */}
        <div className="group relative p-1.5 rounded-2xl bg-gradient-to-b from-gray-100/90 to-gray-200/50 dark:from-zinc-800/80 dark:to-zinc-900/60 ring-1 ring-black/5 dark:ring-white/10 shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="h-full flex flex-col justify-between p-4 sm:p-5 rounded-[calc(1rem-2px)] bg-white dark:bg-zinc-900/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center ring-1 ring-emerald-500/20">
                  <Users className="w-5 h-5" />
                </div>
                <Link
                  href="/admin/pendaftar"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
                >
                  <span>Detail</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Total Pendaftar PPDB
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    {ppdbStats.total}
                  </span>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Siswa Baru
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {ppdbStats.diterima} Diterima
              </span>
              <span className="text-gray-500 dark:text-gray-400 font-medium">
                {ppdbStats.menunggu} Menunggu
              </span>
            </div>
          </div>
        </div>

        {/* KARTU 2: SISWA AKTIF & ROMBEL */}
        <div className="group relative p-1.5 rounded-2xl bg-gradient-to-b from-gray-100/90 to-gray-200/50 dark:from-zinc-800/80 dark:to-zinc-900/60 ring-1 ring-black/5 dark:ring-white/10 shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="h-full flex flex-col justify-between p-4 sm:p-5 rounded-[calc(1rem-2px)] bg-white dark:bg-zinc-900/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center ring-1 ring-blue-500/20">
                  <School className="w-5 h-5" />
                </div>
                <Link
                  href="/admin/siswa"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                >
                  <span>Rombel</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Total Siswa Aktif
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    {rombelSummary.totalSiswa}
                  </span>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Siswa Terdaftar
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-300 font-medium">
                {rombelSummary.totalRombel} Rombel (1A - 6B)
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                {rombelSummary.occupancyRate}% Terisi
              </span>
            </div>
          </div>
        </div>

        {/* KARTU 3: KEHADIRAN HARI INI */}
        <div className="group relative p-1.5 rounded-2xl bg-gradient-to-b from-gray-100/90 to-gray-200/50 dark:from-zinc-800/80 dark:to-zinc-900/60 ring-1 ring-black/5 dark:ring-white/10 shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="h-full flex flex-col justify-between p-4 sm:p-5 rounded-[calc(1rem-2px)] bg-white dark:bg-zinc-900/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center ring-1 ring-indigo-500/20">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                  {attendanceSummary.statusKbm}
                </span>
              </div>

              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Rekap Kehadiran Hari Ini
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    {attendanceSummary.persenHadir}%
                  </span>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Tingkat Presensi
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {attendanceSummary.hadir} Hadir
              </span>
              <span>
                {attendanceSummary.sakit + attendanceSummary.izin} Sakit/Izin
              </span>
              <span>
                {attendanceSummary.alpha} Alpha
              </span>
            </div>
          </div>
        </div>

        {/* KARTU 4: PESAN MASUK BELUM DIBALAS */}
        <div className="group relative p-1.5 rounded-2xl bg-gradient-to-b from-gray-100/90 to-gray-200/50 dark:from-zinc-800/80 dark:to-zinc-900/60 ring-1 ring-black/5 dark:ring-white/10 shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="h-full flex flex-col justify-between p-4 sm:p-5 rounded-[calc(1rem-2px)] bg-white dark:bg-zinc-900/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ring-1 ${
                  pesanBelumDibalas > 0 
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 ring-amber-500/20' 
                    : 'bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 ring-gray-200 dark:ring-zinc-700'
                }`}>
                  <MessageSquare className="w-5 h-5" />
                </div>
                <Link
                  href="/admin/pesan"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400 transition-colors"
                >
                  <span>Kotak Masuk</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Pesan Belum Dibalas
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className={`text-3xl font-extrabold tracking-tight ${
                    pesanBelumDibalas > 0 
                      ? 'text-amber-600 dark:text-amber-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {pesanBelumDibalas}
                  </span>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Pesan Baru
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
              <span className={`font-semibold ${
                pesanBelumDibalas > 0 
                  ? 'text-amber-600 dark:text-amber-400' 
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                {pesanBelumDibalas > 0 ? 'Perlu Respon' : 'Semua Terbalas'}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                Total {totalPesan} Pesan
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
