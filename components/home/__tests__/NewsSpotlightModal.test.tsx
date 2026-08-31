import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React, { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NewsSpotlightModal, { NewsSpotlightItem } from "../NewsSpotlightModal";

// Mock motion/react
vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, whileInView: _whileInView, initial: _initial, animate: _animate, exit: _exit, transition: _transition, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
}));

// Mock next/image
vi.mock("next/image", () => ({
  /* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */
  default: ({ fill: _fill, priority: _priority, ...props }: any) => <img {...props} />,
}));

describe("NewsSpotlightModal Component (TDD)", () => {
  const mockNews: NewsSpotlightItem = {
    id: "news-99",
    judul: "Penerimaan Peserta Didik Baru (PPDB) MIM PK Dimoro 2026 Dibuka!",
    ringkasan: "Pendaftaran santri baru MIM PK Dimoro resmi dibuka dengan kuota terbatas.",
    isi: "Informasi lengkap mengenai persyaratan dan alur pendaftaran santri baru tahun ajaran 2026/2027.",
    image_url: "/images/news-spotlight.jpg",
    tanggal_terbit: "2026-08-30",
    created_at: "2026-08-30T08:00:00Z",
  };

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("does not render if news prop is null or empty", () => {
    const { container: c1 } = render(<NewsSpotlightModal news={null} />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByText(/kabar terkini/i)).toBeNull();
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(<NewsSpotlightModal news={undefined} />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByText(/kabar terkini/i)).toBeNull();
    expect(c2.firstChild).toBeNull();
  });

  it("renders after 700ms delay when news is provided", () => {
    render(<NewsSpotlightModal news={mockNews} />);

    // Before 700ms, modal should not be visible
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.queryByText(mockNews.judul)).toBeNull();

    // After 700ms delay, modal should render
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByText(/kabar terkini/i)).toBeDefined();
    expect(screen.getByText(mockNews.judul)).toBeDefined();
    expect(screen.getByText(mockNews.ringkasan!)).toBeDefined();

    // Check CTA link
    const ctaLink = screen.getByRole("link", { name: /baca selengkapnya/i });
    expect(ctaLink).toBeDefined();
    expect(ctaLink.getAttribute("href")).toBe(`/berita/${mockNews.id}`);
  });

  it("does not render if already dismissed in this session (localStorage.getItem('mim_last_seen_news_id') === String(news.id))", () => {
    localStorage.setItem("mim_last_seen_news_id", String(mockNews.id));

    render(<NewsSpotlightModal news={mockNews} />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByText(mockNews.judul)).toBeNull();
    expect(screen.queryByText(/kabar terkini/i)).toBeNull();
  });

  it("does not render if mim_dismissed_until timestamp is in the future", () => {
    const futureTimestamp = Date.now() + 12 * 60 * 60 * 1000; // 12 hours ahead
    localStorage.setItem("mim_dismissed_until", String(futureTimestamp));

    render(<NewsSpotlightModal news={mockNews} />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByText(mockNews.judul)).toBeNull();
    expect(screen.queryByText(/kabar terkini/i)).toBeNull();
  });

  it("renders if mim_dismissed_until timestamp is in the past", () => {
    const pastTimestamp = Date.now() - 1000; // 1 second ago
    localStorage.setItem("mim_dismissed_until", String(pastTimestamp));

    render(<NewsSpotlightModal news={mockNews} />);

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getByText(mockNews.judul)).toBeDefined();
  });

  it("closes modal and updates localStorage on close button click", () => {
    render(<NewsSpotlightModal news={mockNews} />);

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getByText(mockNews.judul)).toBeDefined();

    const closeButton = screen.getByRole("button", { name: /tutup/i });
    fireEvent.click(closeButton);

    expect(screen.queryByText(mockNews.judul)).toBeNull();
    expect(localStorage.getItem("mim_last_seen_news_id")).toBe(String(mockNews.id));
  });

  it("closes modal on ESC key press", () => {
    render(<NewsSpotlightModal news={mockNews} />);

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getByText(mockNews.judul)).toBeDefined();

    fireEvent.keyDown(window, { key: "Escape", code: "Escape" });

    expect(screen.queryByText(mockNews.judul)).toBeNull();
    expect(localStorage.getItem("mim_last_seen_news_id")).toBe(String(mockNews.id));
  });

  it("saves 24h dismissal (mim_dismissed_until) when checkbox 'Jangan tampilkan lagi hari ini' is checked and modal is closed", () => {
    const baseTime = 1756600000000;
    vi.setSystemTime(baseTime);

    render(<NewsSpotlightModal news={mockNews} />);

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getByText(mockNews.judul)).toBeDefined();

    // Check the "Jangan tampilkan lagi hari ini" checkbox
    const checkbox = screen.getByRole("checkbox", { name: /jangan tampilkan lagi hari ini/i });
    fireEvent.click(checkbox);

    // Dismiss using "Nanti Saja" button
    const nantiSajaBtn = screen.getByRole("button", { name: /nanti saja/i });
    fireEvent.click(nantiSajaBtn);

    expect(screen.queryByText(mockNews.judul)).toBeNull();
    expect(localStorage.getItem("mim_last_seen_news_id")).toBe(String(mockNews.id));

    const dismissedUntil = Number(localStorage.getItem("mim_dismissed_until"));
    expect(dismissedUntil).toBe(baseTime + 700 + 24 * 60 * 60 * 1000);
  });
});
