import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DashboardAuditFeed from '../DashboardAuditFeed';
import { FormattedAuditActivity } from '@/lib/utils/dashboard-stats';

describe('DashboardAuditFeed Component', () => {
  const sampleActivities: FormattedAuditActivity[] = [
    {
      id: 'log-1',
      userName: 'Ust. Ahmad Fauzi',
      userRole: 'admin',
      action: 'INSERT',
      actionLabel: 'Tambah Data',
      actionVariant: 'emerald',
      tableLabel: 'Pendaftaran PPDB',
      recordId: 'pnd-99',
      timestamp: '30 Agu 2026 09:15',
      relativeTime: '15 mnt lalu',
    },
    {
      id: 'log-2',
      userName: 'Ustz. Siti Rahmawati',
      userRole: 'admin_tu',
      action: 'UPDATE',
      actionLabel: 'Sunting Data',
      actionVariant: 'indigo',
      tableLabel: 'Rombongan Belajar',
      recordId: 'rmb-1a',
      timestamp: '30 Agu 2026 08:30',
      relativeTime: '1 jam lalu',
    },
    {
      id: 'log-3',
      userName: 'Super Admin',
      userRole: 'super_admin',
      action: 'DELETE',
      actionLabel: 'Hapus Data',
      actionVariant: 'rose',
      tableLabel: 'Berita & Artikel',
      recordId: 'news-12',
      timestamp: '29 Agu 2026 14:00',
      relativeTime: '1 hari lalu',
    },
  ];

  it('renders list of recent activities with action badges and timestamps', () => {
    render(<DashboardAuditFeed activities={sampleActivities} />);

    expect(screen.getByText('Aktivitas Terbaru Sistem')).toBeInTheDocument();
    expect(screen.getByText('Ust. Ahmad Fauzi')).toBeInTheDocument();
    expect(screen.getByText('Pendaftaran PPDB')).toBeInTheDocument();
    expect(screen.getByText('Tambah Data')).toBeInTheDocument();
    expect(screen.getByText('15 mnt lalu')).toBeInTheDocument();

    expect(screen.getByText('Ustz. Siti Rahmawati')).toBeInTheDocument();
    expect(screen.getByText('Sunting Data')).toBeInTheDocument();

    expect(screen.getByText('Super Admin')).toBeInTheDocument();
    expect(screen.getByText('Hapus Data')).toBeInTheDocument();
  });

  it('renders empty state gracefully when no audit logs exist', () => {
    render(<DashboardAuditFeed activities={[]} />);
    expect(screen.getByText(/Belum ada riwayat aktivitas audit log/i)).toBeInTheDocument();
  });
});
