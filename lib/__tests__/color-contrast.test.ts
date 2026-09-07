/**
 * lib/__tests__/color-contrast.test.ts
 *
 * Property-based tests for WCAG AA color contrast ratio.
 *
 * **Validates: Requirements 3.3**
 *
 * Property 2: Rasio kontras warna memenuhi WCAG AA
 * For the configured --primary (142 70% 40%) and --primary-foreground (0 0% 0%),
 * the contrast ratio must be >= 4.5:1 per WCAG 2.1 AA standard.
 */

import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { calculateContrastRatio, relativeLuminance, type HSLColor } from "../color-utils";

// CSS custom property values from app/globals.css
const PRIMARY_HSL: HSLColor = { h: 142, s: 70, l: 36 };
const PRIMARY_FOREGROUND_HSL: HSLColor = { h: 0, s: 0, l: 0 };

// WCAG AA minimum contrast ratio for normal text
const WCAG_AA_MIN_RATIO = 4.5;

describe("calculateContrastRatio", () => {
  /**
   * Property 2: Rasio kontras warna memenuhi WCAG AA
   * Validates: Requirements 3.3
   *
   * Verifies that --primary (142 70% 40%) vs --primary-foreground (0 0% 0%)
   * produces a contrast ratio >= 4.5:1.
   */
  it("primary color vs primary-foreground meets WCAG AA (>= 4.5:1)", () => {
    const ratio = calculateContrastRatio(PRIMARY_HSL, PRIMARY_FOREGROUND_HSL);
    expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_MIN_RATIO);
  });

  /**
   * Property 2 (extended): Contrast ratio is symmetric — order of arguments
   * does not affect the result, since we always use the lighter/darker pair.
   * Validates: Requirements 3.3
   */
  it("contrast ratio is symmetric (order of colors does not matter)", () => {
    fc.assert(
      fc.property(
        fc.record({
          h: fc.float({ min: 0, max: 360, noNaN: true }),
          s: fc.float({ min: 0, max: 100, noNaN: true }),
          l: fc.float({ min: 0, max: 100, noNaN: true }),
        }),
        fc.record({
          h: fc.float({ min: 0, max: 360, noNaN: true }),
          s: fc.float({ min: 0, max: 100, noNaN: true }),
          l: fc.float({ min: 0, max: 100, noNaN: true }),
        }),
        (color1, color2) => {
          const ratio1 = calculateContrastRatio(color1, color2);
          const ratio2 = calculateContrastRatio(color2, color1);
          // Allow tiny floating-point differences
          expect(Math.abs(ratio1 - ratio2)).toBeLessThan(1e-10);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2 (bounds): Contrast ratio is always in range [1, 21].
   * A color against itself gives 1:1; black vs white gives 21:1.
   * Validates: Requirements 3.3
   */
  it("contrast ratio is always between 1 and 21 for any valid HSL input", () => {
    fc.assert(
      fc.property(
        fc.record({
          h: fc.float({ min: 0, max: 360, noNaN: true }),
          s: fc.float({ min: 0, max: 100, noNaN: true }),
          l: fc.float({ min: 0, max: 100, noNaN: true }),
        }),
        fc.record({
          h: fc.float({ min: 0, max: 360, noNaN: true }),
          s: fc.float({ min: 0, max: 100, noNaN: true }),
          l: fc.float({ min: 0, max: 100, noNaN: true }),
        }),
        (color1, color2) => {
          const ratio = calculateContrastRatio(color1, color2);
          expect(ratio).toBeGreaterThanOrEqual(1);
          // 21:1 is the theoretical max (black vs white), allow tiny float margin
          expect(ratio).toBeLessThanOrEqual(21 + 1e-10);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Sanity check: black (0 0% 0%) vs white (0 0% 100%) should give 21:1.
   */
  it("black vs white gives contrast ratio of 21:1", () => {
    const black: HSLColor = { h: 0, s: 0, l: 0 };
    const white: HSLColor = { h: 0, s: 0, l: 100 };
    const ratio = calculateContrastRatio(black, white);
    expect(ratio).toBeCloseTo(21, 0);
  });

  /**
   * Sanity check: a color against itself gives 1:1.
   */
  it("same color vs itself gives contrast ratio of 1:1", () => {
    const ratio = calculateContrastRatio(PRIMARY_HSL, PRIMARY_HSL);
    expect(ratio).toBeCloseTo(1, 5);
  });
});

describe("relativeLuminance", () => {
  it("white (0 0% 100%) has luminance of 1", () => {
    const white: HSLColor = { h: 0, s: 0, l: 100 };
    expect(relativeLuminance(white)).toBeCloseTo(1, 5);
  });

  it("black (0 0% 0%) has luminance of 0", () => {
    const black: HSLColor = { h: 0, s: 0, l: 0 };
    expect(relativeLuminance(black)).toBeCloseTo(0, 5);
  });

  it("luminance is always in range [0, 1] for any valid HSL input", () => {
    fc.assert(
      fc.property(
        fc.record({
          h: fc.float({ min: 0, max: 360, noNaN: true }),
          s: fc.float({ min: 0, max: 100, noNaN: true }),
          l: fc.float({ min: 0, max: 100, noNaN: true }),
        }),
        (color) => {
          const lum = relativeLuminance(color);
          expect(lum).toBeGreaterThanOrEqual(0);
          expect(lum).toBeLessThanOrEqual(1 + 1e-10);
        }
      ),
      { numRuns: 100 }
    );
  });
});
