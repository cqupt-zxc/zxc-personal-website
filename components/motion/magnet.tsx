"use client";

import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import { useRef, type MouseEvent, type ReactNode } from "react";

export function Magnet({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  const frame = useRef<number | null>(null);

  const move = (event: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      x.set((event.clientX - (bounds.left + bounds.width / 2)) / 3);
      y.set((event.clientY - (bounds.top + bounds.height / 2)) / 3);
    });
  };

  const reset = () => { x.set(0); y.set(0); };

  return <div className={`magnet-zone ${className ?? ""}`} onMouseMove={move} onMouseLeave={reset} ref={ref}>
    <motion.div className="magnet-target" style={{ x, y, transition: reducedMotion ? "none" : "transform .6s ease-in-out", willChange: "transform" }}>
      {children}
    </motion.div>
  </div>;
}
