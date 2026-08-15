import { createHmac, timingSafeEqual } from "node:crypto";
import type { Project } from "@/lib/types";
import type { Education, Honor, SiteContent } from "@/lib/types";

export const privateCookieName = "private_archive_access";

function privateAccessSignature(expiresAt: string, secret: string) {
  return createHmac("sha256", secret).update(expiresAt).digest("base64url");
}

export function createPrivateAccessToken(secret: string, now = Date.now(), ttlMs = 12 * 60 * 60 * 1000) {
  if (!secret) throw new Error("PRIVATE_ARCHIVE_PASSWORD is required");
  const expiresAt = String(now + ttlMs);
  return `${expiresAt}.${privateAccessSignature(expiresAt, secret)}`;
}

export function verifyPrivateAccessToken(token: string | undefined, secret: string | undefined, now = Date.now()) {
  if (!token || !secret) return false;
  const [expiresAt, signature, extra] = token.split(".");
  if (!expiresAt || !signature || extra || !/^\d+$/.test(expiresAt) || Number(expiresAt) < now) return false;
  const expected = privateAccessSignature(expiresAt, secret);
  const suppliedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return suppliedBuffer.length === expectedBuffer.length && timingSafeEqual(suppliedBuffer, expectedBuffer);
}

export function isAdminEmail(email: string | undefined, allowlist: readonly string[]) {
  return email ? allowlist.includes(email.toLowerCase()) : false;
}

export function selectedRepositoryNames(names: string[]) {
  return [...new Set(names.map((name) => name.trim()).filter(Boolean))];
}

function hasProjectValue(value: Project[keyof Project]) {
  return typeof value === "number" || (typeof value === "string" && value.trim().length > 0) || (Array.isArray(value) && value.length > 0);
}

export function mergeFeaturedProjects(defaults: Project[], enrichment: Project[]): Project[] {
  const byName = new Map(enrichment.map((project) => [project.name.trim().toLowerCase(), project]));
  return defaults.map((project) => {
    const update = byName.get(project.name.trim().toLowerCase());
    if (!update) return project;

    const usableUpdate = Object.fromEntries(
      Object.entries(update).filter(([key, value]) => key !== "name" && hasProjectValue(value as Project[keyof Project])),
    ) as Partial<Project>;
    return { ...project, ...usableUpdate };
  });
}

export function applyBaseContentEnrichment(content: SiteContent, enrichment: Project[]): SiteContent {
  return enrichment.length ? { ...content, projects: enrichment } : content;
}

export async function resolveFeaturedProjects(current: Project[], load: () => Promise<Project[]>): Promise<Project[]> {
  try {
    const enrichment = await load();
    return enrichment.length ? mergeFeaturedProjects(current, enrichment) : current;
  } catch {
    return current;
  }
}

export async function enrichHomepageContent(content: SiteContent, load: () => Promise<Project[]>): Promise<SiteContent> {
  const projects = await resolveFeaturedProjects(content.projects, load);
  return projects === content.projects ? content : { ...content, projects };
}

const homepagePlaceholderText = ["hello@example.com", "你的学校", "后台更新", "此处添加个人荣誉", "后台维护"];

function containsHomepagePlaceholder(values: string[]) {
  const text = values.join(" ").toLowerCase();
  return homepagePlaceholderText.some((placeholder) => text.includes(placeholder.toLowerCase()));
}

function isPublicEmail(email: string) {
  const value = email.trim().toLowerCase();
  return value !== "hello@example.com" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPublicProject(project: Project) {
  try {
    const protocol = new URL(project.url).protocol;
    return Boolean(project.name.trim()) && (protocol === "https:" || protocol === "http:");
  } catch {
    return false;
  }
}

function isPublicEducation(item: Education) {
  return Boolean(item.degree.trim() && item.school.trim()) && !containsHomepagePlaceholder([item.period, item.degree, item.school, item.detail]);
}

function isPublicHonor(item: Honor) {
  return Boolean(item.title.trim() && item.issuer.trim()) && !containsHomepagePlaceholder([item.year, item.title, item.issuer, item.description ?? ""]);
}

export function filterHomepageContent(content: SiteContent, options: { hasConfirmedIntro?: boolean } = {}): SiteContent {
  const seenProjectUrls = new Set<string>();
  const projects = content.projects.filter(isPublicProject).filter((project) => {
    const url = project.url.trim();
    if (seenProjectUrls.has(url)) return false;
    seenProjectUrls.add(url);
    return true;
  }).slice(0, 3);

  return {
    ...content,
    email: isPublicEmail(content.email) ? content.email.trim() : "",
    location: "",
    intro: options.hasConfirmedIntro && !containsHomepagePlaceholder([content.intro]) ? content.intro.trim() : "",
    projects,
    education: content.education.filter(isPublicEducation),
    honors: content.honors.filter(isPublicHonor),
  };
}
