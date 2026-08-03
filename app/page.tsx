import "./home.css";
import { AnimatedAbout } from "@/components/animated-about";
import { BeyondWork } from "@/components/beyond-work";
import { CreatorHero } from "@/components/creator-hero";
import { HonorsRail } from "@/components/honors-rail";
import { JourneySection } from "@/components/journey-section";
import { ProjectMarquee } from "@/components/project-marquee";
import { StickyProjects } from "@/components/sticky-projects";
import { getPublicContent } from "@/lib/content";

export const revalidate = 60;

export default async function Home() {
  const content = await getPublicContent();
  return <main className="creator-site">
    <CreatorHero email={content.email} location={content.location} name={content.name} role={content.role} />
    <ProjectMarquee projects={content.projects} />
    <AnimatedAbout email={content.email} intro={content.intro} />
    <JourneySection education={content.education} />
    <StickyProjects projects={content.projects} />
    <HonorsRail honors={content.honors} />
    <BeyondWork name={content.name} />
  </main>;
}
