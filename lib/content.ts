import { demoContent } from "@/lib/demo-content";
import type { SiteContent } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { enrichFeaturedProjects } from "@/lib/github";
import { getOptionalPublicSupabaseConfig } from "@/lib/env/public";

export async function getPublicContent(): Promise<SiteContent> {
  let content = demoContent;
  if (!getOptionalPublicSupabaseConfig()) return content;
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.from("site_content").select("content").eq("id", 1).single();
    content = data?.content ? { ...demoContent, ...data.content } : demoContent;
  } catch { return content; }
  const githubProjects = await enrichFeaturedProjects(content.projects.map((project) => project.name));
  return githubProjects.length ? { ...content, projects: githubProjects } : content;
}
