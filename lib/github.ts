import { selectedRepositoryNames } from "@/lib/site-logic";
import { getOptionalGitHubEnrichmentConfig } from "@/lib/env/server";
import type { Project } from "@/lib/types";

type GitHubRepo = { name: string; description: string | null; html_url: string; language: string | null; stargazers_count: number; pushed_at: string };

export async function enrichFeaturedProjects(names: string[]): Promise<Project[]> {
  const configuration = getOptionalGitHubEnrichmentConfig();
  if (!configuration) return [];
  const headers: Record<string, string> = configuration.token ? { Authorization: `Bearer ${configuration.token}` } : {};
  const results: Array<Project | null> = await Promise.all(selectedRepositoryNames(names).map(async (name): Promise<Project | null> => {
    const response = await fetch(`https://api.github.com/repos/${configuration.username}/${name}`, { headers, next: { revalidate: 3600 } });
    if (!response.ok) return null;
    const repo = await response.json() as GitHubRepo;
    return { name: repo.name, description: repo.description || "暂无项目简介。", url: repo.html_url, language: repo.language || undefined, stars: repo.stargazers_count, updatedAt: repo.pushed_at };
  }));
  return results.filter((project): project is Project => project !== null);
}
