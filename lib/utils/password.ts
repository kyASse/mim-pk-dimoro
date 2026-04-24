export function buildInitialParentPasswordFromDOB(dobISO: string | Date): string {
  const d = new Date(dobISO);
  if (Number.isNaN(d.getTime())) throw new Error('Tanggal lahir tidak valid');
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = String(d.getFullYear());
  return `${dd}${mm}${yyyy}`; // contoh: 02092015
}
