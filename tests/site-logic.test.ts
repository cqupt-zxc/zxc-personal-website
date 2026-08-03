import { describe, expect, it } from "vitest";
import { createPrivateAccessToken, isAdminEmail, privateCookieName, selectedRepositoryNames, verifyPrivateAccessToken } from "../lib/site-logic";
import { contentFromFormValues } from "../lib/admin-content";
import { getHonorCardOffset, getHonorPageLabel, getNextHonorIndex } from "../lib/honor-carousel";
import { formatSceneLabel, normalizeSceneIndex } from "../lib/scene-navigation";
import { getNextDistDir } from "../lib/next-dist-dir";

describe("site access rules", () => {
  it("allows only emails explicitly listed as administrators", () => {
    expect(isAdminEmail("owner@example.com", "owner@example.com, admin@example.com")).toBe(true);
    expect(isAdminEmail("visitor@example.com", "owner@example.com, admin@example.com")).toBe(false);
  });

  it("uses a stable, HttpOnly private archive cookie name", () => {
    expect(privateCookieName).toBe("private_archive_access");
  });

  it("signs private archive access with an expiry and rejects tampering", () => {
    const now = 1_800_000_000_000;
    const token = createPrivateAccessToken("server-only-secret", now, 60_000);
    expect(verifyPrivateAccessToken(token, "server-only-secret", now + 30_000)).toBe(true);
    expect(verifyPrivateAccessToken(`${token}x`, "server-only-secret", now + 30_000)).toBe(false);
    expect(verifyPrivateAccessToken(token, "server-only-secret", now + 60_001)).toBe(false);
    expect(verifyPrivateAccessToken(token, "different-secret", now + 30_000)).toBe(false);
  });
});

describe("featured repositories", () => {
  it("keeps manual order and removes duplicate repository names", () => {
    expect(selectedRepositoryNames(["site", "research", "site"])).toEqual(["site", "research"]);
  });
});

describe("admin content form", () => {
  it("converts section fields into publishable site content", () => {
    const content = contentFromFormValues({
      name: "林见", role: "研究者", location: "上海", intro: "介绍", email: "me@example.com",
      projects: [{ name: "folio", description: "作品", url: "https://github.com/me/folio", language: "TypeScript", stars: "12" }],
      honors: [{ year: "2026", title: "奖项", issuer: "学校" }],
      education: [{ period: "2024 — 至今", degree: "硕士", school: "大学", detail: "研究" }],
      timeline: [{ date: "2025.10", city: "杭州", note: "记录", imageUrl: "" }]
    });
    expect(content.projects[0].stars).toBe(12);
    expect(content.timeline[0].imageUrl).toBeUndefined();
    expect(content.name).toBe("林见");
  });
});

describe("honor carousel", () => {
  it("wraps controls at both ends of the honor list", () => {
    expect(getNextHonorIndex(0, -1, 3)).toBe(2);
    expect(getNextHonorIndex(2, 1, 3)).toBe(0);
  });

  it("formats the visible honor position as a two digit label", () => {
    expect(getHonorPageLabel(1, 5)).toBe("02 / 05");
  });

  it("keeps adjacent honor cards on their expected side of the active card", () => {
    expect(getHonorCardOffset(2, 0, 3)).toBe(-1);
    expect(getHonorCardOffset(1, 0, 3)).toBe(1);
  });
});

describe("scene navigation", () => {
  it("clamps observed scene indexes to the available chapter range", () => {
    expect(normalizeSceneIndex(-1, 5)).toBe(0);
    expect(normalizeSceneIndex(8, 5)).toBe(4);
  });

  it("formats the active chapter with leading zeroes", () => {
    expect(formatSceneLabel(2, 5)).toBe("03 / 05");
  });
});

describe("Next.js build output", () => {
  it("isolates live development assets from production builds", () => {
    expect(getNextDistDir("development")).toBe(".next-dev");
    expect(getNextDistDir("production")).toBe(".next");
    expect(getNextDistDir(undefined)).toBe(".next");
  });
});
