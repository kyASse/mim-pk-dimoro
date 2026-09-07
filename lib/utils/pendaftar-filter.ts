export interface PendaftarFilterParams {
  searchQuery?: string;
  status?: string;
  gender?: string;
  startDate?: string;
  endDate?: string;
  regIdMap?: Map<string, string>;
}

export function filterPendaftarList<T extends Record<string, any>>(
  items: T[],
  filters: PendaftarFilterParams
): T[] {
  const {
    searchQuery = '',
    status = 'ALL',
    gender = '',
    startDate = '',
    endDate = '',
    regIdMap,
  } = filters;

  const query = searchQuery.trim().toLowerCase();
  const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
  const end = endDate ? new Date(`${endDate}T23:59:59.999`) : null;

  return items.filter((item) => {
    // Status filter
    if (status && status !== 'ALL') {
      const s = item.status_pendaftaran;
      if (status === 'Menunggu Persetujuan') {
        if (
          s === 'Diterima' ||
          s === 'Revisi' ||
          s === 'Validasi Ulang' ||
          s === 'Ditolak' ||
          s === 'Akun Dibuat'
        ) {
          return false;
        }
      } else if (status === 'Revisi') {
        if (s !== 'Revisi' && s !== 'Validasi Ulang') {
          return false;
        }
      } else if (s !== status) {
        return false;
      }
    }

    // Gender filter
    if (gender && item.jenis_kelamin !== gender) {
      return false;
    }

    // Date range filter
    if (item.created_at) {
      const itemDate = new Date(item.created_at);
      if (start && itemDate < start) return false;
      if (end && itemDate > end) return false;
    }

    // Search query
    if (query) {
      const nama = (item.nama_lengkap || '').toLowerCase();
      const nik = (item.nomor_induk || '').toLowerCase();
      const ayah = (item.nama_ayah_kandung || '').toLowerCase();
      const ibu = (item.nama_ibu_kandung || '').toLowerCase();
      const phone = (item.nomor_telepon || '').toLowerCase();
      const regId = regIdMap && item.id ? (regIdMap.get(item.id) || '').toLowerCase() : '';

      const matches =
        nama.includes(query) ||
        nik.includes(query) ||
        ayah.includes(query) ||
        ibu.includes(query) ||
        phone.includes(query) ||
        regId.includes(query);

      if (!matches) return false;
    }

    return true;
  });
}
