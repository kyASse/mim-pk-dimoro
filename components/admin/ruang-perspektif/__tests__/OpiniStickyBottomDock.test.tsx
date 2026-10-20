import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import OpiniStickyBottomDock from "../OpiniStickyBottomDock";

describe("OpiniStickyBottomDock", () => {
  it("renders publish, reject, and whatsapp buttons", () => {
    render(
      <OpiniStickyBottomDock
        status="menunggu_kurasi"
        whatsappUrl="https://wa.me/628123"
        onPublish={vi.fn()}
        onReject={vi.fn()}
      />
    );

    expect(screen.getByText("Terbitkan")).toBeDefined();
    expect(screen.getByText("Tolak")).toBeDefined();
    expect(screen.getByText("WhatsApp")).toBeDefined();
  });
});
