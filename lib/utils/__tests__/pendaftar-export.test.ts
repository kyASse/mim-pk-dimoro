import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('xlsx', () => {
  const mockUtils = {
    aoa_to_sheet: vi.fn().mockReturnValue({}),
    book_new: vi.fn().mockReturnValue({}),
    book_append_sheet: vi.fn(),
  };
  return {
    default: {
      utils: mockUtils,
      writeFile: vi.fn(),
    },
    utils: mockUtils,
    writeFile: vi.fn(),
  };
});

import * as XLSX from 'xlsx';
import { prepareEmisDapodikRows, EMIS_DAPODIK_HEADERS, exportToExcelEmisDapodik } from '../pendaftar-export';

describe('pendaftar-export utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('contains all official standard EMIS 4.0 and Dapodik headers', () => {
    expect(EMIS_DAPODIK_HEADERS).toContain('No');
    expect(EMIS_DAPODIK_HEADERS).toContain('ID Registrasi');
    expect(EMIS_DAPODIK_HEADERS).toContain('NIK / No. Induk');
    expect(EMIS_DAPODIK_HEADERS).toContain('Nama Lengkap Siswa');
    expect(EMIS_DAPODIK_HEADERS).toContain('Jenis Kelamin');
    expect(EMIS_DAPODIK_HEADERS).toContain('Asal TK/RA');
    expect(EMIS_DAPODIK_HEADERS).toContain('Nama Ayah Kandung');
    expect(EMIS_DAPODIK_HEADERS).toContain('Nama Ibu Kandung');
    expect(EMIS_DAPODIK_HEADERS).toContain('No. Telepon / WhatsApp');
    expect(EMIS_DAPODIK_HEADERS).toContain('Status Pendaftaran');
  });

  it('correctly maps pendaftar data objects into row arrays matching header sequence', () => {
    const mockPendaftar = [
      {
        id: 'p-1',
        nomor_induk: '3301123456780001',
        nama_lengkap: 'Ahmad Faiz',
        nama_panggilan: 'Faiz',
        jenis_kelamin: 'L',
        tempat_lahir: 'Boyolali',
        tanggal_lahir: '2019-05-12',
        agama: 'Islam',
        kewarganegaraan: 'WNI',
        anak_ke: 1,
        jumlah_saudara_kandung: 2,
        status_anak: 'Anak Kandung',
        bahasa_sehari_hari: 'Indonesia, Jawa',
        berat_badan: 18,
        tinggi_badan: 110,
        golongan_darah: 'O',
        tk_asal: 'TK Aisyiyah Dimoro',
        memiliki_kebutuhan_khusus: false,
        alamat_lengkap: 'Dimoro, Boyolali',
        jarak_tempat_tinggal: '< 1 km',
        transportasi: 'Jalan Kaki',
        nomor_telepon: '081234567890',
        email: 'faiz@example.com',
        nama_ayah_kandung: 'Bambang Sutrisno',
        pendidikan_ayah: 'S1',
        pekerjaan_ayah: 'Guru',
        nama_ibu_kandung: 'Siti Aminah',
        pendidikan_ibu: 'D3',
        pekerjaan_ibu: 'Wiraswasta',
        gaji_orang_tua: '3.000.000 - 5.000.000',
        alamat_orang_tua: 'Dimoro RT 01 RW 02',
        wali_nama: '',
        wali_hubungan: '',
        wali_pendidikan: '',
        wali_pekerjaan: '',
        wali_telepon: '',
        wali_alamat: '',
        hobi: 'Membaca',
        cita_cita: 'Dokter',
        status_pendaftaran: 'Diterima',
        diterima_di_kelas: 'Kelas 1A',
        diterima_pada_tanggal: '2026-08-20',
        created_at: '2026-08-01T10:00:00Z',
      },
    ];

    const regIdMap = new Map([['p-1', 'MIM-2026-001']]);
    const rows = prepareEmisDapodikRows(mockPendaftar, regIdMap);

    expect(rows).toHaveLength(1);
    expect(rows[0][0]).toBe(1); // No
    expect(rows[0][1]).toBe('MIM-2026-001'); // ID Registrasi
    expect(rows[0][2]).toBe('3301123456780001'); // NIK
    expect(rows[0][3]).toBe('Ahmad Faiz'); // Nama
    expect(rows[0][5]).toBe('Laki-laki'); // Jenis Kelamin
    expect(rows[0][17]).toBe('TK Aisyiyah Dimoro'); // Asal TK
    expect(rows[0][18]).toBe('Tidak Ada'); // Kebutuhan Khusus
  });

  it('handles special needs formatting when active', () => {
    const mockPendaftar = [
      {
        id: 'p-2',
        nama_lengkap: 'Zaid',
        memiliki_kebutuhan_khusus: true,
        jenis_kebutuhan_khusus: ['Speech Delay', 'ADHD'],
      },
    ];
    const rows = prepareEmisDapodikRows(mockPendaftar, new Map());
    expect(rows[0][18]).toBe('Speech Delay, ADHD');
  });

  it('triggers XLSX.writeFile when exportToExcelEmisDapodik is executed', () => {
    const mockPendaftar = [
      {
        id: 'p-1',
        nama_lengkap: 'Ahmad Faiz',
      },
    ];
    exportToExcelEmisDapodik(mockPendaftar, new Map());
    expect(XLSX.writeFile).toHaveBeenCalled();
  });

  it('does nothing when pendaftarList is empty', () => {
    exportToExcelEmisDapodik([], new Map());
    expect(XLSX.writeFile).not.toHaveBeenCalled();
  });
});
