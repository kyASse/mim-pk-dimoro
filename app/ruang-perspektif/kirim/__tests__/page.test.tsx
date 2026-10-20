import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import KirimOpiniPage, { metadata } from "../page";

// Mock child form
vi.mock("@/components/ruang-perspektif/OpiniSubmissionForm", () => ({
  default: () => <div data-testid="mock-opini-submission-form">Form Pengiriman</div>,
}));

describe("Kirim Opini Page (app/ruang-perspektif/kirim/page.tsx)", () => {
  it("renders page with submission form", () => {
    render(<KirimOpiniPage />);
    expect(screen.getByTestId("mock-opini-submission-form")).toBeDefined();
  });

  it("exports correct metadata", () => {
    expect(metadata.title).toBe("Kirim Tulisan Opini | Ruang Perspektif MIM PK Dimoro");
    expect(metadata.description).toBe(
      "Formulir kontribusi naskah opini untuk guru, orang tua murid, dan pemerhati pendidikan MIM PK Dimoro."
    );
  });
});
