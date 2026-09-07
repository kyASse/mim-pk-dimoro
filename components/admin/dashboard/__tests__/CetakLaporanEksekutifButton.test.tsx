import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CetakLaporanEksekutifButton from '../CetakLaporanEksekutifButton';

describe('CetakLaporanEksekutifButton Component', () => {
  const sampleReportData = {
    ppdbDemographics: {
      total: 50,
      diterima: 35,
      menunggu: 10,
      revisi: 3,
      ditolak: 2,
      totalLaki: 28,
      totalPerempuan: 22,
      persenLaki: 56,
      persenPerempuan: 44,
    },
    rombels: [
      { id: '1', nama: 'Kelas 1A', tingkat: 1, kapasitas: 28, wali_kelas_nama: 'Ustz. Siti Rahmawati', siswaCount: 26 },
      { id: '2', nama: 'Kelas 1B', tingkat: 1, kapasitas: 28, wali_kelas_nama: 'Ustz. Nur Hidayah', siswaCount: 28 },
    ],
    rombelSummary: {
      totalSiswa: 54,
      totalKapasitas: 56,
      occupancyRate: 96.4,
      totalRombel: 2,
      kelasPenuhCount: 1,
    },
    attendanceSummary: {
      totalSiswa: 54,
      hadir: 52,
      sakit: 1,
      izin: 1,
      alpha: 0,
      persenHadir: 96.3,
      statusKbm: 'KBM Efektif Aktif',
    },
    pesanStats: {
      total: 18,
      belumDibaca: 2,
    },
  };

  it('renders print trigger button and calls window.print on click', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    render(<CetakLaporanEksekutifButton data={sampleReportData} />);

    const button = screen.getByRole('button', { name: /Cetak Laporan Eksekutif/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });

  it('renders official print dossier elements: Kop Surat, Rombel table, and Madrasah Principal signature', () => {
    render(<CetakLaporanEksekutifButton data={sampleReportData} />);

    expect(screen.getByText(/LAPORAN EKSEKUTIF STATISTIK & PERKEMBANGAN MADRASAH/i)).toBeInTheDocument();
    expect(screen.getByText(/MAJELIS PENDIDIKAN DASAR DAN MENENGAH/i)).toBeInTheDocument();
    expect(screen.getByText(/MADRASAH IBTIDAIYAH MUHAMMADIYAH \( MIM \) DIMORO/i)).toBeInTheDocument();
    expect(screen.getByText(/Kepala Madrasah MIM PK Dimoro/i)).toBeInTheDocument();
    expect(screen.getByText('Ustz. Siti Rahmawati')).toBeInTheDocument();
  });
});
