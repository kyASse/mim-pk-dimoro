import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EditKontenPage from "./page";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// Mock Supabase client
vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(),
}));

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("EditKontenPage", () => {
  const mockParams = Promise.resolve({ slug: "test-slug" });
  const mockRouter = { push: vi.fn() };
  const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn(),
    single: vi.fn(),
    update: vi.fn().mockReturnThis(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
    (createClient as any).mockReturnValue(mockSupabase);
  });

  it("should display 'Dibuat pada' and correct date from created_at", async () => {
    const mockData = {
      slug: "test-slug",
      judul: "Test Title",
      isi: { key: "value" },
      created_at: "2024-01-01T00:00:00Z",
    };

    const mockPromise = Promise.resolve({ data: mockData, error: null });
    (mockPromise as any).single = vi.fn().mockResolvedValue({ data: mockData, error: null });
    mockSupabase.eq.mockReturnValue(mockPromise);

    render(<EditKontenPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText(/Dibuat pada:/i)).toBeDefined();
    });
  });

  it("should only send judul and isi in handleSubmit", async () => {
    const mockData = {
      slug: "test-slug",
      judul: "Test Title",
      isi: { key: "value" },
      created_at: "2024-01-01T00:00:00Z",
    };

    const mockPromise = Promise.resolve({ data: mockData, error: null });
    (mockPromise as any).single = vi.fn().mockResolvedValue({ data: mockData, error: null });
    mockSupabase.eq.mockReturnValue(mockPromise);

    render(<EditKontenPage params={mockParams} />);

    await waitFor(() => {
      expect((screen.getByLabelText(/Judul Konten/i) as HTMLInputElement).value).toBe("Test Title");
    });

    const saveButton = screen.getByRole("button", { name: /Simpan Perubahan/i });
    saveButton.click();

    await waitFor(() => {
      expect(mockSupabase.update).toHaveBeenCalledWith({
        judul: "Test Title",
        isi: { key: "value" },
      });
      expect(mockSupabase.eq).toHaveBeenCalledWith('slug', "test-slug");
    });
  });

  it("should render and save catatan-spp correctly", async () => {
    const mockParamsSpp = Promise.resolve({ slug: "catatan-spp" });
    const mockData = {
      slug: "catatan-spp",
      judul: "Catatan SPP",
      isi: { catatan: "Lama" },
      created_at: "2024-01-01T00:00:00Z",
    };

    const mockPromise = Promise.resolve({ data: mockData, error: null });
    (mockPromise as any).single = vi.fn().mockResolvedValue({ data: mockData, error: null });
    mockSupabase.eq.mockReturnValue(mockPromise);

    render(<EditKontenPage params={mockParamsSpp} />);

    await waitFor(() => {
      expect((screen.getByLabelText(/Teks Catatan SPP/i) as HTMLTextAreaElement).value).toBe("Lama");
    });

    const textarea = screen.getByLabelText(/Teks Catatan SPP/i);
    fireEvent.change(textarea, { target: { value: "Baru" } });

    const saveButton = screen.getByRole("button", { name: /Simpan Perubahan/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockSupabase.update).toHaveBeenCalledWith({
        judul: "Catatan SPP",
        isi: { catatan: "Baru" },
      });
    });
  });

  it("should render and save persyaratan-pendaftaran correctly", async () => {
    const mockParamsPersyaratan = Promise.resolve({ slug: "persyaratan-pendaftaran" });
    const mockData = {
      slug: "persyaratan-pendaftaran",
      judul: "Persyaratan Pendaftaran",
      isi: {
        persyaratan: { judul: "Seksi Persyaratan", items: ["Akte Kelahiran", "Kartu Keluarga"] },
        jadwal: { judul: "Seksi Jadwal", items: [{ tahap: "Gelombang 1", periode: "Januari" }] }
      },
      created_at: "2024-01-01T00:00:00Z",
    };

    const mockPromise = Promise.resolve({ data: mockData, error: null });
    (mockPromise as any).single = vi.fn().mockResolvedValue({ data: mockData, error: null });
    mockSupabase.eq.mockReturnValue(mockPromise);

    render(<EditKontenPage params={mockParamsPersyaratan} />);

    await waitFor(() => {
      const judulSeksiInputs = screen.getAllByLabelText(/Judul Seksi/i) as HTMLInputElement[];
      expect(judulSeksiInputs[0].value).toBe("Seksi Persyaratan");
      expect(judulSeksiInputs[1].value).toBe("Seksi Jadwal");
    });

    expect(screen.getByPlaceholderText("Persyaratan #1")).toBeDefined();
    expect(screen.getByPlaceholderText("Persyaratan #2")).toBeDefined();

    const addPersyaratanButton = screen.getByRole("button", { name: /Tambah Persyaratan/i });
    fireEvent.click(addPersyaratanButton);

    const inputs = screen.getAllByPlaceholderText(/Persyaratan #/i) as HTMLInputElement[];
    fireEvent.change(inputs[2], { target: { value: "Ijazah" } });

    const saveButton = screen.getByRole("button", { name: /Simpan Perubahan/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockSupabase.update).toHaveBeenCalledWith({
        judul: "Persyaratan Pendaftaran",
        isi: {
          persyaratan: { judul: "Seksi Persyaratan", items: ["Akte Kelahiran", "Kartu Keluarga", "Ijazah"] },
          jadwal: { judul: "Seksi Jadwal", items: [{ tahap: "Gelombang 1", periode: "Januari" }] }
        }
      });
    });
  });

  it("should render and save jadwal-pendaftaran correctly", async () => {
    const mockParamsJadwal = Promise.resolve({ slug: "jadwal-pendaftaran" });
    const mockData = {
      slug: "jadwal-pendaftaran",
      judul: "Jadwal Pendaftaran",
      isi: {
        judul: "Halaman Jadwal",
        items: [{ nama: "Gelombang 1", periode: "Februari" }]
      },
      created_at: "2024-01-01T00:00:00Z",
    };

    const mockPromise = Promise.resolve({ data: mockData, error: null });
    (mockPromise as any).single = vi.fn().mockResolvedValue({ data: mockData, error: null });
    mockSupabase.eq.mockReturnValue(mockPromise);

    render(<EditKontenPage params={mockParamsJadwal} />);

    await waitFor(() => {
      expect((screen.getByLabelText(/Judul Seksi\/Halaman/i) as HTMLInputElement).value).toBe("Halaman Jadwal");
    });

    const addGelombangButton = screen.getByRole("button", { name: /Tambah Gelombang/i });
    fireEvent.click(addGelombangButton);

    const namaInputs = screen.getAllByPlaceholderText("Nama Gelombang (cth: Gelombang 1)") as HTMLInputElement[];
    const periodeInputs = screen.getAllByPlaceholderText("Periode (cth: Jan - Feb 2026)") as HTMLInputElement[];
    
    fireEvent.change(namaInputs[1], { target: { value: "Gelombang 2" } });
    fireEvent.change(periodeInputs[1], { target: { value: "Maret" } });

    const saveButton = screen.getByRole("button", { name: /Simpan Perubahan/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockSupabase.update).toHaveBeenCalledWith({
        judul: "Jadwal Pendaftaran",
        isi: {
          judul: "Halaman Jadwal",
          items: [
            { nama: "Gelombang 1", periode: "Februari" },
            { nama: "Gelombang 2", periode: "Maret" }
          ]
        }
      });
    });
  });
});
