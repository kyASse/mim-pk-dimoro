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
      expect(updateBiayaAndSppAction).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Data rincian biaya dan catatan SPP berhasil diperbarui.');
    });
  });
});
