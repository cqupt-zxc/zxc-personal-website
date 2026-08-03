import type { Project } from "@/lib/types";

export function getProjectVisuals(project: Project) {
  const candidates = [project.coverImageUrl, ...(project.galleryImageUrls ?? [])];
  return [...new Set(candidates.map((value) => value?.trim()).filter((value): value is string => Boolean(value)))].slice(0, 3);
}
