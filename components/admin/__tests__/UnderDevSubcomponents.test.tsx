import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { UnderDevBadge } from "../under-development/UnderDevBadge";
import { UnderDevProgress } from "../under-development/UnderDevProgress";
import type { UnderDevStatus } from "../under-development/types";

describe("UnderDevBadge Component", () => {
  it("renders with default status (in_progress) and default label", () => {
    render(<UnderDevBadge />);
    const badge = screen.getByRole("status");
    expect(badge).toBeDefined();
    expect(badge.textContent).toMatch(/Dalam Pengembangan|Dalam Pengerjaan/i);
  });

  it("renders each known status with appropriate default text", () => {
    const statusMap: Record<UnderDevStatus, RegExp> = {
      planned: /Direncanakan/i,
      in_progress: /Dalam Pengerjaan|Dalam Pengembangan/i,
      beta: /Beta/i,
      testing: /Pengujian/i,
      completed: /Selesai/i,
      maintenance: /Pemeliharaan/i,
      coming_soon: /Segera Hadir/i,
    };

    (Object.keys(statusMap) as UnderDevStatus[]).forEach((status) => {
      const { unmount } = render(<UnderDevBadge status={status} />);
      expect(screen.getByText(statusMap[status])).toBeDefined();
      unmount();
    });
  });

  it("renders custom label when label prop is provided", () => {
    render(<UnderDevBadge status="in_progress" label="Tahap Riset" />);
    expect(screen.getByText("Tahap Riset")).toBeDefined();
  });

  it("hides icon when showIcon is false", () => {
    const { container } = render(<UnderDevBadge status="in_progress" showIcon={false} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeNull();
  });

  it("renders icon by default", () => {
    const { container } = render(<UnderDevBadge status="in_progress" showIcon={true} />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
  });

  it("handles unknown or custom status gracefully", () => {
    render(<UnderDevBadge status={"custom_unknown_status" as UnderDevStatus} label="Status Kustom" />);
    expect(screen.getByText("Status Kustom")).toBeDefined();
  });

  it("applies custom className and size classes", () => {
    const { container: cSm } = render(<UnderDevBadge size="sm" className="custom-test-class" />);
    expect(cSm.firstChild).toBeDefined();
    expect((cSm.firstChild as HTMLElement).className).toContain("custom-test-class");
    expect((cSm.firstChild as HTMLElement).className).toContain("text-xs");

    const { container: cLg } = render(<UnderDevBadge size="lg" />);
    expect((cLg.firstChild as HTMLElement).className).toContain("text-sm");
  });
});

describe("UnderDevProgress Component", () => {
  it("renders progress bar with correct percentage width", () => {
    const { container } = render(<UnderDevProgress value={65} />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeDefined();
    expect(progressBar.getAttribute("aria-valuenow")).toBe("65");
    expect(progressBar.getAttribute("aria-valuemin")).toBe("0");
    expect(progressBar.getAttribute("aria-valuemax")).toBe("100");

    const indicator = container.querySelector("[data-testid='progress-indicator']") || container.querySelector(".bg-emerald-600, .bg-amber-500, [style*='width']");
    expect(indicator).toBeDefined();
    expect((indicator as HTMLElement).style.width).toBe("65%");
  });

  it("clamps progress values below 0 and above 100", () => {
    const { container: cNegative } = render(<UnderDevProgress value={-20} />);
    const progressNegative = cNegative.querySelector("[role='progressbar']");
    expect(progressNegative?.getAttribute("aria-valuenow")).toBe("-20");
    const indNeg = cNegative.querySelector("[data-testid='progress-indicator']");
    expect((indNeg as HTMLElement).style.width).toBe("0%");

    const { container: cOver } = render(<UnderDevProgress value={150} />);
    const indOver = cOver.querySelector("[data-testid='progress-indicator']");
    expect((indOver as HTMLElement).style.width).toBe("100%");
  });

  it("computes percentage accurately with custom max prop", () => {
    const { container } = render(<UnderDevProgress value={25} max={50} />);
    const indicator = container.querySelector("[data-testid='progress-indicator']");
    expect((indicator as HTMLElement).style.width).toBe("50%");
    expect(screen.getByText("50%")).toBeDefined();
  });

  it("handles max <= 0 safely without NaN", () => {
    const { container } = render(<UnderDevProgress value={10} max={0} />);
    const indicator = container.querySelector("[data-testid='progress-indicator']");
    expect((indicator as HTMLElement).style.width).toBe("0%");
  });

  it("displays label and percentage text when provided", () => {
    render(<UnderDevProgress value={75} label="Progress Pengerjaan" showPercentage={true} />);
    expect(screen.getByText("Progress Pengerjaan")).toBeDefined();
    expect(screen.getByText("75%")).toBeDefined();
  });

  it("hides percentage text when showPercentage is false", () => {
    render(<UnderDevProgress value={75} label="Progress Pengerjaan" showPercentage={false} />);
    expect(screen.getByText("Progress Pengerjaan")).toBeDefined();
    expect(screen.queryByText("75%")).toBeNull();
  });

  it("applies custom className and barClassName", () => {
    const { container } = render(
      <UnderDevProgress
        value={50}
        className="wrapper-custom-class"
        barClassName="bar-custom-class"
      />
    );
    expect(container.firstChild).toBeDefined();
    expect((container.firstChild as HTMLElement).className).toContain("wrapper-custom-class");
    const indicator = container.querySelector("[data-testid='progress-indicator']");
    expect((indicator as HTMLElement).className).toContain("bar-custom-class");
  });

  it("applies correct track height based on size prop", () => {
    const { container: cSm } = render(<UnderDevProgress value={50} size="sm" />);
    const trackSm = cSm.querySelector("[role='progressbar']");
    expect(trackSm?.className).toContain("h-1.5");

    const { container: cMd } = render(<UnderDevProgress value={50} size="md" />);
    const trackMd = cMd.querySelector("[role='progressbar']");
    expect(trackMd?.className).toContain("h-2.5");

    const { container: cLg } = render(<UnderDevProgress value={50} size="lg" />);
    const trackLg = cLg.querySelector("[role='progressbar']");
    expect(trackLg?.className).toContain("h-4");
  });
});
