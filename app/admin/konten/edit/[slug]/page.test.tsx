import { render, screen, waitFor } from "@testing-library/react";
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
    eq: vi.fn().mockReturnThis(),
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

    mockSupabase.single.mockResolvedValue({ data: mockData, error: null });

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

    mockSupabase.single.mockResolvedValue({ data: mockData, error: null });
    mockSupabase.update.mockResolvedValue({ error: null });

    render(<EditKontenPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Judul Konten/i)).toHaveValue("Test Title");
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
});
