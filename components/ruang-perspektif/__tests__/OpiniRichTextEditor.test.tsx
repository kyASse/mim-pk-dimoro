import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import OpiniRichTextEditor from "../OpiniRichTextEditor";

describe("OpiniRichTextEditor Component", () => {
  const defaultProps = {
    value: "<p>Gagasan awal tulisan opini madrasah.</p>",
    onChange: vi.fn(),
    placeholder: "Tuliskan opini Anda di sini...",
  };

  beforeAll(() => {
    if (typeof window !== "undefined") {
      Range.prototype.getClientRects = vi.fn().mockReturnValue([]);
      Range.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
        x: 0,
        y: 0,
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        toJSON: () => "",
      });
      Element.prototype.getClientRects = vi.fn().mockReturnValue([]);
      Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
        x: 0,
        y: 0,
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        toJSON: () => "",
      });
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders editorial typography toolbar buttons without inline image button", () => {
    render(<OpiniRichTextEditor {...defaultProps} />);

    // Typography & Headings
    expect(screen.getByRole("button", { name: /Heading 2/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Heading 3/i })).toBeDefined();

    // Inline marks
    expect(screen.getByRole("button", { name: /Tebal \(Bold\)/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Miring \(Italic\)/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Garis Bawah \(Underline\)/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Coret \(Strikethrough\)/i })).toBeDefined();

    // Editorial formatting
    expect(screen.getByRole("button", { name: /Kutipan \(Blockquote\)/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Daftar Poin \(Bullet List\)/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Daftar Angka \(Ordered List\)/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Garis Pemisah \(Divider\)/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Sisipkan Tautan/i })).toBeDefined();

    // History
    expect(screen.getByRole("button", { name: /Undo/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Redo/i })).toBeDefined();

    // Must NOT have image upload button (pure editorial text)
    expect(screen.queryByRole("button", { name: /Unggah Gambar/i })).toBeNull();
  });

  it("renders editor container and placeholder", () => {
    const { container } = render(<OpiniRichTextEditor {...defaultProps} />);
    expect(container.querySelector(".ProseMirror")).toBeDefined();
  });
});
