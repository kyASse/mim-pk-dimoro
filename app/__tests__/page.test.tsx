import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../page";

// Mock Supabase Server Client
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

// Mock NewsSpotlightModal
vi.mock("@/components/home/NewsSpotlightModal", () => ({
  default: ({ news }: { news: any }) => (
    <div data-testid="news-spotlight-modal">
      {news ? `Spotlight: ${news.judul}` : "No Spotlight News"}
    </div>
  ),
}));

// Mock other home sections to simplify rendering
vi.mock("@/components/home/HomeHero", () => ({
  default: () => <div data-testid="home-hero">HomeHero</div>,
}));
vi.mock("@/components/home/StatsSection", () => ({
  default: () => <div data-testid="stats-section">StatsSection</div>,
}));
vi.mock("@/components/home/AboutSection", () => ({
  default: () => <div data-testid="about-section">AboutSection</div>,
}));
vi.mock("@/components/home/FeaturesSection", () => ({
  default: () => <div data-testid="features-section">FeaturesSection</div>,
}));
vi.mock("@/components/home/NewsSection", () => ({
  default: () => <div data-testid="news-section">NewsSection</div>,
}));
vi.mock("@/components/home/ProgramSection", () => ({
  default: () => <div data-testid="program-section">ProgramSection</div>,
}));
vi.mock("@/components/home/GalleryPreview", () => ({
  default: () => <div data-testid="gallery-preview">GalleryPreview</div>,
}));
vi.mock("@/components/home/TestimonialsSection", () => ({
  default: () => <div data-testid="testimonials-section">TestimonialsSection</div>,
}));
vi.mock("@/components/home/CTASection", () => ({
  default: () => <div data-testid="cta-section">CTASection</div>,
}));

import { createClient } from "@/lib/supabase/server";

describe("Home Page (app/page.tsx)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const setupMockSupabase = (data: any = null, error: any = null) => {
    const queryBuilder: any = {
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data, error }),
    };

    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue(queryBuilder),
      }),
      queryBuilder,
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
    return mockSupabase;
  };

  it("fetches the latest published news and renders NewsSpotlightModal with data", async () => {
    const mockArticle = {
      id: "news-123",
      judul: "Pembukaan Pendaftaran Santri Baru",
      ringkasan: "Pendaftaran tahun ajaran baru telah dibuka.",
      isi_lengkap: "<p>Detail lengkap pendaftaran...</p>",
      image_url: "https://example.com/banner.jpg",
      tanggal_terbit: "2026-08-30T00:00:00Z",
    };

    const mockSupabase = setupMockSupabase(mockArticle);

    const jsx = await Home();
    render(jsx);

    expect(mockSupabase.from).toHaveBeenCalledWith("berita");
    expect(mockSupabase.queryBuilder.eq).toHaveBeenCalledWith("status", "terbit");
    expect(mockSupabase.queryBuilder.order).toHaveBeenCalledWith("tanggal_terbit", { ascending: false });
    expect(mockSupabase.queryBuilder.limit).toHaveBeenCalledWith(1);
    expect(mockSupabase.queryBuilder.maybeSingle).toHaveBeenCalled();

    expect(screen.getByTestId("news-spotlight-modal")).toBeDefined();
    expect(screen.getByText("Spotlight: Pembukaan Pendaftaran Santri Baru")).toBeDefined();
    expect(screen.getByTestId("home-hero")).toBeDefined();
  });

  it("handles null spotlight news gracefully when no published news exists", async () => {
    setupMockSupabase(null);

    const jsx = await Home();
    render(jsx);

    expect(screen.getByTestId("news-spotlight-modal")).toBeDefined();
    expect(screen.getByText("No Spotlight News")).toBeDefined();
  });

  it("handles database errors gracefully and returns null news", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    setupMockSupabase(null, new Error("Database connection failed"));

    const jsx = await Home();
    render(jsx);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching spotlight news:", expect.any(Error));
    expect(screen.getByTestId("news-spotlight-modal")).toBeDefined();
    expect(screen.getByText("No Spotlight News")).toBeDefined();

    consoleErrorSpy.mockRestore();
  });
});
