import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OpiniSubmissionForm from "../OpiniSubmissionForm";
import { submitOpiniAction } from "@/app/ruang-perspektif/actions";

vi.mock("@/app/ruang-perspektif/actions", () => ({
  submitOpiniAction: vi.fn(),
}));

describe("OpiniSubmissionForm", () => {
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

  it("renders form elements and honeypot field", () => {
    const { container } = render(<OpiniSubmissionForm />);

    expect(screen.getByText("Formulir Pengiriman Opini")).toBeDefined();
    expect(screen.getByLabelText(/Nama Lengkap/i)).toBeDefined();
    expect(screen.getByLabelText(/Peran Anda/i)).toBeDefined();
    expect(screen.getByLabelText(/Keterangan Peran/i)).toBeDefined();
    expect(screen.getByLabelText(/Nomor WhatsApp/i)).toBeDefined();
    expect(screen.getByLabelText(/Judul Opini/i)).toBeDefined();
    expect(screen.getByLabelText(/Kategori/i)).toBeDefined();
    expect(screen.getByLabelText(/Ringkasan/i)).toBeDefined();
    expect(screen.getByLabelText(/Isi Lengkap Opini/i)).toBeDefined();

    // Honeypot field must exist and be hidden
    const honeypot = container.querySelector('input[name="website_url"]');
    expect(honeypot).not.toBeNull();
    expect(honeypot?.className).toContain("hidden");
  });

  it("updates live word count indicator as user types", () => {
    render(<OpiniSubmissionForm />);

    const textarea = screen.getByLabelText(/Isi Lengkap Opini/i);
    expect(screen.getByText(/0 kata/i)).toBeDefined();
    expect(screen.getByText(/Kurang dari 250 kata/i)).toBeDefined();

    // Type 3 words
    fireEvent.change(textarea, { target: { value: "Satu dua tiga" } });
    expect(screen.getByText(/3 kata/i)).toBeDefined();
    expect(screen.getByText(/Kurang dari 250 kata/i)).toBeDefined();

    // Type 250 words
    const longText = Array(250).fill("kata").join(" ");
    fireEvent.change(textarea, { target: { value: longText } });
    expect(screen.getByText(/250 kata/i)).toBeDefined();
    expect(screen.getByText(/Memenuhi syarat min. 250 kata/i)).toBeDefined();
  });

  it("handles successful form submission", async () => {
    vi.mocked(submitOpiniAction).mockResolvedValue({
      success: true,
      message: "Alhamdulillah! Naskah Anda berhasil dikirim.",
    });

    render(<OpiniSubmissionForm />);

    fireEvent.change(screen.getByLabelText(/Nama Lengkap/i), { target: { value: "Budi Santoso" } });
    fireEvent.change(screen.getByLabelText(/Keterangan Peran/i), { target: { value: "Guru Kelas 5" } });
    fireEvent.change(screen.getByLabelText(/Nomor WhatsApp/i), { target: { value: "08123456789" } });
    fireEvent.change(screen.getByLabelText(/Judul Opini/i), { target: { value: "Judul Keren" } });
    fireEvent.change(screen.getByLabelText(/Ringkasan/i), { target: { value: "Ringkasan tulisan" } });
    fireEvent.change(screen.getByLabelText(/Isi Lengkap Opini/i), { target: { value: "Isi tulisan lengkap" } });

    const submitBtn = screen.getByRole("button", { name: /Kirim Naskah/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(submitOpiniAction).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Alhamdulillah, Naskah Terkirim!")).toBeDefined();
      expect(screen.getByText(/Alhamdulillah! Naskah Anda berhasil dikirim/i)).toBeDefined();
    });
  });

  it("handles submission error", async () => {
    vi.mocked(submitOpiniAction).mockResolvedValue({
      success: false,
      error: "Isi opini minimal 250 kata",
    });

    render(<OpiniSubmissionForm />);

    const submitBtn = screen.getByRole("button", { name: /Kirim Naskah/i });
    fireEvent.submit(submitBtn.closest("form")!);

    await waitFor(() => {
      expect(screen.getByText("Isi opini minimal 250 kata")).toBeDefined();
    });
  });
});
