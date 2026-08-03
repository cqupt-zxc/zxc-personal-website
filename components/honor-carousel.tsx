"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import type { Honor } from "@/lib/types";
import { getHonorCardOffset, getHonorPageLabel, getNextHonorIndex } from "@/lib/honor-carousel";

export function HonorCarousel({ honors }: { honors: Honor[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!honors.length) return null;

  const move = (direction: -1 | 1) => {
    setActiveIndex((index) => getNextHonorIndex(index, direction, honors.length));
  };

  return (
    <section className="honor-carousel" aria-label="个人荣誉展廊">
      <div className="honor-carousel__topline">
        <p className="eyebrow">荣誉与证书</p>
        <output aria-live="polite">{getHonorPageLabel(activeIndex, honors.length)}</output>
      </div>
      <div className="honor-carousel__stage">
        {honors.map((honor, index) => {
          const offset = getHonorCardOffset(index, activeIndex, honors.length);
          const className = offset === 0 ? "honor-card honor-card--active" : "honor-card";
          return (
            <article
              aria-hidden={offset !== 0}
              className={className}
              key={`${honor.year}-${honor.title}`}
              style={{
                "--card-shift": `${offset * 62}%`,
                "--card-scale": offset === 0 ? "1" : "0.88",
                "--card-opacity": Math.abs(offset) <= 1 ? "1" : "0",
              } as CSSProperties}
            >
              <span className="honor-card__year">{honor.year}</span>
              <div>
                <p className="honor-card__index">ARCHIVE / {String(index + 1).padStart(2, "0")}</p>
                <h3>{honor.title}</h3>
                <p className="honor-card__issuer">{honor.issuer}</p>
              </div>
            </article>
          );
        })}
      </div>
      {honors.length > 1 && (
        <div className="honor-carousel__controls">
          <button aria-label="查看上一项荣誉" onClick={() => move(-1)} type="button">←</button>
          <button aria-label="查看下一项荣誉" onClick={() => move(1)} type="button">→</button>
        </div>
      )}
    </section>
  );
}
