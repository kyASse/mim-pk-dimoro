import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import OpiniAdminEditor from "../OpiniAdminEditor";
import { updateOpiniContentAction } from "@/app/admin/ruang-perspektif/actions";
import { OpiniPerspektif } from "@/lib/types/ruang-perspektif";

vi.mock("@/app/admin/ruang-perspektif/actions", () => ({
  updateOpiniContentAction: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("OpiniAdminEditor", () => {
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

  const mockOpini: OpiniPerspektif = {
    id: "op-1",
    slug: "opini-keren-123456",
    judul: "Judul Asli Opini",
    ringkasan: "Ringkasan naskah opini",
    isi_lengkap: "<p>Paragraf naskah opini yang akan diedit oleh editor redaksi.</p>",
    kategori: "Pendidikan & Karakter",
    nama_penulis: "Ustadz Ahmad",
    peran_penulis: "guru",
    keterangan_peran: "Guru Kelas 5",
    foto_penulis_url: null,
    gambar_sampul_url: null,
    kontak_wa: "081234567890",
    email: null,
    status: "menunggu_kurasi",
    catatan_redaksi: null,
    is_featured: false,
    waktu_terbit: null,
    dibaca_count: 0,
    created_at: "2026-10-19T00:00:00Z",
    updated_at: "2026-10-19T00:00:00Z",
  };

  it("renders editor fields including OpiniRichTextEditor", () => {
    render(<OpiniAdminEditor opini={mockOpini} />);

    expect(screen.getByText("Editor Naskah & Proofreading")).toBeDefined();
    expect(screen.getByDisplayValue("Judul Asli Opini")).toBeDefined();
    expect(screen.getByDisplayValue("Ringkasan naskah opini")).toBeDefined();
    expect(screen.getByRole("button", { name: /Heading 2/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Simpan Draf/i })).toBeDefined();
  });

  it("handles save action successfully", async () => {
    vi.mocked(updateOpiniContentAction).mockResolvedValue({ success: true });

    render(<OpiniAdminEditor opini={mockOpini} />);

    const saveBtn = screen.getByRole("button", { name: /Simpan Draf/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateOpiniContentAction).toHaveBeenCalledWith(
        "op-1",
        expect.objectContaining({
          judul: "Judul Asli Opini",
          kategori: "Pendidikan & Karakter",
          ringkasan: "Ringkasan naskah opini",
          isi_lengkap: "<p>Paragraf naskah opini yang akan diedit oleh editor redaksi.</p>",
        })
      );
    });
  });
});
