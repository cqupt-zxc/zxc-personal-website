import type { Education, Honor, Project, SiteContent, TimelineItem } from "@/lib/types";

type FormValues = Omit<SiteContent, "projects" | "honors" | "education" | "timeline"> & {
  projects: Array<Omit<Project, "stars" | "updatedAt"> & { stars?: string | number }>;
  honors: Honor[];
  education: Education[];
  timeline: TimelineItem[];
};

export function contentFromFormValues(values: FormValues): SiteContent {
  return {
    ...values,
    projects: values.projects.filter((project) => project.name.trim()).map((project) => ({
      ...project,
      stars: project.stars === "" || project.stars === undefined ? undefined : Number(project.stars),
    })),
    honors: values.honors.filter((honor) => honor.title.trim()),
    education: values.education.filter((item) => item.degree.trim()),
    timeline: values.timeline.filter((item) => item.date.trim()).map((item) => ({ ...item, imageUrl: item.imageUrl?.trim() || undefined })),
  };
}
