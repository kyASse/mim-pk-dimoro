import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DashboardCharts from '../DashboardCharts';

describe('DashboardCharts Component', () => {
  const sampleTrends = [
    { dateStr: '2026-08-28', dayLabel: 'Jum, 28', count: 3 },
    { dateStr: '2026-08-29', dayLabel: 'Sab, 29', count: 5 },
    { dateStr: '2026-08-30', dayLabel: 'Min, 30', count: 8 },
  ];

  const sampleDemographics = {
    total: 40,
    totalLaki: 22,
    totalPerempuan: 18,
    persenLaki: 55,
    persenPerempuan: 45,
    diterima: 25,
    menunggu: 12,
    revisi: 2,
    ditolak: 1,
  };

  it('renders daily trend chart and gender proportion comparison', () => {
    render(<DashboardCharts trends={sampleTrends} demographics={sampleDemographics} />);

    expect(screen.getByText('Tren Pendaftaran PPDB')).toBeInTheDocument();
    expect(screen.getByText('Perbandingan Gender Siswa & Siswi')).toBeInTheDocument();
    expect(screen.getByText(/22 Siswa/i)).toBeInTheDocument();
    expect(screen.getByText(/18 Siswi/i)).toBeInTheDocument();
    expect(screen.getByText('55%')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  it('handles empty trends or zero demographic data smoothly', () => {
    const emptyDemographics = {
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

    render(<DashboardCharts trends={[]} demographics={emptyDemographics} />);
    expect(screen.getByText('Tren Pendaftaran PPDB')).toBeInTheDocument();
    expect(screen.getByText('Perbandingan Gender Siswa & Siswi')).toBeInTheDocument();
  });
});
