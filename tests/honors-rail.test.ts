import { describe, expect, it } from "vitest";
import { normalizeHonorIndex } from "../lib/honors-rail";

describe("normalizeHonorIndex", () => {
  it("wraps forward and backward across the collection", () => {
    expect(normalizeHonorIndex(3, 3)).toBe(0);
    expect(normalizeHonorIndex(-1, 3)).toBe(2);
  });

  it("preserves valid indexes and safely handles empty collections", () => {
    expect(normalizeHonorIndex(1, 3)).toBe(1);
    expect(normalizeHonorIndex(5, 0)).toBe(0);
  });
});
