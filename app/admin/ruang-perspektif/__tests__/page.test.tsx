import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminRuangPerspektifPage from '../page';
import * as service from '@/lib/services/ruang-perspektif';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock OpiniAdminTable
vi.mock('@/components/admin/ruang-perspektif/OpiniAdminTable', () => ({
  default: ({ items }: { items: any[] }) => (
    <div data-testid="mock-opini-table" data-count={items.length}>
      Mock OpiniAdminTable ({items.length} items)
    </div>
  ),
}));

describe('AdminRuangPerspektifPage (app/admin/ruang-perspektif/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders breadcrumbs, header, public link shortcut, and OpiniAdminTable', async () => {
    const mockOpinions = [
      { id: 'op-1', judul: 'Opini 1', status: 'terbit' },
      { id: 'op-2', judul: 'Opini 2', status: 'menunggu_kurasi' },
    ];

    vi.spyOn(service, 'getAdminOpinions').mockResolvedValueOnce(mockOpinions as any);

    const jsx = await AdminRuangPerspektifPage();
    render(jsx as React.ReactElement);

    expect(screen.getByText('Meja Redaksi Ruang Perspektif')).toBeDefined();
    expect(screen.getByRole('link', { name: /Lihat Halaman Publik/i })).toBeDefined();

    const tableEl = screen.getByTestId('mock-opini-table');
    expect(tableEl).toBeDefined();
    expect(tableEl.getAttribute('data-count')).toBe('2');
  });
});
