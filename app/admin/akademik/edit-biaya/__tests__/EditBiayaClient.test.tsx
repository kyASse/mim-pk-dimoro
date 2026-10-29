import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditBiayaClient from '../EditBiayaClient';

vi.mock('../../actions', () => ({
  updateBiayaAndSppAction: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

import { updateBiayaAndSppAction } from '../../actions';
import { toast } from 'sonner';

const mockBiaya = [
  { id: 1, komponen_biaya: 'Pendaftaran', biaya_putra: 100000, biaya_putri: 100000 },
  { id: 2, komponen_biaya: 'Seragam', biaya_putra: 450000, biaya_putri: 550000 },
];

describe('EditBiayaClient Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders initial data and live totals correctly', () => {
    render(<EditBiayaClient initialBiaya={mockBiaya} initialCatatanSpp="Catatan SPP awal" />);

    expect(screen.getByText('Edit Rincian Keuangan')).toBeDefined();
    // Desktop and mobile totals: 100k + 450k = 550k for putra, 100k + 550k = 650k for putri
    expect(screen.getAllByText('Rp 550.000').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Rp 650.000').length).toBeGreaterThan(0);
  });

  it('updates live calculations when input changes', () => {
    render(<EditBiayaClient initialBiaya={mockBiaya} initialCatatanSpp="Catatan SPP awal" />);

    // Get input for Putra in mobile card or desktop table
    const inputs = screen.getAllByDisplayValue('100.000');
    fireEvent.change(inputs[0], { target: { value: '200.000' } });

    // Now total putra should be 200k + 450k = 650k
    expect(screen.getAllByText('Rp 650.000').length).toBeGreaterThan(0);
  });

  it('saves changes successfully and triggers toast', async () => {
    vi.mocked(updateBiayaAndSppAction).mockResolvedValue({
      success: true,
      message: 'Data rincian biaya dan catatan SPP berhasil diperbarui.',
    });

    render(<EditBiayaClient initialBiaya={mockBiaya} initialCatatanSpp="Catatan SPP awal" />);

    // Change value to make dirty
    const inputs = screen.getAllByDisplayValue('100.000');
    fireEvent.change(inputs[0], { target: { value: '200.000' } });

    // Find and click save button
    const saveButtons = screen.getAllByRole('button', { name: /simpan/i });
    fireEvent.click(saveButtons[0]);

    await waitFor(() => {
      expect(updateBiayaAndSppAction).toHaveBeenCalledWith(
        expect.objectContaining({
          biaya: expect.arrayContaining([
            expect.objectContaining({
              id: 1,
              biaya_putra: 200000,
            }),
          ]),
          catatanSpp: 'Catatan SPP awal',
          deletedIds: [],
        })
      );
      expect(toast.success).toHaveBeenCalledWith('Data rincian biaya dan catatan SPP berhasil diperbarui.');
    });
  });

  it('allows adding a new fee component and saving it', async () => {
    vi.mocked(updateBiayaAndSppAction).mockResolvedValue({
      success: true,
      message: 'Data rincian biaya dan catatan SPP berhasil diperbarui.',
    });

    render(<EditBiayaClient initialBiaya={mockBiaya} initialCatatanSpp="Catatan SPP awal" />);

    // Click "+ Tambah Komponen Biaya"
    const addButtons = screen.getAllByRole('button', { name: /tambah komponen biaya/i });
    fireEvent.click(addButtons[0]);

    // Check new input with default text "Komponen Biaya Baru" exists
    const newComponentInputs = screen.getAllByDisplayValue('Komponen Biaya Baru');
    expect(newComponentInputs.length).toBeGreaterThan(0);

    // Edit the new component name
    fireEvent.change(newComponentInputs[0], { target: { value: 'Infaq Gedung' } });

    // Save
    const saveButtons = screen.getAllByRole('button', { name: /simpan/i });
    fireEvent.click(saveButtons[0]);

    await waitFor(() => {
      expect(updateBiayaAndSppAction).toHaveBeenCalledWith(
        expect.objectContaining({
          biaya: expect.arrayContaining([
            expect.objectContaining({
              komponen_biaya: 'Infaq Gedung',
              biaya_putra: 0,
              biaya_putri: 0,
            }),
          ]),
          deletedIds: [],
        })
      );
    });
  });

  it('allows deleting an item and passes deletedIds to the server action', async () => {
    vi.mocked(updateBiayaAndSppAction).mockResolvedValue({
      success: true,
      message: 'Data rincian biaya dan catatan SPP berhasil diperbarui.',
    });

    render(<EditBiayaClient initialBiaya={mockBiaya} initialCatatanSpp="Catatan SPP awal" />);

    // Click trash button on first item (id: 1)
    const deleteButtons = screen.getAllByTitle('Hapus komponen ini');
    fireEvent.click(deleteButtons[0]);

    // Save
    const saveButtons = screen.getAllByRole('button', { name: /simpan/i });
    fireEvent.click(saveButtons[0]);

    await waitFor(() => {
      expect(updateBiayaAndSppAction).toHaveBeenCalledWith(
        expect.objectContaining({
          deletedIds: [1],
        })
      );
    });
  });

  it('resets dirty state when Batalkan is clicked', () => {
    render(<EditBiayaClient initialBiaya={mockBiaya} initialCatatanSpp="Catatan SPP awal" />);

    // Modify value
    const inputs = screen.getAllByDisplayValue('100.000');
    fireEvent.change(inputs[0], { target: { value: '999.000' } });

    // "Belum Disimpan" should appear
    expect(screen.getByText('Belum Disimpan')).toBeDefined();

    // Click Batalkan
    const cancelBtn = screen.getByRole('button', { name: /batalkan/i });
    fireEvent.click(cancelBtn);

    // Value should revert and "Tersimpan" should appear
    expect(screen.getByText('Tersimpan')).toBeDefined();
    expect(toast.info).toHaveBeenCalledWith('Perubahan dibatalkan.');
  });
});
