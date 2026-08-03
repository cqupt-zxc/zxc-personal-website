"use client";

import { useEffect, useState } from "react";
import { formatSceneLabel } from "@/lib/scene-navigation";

export type SceneDefinition = { id: string; label: string };

export function SceneController({ scenes }: { scenes: SceneDefinition[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    document.documentElement.classList.add("scenes-ready");
    const elements = scenes
      .map((scene) => document.getElementById(scene.id))
      .filter((element): element is HTMLElement => Boolean(element));
    const ratios = new Map<Element, number>();

    elements[0]?.classList.add("scene--active", "scene--revealed");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("scene--revealed"));
      return () => document.documentElement.classList.remove("scenes-ready");
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        ratios.set(entry.target, entry.intersectionRatio);
        if (entry.isIntersecting) entry.target.classList.add("scene--revealed");
      }

      let nextIndex = 0;
      let highestRatio = -1;
      elements.forEach((element, index) => {
        const ratio = ratios.get(element) ?? 0;
        if (ratio > highestRatio) {
          highestRatio = ratio;
          nextIndex = index;
        }
      });

      elements.forEach((element, index) => {
        element.classList.toggle("scene--active", index === nextIndex);
      });
      setActiveIndex(nextIndex);
    }, { threshold: [0.25, 0.5, 0.72] });

    elements.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("scenes-ready");
    };
  }, [scenes]);

  return (
    <nav className="chapter-rail" aria-label="页面章节">
      <output aria-live="polite">{formatSceneLabel(activeIndex, scenes.length)}</output>
      <div>
        {scenes.map((scene, index) => (
          <a
            aria-current={activeIndex === index ? "location" : undefined}
            href={`#${scene.id}`}
            key={scene.id}
            title={scene.label}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <i aria-hidden="true" />
          </a>
        ))}
      </div>
    </nav>
  );
}
