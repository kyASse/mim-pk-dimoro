import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import TambahGaleriPage from '../page';

// Mock GaleriUploadForm
vi.mock('@/components/admin/galeri/GaleriUploadForm', () => ({
  default: () => <div data-testid="galeri-upload-form">GaleriUploadForm Mock</div>,
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('TambahGaleriPage Component', () => {
  it('renders breadcrumbs, title, back link, and GaleriUploadForm', () => {
    render(<TambahGaleriPage />);

    expect(screen.getByText('Dasbor')).toBeDefined();
    expect(screen.getByText('Galeri Foto')).toBeDefined();
    expect(screen.getByText('Studio Unggah Foto')).toBeDefined();
    expect(screen.getByText('Kembali')).toBeDefined();
    expect(screen.getByTestId('galeri-upload-form')).toBeDefined();
  });
});
