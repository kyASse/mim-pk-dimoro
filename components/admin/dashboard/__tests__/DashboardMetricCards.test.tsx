import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DashboardMetricCards from '../DashboardMetricCards';

describe('DashboardMetricCards Component', () => {
  const sampleProps = {
    ppdbStats: {
      total: 48,
      diterima: 30,
      menunggu: 15,
      revisi: 2,
      ditolak: 1,
      totalLaki: 26,
      totalPerempuan: 22,
      persenLaki: 54.2,
      persenPerempuan: 45.8,
    },
    rombelSummary: {
      totalSiswa: 312,
      totalKapasitas: 336,
      occupancyRate: 92.8,
      totalRombel: 12,
      kelasPenuhCount: 4,
    },
    attendanceSummary: {
      totalSiswa: 312,
      hadir: 303,
      sakit: 5,
      izin: 3,
      alpha: 1,
      persenHadir: 97.1,
      statusKbm: 'KBM Efektif Aktif',
    },
    pesanBelumDibalas: 3,
    totalPesan: 24,
  };

  it('renders all 4 primary metric cards with accurate data', () => {
    render(<DashboardMetricCards {...sampleProps} />);

    // Card 1: PPDB
    expect(screen.getByText('Total Pendaftar PPDB')).toBeInTheDocument();
    expect(screen.getByText('48')).toBeInTheDocument();
    expect(screen.getByText(/30 Diterima/i)).toBeInTheDocument();

    // Card 2: Siswa Aktif
    expect(screen.getByText('Total Siswa Aktif')).toBeInTheDocument();
    expect(screen.getByText('312')).toBeInTheDocument();
    expect(screen.getByText(/12 Rombel/i)).toBeInTheDocument();

    // Card 3: Kehadiran Hari Ini
    expect(screen.getByText('Rekap Kehadiran Hari Ini')).toBeInTheDocument();
    expect(screen.getByText('97.1%')).toBeInTheDocument();
    expect(screen.getByText(/303 Hadir/i)).toBeInTheDocument();

    // Card 4: Pesan Belum Dibalas
    expect(screen.getByText('Pesan Belum Dibalas')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText(/Perlu Respon/i)).toBeInTheDocument();
  });

  it('handles 0 unread messages state gracefully', () => {
    render(<DashboardMetricCards {...sampleProps} pesanBelumDibalas={0} />);
    expect(screen.getByText('Semua Terbalas')).toBeInTheDocument();
  });
});
