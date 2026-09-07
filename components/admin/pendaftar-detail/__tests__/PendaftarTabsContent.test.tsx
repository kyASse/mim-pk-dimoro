import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

import PendaftarTabsContent from "../PendaftarTabsContent";

const mockPendaftar = {
  id: "pendaftar-1",
  nomor_induk: "3301123456780001",
  nama_lengkap: "Muhammad Al-Fatih",
  nama_panggilan: "Fatih",
  jenis_kelamin: "L",
  tempat_lahir: "Sukoharjo",
  tanggal_lahir: "2019-05-12",
  agama: "Islam",
  kewarganegaraan: "WNI",
  status_anak: "Anak Kandung",
  anak_ke: 1,
  jumlah_saudara_kandung: 2,
  bahasa_sehari_hari: "Indonesia",
  berat_badan: 19,
  tinggi_badan: 115,
  golongan_darah: "O",
  tk_asal: "TK ABA Dimoro",
  cita_cita: "Ulama & Arsitek",
  hobi: "Membaca & Berkuda",
  alamat_lengkap: "Sudimoro RT 01 RW 03, Parangjoro",
  jarak_tempat_tinggal: "1",
  transportasi: "Jalan Kaki",
  nomor_telepon: "081234567890",
  email: "fatih.parents@example.com",
  nama_ayah_kandung: "Bambang Sutrisno, S.Pd.",
  pendidikan_ayah: "S1",
  pekerjaan_ayah: "Guru",
  nama_ibu_kandung: "Siti Aminah, S.E.",
  pendidikan_ibu: "S1",
  pekerjaan_ibu: "Wiraswasta",
  gaji_orang_tua: "Rp 4.000.000 - Rp 6.000.000",
  alamat_orang_tua: "Sudimoro RT 01 RW 03",
  wali_nama: "H. Abdullah",
  wali_hubungan: "Kakek",
  wali_pendidikan: "SMA",
  wali_pekerjaan: "Pensiunan",
  wali_telepon: "081333444555",
  wali_alamat: "Sudimoro RT 02 RW 03",
  memiliki_kebutuhan_khusus: false,
  status_pendaftaran: "Menunggu Persetujuan",
  diterima_di_kelas: null,
  diterima_pada_tanggal: null,
  created_at: "2026-08-01T10:00:00Z",
};

describe("PendaftarTabsContent Component", () => {
  it("renders all 4 tab triggers", () => {
    render(<PendaftarTabsContent pendaftar={mockPendaftar} />);
    expect(screen.getByRole("tab", { name: /biodata/i })).toBeDefined();
    expect(screen.getByRole("tab", { name: /keluarga/i })).toBeDefined();
    expect(screen.getByRole("tab", { name: /kebutuhan/i })).toBeDefined();
    expect(screen.getByRole("tab", { name: /administrasi/i })).toBeDefined();
  });

  it("renders default biodata tab content correctly", () => {
    render(<PendaftarTabsContent pendaftar={mockPendaftar} />);
    expect(screen.getByText("TK ABA Dimoro")).toBeDefined();
    expect(screen.getByText("Ulama & Arsitek")).toBeDefined();
    expect(screen.getByText("Membaca & Berkuda")).toBeDefined();
  });

  it("supports controlled active tab or tab navigation", () => {
    render(
      <PendaftarTabsContent pendaftar={mockPendaftar} defaultTab="orangtua" />
    );
    expect(screen.getByText("Bambang Sutrisno, S.Pd.")).toBeDefined();
    expect(screen.getByText("Siti Aminah, S.E.")).toBeDefined();
    expect(screen.getByText("H. Abdullah")).toBeDefined();
  });

  it("renders administrasi tab content when selected", () => {
    render(
      <PendaftarTabsContent
        pendaftar={mockPendaftar}
        defaultTab="administrasi"
      />
    );
    expect(screen.getByText(/Data Administratif Madrasah/i)).toBeDefined();
    expect(screen.getByText(/Status Akun Portal Wali Murid/i)).toBeDefined();
  });
});
