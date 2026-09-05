// components/admin/dashboard/CetakLaporanEksekutifButton.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, FileDown } from 'lucide-react';
import { 
  PPDBDemographics, 
  RombelItem, 
  RombelSummary, 
  AttendanceSummary 
} from '@/lib/utils/dashboard-stats';
import { SCHOOL_FULL_NAME, SCHOOL_WHATSAPP, SCHOOL_EMAIL } from '@/lib/school-config';

export interface ExecutiveReportData {
  ppdbDemographics: PPDBDemographics;
  rombels: RombelItem[];
  rombelSummary: RombelSummary;
  attendanceSummary: AttendanceSummary;
  pesanStats: {
    total: number;
    belumDibaca: number;
  };
}

interface CetakLaporanEksekutifButtonProps {
  data: ExecutiveReportData;
  className?: string;
}

export default function CetakLaporanEksekutifButton({
  data,
  className,
}: CetakLaporanEksekutifButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  const currentDateFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      {/* Tombol Trigger Cetak di UI Dasbor */}
      <Button
        type="button"
        variant="outline"
        onClick={handlePrint}
        className={`group relative flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-gray-100 font-semibold shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all duration-300 active:scale-[0.98] ${className || ''}`}
      >
        <span className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center ring-1 ring-emerald-500/20 group-hover:scale-105 transition-transform">
          <Printer className="w-4 h-4" />
        </span>
        <span className="text-xs sm:text-sm">Cetak Laporan Eksekutif</span>
        <span className="hidden sm:inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 text-[10px]">
          <FileDown className="w-3 h-3" />
        </span>
      </Button>

      {/* Embedded Global CSS khusus @media print */}
      <style>{`
        @media screen {
          .print-only-executive-dossier {
            display: none !important;
          }
        }
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 15mm 10mm 15mm;
          }
          body {
            visibility: hidden !important;
            background: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-only-executive-dossier {
            visibility: visible !important;
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            font-family: "Times New Roman", Times, serif;
            font-size: 10pt;
            line-height: 1.35;
            color: #000 !important;
          }
          .print-only-executive-dossier * {
            visibility: visible !important;
          }
        }
      `}</style>

      {/* Dokumen Dossier Resmi Khusus Cetak A4 */}
      <div className="print-only-executive-dossier">
        {/* KOP SURAT RESMI */}
        <div className="text-center pb-2 mb-3 border-b-4 border-double border-black">
          <h3 className="text-[12pt] font-bold uppercase tracking-wide leading-tight">
            MAJELIS PENDIDIKAN DASAR DAN MENENGAH
          </h3>
          <h3 className="text-[12pt] font-bold uppercase tracking-wide leading-tight">
            PIMPINAN DAERAH MUHAMMADIYAH SUKOHARJO
          </h3>
          <h2 className="text-[14pt] font-extrabold uppercase tracking-wider leading-snug my-0.5">
            MADRASAH IBTIDAIYAH MUHAMMADIYAH ( MIM ) DIMORO
          </h2>
          <p className="text-[9pt] font-semibold tracking-wider uppercase">
            STATUS TERAKREDITASI A
          </p>
          <p className="text-[8.5pt] italic text-gray-700 mt-0.5">
            Alamat: Dimoro, Sukoharjo, Jawa Tengah • Telp/WA: {SCHOOL_WHATSAPP} • Email: {SCHOOL_EMAIL}
          </p>
        </div>

        {/* JUDUL DOKUMEN LAPORAN */}
        <div className="text-center my-3">
          <h1 className="text-[13pt] font-bold uppercase tracking-wider underline">
            LAPORAN EKSEKUTIF STATISTIK & PERKEMBANGAN MADRASAH
          </h1>
          <p className="text-[9pt] font-medium text-gray-700 mt-0.5">
            Tahun Ajaran 2026/2027 • Tanggal Penerbitan: {currentDateFormatted}
          </p>
        </div>

        {/* 1. RINGKASAN EKSEKUTIF (TABEL STATISTIK UTAMA) */}
        <div className="mb-4">
          <h4 className="text-[10pt] font-bold uppercase mb-1.5 border-b border-black pb-0.5">
            I. Ringkasan Indikator Kinerja Madrasah
          </h4>
          <table className="w-full text-[9pt] border-collapse border border-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-1 text-left w-1/3">Indikator Metrik</th>
                <th className="border border-black p-1 text-center w-1/4">Nilai / Jumlah</th>
                <th className="border border-black p-1 text-left">Keterangan & Catatan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-1 font-semibold">Total Pendaftar PPDB</td>
                <td className="border border-black p-1 text-center font-bold">{data.ppdbDemographics.total} Siswa/i</td>
                <td className="border border-black p-1">
                  {data.ppdbDemographics.diterima} Diterima, {data.ppdbDemographics.menunggu} Menunggu, {data.ppdbDemographics.revisi} Revisi
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 font-semibold">Demografi Gender Pendaftar</td>
                <td className="border border-black p-1 text-center">
                  L: {data.ppdbDemographics.totalLaki} ({data.ppdbDemographics.persenLaki}%) | P: {data.ppdbDemographics.totalPerempuan} ({data.ppdbDemographics.persenPerempuan}%)
                </td>
                <td className="border border-black p-1">
                  Rasio seimbang antara calon siswa (putra) dan siswi (putri)
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 font-semibold">Total Siswa Aktif</td>
                <td className="border border-black p-1 text-center font-bold">{data.rombelSummary.totalSiswa} Siswa</td>
                <td className="border border-black p-1">
                  Tersebar pada {data.rombelSummary.totalRombel} Rombongan Belajar (Kapasitas {data.rombelSummary.occupancyRate}%)
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 font-semibold">Rekap Kehadiran Harian</td>
                <td className="border border-black p-1 text-center font-bold">{data.attendanceSummary.persenHadir}%</td>
                <td className="border border-black p-1">
                  {data.attendanceSummary.hadir} Hadir, {data.attendanceSummary.sakit + data.attendanceSummary.izin} Sakit/Izin, {data.attendanceSummary.alpha} Alpha
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 font-semibold">Layanan Pesan & Konsultasi</td>
                <td className="border border-black p-1 text-center font-bold">{data.pesanStats.total} Pesan</td>
                <td className="border border-black p-1">
                  {data.pesanStats.belumDibaca} pesan pending memerlukan tindak lanjut admin
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 2. REKAPITULASI ROMBONGAN BELAJAR */}
        <div className="mb-4">
          <h4 className="text-[10pt] font-bold uppercase mb-1.5 border-b border-black pb-0.5">
            II. Rekapitulasi Rombongan Belajar (Kelas 1A s.d. 6B)
          </h4>
          <table className="w-full text-[8.5pt] border-collapse border border-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-1 text-center w-8">No</th>
                <th className="border border-black p-1 text-left">Nama Rombel</th>
                <th className="border border-black p-1 text-left">Wali Kelas</th>
                <th className="border border-black p-1 text-center w-20">Siswa Aktif</th>
                <th className="border border-black p-1 text-center w-20">Kapasitas</th>
                <th className="border border-black p-1 text-center w-24">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.rombels.map((r, idx) => {
                const siswaCount = r.siswaCount || 0;
                const kapasitas = r.kapasitas || 28;
                const isFull = siswaCount >= kapasitas;

                return (
                  <tr key={r.id || idx}>
                    <td className="border border-black p-1 text-center">{idx + 1}</td>
                    <td className="border border-black p-1 font-semibold">{r.nama}</td>
                    <td className="border border-black p-1">{r.wali_kelas_nama || '-'}</td>
                    <td className="border border-black p-1 text-center font-bold">{siswaCount}</td>
                    <td className="border border-black p-1 text-center">{kapasitas}</td>
                    <td className="border border-black p-1 text-center">
                      {isFull ? 'Penuh (100%)' : `${Math.round((siswaCount / kapasitas) * 100)}%`}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-gray-50 font-bold">
                <td colSpan={3} className="border border-black p-1 text-right">TOTAL KESELURUHAN:</td>
                <td className="border border-black p-1 text-center">{data.rombelSummary.totalSiswa}</td>
                <td className="border border-black p-1 text-center">{data.rombelSummary.totalKapasitas}</td>
                <td className="border border-black p-1 text-center">{data.rombelSummary.occupancyRate}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 3. CATATAN PPDB & STATUS */}
        <div className="mb-5">
          <h4 className="text-[10pt] font-bold uppercase mb-1.5 border-b border-black pb-0.5">
            III. Status Seleksi Calon Siswa Baru (PPDB)
          </h4>
          <div className="grid grid-cols-4 gap-2 text-center text-[9pt]">
            <div className="border border-black p-1.5">
              <p className="font-semibold text-gray-700">Diterima</p>
              <p className="text-[12pt] font-bold">{data.ppdbDemographics.diterima}</p>
            </div>
            <div className="border border-black p-1.5">
              <p className="font-semibold text-gray-700">Menunggu Validasi</p>
              <p className="text-[12pt] font-bold">{data.ppdbDemographics.menunggu}</p>
            </div>
            <div className="border border-black p-1.5">
              <p className="font-semibold text-gray-700">Validasi Ulang (Revisi)</p>
              <p className="text-[12pt] font-bold">{data.ppdbDemographics.revisi}</p>
            </div>
            <div className="border border-black p-1.5">
              <p className="font-semibold text-gray-700">Ditolak</p>
              <p className="text-[12pt] font-bold">{data.ppdbDemographics.ditolak}</p>
            </div>
          </div>
        </div>

        {/* 4. LEMBAR PENGESAHAN KEPALA MADRASAH */}
        <div className="mt-8 flex justify-between items-start text-[9.5pt]">
          <div className="w-1/2">
            <p className="italic text-[8.5pt] text-gray-600">
              * Dokumen ini dibuat otomatis oleh Sistem Informasi Akademik Terpadu {SCHOOL_FULL_NAME}.
            </p>
          </div>
          <div className="text-center w-64">
            <p>Sukoharjo, {currentDateFormatted}</p>
            <p className="font-semibold mt-0.5">Kepala Madrasah MIM PK Dimoro,</p>
            
            <div className="h-16 flex items-center justify-center">
              <span className="text-[8.5pt] italic text-gray-400">[ Tanda Tangan & Cap Resmi ]</span>
            </div>

            <p className="font-bold underline text-[10pt]">
              Ustz. Siti Rahmawati, S.Pd.I
            </p>
            <p className="text-[8.5pt]">NBM / NIP: 19840512 201001 2 008</p>
          </div>
        </div>
      </div>
    </>
  );
}
