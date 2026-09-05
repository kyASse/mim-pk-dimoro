import * as XLSX from 'xlsx';

export const EMIS_DAPODIK_HEADERS = [
  'No',
  'ID Registrasi',
  'NIK / No. Induk',
  'Nama Lengkap Siswa',
  'Nama Panggilan',
  'Jenis Kelamin',
  'Tempat Lahir',
  'Tanggal Lahir',
  'Agama',
  'Kewarganegaraan',
  'Anak Ke',
  'Jumlah Saudara',
  'Status Anak',
  'Bahasa Sehari-hari',
  'Berat Badan (kg)',
  'Tinggi Badan (cm)',
  'Golongan Darah',
  'Asal TK/RA',
  'Kebutuhan Khusus',
  'Alamat Lengkap Siswa',
  'Jarak ke Madrasah',
  'Transportasi',
  'No. Telepon / WhatsApp',
  'Email Orang Tua',
  'Nama Ayah Kandung',
  'Pendidikan Ayah',
  'Pekerjaan Ayah',
  'Nama Ibu Kandung',
  'Pendidikan Ibu',
  'Pekerjaan Ibu',
  'Penghasilan Orang Tua',
  'Alamat Orang Tua',
  'Nama Wali',
  'Hubungan Wali',
  'Pendidikan Wali',
  'Pekerjaan Wali',
  'No. Telepon Wali',
  'Alamat Wali',
  'Hobi',
  'Cita-cita',
  'Status Pendaftaran',
  'Diterima di Kelas',
  'Tanggal Diterima',
  'Tanggal Pendaftaran',
];

export function prepareEmisDapodikRows(
  pendaftarList: Array<Record<string, any>>,
  regIdMap: Map<string, string>
): Array<Array<string | number>> {
  return pendaftarList.map((item, index) => {
    const regId = regIdMap.get(item.id) || `MIM-2026-${String(index + 1).padStart(3, '0')}`;
    const gender =
      item.jenis_kelamin === 'L'
        ? 'Laki-laki'
        : item.jenis_kelamin === 'P'
        ? 'Perempuan'
        : item.jenis_kelamin || '-';

    const tglLahirFormatted = item.tanggal_lahir
      ? new Date(item.tanggal_lahir).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : '-';

    const tglDaftarFormatted = item.created_at
      ? new Date(item.created_at).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : '-';

    const tglDiterimaFormatted = item.diterima_pada_tanggal
      ? new Date(item.diterima_pada_tanggal).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : '-';

    let kebutuhanKhususText = 'Tidak Ada';
    if (item.memiliki_kebutuhan_khusus) {
      const list = Array.isArray(item.jenis_kebutuhan_khusus)
        ? item.jenis_kebutuhan_khusus
        : typeof item.jenis_kebutuhan_khusus === 'string'
        ? JSON.parse(item.jenis_kebutuhan_khusus || '[]')
        : [];
      kebutuhanKhususText = list.length > 0 ? list.join(', ') : 'Ada (Belum dirinci)';
    }

    return [
      index + 1,
      regId,
      item.nomor_induk || '-',
      item.nama_lengkap || '-',
      item.nama_panggilan || '-',
      gender,
      item.tempat_lahir || '-',
      tglLahirFormatted,
      item.agama || 'Islam',
      item.kewarganegaraan || 'WNI',
      item.anak_ke ?? '-',
      item.jumlah_saudara_kandung ?? '-',
      item.status_anak || '-',
      item.bahasa_sehari_hari || '-',
      item.berat_badan ?? '-',
      item.tinggi_badan ?? '-',
      item.golongan_darah || '-',
      item.tk_asal || '-',
      kebutuhanKhususText,
      item.alamat_lengkap || '-',
      item.jarak_tempat_tinggal || '-',
      item.transportasi || '-',
      item.nomor_telepon || '-',
      item.email || '-',
      item.nama_ayah_kandung || '-',
      item.pendidikan_ayah || '-',
      item.pekerjaan_ayah || '-',
      item.nama_ibu_kandung || '-',
      item.pendidikan_ibu || '-',
      item.pekerjaan_ibu || '-',
      item.gaji_orang_tua || '-',
      item.alamat_orang_tua || '-',
      item.wali_nama || '-',
      item.wali_hubungan || '-',
      item.wali_pendidikan || '-',
      item.wali_pekerjaan || '-',
      item.wali_telepon || '-',
      item.wali_alamat || '-',
      item.hobi || '-',
      item.cita_cita || '-',
      item.status_pendaftaran || 'Menunggu Persetujuan',
      item.diterima_di_kelas || '-',
      tglDiterimaFormatted,
      tglDaftarFormatted,
    ];
  });
}

export function exportToExcelEmisDapodik(
  pendaftarList: Array<Record<string, any>>,
  regIdMap: Map<string, string>,
  filenamePrefix = 'data_ppdb_emis_dapodik_mim_pk_dimoro'
) {
  if (pendaftarList.length === 0) return;

  const rows = prepareEmisDapodikRows(pendaftarList, regIdMap);
  const data = [EMIS_DAPODIK_HEADERS, ...rows];

  const ws = XLSX.utils.aoa_to_sheet(data);

  // Auto-width adjustment for columns
  const colWidths = EMIS_DAPODIK_HEADERS.map((header) => ({
    wch: Math.max(header.length + 4, 15),
  }));
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data PPDB EMIS 4.0');

  const today = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `${filenamePrefix}_${today}.xlsx`);
}
