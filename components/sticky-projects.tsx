"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import type { Project } from "@/lib/types";
import { getProjectVisuals } from "@/lib/project-visuals";
import { ProjectVisual } from "@/components/project-visual";

function StickyCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, reducedMotion ? 1 : targetScale]);
  const visuals = getProjectVisuals(project);
  return <div className="sticky-stage" ref={ref}>
    <motion.article className="sticky-project" style={{ scale, top: `calc(6rem + ${index * 28}px)` }}>
      <header>
        <span className="sticky-number">{String(index + 1).padStart(2, "0")}</span>
        <div><p>{project.language || "INDEPENDENT"}</p><h3>{project.name}</h3></div>
        <a href={project.url} rel="noreferrer" target="_blank">查看项目 <ArrowUpRight aria-hidden="true" size={18} /></a>
      </header>
      <p className="sticky-description">{project.description}</p>
      <div className={`project-image-grid project-image-grid--${Math.max(visuals.length, 1)}`}>
        {(visuals.length ? visuals : [undefined]).map((src, visualIndex) => <ProjectVisual className={`project-image project-image--${visualIndex + 1}`} key={`${src}-${visualIndex}`} language={project.language} src={src} title={project.name} />)}
      </div>
      <footer><span>{project.stars ? `★ ${project.stars}` : "GITHUB PROJECT"}</span><span>{project.updatedAt ? `UPDATED ${project.updatedAt.slice(0, 10)}` : "SELECTED WORK"}</span></footer>
    </motion.article>
  </div>;
}

export function StickyProjects({ projects }: { projects: Project[] }) {
  const selected = projects.slice(0, 3);
  if (!selected.length) return null;
  return <section className="sticky-projects-section" id="projects">
    <div className="projects-heading"><span>BUILDING IN PUBLIC</span><h2 className="display-heading">PROJECTS</h2></div>
    {selected.map((project, index) => <StickyCard index={index} key={`${project.name}-${project.url}`} project={project} total={selected.length} />)}
  </section>;
}
