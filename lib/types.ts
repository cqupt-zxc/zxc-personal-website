export type Project = {
  name: string;
  description: string;
  url: string;
  language?: string;
  stars?: number;
  updatedAt?: string;
  coverImageUrl?: string;
  galleryImageUrls?: string[];
};
export type Honor = {
  year: string;
  title: string;
  issuer: string;
  description?: string;
  imageUrl?: string;
};
export type Education = { period: string; degree: string; school: string; detail: string };
export type TimelineItem = { date: string; city: string; note: string; imageUrl?: string };
export type SiteContent = { name: string; role: string; location: string; intro: string; email: string; projects: Project[]; honors: Honor[]; education: Education[]; timeline: TimelineItem[] };
