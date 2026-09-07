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
      {Array.isArray(news) && news.length > 0
        ? `Spotlight (${news.length} items): ${news.map((n) => n.judul).join(", ")}`
        : news && !Array.isArray(news)
        ? `Spotlight: ${news.judul}`
        : "No Spotlight News"}
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

  const setupMockSupabase = (data: any = [], error: any = null) => {
    const queryBuilder: any = {
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data, error }),
      maybeSingle: vi.fn().mockResolvedValue({ data, error }),
    };

    const mockSelect = vi.fn().mockReturnValue(queryBuilder);
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: mockSelect,
      }),
      queryBuilder,
      mockSelect,
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
    return mockSupabase;
  };

  it("fetches up to 5 published news items and renders NewsSpotlightModal with data", async () => {
    const mockArticles = [
      {
        id: "news-1",
        judul: "Pembukaan Pendaftaran Santri Baru",
        ringkasan: "Pendaftaran tahun ajaran baru telah dibuka.",
        isi_lengkap: "<p>Detail lengkap pendaftaran...</p>",
        image_url: "https://example.com/banner1.jpg",
        tanggal_terbit: "2026-08-30T00:00:00Z",
      },
      {
        id: "news-2",
        judul: "Prestasi Juara 1 Tahfidz Tingkat Kabupaten",
        ringkasan: "Santri MIM PK Dimoro meraih prestasi membanggakan.",
        isi_lengkap: "<p>Detail lomba...</p>",
        image_url: "https://example.com/banner2.jpg",
        tanggal_terbit: "2026-08-28T00:00:00Z",
      },
    ];

    const mockSupabase = setupMockSupabase(mockArticles);

    const jsx = await Home();
    render(jsx);

    expect(mockSupabase.from).toHaveBeenCalledWith("berita");
    expect(mockSupabase.mockSelect).toHaveBeenCalledWith(
      "id, judul, ringkasan, isi_lengkap, image_url, tanggal_terbit"
    );
    expect(mockSupabase.queryBuilder.eq).toHaveBeenCalledWith("status", "terbit");
    expect(mockSupabase.queryBuilder.order).toHaveBeenCalledWith("tanggal_terbit", { ascending: false });
    expect(mockSupabase.queryBuilder.limit).toHaveBeenCalledWith(5);

    expect(screen.getByTestId("news-spotlight-modal")).toBeDefined();
    expect(
      screen.getByText(
        "Spotlight (2 items): Pembukaan Pendaftaran Santri Baru, Prestasi Juara 1 Tahfidz Tingkat Kabupaten"
      )
    ).toBeDefined();
    expect(screen.getByTestId("home-hero")).toBeDefined();
  });

  it("handles null or empty spotlight news gracefully when no published news exists", async () => {
    setupMockSupabase([]);

    const jsx = await Home();
    render(jsx);

    expect(screen.getByTestId("news-spotlight-modal")).toBeDefined();
    expect(screen.getByText("No Spotlight News")).toBeDefined();
  });

  it("handles null data from query gracefully and passes empty list", async () => {
    setupMockSupabase(null);

    const jsx = await Home();
    render(jsx);

    expect(screen.getByTestId("news-spotlight-modal")).toBeDefined();
    expect(screen.getByText("No Spotlight News")).toBeDefined();
  });

  it("handles database errors gracefully and returns empty array", async () => {
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
