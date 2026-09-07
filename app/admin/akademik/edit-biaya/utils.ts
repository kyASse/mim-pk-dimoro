export interface BiayaItemRow {
  id: number;
  komponen_biaya: string | null;
  biaya_putra: number | null;
  biaya_putri: number | null;
}

/**
 * Formats a number to Indonesian Rupiah thousand separator format (e.g. 500000 -> "500.000")
 */
export function formatRupiah(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  const rounded = Math.max(0, Math.round(value));
  return rounded.toLocaleString('id-ID');
}

/**
 * Parses raw input string or number into a clean non-negative integer
 */
export function parseRupiah(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') {
    return isNaN(value) ? 0 : Math.max(0, Math.round(value));
  }
  const str = value.toString().trim();
  if (str.startsWith('-')) return 0;
  const cleaned = str.replace(/[^0-9]/g, '');
  if (!cleaned) return 0;
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
}

export interface BiayaTotals {
  totalPutra: number;
  totalPutri: number;
  diff: number;
  formattedTotalPutra: string;
  formattedTotalPutri: string;
  formattedDiff: string;
}

/**
 * Calculates sum of Putra, Putri, and absolute difference
 */
export function calculateTotals(items: BiayaItemRow[]): BiayaTotals {
  let totalPutra = 0;
  let totalPutri = 0;

  for (const item of items) {
    if (!item) continue;
    totalPutra += parseRupiah(item.biaya_putra);
    totalPutri += parseRupiah(item.biaya_putri);
  }

  const diff = totalPutri - totalPutra;

  return {
    totalPutra,
    totalPutri,
    diff,
    formattedTotalPutra: `Rp ${formatRupiah(totalPutra)}`,
    formattedTotalPutri: `Rp ${formatRupiah(totalPutri)}`,
    formattedDiff: diff !== 0 ? `Rp ${formatRupiah(Math.abs(diff))}` : 'Rp 0',
  };
}
