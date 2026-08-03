import { describe, expect, it } from "vitest";
import { demoContent } from "../lib/demo-content";

describe("portfolio fallback projects", () => {
  it("links the visible portfolio cards to Zhang Xuancheng's public GitHub work", () => {
    expect(demoContent.projects.map(({ name, url }) => ({ name, url }))).toEqual([
      { name: "SmartBin-AI-Pi4B", url: "https://github.com/cqupt-zxc/SmartBin-AI-Pi4B" },
      { name: "PreSchedule", url: "https://github.com/cqupt-zxc/PreSchedule" },
      { name: "Minist", url: "https://github.com/cqupt-zxc/Minist" },
    ]);
  });
});
