import { describe, it, expect } from 'vitest';
import { filterPendaftarList, PendaftarFilterParams } from '../pendaftar-filter';

const sampleData = [
  {
    id: '1',
    nama_lengkap: 'Muhammad Al-Fatih',
    nomor_induk: '3301123456780001',
    nama_ayah_kandung: 'Sultan Murad',
    nama_ibu_kandung: 'Huma Hatun',
    jenis_kelamin: 'L',
    status_pendaftaran: 'Menunggu Persetujuan',
    nomor_telepon: '08123456789',
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: '2',
    nama_lengkap: 'Aisyah Humaira',
    nomor_induk: '3301123456780002',
    nama_ayah_kandung: 'Abu Bakar',
    nama_ibu_kandung: 'Ummu Ruman',
    jenis_kelamin: 'P',
    status_pendaftaran: 'Diterima',
    nomor_telepon: '08987654321',
    created_at: '2026-08-10T14:00:00Z',
  },
  {
    id: '3',
    nama_lengkap: 'Tariq Bin Ziyad',
    nomor_induk: '3301123456780003',
    nama_ayah_kandung: 'Ziyad',
    nama_ibu_kandung: 'Fatimah',
    jenis_kelamin: 'L',
    status_pendaftaran: 'Revisi',
    nomor_telepon: '08556677889',
    created_at: '2026-08-20T08:00:00Z',
  },
];

describe('filterPendaftarList', () => {
  it('filters by search query matching name, nik, ayah, or phone', () => {
    expect(filterPendaftarList(sampleData, { searchQuery: 'Fatih' })).toHaveLength(1);
    expect(filterPendaftarList(sampleData, { searchQuery: '3301123456780002' })).toHaveLength(1);
    expect(filterPendaftarList(sampleData, { searchQuery: 'Abu Bakar' })).toHaveLength(1);
    expect(filterPendaftarList(sampleData, { searchQuery: '08556677889' })).toHaveLength(1);
  });

  it('filters by status pendaftaran accurately', () => {
    expect(filterPendaftarList(sampleData, { status: 'Diterima' })).toHaveLength(1);
    expect(filterPendaftarList(sampleData, { status: 'Revisi' })).toHaveLength(1);
    expect(filterPendaftarList(sampleData, { status: 'ALL' })).toHaveLength(3);
  });

  it('filters by date range (startDate and endDate)', () => {
    const res = filterPendaftarList(sampleData, {
      startDate: '2026-08-05',
      endDate: '2026-08-15',
    });
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe('2');
  });

  it('filters by gender', () => {
    expect(filterPendaftarList(sampleData, { gender: 'L' })).toHaveLength(2);
    expect(filterPendaftarList(sampleData, { gender: 'P' })).toHaveLength(1);
  });

  it('filters with regIdMap matching registration ID', () => {
    const regIdMap = new Map([
      ['1', 'MIM-2026-001'],
      ['2', 'MIM-2026-002'],
      ['3', 'MIM-2026-003'],
    ]);
    const res = filterPendaftarList(sampleData, {
      searchQuery: 'MIM-2026-003',
      regIdMap,
    });
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe('3');
  });
});
