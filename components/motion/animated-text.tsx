"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

function Character({ char, progress, start, end }: { char: string; progress: MotionValue<number>; start: number; end: number }) {
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  return <motion.span aria-hidden="true" style={{ opacity }}>{char === " " ? "\u00A0" : char}</motion.span>;
}

export function AnimatedText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.2"] });
  const length = Math.max(text.length, 1);

  if (reducedMotion) return <p className={className}>{text}</p>;
  return <p aria-label={text} className={className} ref={ref}>
    {[...text].map((char, index) => <Character char={char} end={Math.min((index + 5) / length, 1)} key={`${char}-${index}`} progress={scrollYProgress} start={index / length} />)}
  </p>;
}
