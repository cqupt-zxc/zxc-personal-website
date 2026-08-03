"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
};

export function FadeIn({ children, className, delay = 0, duration = 0.7, x = 0, y = 30 }: Props) {
  const reducedMotion = useReducedMotion();
  return <motion.div
    className={className}
    initial={reducedMotion ? false : { opacity: 0, x, y }}
    whileInView={{ opacity: 1, x: 0, y: 0 }}
    viewport={{ once: true, margin: "50px", amount: 0 }}
    transition={{ delay: reducedMotion ? 0 : delay, duration: reducedMotion ? 0 : duration, ease: [0.25, 0.1, 0.25, 1] }}
  >{children}</motion.div>;
}
