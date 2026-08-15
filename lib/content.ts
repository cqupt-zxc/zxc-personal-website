import { demoContent } from "@/lib/demo-content";
import type { SiteContent } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { enrichFeaturedProjects } from "@/lib/github";
import { getOptionalPublicSupabaseConfig } from "@/lib/env/public";
import { applyBaseContentEnrichment, enrichHomepageContent, filterHomepageContent } from "@/lib/site-logic";

type BaseContentResult = {
  content: SiteContent;
  storedContent?: Partial<SiteContent>;
  shouldEnrich: boolean;
};

async function getBasePublicContent(): Promise<BaseContentResult> {
  let content = demoContent;
  if (!getOptionalPublicSupabaseConfig()) return { content, shouldEnrich: false };

  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.from("site_content").select("content").eq("id", 1).single();
    const storedContent = data?.content as Partial<SiteContent> | undefined;
    content = storedContent ? { ...demoContent, ...storedContent } : demoContent;
    return { content, storedContent, shouldEnrich: true };
  } catch {
    return { content, shouldEnrich: false };
  }
}

export async function getPublicContent(): Promise<SiteContent> {
  const { content, shouldEnrich } = await getBasePublicContent();
  if (!shouldEnrich) return content;

  const githubProjects = await enrichFeaturedProjects(content.projects.map((project) => project.name));
  return applyBaseContentEnrichment(content, githubProjects);
}

export async function getHomepageContent(): Promise<SiteContent> {
  const { content, storedContent, shouldEnrich } = await getBasePublicContent();
  const homepageContent = filterHomepageContent(content, {
    hasConfirmedIntro: typeof storedContent?.intro === "string" && storedContent.intro.trim().length > 0,
  });
  if (!shouldEnrich) return homepageContent;

  return enrichHomepageContent(homepageContent, () => enrichFeaturedProjects(homepageContent.projects.map((project) => project.name)));
}
