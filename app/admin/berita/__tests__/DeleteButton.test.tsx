import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteButton from '../DeleteButton';
import { toast } from 'sonner';
import * as actions from '../actions';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../actions', () => ({
  deleteBeritaAction: vi.fn(),
}));

describe('DeleteButton (app/admin/berita/DeleteButton.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders trigger button properly', () => {
    render(<DeleteButton beritaId={1} imageUrl="https://test.com/img.jpg" />);
    const trigger = screen.getByRole('button', { name: /hapus/i });
    expect(trigger).toBeDefined();
  });

  it('opens confirmation alert dialog when trigger button is clicked', async () => {
    render(<DeleteButton beritaId={1} imageUrl="https://test.com/img.jpg" />);
    const trigger = screen.getByRole('button', { name: /hapus/i });
    fireEvent.click(trigger);

    expect(await screen.findByText('Hapus Berita?')).toBeDefined();
    expect(
      screen.getByText(/Apakah Anda yakin ingin menghapus berita ini secara permanen/i)
    ).toBeDefined();
    expect(screen.getByRole('button', { name: /Batal/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Ya, Hapus/i })).toBeDefined();
  });

  it('calls deleteBeritaAction and shows success toast upon confirmation', async () => {
    vi.mocked(actions.deleteBeritaAction).mockResolvedValueOnce({
      success: true,
      message: 'Berita berhasil dihapus',
    });

    render(<DeleteButton beritaId={42} imageUrl="https://test.com/img42.jpg" />);
    const trigger = screen.getByRole('button', { name: /hapus/i });
    fireEvent.click(trigger);

    const confirmBtn = await screen.findByRole('button', { name: /Ya, Hapus/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(actions.deleteBeritaAction).toHaveBeenCalledWith(42, 'https://test.com/img42.jpg');
      expect(toast.success).toHaveBeenCalledWith('Berita berhasil dihapus!');
    });
  });

  it('handles error when deleteBeritaAction fails', async () => {
    vi.mocked(actions.deleteBeritaAction).mockResolvedValueOnce({
      success: false,
      message: 'Gagal menghapus berita dari database',
    });

    render(<DeleteButton beritaId={42} imageUrl="https://test.com/img42.jpg" />);
    const trigger = screen.getByRole('button', { name: /hapus/i });
    fireEvent.click(trigger);

    const confirmBtn = await screen.findByRole('button', { name: /Ya, Hapus/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(actions.deleteBeritaAction).toHaveBeenCalledWith(42, 'https://test.com/img42.jpg');
      expect(toast.error).toHaveBeenCalledWith('Gagal menghapus berita dari database');
    });
  });
});
