import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FloatingSubNav, { SubNavItem } from "../FloatingSubNav";
import { BookOpen, Layers, Star } from "lucide-react";

describe("FloatingSubNav Component", () => {
  const mockItems: SubNavItem[] = [
    { id: "section-1", label: "Bagian Satu", icon: BookOpen },
    { id: "section-2", label: "Bagian Dua", icon: Layers },
    { id: "section-3", label: "Bagian Tiga", icon: Star },
  ];

  beforeEach(() => {
    class MockIntersectionObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }
    window.IntersectionObserver = MockIntersectionObserver as any;
  });

  it("renders all navigation items with labels and icons", () => {
    render(<FloatingSubNav items={mockItems} ariaLabel="Navigasi Halaman" />);

    expect(screen.getByText("Bagian Satu")).toBeDefined();
    expect(screen.getByText("Bagian Dua")).toBeDefined();
    expect(screen.getByText("Bagian Tiga")).toBeDefined();
  });

  it("has correct href anchors for each item", () => {
    render(<FloatingSubNav items={mockItems} />);

    const link1 = screen.getByText("Bagian Satu").closest("a");
    const link2 = screen.getByText("Bagian Dua").closest("a");
    const link3 = screen.getByText("Bagian Tiga").closest("a");

    expect(link1?.getAttribute("href")).toBe("#section-1");
    expect(link2?.getAttribute("href")).toBe("#section-2");
    expect(link3?.getAttribute("href")).toBe("#section-3");
  });

  it("sets active state on initial item", () => {
    render(<FloatingSubNav items={mockItems} />);

    const link1 = screen.getByText("Bagian Satu").closest("a");
    expect(link1?.className).toContain("bg-primary");
  });
});
