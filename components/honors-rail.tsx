"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import type { Honor } from "@/lib/types";
import { normalizeHonorIndex } from "@/lib/honors-rail";

export function HonorsRail({ honors }: { honors: Honor[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const pointerStart = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const active = honors[normalizeHonorIndex(index, honors.length)];
  const go = (next: number) => { setDirection(next > index ? 1 : -1); setIndex(normalizeHonorIndex(next, honors.length)); };

  if (!active) return null;
  return <section className="honors-section" id="honors" onPointerDown={(event) => { pointerStart.current = event.clientX; }} onPointerUp={(event) => { if (pointerStart.current === null) return; const delta = event.clientX - pointerStart.current; if (Math.abs(delta) > 45) go(index + (delta < 0 ? 1 : -1)); pointerStart.current = null; }} onWheel={(event) => { if (Math.abs(event.deltaY) > 24) go(index + (event.deltaY > 0 ? 1 : -1)); }}>
    <div className="honors-heading"><span>HONORS &amp; CERTIFICATES</span><h2>阶段性收获</h2><p>奖项、证书与被认真记住的投入，不需要占满一整页。</p></div>
    <div className="honor-stage">
      <AnimatePresence initial={false} mode="wait">
        <motion.article animate={{ opacity: 1, x: 0 }} className="honor-card" exit={{ opacity: 0, x: reducedMotion ? 0 : -36 * direction }} initial={{ opacity: 0, x: reducedMotion ? 0 : 36 * direction }} key={`${active.year}-${active.title}`} transition={{ duration: reducedMotion ? 0 : 0.48, ease: [0.25, 0.1, 0.25, 1] }}>
          {active.imageUrl ? <img alt={`${active.title}证书`} onError={(event) => { event.currentTarget.hidden = true; }} src={active.imageUrl} /> : <div className="honor-emblem" aria-hidden="true">{active.year.slice(-2)}</div>}
          <div><span>{active.year}</span><h3>{active.title}</h3><p>{active.issuer}</p>{active.description && <small>{active.description}</small>}</div>
        </motion.article>
      </AnimatePresence>
      <div className="honor-controls"><p aria-live="polite">{String(normalizeHonorIndex(index, honors.length) + 1).padStart(2, "0")} / {String(honors.length).padStart(2, "0")}</p><button aria-label="上一项荣誉" onClick={() => go(index - 1)} type="button"><ArrowLeft /></button><button aria-label="下一项荣誉" onClick={() => go(index + 1)} type="button"><ArrowRight /></button></div>
    </div>
  </section>;
}
