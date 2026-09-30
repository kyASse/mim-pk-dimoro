import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import IKWMVideoSection from "../IKWMVideoSection";

describe("IKWMVideoSection Component", () => {
  let observerCallback: ((entries: IntersectionObserverEntry[]) => void) | null = null;
  const observeMock = vi.fn();
  const unobserveMock = vi.fn();
  const disconnectMock = vi.fn();

  beforeEach(() => {
    observerCallback = null;
    vi.clearAllMocks();

    class MockIntersectionObserver {
      constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
        observerCallback = callback;
      }
      observe = observeMock;
      unobserve = unobserveMock;
      disconnect = disconnectMock;
    }

    window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
    global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  it("harus merender null saat display_mode bernilai 'hidden'", () => {
    const { container } = render(
      <IKWMVideoSection
        video={{
          display_mode: "hidden",
          youtube_url: "",
          judul: "",
          deskripsi: "",
          placeholder_title: "",
          placeholder_desc: "",
        }}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("harus merender kartu teaser placeholder saat display_mode bernilai 'placeholder'", () => {
    render(
      <IKWMVideoSection
        video={{
          display_mode: "placeholder",
          youtube_url: "",
          judul: "Video Liputan",
          deskripsi: "Deskripsi",
          placeholder_title: "Dokumentasi Profil Sedang Diproduksi",
          placeholder_desc: "Nantikan liputan kegiatan kami segera.",
        }}
      />
    );
    expect(screen.getByText("Dokumentasi Profil Sedang Diproduksi")).toBeDefined();
    expect(screen.getByText("Segera Hadir")).toBeDefined();
    expect(screen.getByText(/Nantikan liputan kegiatan kami/i)).toBeDefined();
  });

  it("harus merender iframe YouTube saat display_mode bernilai 'active'", () => {
    render(
      <IKWMVideoSection
        video={{
          display_mode: "active",
          youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          judul: "Video Kegiatan Parenting",
          deskripsi: "Dokumentasi pertemuan wali murid.",
          placeholder_title: "",
          placeholder_desc: "",
        }}
      />
    );
    const iframe = screen.getByTitle("Video Kegiatan Parenting");
    expect(iframe).toBeDefined();
    expect(iframe.getAttribute("src")).toContain("dQw4w9WgXcQ");
    expect(iframe.getAttribute("src")).toContain("enablejsapi=1");
  });

  it("harus melakukan fallback ke kartu placeholder saat display_mode 'active' tetapi URL YouTube tidak valid", () => {
    render(
      <IKWMVideoSection
        video={{
          display_mode: "active",
          youtube_url: "invalid-url",
          judul: "Video Liputan",
          deskripsi: "Deskripsi",
          placeholder_title: "Dokumentasi Profil Sedang Diproduksi",
          placeholder_desc: "Nantikan liputan kegiatan kami segera.",
        }}
      />
    );
    expect(screen.getByText("Dokumentasi Profil Sedang Diproduksi")).toBeDefined();
    expect(screen.getByText("Segera Hadir")).toBeDefined();
    expect(screen.queryByTitle("Video Liputan")).toBeNull();
  });

  it("harus dapat beralih antara bisukan dan buka suara saat tombol suara diklik", () => {
    render(
      <IKWMVideoSection
        video={{
          display_mode: "active",
          youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          judul: "Video Kegiatan Parenting",
          deskripsi: "Dokumentasi pertemuan wali murid.",
          placeholder_title: "",
          placeholder_desc: "",
        }}
      />
    );

    const iframe = screen.getByTitle("Video Kegiatan Parenting");
    expect(iframe.getAttribute("src")).toContain("mute=1");

    const soundToggle = screen.getByRole("button", { name: /Buka Suara/i });
    expect(soundToggle).toBeDefined();

    fireEvent.click(soundToggle);
    expect(iframe.getAttribute("src")).toContain("mute=0");
    expect(screen.getByRole("button", { name: /Bisukan/i })).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: /Bisukan/i }));
    expect(iframe.getAttribute("src")).toContain("mute=1");
  });

  it("harus mengaktifkan autoplay saat elemen masuk ke viewport melalui IntersectionObserver", () => {
    render(
      <IKWMVideoSection
        video={{
          display_mode: "active",
          youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          judul: "Video Kegiatan Parenting",
          deskripsi: "Dokumentasi pertemuan wali murid.",
          placeholder_title: "",
          placeholder_desc: "",
        }}
      />
    );

    const iframe = screen.getByTitle("Video Kegiatan Parenting");
    expect(iframe.getAttribute("src")).toContain("autoplay=0");

    if (observerCallback) {
      act(() => {
        observerCallback!([
          {
            isIntersecting: true,
            target: {} as Element,
            boundingClientRect: {} as DOMRectReadOnly,
            intersectionRatio: 0.5,
            intersectionRect: {} as DOMRectReadOnly,
            rootBounds: null,
            time: Date.now(),
          },
        ]);
      });
    }

    expect(iframe.getAttribute("src")).toContain("autoplay=1");
  });
});
