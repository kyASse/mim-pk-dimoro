import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PageHeader from "../PageHeader";

describe("PageHeader Component", () => {
  it("harus merender judul, deskripsi, dan breadcrumb beranda", () => {
    render(
      <PageHeader
        title="Tentang Kami"
        description="Mengenal lebih dekat MIM PK Dimoro"
      />
    );

    expect(screen.getByRole("heading", { level: 1, name: "Tentang Kami" })).toBeDefined();
    expect(screen.getByText("Mengenal lebih dekat MIM PK Dimoro")).toBeDefined();
    expect(screen.getByRole("link", { name: /beranda/i })).toBeDefined();
  });

  it("harus merender eyebrow badge jika disediakan", () => {
    render(
      <PageHeader
        title="Ikatan Wali Murid"
        badge="Sinergi Madrasah & Keluarga"
      />
    );

    expect(screen.getByText("Sinergi Madrasah & Keluarga")).toBeDefined();
  });

  it("harus merender children kustom jika disediakan", () => {
    render(
      <PageHeader title="Ikatan Wali Murid">
        <div data-testid="custom-period">Masa Bakti 2025 - 2027</div>
      </PageHeader>
    );

    expect(screen.getByTestId("custom-period")).toBeDefined();
    expect(screen.getByText("Masa Bakti 2025 - 2027")).toBeDefined();
  });

  it("dapat menerima custom background dan className", () => {
    const { container } = render(
      <PageHeader
        title="Program"
        background="bg-emerald-500/20"
        className="custom-test-class"
      />
    );

    const section = container.querySelector("section");
    expect(section?.className).toContain("bg-emerald-500/20");
    expect(section?.className).toContain("custom-test-class");
  });
});
