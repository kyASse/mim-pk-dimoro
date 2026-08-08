import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import VisionMission from "../VisionMission";
import EducatorsSection from "../EducatorsSection";
import AboutUs from "@/app/tentang-kami/page";
import { HEADMASTER_WELCOME, VISION_MISSION, COMPETENT_EDUCATORS, EXCELLENT_PROGRAMS } from "@/lib/school-data";

// Setup global mocks for test environment
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock Supabase client to avoid environment variable errors when rendering child components like Achievements
vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
  })),
}));

// Mock framer-motion & motion/react to avoid IntersectionObserver errors in test environment
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("Tentang Kami Sections", () => {
  it("renders VisionMission component with vision, indicators, and missions", () => {
    render(<VisionMission />);

    expect(screen.getByText("Visi & Misi Madrasah")).toBeDefined();
    expect(screen.getByText(`"${VISION_MISSION.motto}"`)).toBeDefined();
    expect(screen.getByText(VISION_MISSION.vision)).toBeDefined();
    expect(screen.getByText("7 Indikator Visi")).toBeDefined();
    expect(screen.getByText("8 Misi Utama")).toBeDefined();

    // Check first vision indicator and first mission
    expect(screen.getByText(VISION_MISSION.visionIndicators[0])).toBeDefined();
    expect(screen.getByText(VISION_MISSION.missions[0])).toBeDefined();
  });

  it("renders EducatorsSection component with programs and commitments", () => {
    render(<EducatorsSection />);

    expect(screen.getByText(COMPETENT_EDUCATORS.title)).toBeDefined();
    expect(screen.getByText(COMPETENT_EDUCATORS.description)).toBeDefined();
    expect(screen.getByText("Program Pengembangan & Peningkatan Kualitas Guru")).toBeDefined();
    expect(screen.getByText("Komitmen Pendidik MIM PK Dimoro")).toBeDefined();

    // Check first program and first commitment
    expect(screen.getByText(COMPETENT_EDUCATORS.programs[0])).toBeDefined();
    expect(screen.getByText(COMPETENT_EDUCATORS.commitments[0])).toBeDefined();
  });

  it("renders AboutUs page with Headmaster Welcome, Graduate Profiles, and child sections", () => {
    render(<AboutUs />);

    // Headmaster Welcome
    expect(screen.getByText(HEADMASTER_WELCOME.name)).toBeDefined();
    expect(screen.getByText(HEADMASTER_WELCOME.title)).toBeDefined();
    expect(screen.getByText(HEADMASTER_WELCOME.paragraphs[0])).toBeDefined();
    expect(screen.getByText(HEADMASTER_WELCOME.paragraphs[1])).toBeDefined();

    // Graduate profiles
    expect(screen.getByText("Profil Lulusan")).toBeDefined();
    expect(screen.getByText(EXCELLENT_PROGRAMS.graduateProfiles[0])).toBeDefined();

    // Sub-components presence
    expect(screen.getByText("Visi Utama")).toBeDefined();
    expect(screen.getByText(COMPETENT_EDUCATORS.title)).toBeDefined();
  });
});
