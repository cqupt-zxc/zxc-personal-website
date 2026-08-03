"use client";

import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useEffect, useRef } from "react";
import type { Project } from "@/lib/types";
import { getProjectVisuals } from "@/lib/project-visuals";
import { ProjectVisual } from "@/components/project-visual";

function MarqueeRow({ projects, direction }: { projects: Project[]; direction: 1 | -1 }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const x = useMotionValue(0);

  const updateOffset = (value: number) => {
    if (reducedMotion || !rowRef.current) {
      x.set(0);
      return;
    }
    const sectionTop = rowRef.current?.closest("section")?.getBoundingClientRect().top ?? 0;
    const absoluteTop = sectionTop + value;
    x.set(((value - absoluteTop + window.innerHeight) * 0.3 - 200) * direction);
  };

  useMotionValueEvent(scrollY, "change", updateOffset);
  useEffect(() => updateOffset(scrollY.get()), [reducedMotion, scrollY]);
  const source = projects.length ? projects : [{ name: "项目内容将在后台更新", description: "", url: "#", language: "COMING SOON" }];
  const items = [...source, ...source, ...source];
  return <div className="marquee-window" ref={rowRef}><motion.div className="marquee-row" style={{ x }}>
    {items.map((project, index) => <a className="marquee-card" href={project.url} key={`${project.name}-${index}`} rel="noreferrer" target={project.url === "#" ? undefined : "_blank"}>
      <ProjectVisual language={project.language} src={getProjectVisuals(project)[0]} title={project.name} />
      <span>{String((index % source.length) + 1).padStart(2, "0")} / {project.language || "PROJECT"}</span>
    </a>)}
  </motion.div></div>;
}

export function ProjectMarquee({ projects }: { projects: Project[] }) {
  const rowBreak = Math.max(1, Math.ceil(projects.length / 2));
  const first = projects.slice(0, rowBreak);
  const second = projects.slice(rowBreak).length ? projects.slice(rowBreak) : projects;
  return <section className="selected-work" id="selected-work">
    <div className="section-kicker"><span>SELECTED WORK</span><span>SCROLL-DRIVEN ARCHIVE</span></div>
    <MarqueeRow direction={1} projects={first} />
    <MarqueeRow direction={-1} projects={second} />
  </section>;
}
