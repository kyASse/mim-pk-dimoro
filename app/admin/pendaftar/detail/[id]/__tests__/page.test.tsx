import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
  redirect: vi.fn(),
}));

import DetailPendaftarClient from "@/components/admin/pendaftar-detail/DetailPendaftarClient";

const mockPendaftar = {
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
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
  hobi: "Membaca",
  alamat_lengkap: "Sudimoro RT 01 RW 03, Parangjoro",
  nomor_telepon: "081234567890",
  nama_ayah_kandung: "Sultan Murad",
  nama_ibu_kandung: "Huma Hatun",
  status_pendaftaran: "Menunggu Persetujuan",
  created_at: "2026-08-01T10:00:00Z",
};

describe("Admin Detail Pendaftar Integration", () => {
  it("renders complete 2-column dossier detail view with back button, header, tabs, and inspector sidebar", () => {
    render(
      <DetailPendaftarClient
        pendaftar={mockPendaftar}
        regId="MIM-2026-A1B2"
      />
    );

    // Back button
    expect(screen.getByText(/Kembali ke Daftar Pendaftar/i)).toBeDefined();

    // Identity Header
    expect(screen.getByRole("heading", { name: /Muhammad Al-Fatih/i })).toBeDefined();
    expect(screen.getByText("MIM-2026-A1B2")).toBeDefined();

    // Tabs
    expect(screen.getByRole("tab", { name: /biodata/i })).toBeDefined();
    expect(screen.getByRole("tab", { name: /keluarga/i })).toBeDefined();
    expect(screen.getByRole("tab", { name: /kebutuhan/i })).toBeDefined();
    expect(screen.getByRole("tab", { name: /administrasi/i })).toBeDefined();

    // Action buttons (Desktop sidebar & Mobile action bar)
    expect(
      screen.getAllByRole("button", { name: /kirim pesan whatsapp/i }).length
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("button", { name: /cetak formulir resmi/i })).toBeDefined();
  });
});
