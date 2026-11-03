import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import ShareSection from "../ShareSection";

describe("ShareSection Component (components/berita/ShareSection.tsx)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with dark-mode friendly border and semantic text colors", () => {
    const { container } = render(<ShareSection title="Uji Coba Judul Berita" />);

    // Label should use text-foreground instead of hardcoded text-gray-800
    const label = screen.getByText("Bagikan Artikel:");
    expect(label.className).toContain("text-foreground");
    expect(label.className).not.toContain("text-gray-800");

    // Divider border should use border-border instead of border-gray-200
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("border-border");
    expect(wrapper.className).not.toContain("border-gray-200");
  });

  it("provides dark-mode hover states for share buttons", () => {
    render(<ShareSection title="Uji Coba Judul Berita" />);

    const facebookBtn = screen.getByRole("button", { name: /facebook/i });
    const twitterBtn = screen.getByRole("button", { name: /twitter/i });
    const waBtn = screen.getByRole("button", { name: /whatsapp/i });

    expect(facebookBtn.className).toContain("dark:hover:bg-blue-950");
    expect(twitterBtn.className).toContain("dark:hover:bg-sky-950");
    expect(waBtn.className).toContain("dark:hover:bg-green-950");
  });
});
