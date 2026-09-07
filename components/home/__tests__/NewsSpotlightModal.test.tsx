import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React, { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NewsSpotlightModal, { NewsSpotlightItem } from "../NewsSpotlightModal";

// Mock motion/react
vi.mock("motion/react", () => ({
  motion: {
    div: ({
      children,
      whileInView: _whileInView,
      initial: _initial,
      animate: _animate,
      exit: _exit,
      transition: _transition,
      ...props
    }: any) => <div {...props}>{children}</div>,
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
  const mockSingleNews: NewsSpotlightItem = {
    id: "news-99",
    judul: "Penerimaan Peserta Didik Baru (PPDB) MIM PK Dimoro 2026 Dibuka!",
    ringkasan: "Pendaftaran santri baru MIM PK Dimoro resmi dibuka dengan kuota terbatas.",
    isi: "Informasi lengkap mengenai persyaratan dan alur pendaftaran santri baru tahun ajaran 2026/2027.",
    image_url: "/images/news-spotlight.jpg",
    tanggal_terbit: "2026-08-30",
    created_at: "2026-08-30T08:00:00Z",
  };

  const mockNewsList: NewsSpotlightItem[] = [
    {
      id: "news-1",
      judul: "Berita Pertama: Prestasi Siswa di Olimpiade Sains",
      ringkasan: "Santri MIM PK Dimoro meraih medali emas pada ajang nasional.",
      image_url: "/images/news-1.jpg",
      tanggal_terbit: "2026-08-30",
    },
    {
      id: "news-2",
      judul: "Berita Kedua: Perkemahan Hizbul Wathan 2026",
      ringkasan: "Kegiatan kepanduan tahunan melatih kemandirian santri.",
      image_url: "/images/news-2.jpg",
      tanggal_terbit: "2026-08-28",
    },
    {
      id: "news-3",
      judul: "Berita Ketiga: Workshop Parenting Islami",
      ringkasan: "Sinergi wali murid dan guru dalam mendidik generasi Qurani.",
      image_url: "/images/news-3.jpg",
      tanggal_terbit: "2026-08-25",
    },
    {
      id: "news-4",
      judul: "Berita Keempat: Kunjungan Edukatif Museum",
      ringkasan: "Santri belajar sejarah peradaban Islam.",
      image_url: "/images/news-4.jpg",
      tanggal_terbit: "2026-08-20",
    },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("does not render if news prop is null, undefined, or empty array", () => {
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

    const { container: c3 } = render(<NewsSpotlightModal news={[]} />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByText(/kabar terkini/i)).toBeNull();
    expect(c3.firstChild).toBeNull();
  });

  it("does not render if news array contains only invalid items (missing id or judul)", () => {
    const invalidItems = [
      { id: "", judul: "" },
      { id: "news-invalid", judul: "" },
      { id: "", judul: "Judul tanpa ID" },
    ] as NewsSpotlightItem[];

    const { container } = render(<NewsSpotlightModal news={invalidItems} />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByText(/kabar terkini/i)).toBeNull();
    expect(container.firstChild).toBeNull();
  });

  it("renders single item correctly after 700ms delay when passed single object", () => {
    render(<NewsSpotlightModal news={mockSingleNews} />);

    // Before 700ms delay
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.queryByText(mockSingleNews.judul)).toBeNull();

    // After 700ms delay
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByText(/kabar terkini/i)).toBeDefined();
    expect(screen.getByText(mockSingleNews.judul)).toBeDefined();
    expect(screen.getByText(mockSingleNews.ringkasan!)).toBeDefined();

    // Navigation buttons and pagination pills should NOT be rendered for single item
    expect(screen.queryByRole("button", { name: /berita sebelumnya/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /berita selanjutnya/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /lihat slide/i })).toBeNull();

    // Check CTA link
    const ctaLink = screen.getByRole("link", { name: /baca selengkapnya/i });
    expect(ctaLink).toBeDefined();
    expect(ctaLink.getAttribute("href")).toBe(`/berita/${mockSingleNews.id}`);
  });

  it("renders single item array without navigation buttons or pagination dots", () => {
    render(<NewsSpotlightModal news={[mockSingleNews]} />);

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getByText(mockSingleNews.judul)).toBeDefined();
    expect(screen.queryByRole("button", { name: /berita sebelumnya/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /berita selanjutnya/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /lihat slide/i })).toBeNull();
  });

  it("renders multi-item carousel with slide counter badge and navigation controls", () => {
    render(<NewsSpotlightModal news={mockNewsList} />);

    act(() => {
      vi.advanceTimersByTime(700);
    });

    // Initial render shows item 0
    expect(screen.getByText(mockNewsList[0].judul)).toBeDefined();
    expect(screen.getByText(mockNewsList[0].ringkasan!)).toBeDefined();

    // Counter badge shows 1 / 4
    expect(screen.getByText(/kabar terkini • 1\/4/i)).toBeDefined();

    // Previous and Next buttons are rendered
    expect(screen.getByRole("button", { name: /berita sebelumnya/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /berita selanjutnya/i })).toBeDefined();

    // 4 pagination pill buttons are rendered
    const pills = screen.getAllByRole("button", { name: /lihat slide/i });
    expect(pills.length).toBe(4);
  });

  it("advances currentIndex on next button click and wraps around from last to first", () => {
    render(<NewsSpotlightModal news={mockNewsList} />);

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getByText(mockNewsList[0].judul)).toBeDefined();

    const nextBtn = screen.getByRole("button", { name: /berita selanjutnya/i });

    // Click Next -> Item 1 (Slide 2)
    fireEvent.click(nextBtn);
    expect(screen.getByText(mockNewsList[1].judul)).toBeDefined();
    expect(screen.getByText(/kabar terkini • 2\/4/i)).toBeDefined();

    // Click Next -> Item 2 (Slide 3)
    fireEvent.click(nextBtn);
    expect(screen.getByText(mockNewsList[2].judul)).toBeDefined();
    expect(screen.getByText(/kabar terkini • 3\/4/i)).toBeDefined();

    // Click Next -> Item 3 (Slide 4)
    fireEvent.click(nextBtn);
    expect(screen.getByText(mockNewsList[3].judul)).toBeDefined();
    expect(screen.getByText(/kabar terkini • 4\/4/i)).toBeDefined();

    // Click Next -> Wraps to Item 0 (Slide 1)
    fireEvent.click(nextBtn);
    expect(screen.getByText(mockNewsList[0].judul)).toBeDefined();
    expect(screen.getByText(/kabar terkini • 1\/4/i)).toBeDefined();
  });

  it("moves currentIndex to previous item on prev button click and wraps around from first to last", () => {
    render(<NewsSpotlightModal news={mockNewsList} />);

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getByText(mockNewsList[0].judul)).toBeDefined();

    const prevBtn = screen.getByRole("button", { name: /berita sebelumnya/i });

    // Click Prev from first item -> Wraps to last item (Slide 4)
    fireEvent.click(prevBtn);
    expect(screen.getByText(mockNewsList[3].judul)).toBeDefined();
    expect(screen.getByText(/kabar terkini • 4\/4/i)).toBeDefined();

    // Click Prev again -> Slide 3
    fireEvent.click(prevBtn);
    expect(screen.getByText(mockNewsList[2].judul)).toBeDefined();
    expect(screen.getByText(/kabar terkini • 3\/4/i)).toBeDefined();
  });

  it("jumps to specific slide when clicking a pagination pill indicator", () => {
    render(<NewsSpotlightModal news={mockNewsList} />);

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getByText(mockNewsList[0].judul)).toBeDefined();

    // Click pill for slide 3 (index 2)
    const slide3Pill = screen.getByRole("button", { name: /lihat slide 3/i });
    fireEvent.click(slide3Pill);

    expect(screen.getByText(mockNewsList[2].judul)).toBeDefined();
    expect(screen.getByText(/kabar terkini • 3\/4/i)).toBeDefined();

    // Click pill for slide 1 (index 0)
    const slide1Pill = screen.getByRole("button", { name: /lihat slide 1/i });
    fireEvent.click(slide1Pill);

    expect(screen.getByText(mockNewsList[0].judul)).toBeDefined();
    expect(screen.getByText(/kabar terkini • 1\/4/i)).toBeDefined();
  });

  it("auto-advances every 5000ms to next slide", () => {
    render(<NewsSpotlightModal news={mockNewsList} />);

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getByText(mockNewsList[0].judul)).toBeDefined();

    // After 5000ms -> advances to slide 2
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText(mockNewsList[1].judul)).toBeDefined();

    // After another 5000ms -> advances to slide 3
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText(mockNewsList[2].judul)).toBeDefined();
  });

  it("pauses auto-advance on mouse enter and resumes on mouse leave", () => {
    render(<NewsSpotlightModal news={mockNewsList} />);

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getByText(mockNewsList[0].judul)).toBeDefined();

    const dialog = screen.getByRole("dialog");

    // Hover enters -> pause
    fireEvent.mouseEnter(dialog);

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // Should still be on item 0 because it was paused
    expect(screen.getByText(mockNewsList[0].judul)).toBeDefined();

    // Hover leaves -> resume
    fireEvent.mouseLeave(dialog);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Should now advance to item 1
    expect(screen.getByText(mockNewsList[1].judul)).toBeDefined();
  });

  it("pauses auto-advance on focus and resumes on blur", () => {
    render(<NewsSpotlightModal news={mockNewsList} />);

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getByText(mockNewsList[0].judul)).toBeDefined();

    const dialog = screen.getByRole("dialog");

    // Focus enters -> pause
    fireEvent.focus(dialog);

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(screen.getByText(mockNewsList[0].judul)).toBeDefined();

    // Blur -> resume
    fireEvent.blur(dialog);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText(mockNewsList[1].judul)).toBeDefined();
  });

  it("limits items to maximum 5 items if more are provided", () => {
    const manyItems: NewsSpotlightItem[] = Array.from({ length: 8 }, (_, i) => ({
      id: `news-${i + 1}`,
      judul: `Berita Ke-${i + 1}`,
      ringkasan: `Ringkasan berita ke-${i + 1}`,
    }));

    render(<NewsSpotlightModal news={manyItems} />);

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getByText(/kabar terkini • 1\/5/i)).toBeDefined();
    const pills = screen.getAllByRole("button", { name: /lihat slide/i });
    expect(pills.length).toBe(5);
  });

  it("does not render if already dismissed in this session (matching top news item items[0].id)", () => {
    localStorage.setItem("mim_last_seen_news_id", String(mockNewsList[0].id));

    render(<NewsSpotlightModal news={mockNewsList} />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByText(mockNewsList[0].judul)).toBeNull();
    expect(screen.queryByText(/kabar terkini/i)).toBeNull();
  });

  it("does not render if mim_dismissed_until timestamp is in the future", () => {
    const futureTimestamp = Date.now() + 12 * 60 * 60 * 1000; // 12 hours ahead
    localStorage.setItem("mim_dismissed_until", String(futureTimestamp));

    render(<NewsSpotlightModal news={mockNewsList} />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByText(mockNewsList[0].judul)).toBeNull();
    expect(screen.queryByText(/kabar terkini/i)).toBeNull();
  });

  it("renders if mim_dismissed_until timestamp is in the past", () => {
    const pastTimestamp = Date.now() - 1000; // 1 second ago
    localStorage.setItem("mim_dismissed_until", String(pastTimestamp));

    render(<NewsSpotlightModal news={mockNewsList} />);

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getByText(mockNewsList[0].judul)).toBeDefined();
  });

  it("closes modal and saves top news id (items[0].id) on close button click", () => {
    render(<NewsSpotlightModal news={mockNewsList} />);

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getByText(mockNewsList[0].judul)).toBeDefined();

    // Advance to slide 2 before closing
    const nextBtn = screen.getByRole("button", { name: /berita selanjutnya/i });
    fireEvent.click(nextBtn);
    expect(screen.getByText(mockNewsList[1].judul)).toBeDefined();

    const closeButton = screen.getByRole("button", { name: /tutup warta spotlight/i });
    fireEvent.click(closeButton);

    expect(screen.queryByText(mockNewsList[1].judul)).toBeNull();
    // Saved ID should be top news ID (items[0].id)
    expect(localStorage.getItem("mim_last_seen_news_id")).toBe(String(mockNewsList[0].id));
  });

  it("closes modal on 'Nanti Saja' button click", () => {
    render(<NewsSpotlightModal news={mockNewsList} />);

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getByText(mockNewsList[0].judul)).toBeDefined();

    const nantiSajaBtn = screen.getByRole("button", { name: /nanti saja/i });
    fireEvent.click(nantiSajaBtn);

    expect(screen.queryByText(mockNewsList[0].judul)).toBeNull();
    expect(localStorage.getItem("mim_last_seen_news_id")).toBe(String(mockNewsList[0].id));
  });

  it("closes modal on ESC key press", () => {
    render(<NewsSpotlightModal news={mockNewsList} />);

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getByText(mockNewsList[0].judul)).toBeDefined();

    fireEvent.keyDown(window, { key: "Escape", code: "Escape" });

    expect(screen.queryByText(mockNewsList[0].judul)).toBeNull();
    expect(localStorage.getItem("mim_last_seen_news_id")).toBe(String(mockNewsList[0].id));
  });

  it("closes modal on backdrop click", () => {
    render(<NewsSpotlightModal news={mockNewsList} />);

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getByText(mockNewsList[0].judul)).toBeDefined();

    const backdrop = screen.getByRole("dialog");
    fireEvent.click(backdrop);

    expect(screen.queryByText(mockNewsList[0].judul)).toBeNull();
    expect(localStorage.getItem("mim_last_seen_news_id")).toBe(String(mockNewsList[0].id));
  });

  it("saves 24h dismissal (mim_dismissed_until) when checkbox is checked and modal is closed", () => {
    const baseTime = 1756600000000;
    vi.setSystemTime(baseTime);

    render(<NewsSpotlightModal news={mockNewsList} />);

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getByText(mockNewsList[0].judul)).toBeDefined();

    // Check the "Jangan tampilkan lagi hari ini" checkbox
    const checkbox = screen.getByRole("checkbox", { name: /jangan tampilkan lagi hari ini/i });
    fireEvent.click(checkbox);

    // Dismiss using "Nanti Saja" button
    const nantiSajaBtn = screen.getByRole("button", { name: /nanti saja/i });
    fireEvent.click(nantiSajaBtn);

    expect(screen.queryByText(mockNewsList[0].judul)).toBeNull();
    expect(localStorage.getItem("mim_last_seen_news_id")).toBe(String(mockNewsList[0].id));

    const dismissedUntil = Number(localStorage.getItem("mim_dismissed_until"));
    expect(dismissedUntil).toBe(baseTime + 700 + 24 * 60 * 60 * 1000);
  });
});
