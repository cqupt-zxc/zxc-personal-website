import { describe, expect, it } from "vitest";
import { demoContent } from "../lib/demo-content";
import * as siteLogic from "../lib/site-logic";
import type { Project, SiteContent } from "../lib/types";

const baseProjects: Project[] = [
  { name: "First", description: "First project", url: "https://example.com/first", language: "TypeScript" },
  { name: "Second", description: "Second project", url: "https://example.com/second" },
  { name: "Third", description: "Third project", url: "https://example.com/third" },
];

describe("featured project enrichment", () => {
  it("keeps the configured project order when only some GitHub repositories enrich", () => {
    const merge = (siteLogic as { mergeFeaturedProjects?: (defaults: Project[], enrichment: Project[]) => Project[] }).mergeFeaturedProjects;

    expect(merge).toBeTypeOf("function");
    if (!merge) return;

    expect(merge(baseProjects, [
      { name: "Second", description: "Updated from GitHub", url: "https://github.com/example/second", stars: 12 },
    ])).toEqual([
      baseProjects[0],
      { ...baseProjects[1], description: "Updated from GitHub", url: "https://github.com/example/second", stars: 12 },
      baseProjects[2],
    ]);

    expect(merge(baseProjects, [
      { name: "First", description: "", url: "", language: "" },
    ])).toEqual(baseProjects);
  });

  it("keeps the current projects when enrichment rejects", async () => {
    const resolve = (siteLogic as {
      resolveFeaturedProjects?: (current: Project[], load: () => Promise<Project[]>) => Promise<Project[]>;
    }).resolveFeaturedProjects;

    expect(resolve).toBeTypeOf("function");
    if (!resolve) return;

    let loads = 0;
    const current = await resolve(baseProjects, async () => {
      loads += 1;
      throw new Error("GitHub unavailable");
    });

    expect(loads).toBe(1);
    expect(current).toBe(baseProjects);
  });

  it("keeps the current homepage content when homepage-only enrichment rejects", async () => {
    const enrich = (siteLogic as {
      enrichHomepageContent?: (content: SiteContent, load: () => Promise<Project[]>) => Promise<SiteContent>;
    }).enrichHomepageContent;
    const content: SiteContent = {
      name: "Confirmed name",
      role: "Researcher · Independent developer",
      location: "",
      intro: "Confirmed public introduction",
      email: "",
      projects: baseProjects,
      education: [],
      honors: [],
      timeline: [],
    };

    expect(enrich).toBeTypeOf("function");
    if (!enrich) return;

    await expect(enrich(content, async () => Promise.reject(new Error("GitHub unavailable")))).resolves.toBe(content);
  });

  it("preserves the admin-facing base content enrichment behavior when GitHub data is available", () => {
    const apply = (siteLogic as {
      applyBaseContentEnrichment?: (content: SiteContent, enrichment: Project[]) => SiteContent;
    }).applyBaseContentEnrichment;
    const content: SiteContent = {
      ...demoContent,
      projects: baseProjects,
    };
    const enrichment = [
      { name: "GitHub result", description: "From GitHub", url: "https://github.com/example/result" },
    ];

    expect(apply).toBeTypeOf("function");
    if (!apply) return;

    expect(apply(content, enrichment)).toEqual({ ...content, projects: enrichment });
    expect(apply(content, [])).toBe(content);
  });
});

describe("homepage content filtering", () => {
  it("hides known placeholder contact, education, and honor content while preserving at most three unique projects", () => {
    const filter = (siteLogic as {
      filterHomepageContent?: (content: SiteContent, options?: { hasConfirmedIntro?: boolean }) => SiteContent;
    }).filterHomepageContent;
    const content: SiteContent = {
      name: "Confirmed name",
      role: "Researcher · Independent developer",
      location: "Unconfirmed location",
      intro: "Confirmed public introduction",
      email: "hello@example.com",
      projects: [...baseProjects, { ...baseProjects[0], name: "Duplicate" }],
      education: [
        { period: "2024", degree: "Degree", school: "你的学校", detail: "后台更新" },
        { period: "2023", degree: "Confirmed degree", school: "Confirmed school", detail: "Confirmed detail" },
      ],
      honors: [
        { year: "2025", title: "此处添加个人荣誉", issuer: "后台维护" },
        { year: "2024", title: "Confirmed honor", issuer: "Confirmed issuer" },
      ],
      timeline: [],
    };

    expect(filter).toBeTypeOf("function");
    if (!filter) return;

    expect(filter(content)).toMatchObject({
      email: "",
      location: "",
      projects: baseProjects,
      education: [content.education[1]],
      honors: [content.honors[1]],
    });
  });

  it("does not publish the unconfirmed default demo biography", () => {
    const filter = (siteLogic as {
      filterHomepageContent?: (content: SiteContent, options?: { hasConfirmedIntro?: boolean }) => SiteContent;
    }).filterHomepageContent;

    expect(filter).toBeTypeOf("function");
    if (!filter) return;

    expect(filter(demoContent).intro).toBe("");
  });

  it("displays an explicitly confirmed biography", () => {
    const filter = (siteLogic as {
      filterHomepageContent?: (content: SiteContent, options?: { hasConfirmedIntro?: boolean }) => SiteContent;
    }).filterHomepageContent;
    const confirmedIntro = "用户确认的公开简介";

    expect(filter).toBeTypeOf("function");
    if (!filter) return;

    expect(filter({ ...demoContent, intro: confirmedIntro }, { hasConfirmedIntro: true }).intro).toBe(confirmedIntro);
  });
});
