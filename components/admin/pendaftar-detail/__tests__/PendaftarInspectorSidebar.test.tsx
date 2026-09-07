import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

import PendaftarInspectorSidebar from "../PendaftarInspectorSidebar";

const mockPendaftar = {
  id: "pendaftar-1",
  nomor_induk: "3301123456780001",
  nama_lengkap: "Muhammad Al-Fatih",
  status_pendaftaran: "Menunggu Persetujuan",
  nomor_telepon: "081234567890",
  email: "fatih.parent@example.com",
  nama_ayah_kandung: "Bambang Sutrisno",
  nama_ibu_kandung: "Siti Aminah",
};

describe("PendaftarInspectorSidebar Component", () => {
  it("renders status controls, WhatsApp trigger, and parent contact summary", () => {
    const onOpenWhatsApp = vi.fn();
    render(
      <PendaftarInspectorSidebar
        pendaftar={mockPendaftar}
        onOpenWhatsApp={onOpenWhatsApp}
      />
    );

    expect(screen.getByText(/Keputusan & Status/i)).toBeDefined();
    expect(screen.getAllByText(/Kontak Utama/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/081234567890/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/fatih.parent@example.com/).length).toBeGreaterThanOrEqual(1);
  });

  it("calls onOpenWhatsApp when WhatsApp trigger button is clicked", () => {
    const onOpenWhatsApp = vi.fn();
    render(
      <PendaftarInspectorSidebar
        pendaftar={mockPendaftar}
        onOpenWhatsApp={onOpenWhatsApp}
      />
    );

    const waBtn = screen.getByRole("button", { name: /kirim pesan whatsapp/i });
    fireEvent.click(waBtn);
    expect(onOpenWhatsApp).toHaveBeenCalled();
  });
});
