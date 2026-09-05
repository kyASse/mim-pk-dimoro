// components/admin/dashboard/DashboardCharts.tsx
'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users2, 
  CalendarDays, 
  ArrowRight
} from 'lucide-react';
import { DailyTrendItem, PPDBDemographics } from '@/lib/utils/dashboard-stats';
import Link from 'next/link';

interface DashboardChartsProps {
  trends: DailyTrendItem[];
  demographics: PPDBDemographics;
}

export default function DashboardCharts({
  trends,
  demographics,
}: DashboardChartsProps) {
  const [hoveredDay, setHoveredDay] = useState<DailyTrendItem | null>(null);

  const maxCount = Math.max(...trends.map((t) => t.count), 1);
  const totalInTrends = trends.reduce((acc, curr) => acc + curr.count, 0);
  const peakDay = trends.reduce(
    (prev, current) => (prev.count > current.count ? prev : current),
    trends[0] || { count: 0, dayLabel: '-' }
  );

  // Donut chart calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const lakiOffset = circumference - (demographics.persenLaki / 100) * circumference;
  const perempuanOffset = circumference - (demographics.persenPerempuan / 100) * circumference;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
      {/* CHART 1: TREN PENDAFTARAN HARIAN (8 Cols Desktop) */}
      <div className="lg:col-span-8 p-1.5 rounded-2xl bg-gradient-to-b from-gray-100/90 to-gray-200/50 dark:from-zinc-800/80 dark:to-zinc-900/60 ring-1 ring-black/5 dark:ring-white/10 shadow-sm">
        <div className="h-full flex flex-col justify-between p-4 sm:p-6 rounded-[calc(1rem-2px)] bg-white dark:bg-zinc-900/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center ring-1 ring-emerald-500/20">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Tren Pendaftaran PPDB
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Aktivitas pendaftaran siswa baru 14 hari terakhir
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Puncak: <strong className="text-gray-900 dark:text-white font-semibold">{peakDay.count} Siswa/i</strong> ({peakDay.dayLabel})
              </span>
            </div>
          </div>

          {/* Interactive Chart Area */}
          <div className="my-6">
            {trends.length === 0 ? (
              <div className="h-44 flex items-center justify-center text-xs text-gray-400">
                Belum ada data riwayat pendaftaran
              </div>
            ) : (
              <div className="w-full">
                {/* Active Tooltip Display */}
                <div className="h-6 mb-2 flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                    {hoveredDay ? hoveredDay.dayLabel : 'Arahkan kursor pada bar untuk melihat detail'}
                  </span>
                  {hoveredDay && (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded text-[11px]">
                      {hoveredDay.count} Pendaftar
                    </span>
                  )}
                </div>

                {/* SVG Bar Chart Visualization */}
                <div className="relative h-40 w-full flex items-end justify-between gap-1 sm:gap-2 pt-4 px-1">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                    <div className="border-b border-dashed border-gray-200 dark:border-zinc-800 w-full" />
                    <div className="border-b border-dashed border-gray-200 dark:border-zinc-800 w-full" />
                    <div className="border-b border-dashed border-gray-200 dark:border-zinc-800 w-full" />
                  </div>

                  {/* Bars */}
                  {trends.map((item, idx) => {
                    const heightPercent = maxCount > 0 ? Math.max((item.count / maxCount) * 100, 6) : 6;
                    const isPeak = item.count === peakDay.count && item.count > 0;
                    const isHovered = hoveredDay?.dateStr === item.dateStr;

                    return (
                      <div
                        key={item.dateStr || idx}
                        onMouseEnter={() => setHoveredDay(item)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className="relative flex-1 flex flex-col items-center h-full justify-end group/bar cursor-pointer"
                      >
                        {/* Bar Pillar */}
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 ${
                            isHovered
                              ? 'bg-emerald-500 dark:bg-emerald-400 shadow-lg shadow-emerald-500/20'
                              : isPeak
                              ? 'bg-gradient-to-t from-emerald-600 to-teal-400'
                              : item.count > 0
                              ? 'bg-emerald-500/80 hover:bg-emerald-500 dark:bg-emerald-600/70 dark:hover:bg-emerald-500'
                              : 'bg-gray-100 dark:bg-zinc-800/80'
                          }`}
                        />
                        
                        {/* Day label */}
                        <span className="mt-2 text-[9px] sm:text-[10px] font-medium text-gray-400 group-hover/bar:text-gray-900 dark:group-hover/bar:text-white transition-colors truncate max-w-[28px] text-center">
                          {item.dayLabel.split(',')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Summary */}
          <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">
              Total 14 Hari:{' '}
              <strong className="text-gray-900 dark:text-white font-semibold">
                {totalInTrends} Siswa/i
              </strong>
            </span>
            <Link
              href="/admin/pendaftar"
              className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <span>Lihat Rekap Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* CHART 2: PERBANDINGAN GENDER SISWA & SISWI (4 Cols Desktop) */}
      <div className="lg:col-span-4 p-1.5 rounded-2xl bg-gradient-to-b from-gray-100/90 to-gray-200/50 dark:from-zinc-800/80 dark:to-zinc-900/60 ring-1 ring-black/5 dark:ring-white/10 shadow-sm">
        <div className="h-full flex flex-col justify-between p-4 sm:p-6 rounded-[calc(1rem-2px)] bg-white dark:bg-zinc-900/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
          {/* Header */}
          <div className="pb-3 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center ring-1 ring-blue-500/20">
              <Users2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Perbandingan Gender Siswa &amp; Siswi
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Demografi pendaftar PPDB
              </p>
            </div>
          </div>

          {/* Donut & Progress Section */}
          <div className="my-4 flex flex-col items-center">
            {/* SVG Donut */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-gray-100 dark:stroke-zinc-800"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Putra Segment (Blue) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-blue-500 transition-all duration-700 ease-out"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={lakiOffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
                {/* Putri Segment (Rose) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-rose-500 transition-all duration-700 ease-out"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={perempuanOffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-gray-900 dark:text-white leading-none">
                  {demographics.total}
                </span>
                <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                  Total
                </span>
              </div>
            </div>

            {/* Breakdown Bars */}
            <div className="w-full mt-4 space-y-3">
              {/* Putra */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    Siswa (Laki-laki)
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {demographics.persenLaki}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${demographics.persenLaki}%` }}
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  />
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 text-right font-medium">
                  {demographics.totalLaki} Siswa
                </p>
              </div>

              {/* Putri */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    Siswi (Perempuan)
                  </span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    {demographics.persenPerempuan}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${demographics.persenPerempuan}%` }}
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  />
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 text-right font-medium">
                  {demographics.totalPerempuan} Siswi
                </p>
              </div>
            </div>
          </div>

          {/* Footer Ratio */}
          <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 text-center text-xs text-gray-500 dark:text-gray-400">
            Rasio Gender:{' '}
            <strong className="text-gray-800 dark:text-gray-200 font-semibold">
              {demographics.totalLaki} : {demographics.totalPerempuan}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
