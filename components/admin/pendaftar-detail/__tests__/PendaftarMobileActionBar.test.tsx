import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

import PendaftarMobileActionBar from "../PendaftarMobileActionBar";

const mockPendaftar = {
  id: "pendaftar-1",
  nomor_induk: "3301123456780001",
  nama_lengkap: "Muhammad Al-Fatih",
  status_pendaftaran: "Menunggu Persetujuan",
  nomor_telepon: "081234567890",
  email: "fatih.parent@example.com",
};

describe("PendaftarMobileActionBar Component", () => {
  it("renders WhatsApp button and Process / Status button", () => {
    const onOpenWhatsApp = vi.fn();
    render(
      <PendaftarMobileActionBar
        pendaftar={mockPendaftar}
        onOpenWhatsApp={onOpenWhatsApp}
      />
    );

    expect(screen.getByRole("button", { name: /kirim pesan whatsapp/i })).toBeDefined();
    expect(screen.getByText(/Terima & Buatkan Akun Portal/i)).toBeDefined();
  });

  it("triggers onOpenWhatsApp on button click", () => {
    const onOpenWhatsApp = vi.fn();
    render(
      <PendaftarMobileActionBar
        pendaftar={mockPendaftar}
        onOpenWhatsApp={onOpenWhatsApp}
      />
    );

    const waBtn = screen.getByRole("button", { name: /kirim pesan whatsapp/i });
    fireEvent.click(waBtn);
    expect(onOpenWhatsApp).toHaveBeenCalled();
  });
});
