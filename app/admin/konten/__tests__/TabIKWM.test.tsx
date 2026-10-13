import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TabIKWM } from "@/components/admin/konten/TabIKWM";
import { DEFAULT_IKWM_CONTENT } from "@/lib/utils/content-parsers";
import { saveIKWMContentAction } from "@/app/admin/konten/actions";
import { toast } from "sonner";

vi.mock("@/app/admin/konten/actions", () => ({
  saveIKWMContentAction: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    loading: vi.fn().mockReturnValue("toast-id"),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock ImageUploader to avoid Supabase storage dependencies in component tests
vi.mock("@/components/admin/konten/ImageUploader", () => ({
  ImageUploader: ({ label, value, onChange }: any) => (
    <div data-testid="mock-image-uploader">
      <span>{label}</span>
      <input
        aria-label={label}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  ),
}));

describe("TabIKWM Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (saveIKWMContentAction as any).mockResolvedValue({
      success: true,
      message: "Konten IKWM berhasil diperbarui!",
    });
  });

  it("merender seluruh seksi formulir IKWM secara lengkap", () => {
    render(<TabIKWM initialData={DEFAULT_IKWM_CONTENT} />);

    expect(screen.getByText("Hero Banner & Periode Kepengurusan")).toBeDefined();
    expect(screen.getByText("Kata Pengantar Ketua IKWM")).toBeDefined();
    expect(screen.getByText("Video Profil & Sorotan Dokumenter")).toBeDefined();
    expect(screen.getByText("Bagan Struktur Kepengurusan")).toBeDefined();
    expect(screen.getByText("Bento Program & Kegiatan Unggulan")).toBeDefined();
  });

  it("dapat mengubah mode video menjadi placeholder atau hidden", () => {
    render(<TabIKWM initialData={DEFAULT_IKWM_CONTENT} />);

    const teaserButton = screen.getByRole("button", { name: /Teaser \(Segera Hadir\)/i });
    fireEvent.click(teaserButton);

    const hiddenButton = screen.getByRole("button", { name: /Disembunyikan/i });
    fireEvent.click(hiddenButton);
  });

  it("dapat menambah dan menghapus paragraf sambutan", () => {
    render(<TabIKWM initialData={DEFAULT_IKWM_CONTENT} />);

    const addParagraphBtn = screen.getByRole("button", { name: /Tambah Paragraf/i });
    fireEvent.click(addParagraphBtn);

    // Paragraf tambahan bertambah
    const textareas = screen.getAllByPlaceholderText(/Tulis paragraf sambutan ke-/i);
    expect(textareas.length).toBe(DEFAULT_IKWM_CONTENT.kata_pengantar.sambutan.length + 1);
  });

  it("memanggil saveIKWMContentAction saat tombol simpan diklik", async () => {
    render(<TabIKWM initialData={DEFAULT_IKWM_CONTENT} />);

    const saveButton = screen.getByRole("button", {
      name: /Simpan Seluruh Perubahan Wali Murid \(IKWM\)/i,
    });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(saveIKWMContentAction).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith(
        "Konten IKWM berhasil diperbarui!",
        expect.any(Object)
      );
    });
  });

  it("menampilkan toast error jika penyimpanan gagal", async () => {
    (saveIKWMContentAction as any).mockResolvedValueOnce({
      success: false,
      message: "Gagal menyimpan ke basis data",
    });

    render(<TabIKWM initialData={DEFAULT_IKWM_CONTENT} />);

    const saveButton = screen.getByRole("button", {
      name: /Simpan Seluruh Perubahan Wali Murid \(IKWM\)/i,
    });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("Gagal menyimpan ke basis data"),
        expect.any(Object)
      );
    });
  });
});
