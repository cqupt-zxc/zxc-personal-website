import { describe, expect, it } from "vitest";
import { getProjectVisuals } from "../lib/project-visuals";

describe("getProjectVisuals", () => {
  it("trims, deduplicates, prioritizes the cover, and caps output at three", () => {
    expect(getProjectVisuals({
      name: "A",
      description: "",
      url: "#",
      coverImageUrl: " cover ",
      galleryImageUrls: ["", "one", "one", "two", "three"],
    })).toEqual(["cover", "one", "two"]);
  });

  it("returns an empty collection when no usable image URLs exist", () => {
    expect(getProjectVisuals({ name: "A", description: "", url: "#" })).toEqual([]);
  });
});
