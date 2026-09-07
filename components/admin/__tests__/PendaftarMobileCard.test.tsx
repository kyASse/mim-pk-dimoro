import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import PendaftarMobileCard from "../PendaftarMobileCard";
import { PendaftarItem } from "../PendaftarTable";

const mockItem: PendaftarItem = {
  id: "pendaftar-1",
  nomor_induk: "3301123456780001",
  nama_lengkap: "Muhammad Al-Fatih",
  nama_panggilan: "Fatih",
  nama_ayah_kandung: "Sultan Murad",
  nama_ibu_kandung: "Huma Hatun",
  jenis_kelamin: "L",
  nomor_telepon: "081234567890",
  status_pendaftaran: "Menunggu Persetujuan",
  created_at: "2026-08-01T10:00:00Z",
};

describe("PendaftarMobileCard Component", () => {
  it("renders student information, registration ID, and status badge accurately", () => {
    render(
      <PendaftarMobileCard
        item={mockItem}
        regId="MIM-2026-001"
        isSelected={false}
        onToggleSelect={vi.fn()}
        onOpenWhatsApp={vi.fn()}
      />
    );

    expect(screen.getByText("Muhammad Al-Fatih")).toBeDefined();
    expect(screen.getByText("MIM-2026-001")).toBeDefined();
    expect(screen.getByText(/3301123456780001/)).toBeDefined();
    expect(screen.getByText(/Sultan Murad/)).toBeDefined();
    expect(screen.getByText("Menunggu Persetujuan")).toBeDefined();
  });

  it("handles selection checkbox toggle", () => {
    const onToggleSelect = vi.fn();
    render(
      <PendaftarMobileCard
        item={mockItem}
        regId="MIM-2026-001"
        isSelected={false}
        onToggleSelect={onToggleSelect}
        onOpenWhatsApp={vi.fn()}
      />
    );

    const checkbox = screen.getByRole("checkbox", { name: /pilih muhammad al-fatih/i });
    fireEvent.click(checkbox);
    expect(onToggleSelect).toHaveBeenCalledWith("pendaftar-1");
  });

  it("handles WhatsApp button click", () => {
    const onOpenWhatsApp = vi.fn();
    render(
      <PendaftarMobileCard
        item={mockItem}
        regId="MIM-2026-001"
        isSelected={false}
        onToggleSelect={vi.fn()}
        onOpenWhatsApp={onOpenWhatsApp}
      />
    );

    const waBtn = screen.getByRole("button", { name: /kirim pesan whatsapp/i });
    fireEvent.click(waBtn);
    expect(onOpenWhatsApp).toHaveBeenCalledWith(mockItem);
  });

  it("renders link to detail page", () => {
    render(
      <PendaftarMobileCard
        item={mockItem}
        regId="MIM-2026-001"
        isSelected={false}
        onToggleSelect={vi.fn()}
        onOpenWhatsApp={vi.fn()}
      />
    );

    const detailLink = screen.getByRole("link", { name: /lihat detail/i });
    expect(detailLink.getAttribute("href")).toBe("/admin/pendaftar/detail/pendaftar-1");
  });
});
