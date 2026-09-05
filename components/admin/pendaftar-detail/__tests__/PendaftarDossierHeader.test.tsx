import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

import PendaftarDossierHeader from "../PendaftarDossierHeader";

const mockPendaftar = {
  id: "pendaftar-1",
  nomor_induk: "3301123456780001",
  nama_lengkap: "Muhammad Al-Fatih",
  nama_panggilan: "Fatih",
  jenis_kelamin: "L",
  status_pendaftaran: "Menunggu Persetujuan",
  nomor_telepon: "081234567890",
  tanggal_lahir: "2019-05-12",
  tempat_lahir: "Sukoharjo",
  created_at: "2026-08-01T10:00:00Z",
};

describe("PendaftarDossierHeader Component", () => {
  it("renders student name, registration ID, NIK, and gender badge", () => {
    render(
      <PendaftarDossierHeader
        pendaftar={mockPendaftar}
        regId="MIM-2026-001"
      />
    );

    expect(screen.getByRole("heading", { name: /muhammad al-fatih/i })).toBeDefined();
    expect(screen.getByText("MIM-2026-001")).toBeDefined();
    expect(screen.getByText(/3301123456780001/)).toBeDefined();
    expect(screen.getByText(/Laki-laki/i)).toBeDefined();
  });

  it("copies NIK to clipboard on copy click", () => {
    const writeTextMock = vi.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <PendaftarDossierHeader
        pendaftar={mockPendaftar}
        regId="MIM-2026-001"
      />
    );

    const copyBtn = screen.getByRole("button", { name: /salin nik/i });
    fireEvent.click(copyBtn);
    expect(writeTextMock).toHaveBeenCalledWith("3301123456780001");
  });
});
