import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EditContactPage from "../EditContactPage";
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

describe("EditContactPage", () => {
  const mockRouter = { push: vi.fn() };
  const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
    (createClient as any).mockReturnValue(mockSupabase);
  });

  it("renders social media input fields and populates from kontak_sekolah data", async () => {
    const mockData = {
      id: 1,
      alamat: "Jl. Test No. 1",
      whatsapp: "08123456789",
      email_utama: "admin@mim.sch.id",
      email_admin: "admin2@mim.sch.id",
      jam_operasional: "07:00 - 13:00 WIB",
      maps_embed_url: "https://maps.google.com/embed",
      facebook_url: "https://facebook.com/mimpkdimoro",
      instagram_url: "https://instagram.com/mimpkdimoro",
      youtube_url: "https://youtube.com/@mimpkdimoro",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    };

    mockSupabase.maybeSingle.mockResolvedValue({ data: mockData, error: null });

    render(<EditContactPage />);

    await waitFor(() => {
      expect((screen.getByLabelText(/Facebook URL/i) as HTMLInputElement).value).toBe("https://facebook.com/mimpkdimoro");
      expect((screen.getByLabelText(/Instagram URL/i) as HTMLInputElement).value).toBe("https://instagram.com/mimpkdimoro");
      expect((screen.getByLabelText(/YouTube URL/i) as HTMLInputElement).value).toBe("https://youtube.com/@mimpkdimoro");
    });
  });

  it("submits updated social media fields in update payload", async () => {
    const mockData = {
      id: 1,
      alamat: "Jl. Test No. 1",
      whatsapp: "08123456789",
      email_utama: "admin@mim.sch.id",
      email_admin: "admin2@mim.sch.id",
      jam_operasional: "07:00 - 13:00 WIB",
      maps_embed_url: "",
      facebook_url: "",
      instagram_url: "",
      youtube_url: "",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    };

    mockSupabase.maybeSingle.mockResolvedValue({ data: mockData, error: null });
    mockSupabase.eq.mockResolvedValue({ error: null });

    render(<EditContactPage />);

    await waitFor(() => {
      expect((screen.getByLabelText(/Facebook URL/i) as HTMLInputElement).value).toBe("");
    });

    fireEvent.change(screen.getByLabelText(/Facebook URL/i), {
      target: { value: "https://facebook.com/newpage" },
    });
    fireEvent.change(screen.getByLabelText(/Instagram URL/i), {
      target: { value: "https://instagram.com/newpage" },
    });
    fireEvent.change(screen.getByLabelText(/YouTube URL/i), {
      target: { value: "https://youtube.com/@newpage" },
    });

    const submitBtn = screen.getByRole("button", { name: /Simpan Perubahan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockSupabase.update).toHaveBeenCalledWith(
        expect.objectContaining({
          facebook_url: "https://facebook.com/newpage",
          instagram_url: "https://instagram.com/newpage",
          youtube_url: "https://youtube.com/@newpage",
        })
      );
      expect(mockSupabase.eq).toHaveBeenCalledWith("id", 1);
      expect(mockRouter.push).toHaveBeenCalledWith("/admin/konten");
    });
  });
});
